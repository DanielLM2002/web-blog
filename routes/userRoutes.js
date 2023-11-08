import { Router } from 'express';
import { checkAdminAuth } from '../middlewares/authentication.js';
import { 
  loadLogin , 
  loadSignup,
  login,
  logout,
  signup,
  changeUserRole,
  deleteUser
} from '../controllers/userController.js';

const router = Router();

router.get('/login', loadLogin);
router.get('/logout', logout);
router.get('/signup', loadSignup);
router.post('/login', login);
router.post('/signup', signup);
router.post('/user/:id/:role', changeUserRole);
router.delete('/user/:id', deleteUser);

export default router;
