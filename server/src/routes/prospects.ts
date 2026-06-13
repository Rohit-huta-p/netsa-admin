import { Router } from 'express';
import { auth } from '../middleware/auth';
import * as c from '../controllers/prospectController';

const router = Router();
router.use(auth);
router.get('/', c.listProspects);
router.post('/', c.createProspect);
router.post('/import', c.importEndpoint);
router.get('/:id', c.getProspect);
router.patch('/:id', c.updateProspect);
router.delete('/:id', c.removeProspect);
router.post('/:id/notes', c.addNote);
router.post('/:id/contacted', c.markContacted);
export default router;
