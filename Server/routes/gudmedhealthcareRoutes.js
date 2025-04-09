import express from 'express';
import {
    getGudmedHealthcare,
    createGudmedHealthcare,
    updateGudmedHealthcare,
    deleteGudmedHealthcare
} from '../controllers/gudmedhealthcareController.js';


import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", getGudmedHealthcare );
router.post("/", authenticateToken, createGudmedHealthcare );
router.put("/:id", authenticateToken, updateGudmedHealthcare );
router.delete("/:id", authenticateToken, deleteGudmedHealthcare );

export default router;

