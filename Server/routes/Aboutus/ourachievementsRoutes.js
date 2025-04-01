import express from "express";
import {
  getOurAchievements,
  createOurAchievements,
  updateOurAchievements,
  deleteOurAchievements,
} from "../../controllers/ourachievementsController.js"; // ✅ Correct import path
import authenticateToken from "../../middleware/auth.js"; // ✅ Ensure this path is correct

const router = express.Router();

router.get("/", getOurAchievements);
router.post("/", authenticateToken, createOurAchievements);
router.put("/", authenticateToken, updateOurAchievements);
router.delete("/", authenticateToken, deleteOurAchievements);

export default router;
