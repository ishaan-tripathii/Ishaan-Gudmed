import express from 'express';
import {
    getDigitalHospital,
    createDigitalHospital,
    updateDigitalHospital,
    deleteDigitalHospital
}  from '../controllers/hospitalControllers.js'

import authenticateToken from "../middleware/auth.js"; // Ensure correct path
const router = express.Router();

router.get("/", getDigitalHospital);
// Protected routes
router.post("/", authenticateToken, createDigitalHospital);
router.put("/:id", authenticateToken, updateDigitalHospital);
router.delete("/:id", authenticateToken, deleteDigitalHospital);

export default router;