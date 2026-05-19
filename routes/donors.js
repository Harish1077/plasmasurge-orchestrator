const express = require('express');
const router = express.Router();
const db = require('../services/DatabaseService');
const matchingService = require('../services/MatchingService');

// GET /api/donors
router.get('/', async (req, res) => {
    try {
        const donors = await db.getDonors();
        return res.json(donors);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// POST /api/donors
router.post('/', async (req, res) => {
    try {
        const { fullName, bloodGroup, phone, city, email } = req.body;
        
        if (!fullName || !bloodGroup || !phone || !city) {
            return res.status(400).json({ error: 'Required donor registration fields missing.' });
        }

        // Generate properties satisfying standard GeoJSON model definitions to prevent indexing schema crashes
        const donorData = {
            fullName,
            bloodGroup,
            phone,
            city,
            email: email || `donor_${Date.now()}_${Math.floor(Math.random() * 1000)}@e-blood-fallback.com`,
            location: {
                type: 'Point',
                coordinates: [74.8723, 31.6340] // Default geo position map markers (Amritsar coordinates)
            },
            lastDonationDate: null
        };

        const donor = await db.registerDonor(donorData);
        
        // Push reactive updates out to active web client interfaces
        const io = req.app.get('io');
        if (io) {
            io.emit('donor_registered', donor);
        }

        return res.json({ success: true, donor });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// GET /api/donors/match
router.get('/match', async (req, res) => {
    try {
        const { lat, lng, bloodGroup, radiusKm = 20, urgency = 'Stable' } = req.query;
        if (!bloodGroup) {
            return res.status(400).json({ error: 'Antigen group code parameter required.' });
        }
        
        const donors = await db.getDonors();
        const matches = matchingService.rankDonors(donors, {
            neededGroup: bloodGroup,
            hospitalLat: lat ? Number(lat) : null,
            hospitalLng: lng ? Number(lng) : null,
            maxRadiusKm: Number(radiusKm),
            urgency
        });
        
        return res.json({ success: true, donors: matches });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;