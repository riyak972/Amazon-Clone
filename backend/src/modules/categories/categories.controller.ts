import { Request, Response, NextFunction } from 'express';
import { CategoriesService } from './categories.service';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await CategoriesService.getAll();
        res.status(200).json({ success: true, data: categories, message: 'Categories retrieved' });
    } catch (error) {
        next(error);
    }
};

export const getCategoryProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await CategoriesService.getProducts(req.params.slug, req.query);
        res.status(200).json({ success: true, ...result, message: 'Category products retrieved' });
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await CategoriesService.create(req.body);
        res.status(201).json({ success: true, data: category, message: 'Category created' });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await CategoriesService.update(req.params.id, req.body);
        res.status(200).json({ success: true, data: category, message: 'Category updated' });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await CategoriesService.delete(req.params.id);
        res.status(200).json({ success: true, data: {}, message: 'Category deleted' });
    } catch (error) {
        next(error);
    }
};
