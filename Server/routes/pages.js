import express from 'express';
import { getPages, createPage, updatePage, deletePage } from '../controllers/pageController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPages);
router.post('/', authenticateToken, createPage);
router.put('/:id', authenticateToken, updatePage);
router.delete('/:id', authenticateToken, deletePage);

export default router;