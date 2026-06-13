import { Router } from 'express';
import { auth } from '../middleware/auth';
import { requireOwner } from '../middleware/requireOwner';
import { listAdmins, createAdmin, removeAdmin } from '../controllers/adminController';

const router = Router();
router.use(auth, requireOwner);
router.get('/', listAdmins);
router.post('/', createAdmin);
router.delete('/:id', removeAdmin);
export default router;
