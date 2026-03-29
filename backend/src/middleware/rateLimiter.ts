import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from '../config/redis';
import { Request, Response, NextFunction } from 'express';

const publicLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit_public',
    points: 100, // 100 requests
    duration: 60, // per 60 seconds by IP
});

const authLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit_auth',
    points: 30, // 30 requests
    duration: 60, // per 60 seconds by IP/User ID
});

export const publicRateLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await publicLimiter.consume(req.ip || 'unknown');
        next();
    } catch (rejRes) {
        res.status(429).json({ success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too Many Requests' } });
    }
};

export const authRateLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = (req as any).user ? (req as any).user.id : req.ip;
        await authLimiter.consume(key);
        next();
    } catch (rejRes) {
        res.status(429).json({ success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too Many Requests' } });
    }
};
