import prisma from '../../config/database';
import cloudinary from '../../config/cloudinary';
import { AppError } from '../../utils/AppError';
import { clearCache } from '../../utils/cache';
import { generateSlug } from '../../utils/slugify';
import { getPagination } from '../../utils/pagination';

export class ProductsService {
    static async getProducts(queryData: any) {
        const { page, limit, category, brand, minPrice, maxPrice, rating, sort, inStock } = queryData;

        // Convert to actual values
        const take = parseInt(limit) || 20;
        const skip = (parseInt(page) || 1 - 1) * take;

        const where: any = { isActive: true };
        if (category) {
            const cat = await prisma.category.findUnique({ where: { slug: category } });
            if (cat) where.categoryId = cat.id;
        }
        if (brand) where.brand = brand;
        if (minPrice || maxPrice) {
            where.finalPrice = {};
            if (minPrice) where.finalPrice.gte = parseFloat(minPrice);
            if (maxPrice) where.finalPrice.lte = parseFloat(maxPrice);
        }
        if (rating) where.rating = { gte: parseFloat(rating) };
        if (inStock === 'true') where.stock = { gt: 0 };

        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'price_asc') orderBy = { finalPrice: 'asc' };
        if (sort === 'price_desc') orderBy = { finalPrice: 'desc' };
        if (sort === 'rating') orderBy = { rating: 'desc' };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                take,
                skip,
                orderBy,
                include: { images: true, category: true }
            }),
            prisma.product.count({ where })
        ]);

        return {
            data: products,
            pagination: { page: parseInt(page) || 1, limit: take, total, pages: Math.ceil(total / take) }
        };
    }

    static async searchProducts(queryData: any) {
        const { q, page, limit } = queryData;
        if (!q) return this.getProducts(queryData);

        const take = parseInt(limit) || 20;
        const skip = (parseInt(page) || 1 - 1) * take;

        // Use raw query for pg_trgm due to Prisma limitation
        const rawProducts: any[] = await prisma.$queryRaw`
      SELECT id, ts_rank(search_vector, plainto_tsquery(${q})) AS rank
      FROM "Product"
      WHERE search_vector @@ plainto_tsquery(${q}) AND "isActive" = true
      ORDER BY rank DESC
      LIMIT ${take} OFFSET ${skip};
    `;

        const ids = rawProducts.map(p => p.id);
        const fetchedProducts = await prisma.product.findMany({
            where: { id: { in: ids } },
            include: { images: true, category: true }
        });
        const products = ids.map(id => fetchedProducts.find(p => p.id === id)).filter(Boolean);

        const totalRes: any = await prisma.$queryRaw`
      SELECT COUNT(*)
      FROM "Product"
      WHERE search_vector @@ plainto_tsquery(${q}) AND "isActive" = true;
    `;
        const total = Number(totalRes[0].count);

        return {
            data: products,
            pagination: { page: parseInt(page) || 1, limit: take, total, pages: Math.ceil(total / take) }
        };
    }

    static async getFeatured() {
        return prisma.product.findMany({
            where: { isFeatured: true, isActive: true },
            take: 8,
            include: { images: true }
        });
    }

    static async getDeals() {
        return prisma.product.findMany({
            where: { discountPercent: { gte: 20 }, isActive: true },
            take: 20,
            include: { images: true }
        });
    }

    static async getBySlug(slug: string) {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: { images: true, variants: true, seller: { include: { user: { select: { firstName: true, lastName: true } } } }, category: true }
        });
        if (!product || !product.isActive) throw new AppError(404, 'NOT_FOUND', 'Product not found');
        return product;
    }

    static async create(data: any, files: Express.Multer.File[], userId: string) {
        const seller = await prisma.seller.findUnique({ where: { userId } });
        if (!seller || (!seller.isVerified && (data.role as string) !== 'ADMIN')) {
            throw new AppError(403, 'FORBIDDEN', 'Ensure you have a verified seller account');
        }

        const slug = generateSlug(`${data.brand} ${data.title} ${Date.now().toString().slice(-4)}`);

        const finalPrice = data.basePrice - (data.basePrice * (data.discountPercent / 100));

        // Upload files to Cloudinary
        let imageRecords: any[] = [];
        if (files && files.length > 0) {
            for (const [idx, file] of files.entries()) {
                const b64 = Buffer.from(file.buffer).toString('base64');
                const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
                const result = await cloudinary.uploader.upload(dataURI, { folder: 'amazon-clone/products' });
                imageRecords.push({ url: result.secure_url, isPrimary: idx === 0, order: idx });
            }
        }

        const product = await prisma.product.create({
            data: {
                title: data.title,
                slug,
                description: data.description,
                brand: data.brand,
                categoryId: data.categoryId,
                sellerId: seller.id,
                basePrice: data.basePrice,
                discountPercent: data.discountPercent,
                finalPrice,
                stock: data.stock,
                specifications: data.specifications || {},
                tags: data.tags || [],
                images: { create: imageRecords }
            },
            include: { images: true }
        });

        await clearCache('products');
        return product;
    }

    static async update(id: string, data: any, user: any) {
        const product = await prisma.product.findUnique({ where: { id }, include: { seller: true } });
        if (!product) throw new AppError(404, 'NOT_FOUND', 'Product not found');

        if (user.role !== 'ADMIN' && product.seller.userId !== user.id) {
            throw new AppError(403, 'FORBIDDEN', 'You do not own this product');
        }

        let finalPrice = product.finalPrice;
        if (data.basePrice || data.discountPercent !== undefined) {
            const bp = data.basePrice || product.basePrice;
            const dp = data.discountPercent !== undefined ? data.discountPercent : product.discountPercent;
            finalPrice = bp - (bp * (dp / 100));
            data.finalPrice = finalPrice;
        }

        const updated = await prisma.product.update({ where: { id }, data });
        await clearCache('products');
        await clearCache('product_detail');
        return updated;
    }

    static async softDelete(id: string, user: any) {
        const product = await prisma.product.findUnique({ where: { id }, include: { seller: true } });
        if (!product) throw new AppError(404, 'NOT_FOUND', 'Product not found');

        if (user.role !== 'ADMIN' && product.seller.userId !== user.id) {
            throw new AppError(403, 'FORBIDDEN', 'You do not own this product');
        }

        await prisma.product.update({ where: { id }, data: { isActive: false } });
        await clearCache('products');
        await clearCache('product_detail');
    }
}
