import { Router } from 'express';
import { example } from '../controllers/exampleController.js';

const router = Router();
router.get('/', example);

export default router;
