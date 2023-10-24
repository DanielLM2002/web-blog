import { Router } from 'express';
import { 
  getAllPosts,
  createPost,
  getUserPosts,
  getCategoryPosts
} from '../controllers/postController.js';

const router = Router();

router.get('/', getAllPosts);
router.get('/posts/create', createPost);
router.get('/posts/user/:id', getUserPosts);
router.get('/posts/category/:name', getCategoryPosts);

export default router;
