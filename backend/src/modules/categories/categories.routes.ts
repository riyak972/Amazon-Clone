import { Router } from 'express';
import * as categoriesController from './categories.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { restrictTo } from '../../middleware/roles';
import { createCategorySchema, updateCategorySchema } from './categories.schema';
import { getProductsQuerySchema } from '../products/products.schema';

const router = Router();

router.get('/', categoriesController.getCategories);
router.get('/:slug/products', validate(getProductsQuerySchema), categoriesController.getCategoryProducts);

router.post('/', requireAuth, restrictTo('ADMIN'), validate(createCategorySchema), categoriesController.createCategory);
router.put('/:id', requireAuth, restrictTo('ADMIN'), validate(updateCategorySchema), categoriesController.updateCategory);
router.delete('/:id', requireAuth, restrictTo('ADMIN'), categoriesController.deleteCategory);

export default router;
