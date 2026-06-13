import { Router } from 'express';
import { auth } from '../middleware/auth';
import { funnel } from '../controllers/statsController';

const router = Router();
router.use(auth);
router.get('/funnel', funnel);
export default router;
