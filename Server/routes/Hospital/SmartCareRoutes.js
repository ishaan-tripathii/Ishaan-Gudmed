import express from "express";
import {
  getSmartCareData,
  createSmartCareData,
  updateSmartCareData,
  deleteSmartCareData
} from "../../controllers/Hospital/SmartCareControllers.js"; // make sure file extension is added
import authMiddleware from "../../middleware/auth.js"; // added .js if needed

const router = express.Router();

// ✅ GET all SmartCare data (requires authentication)
router.get("/",  getSmartCareData);

// ✅ POST new SmartCare data
router.post("/", authMiddleware, createSmartCareData);

// ✅ PUT update SmartCare data by ID
router.put("/:id", authMiddleware, updateSmartCareData);

// ✅ DELETE SmartCare data by ID
router.delete("/:id", authMiddleware, deleteSmartCareData);

export default router;
