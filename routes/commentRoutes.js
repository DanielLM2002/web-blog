import { Router } from 'express';
import { postComment } from '../controllers/commentsController.js';

const router = Router();

router.post('/posts/:id', postComment);

export default router;
