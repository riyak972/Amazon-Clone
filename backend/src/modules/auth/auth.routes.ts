import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../middleware/validate';
import { publicRateLimit, authRateLimit } from '../../middleware/rateLimiter';
import { requireAuth } from '../../middleware/auth';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.schema';

const router = Router();

router.post('/register', publicRateLimit, validate(registerSchema), authController.register);
router.post('/login', publicRateLimit, validate(loginSchema), authController.login);
router.post('/refresh', publicRateLimit, authController.refresh);
router.delete('/logout', authRateLimit, requireAuth, authController.logout);

router.get('/verify-email/:token', publicRateLimit, authController.verifyEmail);
router.post('/forgot-password', publicRateLimit, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password/:token', publicRateLimit, validate(resetPasswordSchema), authController.resetPassword);

router.get('/me', authRateLimit, requireAuth, authController.getMe);

export default router;
