import { Request, Response, NextFunction } from 'express';
import stripe from '../../config/stripe';
import prisma from '../../config/database';
import { AppError } from '../../utils/AppError';

export const createIntent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Actually, createIntent is handled in OrdersService.createOrder 
        // If the client just wants a raw intent, we can provide it, but they should hit POST /orders
        res.status(200).json({ success: true, message: 'Use POST /orders to create an order and payment intent simultaneously.' });
    } catch (error) {
        next(error);
    }
};

export const webhook = async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as any;
            const orderId = paymentIntent.metadata?.orderId;

            if (orderId) {
                await prisma.order.update({
                    where: { id: orderId },
                    data: {
                        paymentStatus: 'PAID',
                        status: 'CONFIRMED',
                        timeline: { create: { status: 'CONFIRMED', message: 'Payment successful' } }
                    }
                });
            }
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object as any;
            const orderId = paymentIntent.metadata?.orderId;

            if (orderId) {
                const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
                if (order) {
                    // Compensating transaction
                    await prisma.$transaction(async (tx) => {
                        for (const item of order.items) {
                            await tx.product.update({
                                where: { id: item.productId },
                                data: { stock: { increment: item.quantity } }
                            });
                        }
                        await tx.order.update({
                            where: { id: orderId },
                            data: {
                                status: 'CANCELLED',
                                paymentStatus: 'UNPAID',
                                timeline: { create: { status: 'CANCELLED', message: 'Payment failed. Stock restored.' } }
                            }
                        });
                    });
                }
            }
        }

        res.json({ received: true });
    } catch (e) {
        next(e);
    }
};
