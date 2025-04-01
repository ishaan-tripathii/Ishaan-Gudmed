import express from 'express';
import { getPosts, createPost } from '../controllers/postController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', authenticateToken, createPost);

export default router;