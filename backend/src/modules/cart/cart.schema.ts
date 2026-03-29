import { z } from 'zod';

export const cartItemSchema = z.object({
    body: z.object({
        productId: z.string(),
        variantId: z.string().optional().nullable(),
        quantity: z.number().int().positive()
    })
});

export const updateCartItemSchema = z.object({
    body: z.object({
        quantity: z.number().int().positive()
    })
});
