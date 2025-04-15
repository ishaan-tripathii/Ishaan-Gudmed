import express from "express";

import {
    getGudmedToday,
    createGudmedToday,
    updateGudmedToday,
    deleteGudmedToday,
} from "../../controllers/Hospital/gudmedtodayController.js"; // Corrected path
import authenticateToken from "../../middleware/auth.js";

const router = express.Router();

// Fetch Gudmed Today data
router.get("/", getGudmedToday);

// Protected routes
router.post("/", authenticateToken, createGudmedToday);
router.put("/:id", authenticateToken, updateGudmedToday);
router.delete("/:id", authenticateToken, deleteGudmedToday);

export default router;

