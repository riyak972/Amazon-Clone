import prisma from '../../config/database';
import cloudinary from '../../config/cloudinary';
import { AppError } from '../../utils/AppError';
import { clearCache } from '../../utils/cache';

export class ReviewsService {
    static async createReview(userId: string, data: any, files?: Express.Multer.File[]) {
        // Check if user has a DELIVERED order for this product
        const orderItem = await prisma.orderItem.findFirst({
            where: {
                productId: data.productId,
                order: { userId, status: 'DELIVERED' }
            }
        });

        if (!orderItem) {
            throw new AppError(403, 'FORBIDDEN', 'You must have a delivered order of this product to leave a review.');
        }

        const existing = await prisma.review.findFirst({
            where: { userId, productId: data.productId }
        });
        if (existing) throw new AppError(400, 'BAD_REQUEST', 'You have already reviewed this product.');

        const images: string[] = [];
        if (files) {
            for (const file of files) {
                const b64 = Buffer.from(file.buffer).toString('base64');
                const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
                const result = await cloudinary.uploader.upload(dataURI, { folder: 'amazon-clone/reviews' });
                images.push(result.secure_url);
            }
        }

        const review = await prisma.review.create({
            data: {
                userId,
                productId: data.productId,
                rating: Number(data.rating),
                title: data.title,
                body: data.body,
                images,
                isVerified: true
            }
        });

        await this.updateProductRating(data.productId);
        await clearCache('product_detail');

        return review;
    }

    static async updateReview(userId: string, id: string, data: any) {
        const review = await prisma.review.findUnique({ where: { id } });
        if (!review || review.userId !== userId) throw new AppError(403, 'FORBIDDEN', 'You can only update your own reviews');

        const updated = await prisma.review.update({ where: { id }, data });
        if (data.rating) await this.updateProductRating(review.productId);
        await clearCache('product_detail');
        return updated;
    }

    static async deleteReview(user: any, id: string) {
        const review = await prisma.review.findUnique({ where: { id } });
        if (!review) throw new AppError(404, 'NOT_FOUND', 'Review not found');

        if (user.role !== 'ADMIN' && review.userId !== user.id) {
            throw new AppError(403, 'FORBIDDEN', 'Access denied');
        }

        await prisma.review.delete({ where: { id } });
        await this.updateProductRating(review.productId);
        await clearCache('product_detail');
    }

    static async markHelpful(id: string) {
        return prisma.review.update({
            where: { id },
            data: { helpfulVotes: { increment: 1 } }
        });
    }

    static async getProductReviews(productId: string, query: any) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { productId },
                skip, take: limit,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } }
            }),
            prisma.review.count({ where: { productId } })
        ]);

        return { data: reviews, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
    }

    private static async updateProductRating(productId: string) {
        const stats = await prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: { id: true }
        });

        await prisma.product.update({
            where: { id: productId },
            data: {
                rating: stats._avg.rating || 0,
                reviewCount: stats._count.id || 0
            }
        });
    }
}
