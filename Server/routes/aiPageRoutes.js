import express from 'express';
import {
  fetchAIPages,
  createAIPage,
  updateAIPage,
  deleteAIPage,
} from '../controllers/AiPageControllers.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', fetchAIPages);
router.get('/:id', fetchAIPages);
router.post('/', authMiddleware, createAIPage);
router.put('/:id', authMiddleware, updateAIPage);
router.delete('/:id', authMiddleware, deleteAIPage);

export default router;