const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');

// Health check routes
router.use('/health', healthRoutes);

// Add other routes here
router.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

module.exports = router; 