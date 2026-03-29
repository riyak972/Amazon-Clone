import prisma from '../../config/database';
import redis from '../../config/redis';
import { AppError } from '../../utils/AppError';

export class CartService {
    static async getCart(userId: string) {
        // Write-through cache strategy
        const cachedCart = await redis.get(`cart:${userId}`);
        if (cachedCart) return JSON.parse(cachedCart);

        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: { include: { images: true } } } } }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: { items: { include: { product: { include: { images: true } } } } }
            });
        }

        await redis.set(`cart:${userId}`, JSON.stringify(cart), 'EX', 30 * 60); // 30 mins TTS
        return cart;
    }

    static async addItem(userId: string, data: any) {
        const product = await prisma.product.findUnique({ where: { id: data.productId } });
        if (!product || !product.isActive) {
            throw new AppError(404, 'NOT_FOUND', 'Product not found');
        }

        if (product.stock < data.quantity) {
            throw new AppError(400, 'OUT_OF_STOCK', 'Not enough stock available');
        }

        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) cart = await prisma.cart.create({ data: { userId } });

        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId: data.productId, variantId: data.variantId || null }
        });

        if (existingItem) {
            const newQty = existingItem.quantity + data.quantity;
            if (product.stock < newQty) throw new AppError(400, 'OUT_OF_STOCK', 'Not enough stock available');
            await prisma.cartItem.update({ where: { id: existingItem.id }, data: { quantity: newQty } });
        } else {
            await prisma.cartItem.create({
                data: { cartId: cart.id, productId: data.productId, variantId: data.variantId, quantity: data.quantity }
            });
        }

        // Refresh cart
        await redis.del(`cart:${userId}`);
        return this.getCart(userId);
    }

    static async updateItem(userId: string, itemId: string, quantity: number) {
        const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { product: true } });
        if (!item) throw new AppError(404, 'NOT_FOUND', 'Cart item not found');

        if (item.product.stock < quantity) {
            throw new AppError(400, 'OUT_OF_STOCK', 'Not enough stock available');
        }

        await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
        await redis.del(`cart:${userId}`);
        return this.getCart(userId);
    }

    static async removeItem(userId: string, itemId: string) {
        await prisma.cartItem.delete({ where: { id: itemId } });
        await redis.del(`cart:${userId}`);
        return this.getCart(userId);
    }

    static async clearCart(userId: string) {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (cart) {
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
            await redis.del(`cart:${userId}`);
        }
    }
}
