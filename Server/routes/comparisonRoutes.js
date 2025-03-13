// backend/routes/comparisonRoutes.js
import express from "express";
import { getComparison, updateComparison } from "../controllers/comparisonController.js";
import authenticateToken  from "../middleware/auth.js"; // Assuming you have this

const router = express.Router();

router.get("/", getComparison);
router.put("/", authenticateToken, updateComparison);

export default router;