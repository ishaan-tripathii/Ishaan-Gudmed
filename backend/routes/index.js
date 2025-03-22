const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');

// Health check routes
router.use('/health', healthRoutes);

// Root route
router.get('/', (req, res) => {
    res.json({
        message: 'GudMed API is running',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            docs: '/api/docs'
        }
    });
});

module.exports = router; 