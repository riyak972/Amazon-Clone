import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profile = await UsersService.getProfile((req as any).user.id);
        res.status(200).json({ success: true, data: profile, message: 'Profile retrieved' });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file;
        const result = await UsersService.updateProfile((req as any).user.id, req.body, file);
        res.status(200).json({ success: true, data: result, message: 'Profile updated' });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UsersService.changePassword((req as any).user.id, req.body.currentPassword, req.body.newPassword);
        res.status(200).json({ success: true, data: {}, message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addresses = await UsersService.getAddresses((req as any).user.id);
        res.status(200).json({ success: true, data: addresses, message: 'Addresses retrieved' });
    } catch (error) {
        next(error);
    }
};

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const address = await UsersService.addAddress((req as any).user.id, req.body);
        res.status(201).json({ success: true, data: address, message: 'Address created' });
    } catch (error) {
        next(error);
    }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const address = await UsersService.updateAddress((req as any).user.id, req.params.id, req.body);
        res.status(200).json({ success: true, data: address, message: 'Address updated' });
    } catch (error) {
        next(error);
    }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UsersService.deleteAddress((req as any).user.id, req.params.id);
        res.status(200).json({ success: true, data: {}, message: 'Address deleted' });
    } catch (error) {
        next(error);
    }
};

export const setDefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const address = await UsersService.setDefaultAddress((req as any).user.id, req.params.id);
        res.status(200).json({ success: true, data: address, message: 'Default address set' });
    } catch (error) {
        next(error);
    }
};

export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wishlist = await UsersService.getWishlist((req as any).user.id);
        res.status(200).json({ success: true, data: wishlist, message: 'Wishlist retrieved' });
    } catch (error) {
        next(error);
    }
};

export const toggleWishlistItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UsersService.toggleWishlist((req as any).user.id, req.params.productId);
        res.status(200).json({ success: true, data: result, message: 'Wishlist updated' });
    } catch (error) {
        next(error);
    }
};
