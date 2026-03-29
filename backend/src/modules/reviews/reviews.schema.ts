import { z } from 'zod';

export const createReviewSchema = z.object({
    body: z.object({
        productId: z.string(),
        rating: z.number().int().min(1).max(5),
        title: z.string().min(2),
        body: z.string().min(10)
    })
});

export const updateReviewSchema = z.object({
    body: z.object({
        rating: z.number().int().min(1).max(5).optional(),
        title: z.string().min(2).optional(),
        body: z.string().min(10).optional()
    })
});
