import { Request, Response, NextFunction } from 'express';
import { SellerService } from './seller.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const seller = await SellerService.register((req as any).user.id, req.body);
        res.status(201).json({ success: true, data: seller, message: 'Seller registered successfully' });
    } catch (error) {
        next(error);
    }
};

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dashboard = await SellerService.getDashboard((req as any).user.id);
        res.status(200).json({ success: true, data: dashboard, message: 'Seller dashboard retrieved' });
    } catch (error) {
        next(error);
    }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await SellerService.getProducts((req as any).user.id, req.query);
        res.status(200).json({ success: true, ...result, message: 'Seller products retrieved' });
    } catch (error) {
        next(error);
    }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await SellerService.getOrders((req as any).user.id, req.query);
        res.status(200).json({ success: true, ...result, message: 'Seller orders retrieved' });
    } catch (error) {
        next(error);
    }
};
