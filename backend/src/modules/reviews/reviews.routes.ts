import { Router } from 'express';
import * as reviewsController from './reviews.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { upload } from '../../middleware/upload';
import { createReviewSchema, updateReviewSchema } from './reviews.schema';

const router = Router();

// Notice this is at /api/v1/products/:id/reviews, but mounted as /api/v1/reviews for some routes
// We will mount this router at /api/v1/reviews

router.post('/', requireAuth, upload.array('images', 5), validate(createReviewSchema), reviewsController.createReview);
router.put('/:id', requireAuth, validate(updateReviewSchema), reviewsController.updateReview);
router.delete('/:id', requireAuth, reviewsController.deleteReview);
router.post('/:id/helpful', requireAuth, reviewsController.markHelpful);

export default router;
