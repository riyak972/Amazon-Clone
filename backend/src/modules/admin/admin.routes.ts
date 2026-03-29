import { Router } from 'express';
import * as adminController from './admin.controller';
import { requireAuth } from '../../middleware/auth';
import { restrictTo } from '../../middleware/roles';

const router = Router();

router.use(requireAuth, restrictTo('ADMIN'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.get('/sellers', adminController.getSellers);
router.put('/sellers/:id/verify', adminController.verifySeller);

export default router;
