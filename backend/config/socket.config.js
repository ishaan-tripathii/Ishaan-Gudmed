const socketConfig = {
    cors: {
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://my-project.onrender.com',
            'https://gudmed-admin.onrender.com'
        ],
        methods: ['GET', 'POST'],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    path: '/socket.io'
};

module.exports = socketConfig; 