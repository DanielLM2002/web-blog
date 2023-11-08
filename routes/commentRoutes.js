import { Router } from 'express';
import { checkUserAuth } from '../middlewares/authentication.js';
import { postComment } from '../controllers/commentController.js';

const router = Router();

router.post('/posts/:id', checkUserAuth, postComment);

export default router;
