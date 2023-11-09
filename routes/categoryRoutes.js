import { Router } from 'express';
import { checkAdminAuth } from '../middlewares/authentication.js';
import { addCategory, deleteCategory } from '../controllers/categoryController.js';

const router = Router();

router.post('/category/:name', checkAdminAuth, addCategory);
router.delete('/category/:name', checkAdminAuth, deleteCategory);

export default router;
