import express from 'express';
import {
    getSmartCamera,
    createSmartCamera,
    updateSmartCamera,
    deleteSmartCamera
} from '../controllers/smartCameraController.js' //Ensure correct path 

const router = express.Router();

router.get("/", getSmartCamera);
router.post("/", createSmartCamera);
router.put("/",updateSmartCamera );
router.delete("/:id", deleteSmartCamera);

export default router;
