import express from "express";
import {
  getStepByStep,
  createStepByStep,
  updateStepByStep,
  deleteStepByStep,
} from "../controllers/stepByStepController.js";

const router = express.Router();

router.get("/", getStepByStep);
router.post("/", createStepByStep);
router.put("/", updateStepByStep);
router.delete("/", deleteStepByStep);

export default router;