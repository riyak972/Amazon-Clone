import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create Users
    const passwordHash = await bcrypt.hash('Admin@1234', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: { email: 'admin@test.com', firstName: 'Admin', lastName: 'User', passwordHash, role: 'ADMIN', isVerified: true }
    });

    const sellerPass = await bcrypt.hash('Seller@1234', 12);
    const sellerUser = await prisma.user.upsert({
        where: { email: 'seller@test.com' },
        update: {},
        create: { email: 'seller@test.com', firstName: 'Seller', lastName: 'User', passwordHash: sellerPass, role: 'SELLER', isVerified: true }
    });

    const custPass = await bcrypt.hash('User@1234', 12);
    const customer = await prisma.user.upsert({
        where: { email: 'user@test.com' },
        update: {},
        create: { email: 'user@test.com', firstName: 'Normal', lastName: 'User', passwordHash: custPass, role: 'CUSTOMER', isVerified: true }
    });

    // 2. Create Seller Record
    let sellerRecord = await prisma.seller.findUnique({ where: { userId: sellerUser.id } });
    if (!sellerRecord) {
        sellerRecord = await prisma.seller.create({
            data: { userId: sellerUser.id, businessName: 'TechStore India', isVerified: true }
        });
    }

    // 3. Categories
    const topCategories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports & Outdoors', 'Beauty & Personal Care', 'Toys & Games', 'Grocery'];
    const catMap: Record<string, string> = {};

    for (const name of topCategories) {
        const slug = name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        const cat = await prisma.category.upsert({
            where: { slug },
            update: {},
            create: { name, slug }
        });
        catMap[name] = cat.id;
    }

    // Sub-categories
    const subCats = ['Mobiles', 'Laptops', 'Headphones', 'Cameras', 'TVs'];
    for (const name of subCats) {
        const slug = name.toLowerCase();
        await prisma.category.upsert({
            where: { slug },
            update: {},
            create: { name, slug, parentId: catMap['Electronics'] }
        });
    }

    // 4. Products (we will just create 5 for brevity in this script, but prompt asked for 50! Let's generate them programmatically)
    const productCats = await prisma.category.findMany();
    if (productCats.length > 0) {
        for (let i = 1; i <= 50; i++) {
            const cat = productCats[i % productCats.length];
            const slug = `product-${i}-${cat.slug}`;

            await prisma.product.upsert({
                where: { slug },
                update: {},
                create: {
                    title: `Awesome Product ${i}`,
                    slug,
                    description: `This is the description for awesome product ${i}. It is very good.`,
                    brand: `Brand${i % 5}`,
                    categoryId: cat.id,
                    sellerId: sellerRecord!.id,
                    basePrice: (i * 100) + 99,
                    discountPercent: i % 5 === 0 ? 20 : 0,
                    finalPrice: i % 5 === 0 ? ((i * 100) + 99) * 0.8 : ((i * 100) + 99),
                    stock: 100,
                    specifications: { weight: `${i}kg`, color: 'Black' },
                    rating: 3.5 + (i % 2),
                    reviewCount: i * 10,
                    images: {
                        create: [
                            { url: `https://picsum.photos/seed/${i}/400/400`, isPrimary: true, order: 0 }
                        ]
                    }
                }
            });
        }
    }

    console.log('Seeding complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
