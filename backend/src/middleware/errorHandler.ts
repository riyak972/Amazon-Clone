import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: { code: err.code, message: err.message, details: err.details }
        });
    }

    // Prisma Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: `Duplicate value entered for ${err.meta?.target}` } });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Record not found' } });
        }
    }

    // Zod Erros
    if (err instanceof ZodError) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Provided data is invalid', details: err.errors } });
    }

    // JWT Errors
    if (err instanceof JsonWebTokenError) {
        return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Token is invalid' } });
    }
    if (err instanceof TokenExpiredError) {
        return res.status(401).json({ success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token has expired' } });
    }

    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went very wrong!',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        }
    });
};
