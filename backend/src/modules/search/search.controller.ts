import { Request, Response, NextFunction } from 'express';
import { ProductsService } from '../products/products.service';
import prisma from '../../config/database';

export const getSearchSuggestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const q = req.query.q as string;
        if (!q || q.length < 2) return res.status(200).json({ success: true, data: [] });

        // Autocomplete using Prisma simple `contains`, limits to 8 results
        const products = await prisma.product.findMany({
            where: {
                title: { contains: q, mode: 'insensitive' },
                isActive: true
            },
            take: 8,
            select: { id: true, title: true, slug: true }
        });

        res.status(200).json({ success: true, data: products, message: 'Suggestions retrieved' });
    } catch (error) {
        next(error);
    }
};

export const getSearchResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ProductsService.searchProducts(req.query);
        res.status(200).json({ success: true, ...result, message: 'Search results' });
    } catch (error) {
        next(error);
    }
};
