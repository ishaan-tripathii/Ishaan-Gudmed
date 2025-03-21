const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

// Environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:3001';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gudmed';
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

// MongoDB Connection with retry logic
const connectDB = async (retries = 5) => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
            w: 'majority'
        });
        console.log('Connected to MongoDB successfully');
        console.log('Database:', mongoose.connection.name);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        if (retries > 0) {
            console.log(`Retrying connection... (${retries} attempts remaining)`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return connectDB(retries - 1);
        }
        console.error('Failed to connect to MongoDB after multiple attempts');
    }
};

// Initialize MongoDB connection
connectDB();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    socket.on('contentUpdated', (data) => {
        socket.broadcast.emit('contentUpdated', data);
    });

    socket.on('adminUpdate', (data) => {
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
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
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