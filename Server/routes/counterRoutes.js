// backend/routes/counterRoutes.js
import express from "express";
import { getCounter, updateCounter } from "../controllers/counterController.js";
import  authenticateToken  from "../middleware/auth.js"; // Assuming you have this

const router = express.Router();

router.get("/", getCounter);
router.put("/", authenticateToken, updateCounter);

export default router;