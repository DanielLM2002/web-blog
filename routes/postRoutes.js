import { Router } from 'express';
import { 
  getAllPosts,
  createPost,
  getUserPosts
} from '../controllers/postController.js';

const router = Router();

router.get('/', getAllPosts);
router.get('/posts/create', createPost);
router.get('/posts/user/:id', getUserPosts);

export default router;
