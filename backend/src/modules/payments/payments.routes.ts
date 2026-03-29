import { Router, raw } from 'express';
import * as paymentsController from './payments.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.post('/create-intent', requireAuth, paymentsController.createIntent);

// Stripe webhook requires raw body for signature verification
router.post('/webhook', raw({ type: 'application/json' }), paymentsController.webhook);

export default router;
