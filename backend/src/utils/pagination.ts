import { Request } from 'express';

export const getPagination = (req: Request) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    return { page, limit: take, skip, take };
};
