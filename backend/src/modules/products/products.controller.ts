import { Request, Response, NextFunction } from 'express';
import { ProductsService } from './products.service';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ProductsService.getProducts(req.query);
        res.status(200).json({ success: true, ...result, message: 'Products retrieved' });
    } catch (error) {
        next(error);
    }
};

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ProductsService.searchProducts(req.query);
        res.status(200).json({ success: true, ...result, message: 'Search results retrieved' });
    } catch (error) {
        next(error);
    }
};

export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await ProductsService.getFeatured();
        res.status(200).json({ success: true, data: products, message: 'Featured products retrieved' });
    } catch (error) {
        next(error);
    }
};

export const getDeals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await ProductsService.getDeals();
        res.status(200).json({ success: true, data: products, message: 'Deals retrieved' });
    } catch (error) {
        next(error);
    }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await ProductsService.getBySlug(req.params.slug);
        res.status(200).json({ success: true, data: product, message: 'Product retrieved' });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];
        const product = await ProductsService.create(req.body, files, (req as any).user.id);
        res.status(201).json({ success: true, data: product, message: 'Product created' });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await ProductsService.update(req.params.id, req.body, (req as any).user);
        res.status(200).json({ success: true, data: product, message: 'Product updated' });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await ProductsService.softDelete(req.params.id, (req as any).user);
        res.status(200).json({ success: true, data: {}, message: 'Product deleted' });
    } catch (error) {
        next(error);
    }
};
