import express from 'express';
import {
    getGudmedHealthcare,
    createGudmedHealthcare,
    updateGudmedHealthcare,
    deleteGudmedHealthcare
} from "../../controllers/Hospital/gudmedhealthcareController.js"; // Corrected path

import authenticateToken from "../../middleware/auth.js"; // Corrected path

const router = express.Router();

router.get("/", getGudmedHealthcare);
router.post("/", authenticateToken, createGudmedHealthcare);
router.put("/:id", authenticateToken, updateGudmedHealthcare);
router.delete("/:id", authenticateToken, deleteGudmedHealthcare);

export default router;

