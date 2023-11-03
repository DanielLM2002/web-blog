import { Router } from 'express';
import { 
  loadLogin , 
  loadSignup,
  login,
  logout,
  signup
} from '../controllers/userController.js';

const router = Router();

router.get('/login', loadLogin);
router.get('/signup', loadSignup);
router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);

export default router;
