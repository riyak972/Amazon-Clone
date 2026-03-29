import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await AdminService.getStats();
        res.status(200).json({ success: true, data: stats, message: 'Admin stats retrieved' });
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await AdminService.getUsers(req.query);
        res.status(200).json({ success: true, ...result, message: 'Users retrieved' });
    } catch (error) {
        next(error);
    }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await AdminService.updateUserRole(req.params.id, req.body.role);
        res.status(200).json({ success: true, data: user, message: 'User role updated' });
    } catch (error) {
        next(error);
    }
};

export const getSellers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await AdminService.getSellers(req.query);
        res.status(200).json({ success: true, ...result, message: 'Sellers retrieved' });
    } catch (error) {
        next(error);
    }
};

export const verifySeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const seller = await AdminService.verifySeller(req.params.id, req.body.isVerified);
        res.status(200).json({ success: true, data: seller, message: 'Seller verification status updated' });
    } catch (error) {
        next(error);
    }
};
