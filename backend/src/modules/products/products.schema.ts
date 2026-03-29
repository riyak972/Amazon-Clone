import { z } from 'zod';

export const createProductSchema = z.object({
    body: z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        brand: z.string(),
        categoryId: z.string(),
        basePrice: z.number().positive(),
        discountPercent: z.number().min(0).max(100).optional().default(0),
        stock: z.number().int().nonnegative(),
        specifications: z.any().optional(),
        tags: z.array(z.string()).optional(),
    })
});

export const updateProductSchema = z.object({
    body: z.object({
        title: z.string().min(3).optional(),
        description: z.string().min(10).optional(),
        brand: z.string().optional(),
        categoryId: z.string().optional(),
        basePrice: z.number().positive().optional(),
        discountPercent: z.number().min(0).max(100).optional(),
        stock: z.number().int().nonnegative().optional(),
        specifications: z.any().optional(),
        tags: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
    })
});

export const getProductsQuerySchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        category: z.string().optional(),
        brand: z.string().optional(),
        minPrice: z.string().optional(),
        maxPrice: z.string().optional(),
        rating: z.string().optional(),
        sort: z.enum(['price_asc', 'price_desc', 'rating', 'newest', 'bestseller']).optional(),
        inStock: z.enum(['true', 'false']).optional(),
    })
});
