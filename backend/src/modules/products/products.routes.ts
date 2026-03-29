import { Router } from 'express';
import * as productsController from './products.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { restrictTo } from '../../middleware/roles';
import { upload } from '../../middleware/upload';
import { createProductSchema, updateProductSchema, getProductsQuerySchema } from './products.schema';
import { cacheMiddleware } from '../../utils/cache';

const router = Router();

router.get('/', validate(getProductsQuerySchema), cacheMiddleware('products', 300), productsController.getProducts);
router.get('/search', validate(getProductsQuerySchema), productsController.searchProducts);
router.get('/featured', cacheMiddleware('featured', 300), productsController.getFeaturedProducts);
router.get('/deals', cacheMiddleware('deals', 300), productsController.getDeals);
router.get('/:slug', cacheMiddleware('product_detail', 600), productsController.getProductBySlug);

router.post('/', requireAuth, restrictTo('SELLER', 'ADMIN'), upload.array('images', 5), validate(createProductSchema), productsController.createProduct);
router.put('/:id', requireAuth, restrictTo('SELLER', 'ADMIN'), validate(updateProductSchema), productsController.updateProduct);
router.delete('/:id', requireAuth, restrictTo('SELLER', 'ADMIN'), productsController.deleteProduct);

export default router;
