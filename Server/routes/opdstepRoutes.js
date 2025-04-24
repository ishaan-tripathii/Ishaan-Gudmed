import express from 'express';

import {
    getIPDStep,
    createIPDStep,
    updateIPDStep,
    deleteIPDStep
} from '../controllers/opdstepController.js';

const router = express.Router();

router.get('/',getIPDStep);
//Protected routes
router.post('/', createIPDStep);
router.put('/', updateIPDStep);
router.delete('/', deleteIPDStep);

export default router;