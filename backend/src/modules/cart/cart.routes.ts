import { Router } from 'express';
import * as cartController from './cart.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { cartItemSchema, updateCartItemSchema } from './cart.schema';

const router = Router();

router.use(requireAuth);

router.get('/', cartController.getCart);
router.post('/items', validate(cartItemSchema), cartController.addItem);
router.put('/items/:itemId', validate(updateCartItemSchema), cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

export default router;
