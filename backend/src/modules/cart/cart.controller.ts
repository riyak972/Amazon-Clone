import { Request, Response, NextFunction } from 'express';
import { CartService } from './cart.service';

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await CartService.getCart((req as any).user.id);
        res.status(200).json({ success: true, data: cart, message: 'Cart retrieved' });
    } catch (error) {
        next(error);
    }
};

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await CartService.addItem((req as any).user.id, req.body);
        res.status(200).json({ success: true, data: cart, message: 'Item added to cart' });
    } catch (error) {
        next(error);
    }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await CartService.updateItem((req as any).user.id, req.params.itemId, req.body.quantity);
        res.status(200).json({ success: true, data: cart, message: 'Cart updated' });
    } catch (error) {
        next(error);
    }
};

export const removeItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await CartService.removeItem((req as any).user.id, req.params.itemId);
        res.status(200).json({ success: true, data: cart, message: 'Item removed from cart' });
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await CartService.clearCart((req as any).user.id);
        res.status(200).json({ success: true, data: {}, message: 'Cart cleared' });
    } catch (error) {
        next(error);
    }
};
