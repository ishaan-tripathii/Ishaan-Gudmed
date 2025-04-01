import express from "express";
import { getAboutUs, createAboutUs, updateAboutUs, deleteAboutUs } from "../../controllers/aboutusController.js";
import authenticateToken from "../../middleware/auth.js";


const router = express.Router();

// Public route (no authentication required)
router.get("/", getAboutUs);

// Protected routes (require authentication)
router.post("/", authenticateToken, createAboutUs);
router.put("/", authenticateToken, updateAboutUs);
router.delete("/", authenticateToken, deleteAboutUs);

export default router;
