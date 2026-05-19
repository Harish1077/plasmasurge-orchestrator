// Geodetic multi-criteria 0-100 Emergency Score ranking algorithm
const config = require('../config/config');
const { isCompatible, isExactMatch } = require('./BloodCompatibility');

function toRad(deg) { return (deg * Math.PI) / 180; }

function haversineKm(lat1, lng1, lat2, lng2) {
    if ([lat1, lng1, lat2, lng2].some(v => v == null || Number.isNaN(Number(v)))) return null;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return config.EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function rankDonors(donors, context) {
    const { neededGroup, hospitalLat, hospitalLng, maxRadiusKm = 20, urgency = 'Stable' } = context;

    return donors
        .map(donor => {
            if (!isCompatible(donor.bloodGroup, neededGroup)) {
                return { ...donor, emergencyScore: 0 };
            }

            let distanceKm = null;
            let coords = donor.location?.coordinates;
            if (coords && coords.length === 2 && hospitalLat != null && hospitalLng != null) {
                distanceKm = haversineKm(hospitalLat, hospitalLng, coords[1], coords[0]);
            }

            let proximity = distanceKm == null ? 10 : distanceKm > maxRadiusKm ? 0 : Math.round((1 - distanceKm / maxRadiusKm) * 40);
            let blood = isExactMatch(donor.bloodGroup, neededGroup) ? 30 : 20;
            
            let donation = 30;
            if (donor.lastDonationDate) {
                const days = (Date.now() - new Date(donor.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24);
                donation = days >= config.MIN_DONATION_GAP_DAYS ? 30 : days >= 60 ? 15 : days >= 30 ? 8 : 0;
            }

            let bonus = urgency === 'Critical' ? 5 : 0;
            const score = Math.min(100, proximity + blood + donation + bonus);

            return {
                ...donor,
                emergencyScore: score,
                distanceKm: distanceKm != null ? Math.round(distanceKm * 10) / 10 : null
            };
        })
        .filter(d => d.emergencyScore > 0)
        .sort((a, b) => b.emergencyScore - a.emergencyScore);
}

module.exports = { rankDonors, haversineKm };