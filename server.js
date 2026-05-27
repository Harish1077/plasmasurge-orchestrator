const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const dbService = require('./services/DatabaseService');
const apiRoutes = require('./routes/index');
const syncQueue = require('./services/SyncQueue');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.set('io', io);
app.use(cors());
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/portal', (req, res) => res.sendFile(path.join(__dirname, 'public', 'portal.html')));

require('./socket/index')(io);

dbService.init().then(() => {
    setInterval(async () => {
        if (dbService.isReady()) {
            const operations = syncQueue.getAll();
            if (operations.length > 0) {
                for (const op of operations) {
                    try {
                        if (op.type === 'EMERGENCY_SAVE') await dbService.saveEmergencyDirectly(op.data);
                        if (op.type === 'DONOR_REGISTER') await dbService.saveDonorDirectly(op.data);
                        syncQueue.remove(op.id);
                    } catch (err) {
                        break;
                    }
                }
            }
        }
    }, 15000);

    server.listen(config.PORT, () => {
        console.log(` E-BLOOD ENTERPRISE SYSTEM DEPLOYED ONLINE AT PORT ${config.PORT} `);
    });
}).catch(err => {
    process.exit(1);
});
