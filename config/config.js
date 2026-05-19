require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eblood_enterprise',
    JWT_SECRET: process.env.JWT_SECRET || 'eblood_super_secure_enterprise_secret_2026',
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
    VERIFIED_EMAIL_DOMAINS: [
        'apollohospitals.com',
        'fortishealthcare.com',
        'maxhealthcare.in',
        'aiims.edu',
        'redcross.org',
        'gov.in'
    ],
    EARTH_RADIUS_KM: 6371,
    MIN_DONATION_GAP_DAYS: 90
};