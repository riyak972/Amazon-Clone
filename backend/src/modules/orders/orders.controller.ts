import { Request, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await OrdersService.createOrder((req as any).user.id, req.body);
        res.status(201).json({ success: true, data: result, message: 'Order created' });
    } catch (error) {
        next(error);
    }
};

export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await OrdersService.getUserOrders((req as any).user.id, req.query);
        res.status(200).json({ success: true, ...result, message: 'Orders retrieved' });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await OrdersService.getOrderById((req as any).user, req.params.id);
        res.status(200).json({ success: true, data: order, message: 'Order retrieved' });
    } catch (error) {
        next(error);
    }
};

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await OrdersService.cancelOrder((req as any).user.id, req.params.id);
        res.status(200).json({ success: true, data: order, message: 'Order cancelled successfully' });
    } catch (error) {
        next(error);
    }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await OrdersService.getAllOrders(req.query);
        res.status(200).json({ success: true, ...result, message: 'All orders retrieved' });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await OrdersService.updateOrderStatus(req.params.id, req.body.status, req.body.message);
        res.status(200).json({ success: true, data: order, message: 'Order status updated' });
    } catch (error) {
        next(error);
    }
};
