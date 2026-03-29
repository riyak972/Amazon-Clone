import { z } from 'zod';

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2),
        description: z.string().optional(),
        imageUrl: z.string().url().optional(),
        parentId: z.string().optional()
    })
});

export const updateCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        imageUrl: z.string().url().optional(),
        parentId: z.string().optional().nullable()
    })
});
