import express from "express";
import { 
  getStepByStep, 
  createStepByStep, 
  updateStepByStep, 
  deleteStepByStep 
} from "../controllers/stepByStepController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

// Public Route
router.get("/", getStepByStep);

// Protected Routes (Require Authentication)
router.post("/", authenticateToken, createStepByStep);
router.put("/", authenticateToken, updateStepByStep); // Changed from /:id to /
router.delete("/", authenticateToken, deleteStepByStep); // Changed from /:id to /

export default router;