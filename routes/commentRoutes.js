import { Router } from 'express';
import { checkUserAuth } from '../middlewares/authentication.js';
import { 
  postComment,
  deleteComment,
  loadEditComment,
  editComment
} from '../controllers/commentController.js';

const router = Router();

router.get('/comments/edit/:id', checkUserAuth, loadEditComment);
router.post('/posts/:id', checkUserAuth, postComment);
router.post('/comments/delete/:id', checkUserAuth, deleteComment);
router.post('/comments/edit/:id', checkUserAuth, editComment);

export default router;
