import { Router } from 'express';
import { 
  getAllPosts,
  createPost
} from '../controllers/postController.js';

const router = Router();

router.get('/', getAllPosts);
router.get('/post', createPost);

export default router;
