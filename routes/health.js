// System status telemetry heartbeat endpoint
const express = require('express');
const router = express.Router();
const db = require('../services/DatabaseService');
const syncQueue = require('../services/SyncQueue');

router.get('/', (req, res) => {
    return res.json({
        status: 'ok',
        storage: db.isReady() ? 'mongo' : 'local_fallback_json',
        pendingSync: syncQueue.getAll().length,
        uptime: process.uptime()
    });
});

module.exports = router;