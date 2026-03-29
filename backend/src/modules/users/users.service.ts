import prisma from '../../config/database';
import cloudinary from '../../config/cloudinary';
import { AppError } from '../../utils/AppError';
import bcrypt from 'bcryptjs';

export class UsersService {
    static async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, avatarUrl: true, isVerified: true, createdAt: true }
        });
        if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');
        return user;
    }

    static async updateProfile(userId: string, data: any, file?: Express.Multer.File) {
        if (file) {
            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
            const result = await cloudinary.uploader.upload(dataURI, { folder: 'amazon-clone/avatars' });
            data.avatarUrl = result.secure_url;
        }
        const updated = await prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatarUrl: true }
        });
        return updated;
    }

    static async changePassword(userId: string, currentP: string, newP: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !(await bcrypt.compare(currentP, user.passwordHash))) {
            throw new AppError(400, 'BAD_REQUEST', 'Current password is incorrect');
        }
        const hash = await bcrypt.hash(newP, 12);
        await prisma.user.update({ where: { id: userId }, data: { passwordHash: hash } });
    }

    static async getAddresses(userId: string) {
        return prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } });
    }

    static async addAddress(userId: string, data: any) {
        const addresses = await prisma.address.findMany({ where: { userId } });
        if (addresses.length >= 5) throw new AppError(400, 'BAD_REQUEST', 'Maximum 5 addresses allowed');

        if (data.isDefault || addresses.length === 0) {
            await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
            data.isDefault = true;
        }

        return prisma.address.create({ data: { ...data, userId } });
    }

    static async updateAddress(userId: string, id: string, data: any) {
        if (data.isDefault) {
            await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
        }
        return prisma.address.update({ where: { id, userId }, data });
    }

    static async deleteAddress(userId: string, id: string) {
        return prisma.address.delete({ where: { id, userId } });
    }

    static async setDefaultAddress(userId: string, id: string) {
        await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
        return prisma.address.update({ where: { id, userId }, data: { isDefault: true } });
    }

    static async getWishlist(userId: string) {
        return prisma.wishlistItem.findMany({ where: { userId }, include: { product: { include: { images: true } } } });
    }

    static async toggleWishlist(userId: string, productId: string) {
        const existing = await prisma.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } });
        if (existing) {
            await prisma.wishlistItem.delete({ where: { id: existing.id } });
            return { added: false };
        } else {
            await prisma.wishlistItem.create({ data: { userId, productId } });
            return { added: true };
        }
    }
}
