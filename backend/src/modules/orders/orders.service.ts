import prisma from '../../config/database';
import stripe from '../../config/stripe';
import { AppError } from '../../utils/AppError';
import { sendEmail } from '../../config/email';

export class OrdersService {
    static async createOrder(userId: string, data: any) {
        // Lock inventory in a transaction
        return await prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: { userId },
                include: { items: { include: { product: true } } }
            });

            if (!cart || cart.items.length === 0) {
                throw new AppError(400, 'BAD_REQUEST', 'Cart is empty');
            }

            let subtotal = 0;
            let totalDiscount = 0;
            const orderItems = [];

            for (const item of cart.items) {
                // Optimistic locking / Inventory decrement
                const updatedProduct = await tx.product.updateMany({
                    where: { id: item.productId, stock: { gte: item.quantity } },
                    data: { stock: { decrement: item.quantity } }
                });

                if (updatedProduct.count === 0) {
                    throw new AppError(400, 'OUT_OF_STOCK', `Product ${item.product.title} is out of stock or insufficient quantity`);
                }

                const price = Number(item.product.basePrice);
                const finalP = Number(item.product.finalPrice);
                const disc = price - finalP;

                subtotal += price * item.quantity;
                totalDiscount += disc * item.quantity;

                orderItems.push({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    priceAtTime: finalP,
                    title: item.product.title,
                    imageUrl: "" // wait we can fetch the primary image or just skip for now since it requires another join. Let's set empty string.
                });
            }

            const shipping = (subtotal - totalDiscount) >= 499 ? 0 : 49;
            const total = subtotal - totalDiscount + shipping;

            const order = await tx.order.create({
                data: {
                    userId,
                    addressId: data.addressId,
                    subtotal,
                    discount: totalDiscount,
                    shipping,
                    total,
                    notes: data.notes,
                    items: { create: orderItems },
                    timeline: { create: { status: 'PENDING', message: 'Order placed' } }
                }
            });

            // Clear the cart in the transaction
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

            // Create Stripe Intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(total * 100), // INR paise
                currency: 'inr',
                metadata: { orderId: order.id }
            });

            await tx.order.update({
                where: { id: order.id },
                data: { paymentIntentId: paymentIntent.id }
            });

            return { orderId: order.id, clientSecret: paymentIntent.client_secret };
        });
    }

    static async getUserOrders(userId: string, query: any) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip, take: limit,
                include: { items: { include: { product: { select: { images: { take: 1 } } } } } }
            }),
            prisma.order.count({ where: { userId } })
        ]);

        return { data: orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
    }

    static async getOrderById(user: any, orderId: string) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, address: true, timeline: { orderBy: { timestamp: 'desc' } } }
        });

        if (!order) throw new AppError(404, 'NOT_FOUND', 'Order not found');
        if (user.role !== 'ADMIN' && order.userId !== user.id) throw new AppError(403, 'FORBIDDEN', 'Access denied');

        return order;
    }

    static async cancelOrder(userId: string, orderId: string) {
        const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
        if (!order || order.userId !== userId) throw new AppError(404, 'NOT_FOUND', 'Order not found');

        if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
            throw new AppError(400, 'BAD_REQUEST', `Cannot cancel order in ${order.status} state`);
        }

        return await prisma.$transaction(async (tx) => {
            // Restore stock
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } }
                });
            }

            let paymentStatus = order.paymentStatus;
            if (order.paymentStatus === 'PAID' && order.paymentIntentId) {
                // Refund stripe
                try {
                    await stripe.refunds.create({ payment_intent: order.paymentIntentId });
                    paymentStatus = 'REFUNDED';
                } catch (e) { console.error('Refund err', e); }
            }

            return await tx.order.update({
                where: { id: orderId },
                data: {
                    status: 'CANCELLED',
                    paymentStatus,
                    timeline: { create: { status: 'CANCELLED', message: 'Cancelled by user' } }
                }
            });
        });
    }

    static async getAllOrders(query: any) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { user: true } }),
            prisma.order.count()
        ]);

        return { data: orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
    }

    static async updateOrderStatus(orderId: string, status: any, message?: string) {
        const order = await prisma.order.findUnique({ where: { id: orderId }, include: { user: true } });
        if (!order) throw new AppError(404, 'NOT_FOUND', 'Order not found');

        const updated = await prisma.order.update({
            where: { id: orderId },
            data: {
                status,
                timeline: { create: { status, message } }
            }
        });

        try {
            if (status === 'SHIPPED') {
                await sendEmail(order.user.email, 'Your order has shipped', `Good news! Your order ${order.id} is on the way.`);
            } else if (status === 'DELIVERED') {
                await sendEmail(order.user.email, 'Your order was delivered', `Your order ${order.id} has been delivered.`);
            }
        } catch (e) { }

        return updated;
    }
}
