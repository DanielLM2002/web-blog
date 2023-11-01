import { Router } from 'express';
import { 
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  getPostsByCategory,
  post
} from '../controllers/postController.js';

const router = Router();

router.get('/', getAllPosts);
router.get('/posts/new', createPost);
router.get('/posts/:id', getPostById);
router.get('/posts/user/:id', getPostsByUser);
router.get('/posts/category/:name', getPostsByCategory);
router.post('/posts/', post);

export default router;
