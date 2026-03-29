import prisma from '../../config/database';
import { AppError } from '../../utils/AppError';

export class SellerService {
    static async register(userId: string, data: any) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');

        const existing = await prisma.seller.findUnique({ where: { userId } });
        if (existing) throw new AppError(400, 'BAD_REQUEST', 'Already registered as a seller');

        const seller = await prisma.$transaction(async (tx) => {
            const s = await tx.seller.create({ data: { ...data, userId } });
            await tx.user.update({ where: { id: userId }, data: { role: 'SELLER' } });
            return s;
        });

        return seller;
    }

    static async getDashboard(userId: string) {
        const seller = await prisma.seller.findUnique({ where: { userId } });
        if (!seller) throw new AppError(404, 'NOT_FOUND', 'Seller profile not found');

        const [totalProducts, ordersWithProducts] = await Promise.all([
            prisma.product.count({ where: { sellerId: seller.id } }),
            prisma.order.findMany({
                where: { items: { some: { product: { sellerId: seller.id } } }, status: { not: 'CANCELLED' } },
                include: { items: { where: { product: { sellerId: seller.id } } } }
            })
        ]);

        let totalSales = 0;
        let revenueThisMonth = 0;
        let pendingOrders = 0;

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        for (const order of ordersWithProducts) {
            if (order.status === 'PENDING' || order.status === 'PROCESSING') pendingOrders++;
            for (const item of order.items) {
                totalSales += item.quantity;
                const oDate = new Date(order.createdAt);
                if (oDate.getMonth() === currentMonth && oDate.getFullYear() === currentYear) {
                    revenueThisMonth += (Number(item.priceAtTime) * item.quantity);
                }
            }
        }

        return { totalProducts, revenueThisMonth, pendingOrders, totalSales };
    }

    static async getProducts(userId: string, query: any) {
        const seller = await prisma.seller.findUnique({ where: { userId } });
        if (!seller) throw new AppError(404, 'NOT_FOUND', 'Seller not found');

        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where: { sellerId: seller.id },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { images: { take: 1 } }
            }),
            prisma.product.count({ where: { sellerId: seller.id } })
        ]);

        return { data: products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
    }

    static async getOrders(userId: string, query: any) {
        const seller = await prisma.seller.findUnique({ where: { userId } });
        if (!seller) throw new AppError(404, 'NOT_FOUND', 'Seller not found');

        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: { items: { some: { product: { sellerId: seller.id } } } },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: { where: { product: { sellerId: seller.id } }, include: { product: { select: { images: { take: 1 } } } } },
                    user: { select: { firstName: true, lastName: true, email: true } }
                }
            }),
            prisma.order.count({ where: { items: { some: { product: { sellerId: seller.id } } } } })
        ]);

        return { data: orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
    }
}
