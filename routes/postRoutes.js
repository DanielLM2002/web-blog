import { Router } from 'express';
import { 
  createPost,
  loadEditPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  getPostsByCategory,
  getProfilePosts,
  post,
  deletePost,
  editPost
} from '../controllers/postController.js';
import { checkUserAuth } from '../middlewares/authentication.js';

const router = Router();

router.get('/', getAllPosts);
router.get('/:page', getAllPosts);
router.get('/posts/new', checkUserAuth, createPost);
router.get('/posts/:id', getPostById);
router.get('/posts/user/:id', getPostsByUser);
router.get('/posts/user/:id/:page', getPostsByUser);
router.get('/posts/category/:name', getPostsByCategory);
router.get('/profile', checkUserAuth, getProfilePosts);
router.get('/posts/edit/:id', checkUserAuth, loadEditPost);
router.post('/posts/', checkUserAuth, post);
router.post('/posts/delete/:id', checkUserAuth, deletePost);
router.post('/posts/edit/:id', checkUserAuth, editPost);

export default router;
