const express = require('express');
const router = express.Router();
const config = require('../config/config');
const { signToken } = require('../middleware/auth');
const { isVerifiedDomain } = require('../middleware/hospitalAuth');

// Correctly mount all child routes
router.use('/health', require('./health'));
router.use('/donors', require('./donors'));
router.use('/emergencies', require('./emergencies'));
router.use('/hospitals', require('./hospitals'));

// Secure Configuration Endpoint for your Google Maps Key
router.get('/config/maps-gl', (req, res) => {
    return res.json({ apiKey: config.GOOGLE_MAPS_API_KEY || '' });
});

// Uniform Login/Verification Endpoint
router.post('/login', (req, res) => {
    const { email } = req.body;
    const verified = isVerifiedDomain(email);
    
    const token = signToken({ 
        id: 'hosp_token_id', 
        role: 'hospital', 
        verified: verified, 
        email: email || 'emergency@apollohospitals.com' 
    });
    
    return res.json({ success: true, token });
});

module.exports = router;