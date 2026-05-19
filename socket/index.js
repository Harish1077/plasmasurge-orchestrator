// Scoped real-time network engine (City rooms & pulse broads)
module.exports = function initSocket(io) {
    io.on('connection', (socket) => {
        socket.on('join', (context) => {
            if (context.city) {
                socket.join(`city:${context.city.trim().toLowerCase()}`);
            }
            socket.join('global:alerts');
        });
    });
};