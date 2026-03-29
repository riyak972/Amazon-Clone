import { Router } from 'express';
import * as sellerController from './seller.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { restrictTo } from '../../middleware/roles';
import { registerSellerSchema } from './seller.schema';

const router = Router();

router.use(requireAuth);

router.post('/register', validate(registerSellerSchema), sellerController.register);

// The following routes require the user to actually be a Seller
router.use(restrictTo('SELLER'));

router.get('/dashboard', sellerController.getDashboard);
router.get('/products', sellerController.getProducts);
router.get('/orders', sellerController.getOrders);

export default router;
