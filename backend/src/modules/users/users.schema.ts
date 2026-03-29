import { z } from 'zod';

export const updateProfileSchema = z.object({
    body: z.object({
        firstName: z.string().min(2).optional(),
        lastName: z.string().min(2).optional(),
        phone: z.string().optional(),
        avatarUrl: z.string().url().optional()
    })
});

export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8)
    })
});

export const addressSchema = z.object({
    body: z.object({
        fullName: z.string().min(2),
        line1: z.string().min(5),
        line2: z.string().optional(),
        city: z.string().min(2),
        state: z.string().min(2),
        pincode: z.string().min(4),
        country: z.string().optional(),
        phone: z.string().min(7),
        isDefault: z.boolean().optional()
    })
});
