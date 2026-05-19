// Strategic domain lookup and verification validation
const config = require('../config/config');

function isVerifiedDomain(email) {
    if (!email || !email.includes('@')) return false;
    const domain = email.split('@')[1].toLowerCase().trim();
    return config.VERIFIED_EMAIL_DOMAINS.some(d => domain === d || domain.endsWith('.' + d));
}

function requireVerifiedHospital(req, res, next) {
    if (!req.user || req.user.role !== 'hospital') {
        return res.status(403).json({ error: 'Access unauthorized. Hospital authorization token signature required.' });
    }
    if (!req.user.verified) {
        return res.status(403).json({ error: 'Action blocked. Complete clinical profile verification.' });
    }
    next();
}

module.exports = { isVerifiedDomain, requireVerifiedHospital };