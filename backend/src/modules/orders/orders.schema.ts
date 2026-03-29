import { z } from 'zod';

export const createOrderSchema = z.object({
    body: z.object({
        addressId: z.string(),
        notes: z.string().optional()
    })
});

export const updateOrderStatusSchema = z.object({
    body: z.object({
        status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED']),
        message: z.string().optional()
    })
});
