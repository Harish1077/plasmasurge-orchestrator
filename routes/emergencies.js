const express = require('express');
const router = express.Router();
const db = require('../services/DatabaseService');
const { verifyToken } = require('../middleware/auth');

// GET /api/emergencies
router.get('/', async (req, res) => {
    try {
        const items = await db.getEmergencies();
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// POST /api/emergencies
router.post('/', verifyToken, async (req, res) => {
    try {
        const broadcastPayload = {
            ...req.body,
            hospitalVerified: req.user.verified || false,
            createdAt: new Date().toISOString()
        };

        const savedRecord = await db.raiseEmergency(broadcastPayload);
        const io = req.app.get('io');
        const targetCity = (req.body.city || 'Amritsar').trim().toLowerCase();

        // Broadcast through global and room channels to avoid broadcast noise
        io.emit('new_emergency', savedRecord);
        io.to(`city:${targetCity}`).emit('city_emergency', savedRecord);
        io.to('global:alerts').emit('emergency_pulse', savedRecord);

        return res.json({ success: true, emergency: savedRecord });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// POST /api/emergencies/sync (For clearing client offline queues)
router.post('/sync', async (req, res) => {
    try {
        const { operations } = req.body;
        if (Array.isArray(operations)) {
            for (const op of operations) {
                if (op.type === 'EMERGENCY_SAVE') {
                    await db.raiseEmergency(op.data);
                }
            }
        }
        return res.json({ success: true, messsage: "Sync buffer cleared successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;