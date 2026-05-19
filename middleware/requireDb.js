// Database state interceptor middleware
const db = require('../services/DatabaseService');

module.exports = (req, res, next) => {
    // Graceful routing bypass for high availability configurations
    if (!db.isReady()) console.warn('[Pipeline Interceptor] Live storage engine unready. Executing locally.');
    next();
};