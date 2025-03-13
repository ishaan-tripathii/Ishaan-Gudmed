// backend/routes/stepByStepRoutes.js
import express from "express";
import { getStepByStep, updateStepByStep } from "../controllers/stepByStepController.js";
import  authenticateToken  from "../middleware/auth.js"; // Assuming you have this

const router = express.Router();

router.get("/", getStepByStep);
router.put("/", authenticateToken, updateStepByStep);

export default router;