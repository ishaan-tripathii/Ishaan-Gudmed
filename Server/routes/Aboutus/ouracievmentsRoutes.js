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
router.put("/:id", authenticateToken, updateOurAchievements);
router.delete("/:id", authenticateToken, deleteOurAchievements);

export default router;
