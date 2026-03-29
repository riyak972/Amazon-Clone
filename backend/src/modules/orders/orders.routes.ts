import { Router } from 'express';
import * as ordersController from './orders.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { restrictTo } from '../../middleware/roles';
import { createOrderSchema, updateOrderStatusSchema } from './orders.schema';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createOrderSchema), ordersController.createOrder);
router.get('/', ordersController.getMyOrders);
router.get('/:id', ordersController.getOrderById);
router.post('/:id/cancel', ordersController.cancelOrder);

// Admin
router.get('/admin/all', restrictTo('ADMIN'), ordersController.getAllOrders);
router.put('/admin/:id/status', restrictTo('ADMIN'), validate(updateOrderStatusSchema), ordersController.updateOrderStatus);

export default router;
