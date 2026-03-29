import { Request, Response, NextFunction } from 'express';
import { ReviewsService } from './reviews.service';

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];
        const review = await ReviewsService.createReview((req as any).user.id, req.body, files);
        res.status(201).json({ success: true, data: review, message: 'Review posted' });
    } catch (error) {
        next(error);
    }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const review = await ReviewsService.updateReview((req as any).user.id, req.params.id, req.body);
        res.status(200).json({ success: true, data: review, message: 'Review updated' });
    } catch (error) {
        next(error);
    }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await ReviewsService.deleteReview((req as any).user, req.params.id);
        res.status(200).json({ success: true, data: {}, message: 'Review deleted' });
    } catch (error) {
        next(error);
    }
};

export const markHelpful = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const review = await ReviewsService.markHelpful(req.params.id);
        res.status(200).json({ success: true, data: review, message: 'Review marked helpful' });
    } catch (error) {
        next(error);
    }
};

export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ReviewsService.getProductReviews(req.params.id, req.query);
        res.status(200).json({ success: true, ...result, message: 'Reviews retrieved' });
    } catch (error) {
        next(error);
    }
};
