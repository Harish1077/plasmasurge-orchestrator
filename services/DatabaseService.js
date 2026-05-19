// Resilient MongoDB connector + dynamic offline fallback controller
const mongoose = require('mongoose');
const config = require('../config/config');
const syncQueue = require('./SyncQueue');

const DonorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    bloodGroup: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    city: { type: String, required: true, index: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // format: [longitude, latitude]
    },
    lastDonationDate: { type: Date, default: null }
}, { timestamps: true });

DonorSchema.index({ location: '2dsphere' });

const EmergencySchema = new mongoose.Schema({
    hospitalName: { type: String, required: true },
    requiredGroup: { type: String, required: true, index: true },
    urgency: { type: String, enum: ['Critical', 'Stable'], required: true },
    location: { type: String, required: true },
    city: { type: String, required: true, index: true },
    hospitalVerified: { type: Boolean, default: false }
}, { timestamps: true });

class DatabaseService {
    constructor() {
        this.Donor = null;
        this.Emergency = null;
        this.connected = false;
        this.localCache = { donors: [], emergencies: [] };
    }

    async init() {
        mongoose.connection.on('connected', () => {
            this.connected = true;
            console.log('[Database Layer] Connected safely to live MongoDB instance.');
        });

        mongoose.connection.on('disconnected', () => {
            this.connected = false;
            console.warn('[Database Layer] Live connection broken. Routing writes to fallback buffers.');
        });

        try {
            await mongoose.connect(config.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
        } catch {
            console.error('[Database Layer] Operating under initial local fallback loop settings.');
        }

        this.Donor = mongoose.model('Donor', DonorSchema);
        this.Emergency = mongoose.model('Emergency', EmergencySchema);
    }

    isReady() {
        return this.connected && mongoose.connection.readyState === 1;
    }

    async getDonors(filter = {}) {
        if (this.isReady()) return this.Donor.find(filter).lean();
        return this.localCache.donors.filter(d => !filter.bloodGroup || d.bloodGroup === filter.bloodGroup);
    }

    async getEmergencies() {
        if (this.isReady()) return this.Emergency.find().sort({ createdAt: -1 }).limit(30).lean();
        return [...this.localCache.emergencies].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    async registerDonor(data) {
        if (!data.location) {
            data.location = { type: 'Point', coordinates: [74.8723, 31.6340] }; // Default Amritsar center coordinates
        }
        if (this.isReady()) return await this.Donor.create(data);

        const simulated = { _id: `off_d_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
        this.localCache.donors.push(simulated);
        syncQueue.enqueue({ type: 'DONOR_REGISTER', data });
        return simulated;
    }

    async raiseEmergency(data) {
        if (!data.city) data.city = 'Amritsar';
        if (this.isReady()) return await this.Emergency.create(data);

        const simulated = { _id: `off_e_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
        this.localCache.emergencies.push(simulated);
        syncQueue.enqueue({ type: 'EMERGENCY_SAVE', data });
        return simulated;
    }

    async saveDonorDirectly(data) { return await this.Donor.create(data); }
    async saveEmergencyDirectly(data) { return await this.Emergency.create(data); }
}

module.exports = new DatabaseService();