import { Router } from 'express';
import { 
  getAllPosts,
  createPost,
  getUserPosts,
  getCategoryPosts,
  getPostById
} from '../controllers/postController.js';

const router = Router();

router.get('/', getAllPosts);
router.get('/posts/new', createPost);
router.get('/posts/:id', getPostById);
router.get('/posts/user/:id', getUserPosts);
router.get('/posts/category/:name', getCategoryPosts);

export default router;
