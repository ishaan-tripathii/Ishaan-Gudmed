import express from 'express';
import {
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
} from "../controllers/teamControllers.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", getTeam);
router.post("/", authenticateToken, createTeam);
router.put("/:id", authenticateToken, updateTeam);
router.delete("/:id", authenticateToken, deleteTeam);

export default router;