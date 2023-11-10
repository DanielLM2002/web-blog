import { Router } from 'express';
import { 
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  getPostsByCategory,
  getProfilePosts,
  post,
  deletePost
} from '../controllers/postController.js';
import { checkUserAuth } from '../middlewares/authentication.js';

const router = Router();

router.get('/', getAllPosts);
router.get('/posts/new', checkUserAuth, createPost);
router.get('/posts/:id', getPostById);
router.get('/posts/user/:id', getPostsByUser);
router.get('/posts/category/:name', getPostsByCategory);
router.get('/profile', checkUserAuth, getProfilePosts);
router.post('/posts/', checkUserAuth, post);
router.post('/posts/delete/:id', checkUserAuth, deletePost);

export default router;
