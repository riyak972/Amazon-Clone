import prisma from '../../config/database';
import { AppError } from '../../utils/AppError';
import { Role } from '@prisma/client';

export class AdminService {
    static async getStats() {
        const [totalUsers, totalOrders, totalProducts, activeSellers] = await Promise.all([
            prisma.user.count(),
            prisma.order.count(),
            prisma.product.count(),
            prisma.seller.count({ where: { isVerified: true } })
        ]);

        const revenueResult = await prisma.order.aggregate({
            where: { paymentStatus: 'PAID', status: { not: 'CANCELLED' } },
            _sum: { total: true }
        });

        return {
            totalUsers,
            totalOrders,
            totalProducts,
            activeSellers,
            totalRevenue: revenueResult._sum.total || 0
        };
    }

    static async getUsers(query: any) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;

        const where: any = {};
        if (query.role) where.role = query.role;

        const [users, total] = await Promise.all([
            prisma.user.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
            prisma.user.count({ where })
        ]);

        return { data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
    }

    static async updateUserRole(id: string, role: string) {
        if (!['CUSTOMER', 'SELLER', 'ADMIN'].includes(role)) {
            throw new AppError(400, 'BAD_REQUEST', 'Invalid role');
        }
        return prisma.user.update({ where: { id }, data: { role: role as Role } });
    }

    static async getSellers(query: any) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;

        const [sellers, total] = await Promise.all([
            prisma.seller.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: { user: { select: { email: true, firstName: true } } } }),
            prisma.seller.count()
        ]);

        return { data: sellers, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
    }

    static async verifySeller(id: string, isVerified: boolean) {
        return prisma.seller.update({ where: { id }, data: { isVerified } });
    }
}
