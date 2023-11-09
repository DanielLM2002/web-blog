import { Router } from 'express';
import { checkAdminAuth } from '../middlewares/authentication.js';
import { 
  loadAdmin,
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
router.get('/admin', checkAdminAuth, loadAdmin);
router.post('/login', login);
router.post('/signup', signup);
router.post('/user/:id/:role', checkAdminAuth, changeUserRole);
router.post('/user/:id', checkAdminAuth, deleteUser);

export default router;
