import { Router } from 'express';
import { auth } from '../middleware/auth';
import { listTemplates, updateTemplate } from '../controllers/templateController';

const router = Router();
router.use(auth);
router.get('/', listTemplates);
router.patch('/:key', updateTemplate);
export default router;
