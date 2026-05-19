// Atomic local file backup queue (pending-sync.json)
const fs = require('fs');
const path = require('path');

const QUEUE_FILE = path.join(__dirname, '..', 'data', 'pending-sync.json');

class SyncQueue {
    constructor() {
        this.queue = [];
        this._load();
    }

    _ensureDir() {
        const dir = path.dirname(QUEUE_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    _load() {
        this._ensureDir();
        if (!fs.existsSync(QUEUE_FILE)) {
            this.queue = [];
            return;
        }
        try {
            this.queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
        } catch {
            this.queue = [];
        }
    }

    _persist() {
        this._ensureDir();
        fs.writeFileSync(QUEUE_FILE, JSON.stringify(this.queue, null, 2));
    }

    enqueue(operation) {
        const item = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            ...operation,
            createdAt: new Date().toISOString()
        };
        this.queue.push(item);
        this._persist();
        return item;
    }

    getAll() {
        return [...this.queue];
    }

    remove(id) {
        this.queue = this.queue.filter(q => q.id !== id);
        this._persist();
    }
}

module.exports = new SyncQueue();