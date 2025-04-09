import express from "express";
import {
  getIcuAutomationData,
  createIcuAutomationData,
  updateIcuAutomationData,
  deleteIcuAutomationData,
  updateSectionData,
} from "../../controllers/Hospital/IcuAutomationController.js";
import authMiddleware from "../../middleware/auth.js";

const router = express.Router();

router.get("/", getIcuAutomationData); // Public
router.post("/", authMiddleware, createIcuAutomationData); // Admin only (add feature)
router.put("/feature/:featureId", authMiddleware, updateIcuAutomationData); // Admin only (update feature)
router.delete("/feature/:featureId", authMiddleware, deleteIcuAutomationData); // Admin only (delete feature)
router.put("/", authMiddleware, updateSectionData); // Admin only (update section)

export default router;