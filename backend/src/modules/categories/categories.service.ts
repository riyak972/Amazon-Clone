import prisma from '../../config/database';
import { AppError } from '../../utils/AppError';
import { generateSlug } from '../../utils/slugify';
import { ProductsService } from '../products/products.service';

export class CategoriesService {
    static async getAll() {
        return prisma.category.findMany({
            where: { parentId: null },
            include: { children: { include: { children: true } } }
        });
    }

    static async getProducts(slug: string, query: any) {
        const category = await prisma.category.findUnique({ where: { slug } });
        if (!category) throw new AppError(404, 'NOT_FOUND', 'Category not found');

        // Instead of completely passing down, we manipulate the query object
        query.category = slug;
        return ProductsService.getProducts(query);
    }

    static async create(data: any) {
        const slug = generateSlug(data.name);
        return prisma.category.create({ data: { ...data, slug } });
    }

    static async update(id: string, data: any) {
        let slug;
        if (data.name) slug = generateSlug(data.name);
        return prisma.category.update({ where: { id }, data: { ...data, slug } });
    }

    static async delete(id: string) {
        const productsCount = await prisma.product.count({ where: { categoryId: id } });
        if (productsCount > 0) {
            throw new AppError(400, 'BAD_REQUEST', 'Cannot delete category with existing products');
        }
        await prisma.category.delete({ where: { id } });
    }
}
