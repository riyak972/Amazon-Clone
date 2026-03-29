import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import prisma from './config/database';
import { redis } from './config/redis';
// Modules
import authRoutes from './modules/auth/auth.routes';
import productsRoutes from './modules/products/products.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import cartRoutes from './modules/cart/cart.routes';
import ordersRoutes from './modules/orders/orders.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import usersRoutes from './modules/users/users.routes';
import reviewsRoutes from './modules/reviews/reviews.routes';
import sellerRoutes from './modules/seller/seller.routes';
import adminRoutes from './modules/admin/admin.routes';
import searchRoutes from './modules/search/search.routes';

// Middleware / Docs
import { globalErrorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger'; // Will create this next

const app: Express = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  /\.vercel\.app$/,
].filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : (o as RegExp).test(origin)
    );
    if (allowed) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Swagger API Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mounted Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/seller', sellerRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/search', searchRoutes);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// Global error handler
app.use(globalErrorHandler);

export default app;

const PORT = parseInt(process.env.PORT || '5000', 10);

// 🌱 SAFE SEED TRIGGER (ADD THIS)
if (process.env.RUN_SEED === 'true') {
  (async () => {
    try {
      console.log('🌱 Running seed...');
      const { execSync } = require('child_process');
      execSync('npx prisma db seed', { stdio: 'inherit' });
      console.log('✅ Seed completed');
    } catch (err) {
      console.error('❌ Seed failed, continuing startup');
    }
  })();
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] Running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

const shutdown = async () => {
  console.log('[Server] Shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    redis.disconnect();
    console.log('[Server] Shutdown complete');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
