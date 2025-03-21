const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

// Environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:3001';
const MONGODB_URI = process.env.MONGODB_URI || 'your_local_mongodb_uri';
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();
const server = http.createServer(app);

// Socket.IO configuration
const io = new Server(server, {
    cors: {
        origin: [FRONTEND_URL, ADMIN_URL],
        methods: ['GET', 'POST'],
        credentials: true
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
});

// Middleware
app.use(cors({
    origin: [FRONTEND_URL, ADMIN_URL],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle client events
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    // Custom events
    socket.on('contentUpdated', (data) => {
        // Broadcast to all clients except sender
        socket.broadcast.emit('contentUpdated', data);
    });

    socket.on('adminUpdate', (data) => {
        // Broadcast to all clients
        io.emit('contentChanged', data);
    });
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        environment: NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    console.log(`Frontend URL: ${FRONTEND_URL}`);
    console.log(`Admin URL: ${ADMIN_URL}`);
}); 