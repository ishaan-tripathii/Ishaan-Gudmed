import express from "express";
import {
    getThirdSection,
    createThirdSection,
    updateThirdSection,
    deleteThirdSection,
} from "../../controllers/thirdsectionController.js"; // ✅ Fixed incorrect import path
import authenticateToken from "../../middleware/auth.js"; // ✅ Ensure correct middleware path

const router = express.Router();

// ✅ Get Third Section Data (No ID needed, assuming only one exists)
router.get("/", getThirdSection);

// ✅ Create Third Section Data
router.post("/", authenticateToken, createThirdSection);

// ✅ Update Third Section Data (Requires ID)
router.put("/:id", authenticateToken, updateThirdSection);

// ✅ Delete Third Section Data (Requires ID)
router.delete("/:id", authenticateToken, deleteThirdSection);

export default router;

