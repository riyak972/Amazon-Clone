import { Router } from 'express';
import * as usersController from './users.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { upload } from '../../middleware/upload';
import { updateProfileSchema, changePasswordSchema, addressSchema } from './users.schema';

const router = Router();

router.use(requireAuth);

router.get('/profile', usersController.getProfile);
router.put('/profile', upload.single('avatar'), validate(updateProfileSchema), usersController.updateProfile);
router.put('/change-password', validate(changePasswordSchema), usersController.changePassword);

router.get('/addresses', usersController.getAddresses);
router.post('/addresses', validate(addressSchema), usersController.addAddress);
router.put('/addresses/:id', validate(addressSchema), usersController.updateAddress);
router.delete('/addresses/:id', usersController.deleteAddress);
router.put('/addresses/:id/default', usersController.setDefaultAddress);

router.get('/wishlist', usersController.getWishlist);
router.post('/wishlist/:productId', usersController.toggleWishlistItem);

export default router;
