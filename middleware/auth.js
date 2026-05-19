// JWT authorization validation gate
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function verifyToken(req, res, next) {
    const header = req.headers['authorization'];
    if (!header) return res.status(403).json({ error: 'Authentication challenge parameter omitted.' });
    
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : header;
    try {
        req.user = jwt.verify(token, config.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: 'Authentication state invalid.' });
    }
}

function signToken(payload) { return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '24h' }); }

module.exports = { verifyToken, signToken };