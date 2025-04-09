import express from "express";
import {
  getHospitalData,
  createHospitalData,
  updateHospitalData,
  deleteHospitalData,
} from "../../controllers/Hospital/hospitalController.js";
import authMiddleware from "../../middleware/auth.js";

const router = express.Router();

// Public route (no auth required)
router.get("/", getHospitalData);

// Protected routes (admin only)
router.post("/", authMiddleware, createHospitalData);
router.put("/:id", authMiddleware, updateHospitalData);
router.delete("/:id", authMiddleware, deleteHospitalData);

export default router;