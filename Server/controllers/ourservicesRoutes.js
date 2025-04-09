import express from 'express';
import { 
    createOurServices, 
    deleteOurServices, 
    getOurServices, 
    updateOurServices 
} from '../controllers/servicesController.js'; // Ensure correct path

const router = express.Router();

router.get("/", getOurServices);
router.post("/", createOurServices);
router.put("/:id", updateOurServices);
router.delete("/:id",deleteOurServices);

export default router;