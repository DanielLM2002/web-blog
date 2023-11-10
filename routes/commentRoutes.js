import { Router } from 'express';
import { checkUserAuth } from '../middlewares/authentication.js';
import { 
  postComment,
  deleteComment 
} from '../controllers/commentController.js';

const router = Router();

router.post('/posts/:id', checkUserAuth, postComment);
router.post('/comments/delete/:id', checkUserAuth ,deleteComment);

export default router;
