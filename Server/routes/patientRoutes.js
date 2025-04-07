import express from 'express';
import {
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
} from "../controllers/patientController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPatient)

//Protected routes
router.post("/", authenticateToken, createPatient )
router.put("/", authenticateToken, updatePatient )
router.delete("/", authenticateToken, deletePatient )

export default router;