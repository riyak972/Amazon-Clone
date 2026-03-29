import redis from '../config/redis';
import { Request, Response, NextFunction } from 'express';

export const cacheMiddleware = (prefix: string, ttl: number = 300) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET') return next();

        const key = `${prefix}:${req.originalUrl}`;
        try {
            const cachedResponse = await redis.get(key);
            if (cachedResponse) {
                res.setHeader('X-Cache-Hit', 'true');
                return res.status(200).json(JSON.parse(cachedResponse));
            }

            const originalSend = res.json.bind(res);
            res.json = (body: any) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    redis.setex(key, ttl, JSON.stringify(body));
                }
                return originalSend(body);
            };
            next();
        } catch (error) {
            next();
        }
    };
};

export const clearCache = async (prefix: string) => {
    try {
        const keys = await redis.keys(`${prefix}:*`);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (error) {
        console.error('Redis clear cache error:', error);
    }
};
