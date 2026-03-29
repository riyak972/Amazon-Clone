import { z } from 'zod';

export const registerSellerSchema = z.object({
    body: z.object({
        businessName: z.string().min(2),
        gstin: z.string().optional()
    })
});
