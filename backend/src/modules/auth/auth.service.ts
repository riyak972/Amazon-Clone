import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../../config/database';
import redis from '../../config/redis';
import { AppError } from '../../utils/AppError';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { sendEmail } from '../../config/email';
import crypto from 'crypto';

export class AuthService {
    static async register(data: any) {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) throw new AppError(409, 'CONFLICT', 'Email already in use');

        const passwordHash = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                passwordHash,
                phone: data.phone,
                isVerified: true
            }
        });

        // Generate Verification Token
        const verifyToken = crypto.randomBytes(32).toString('hex');
        await redis.setex(`verify:${verifyToken}`, 60 * 60 * 24, user.id); // Valid 24h

        const url = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;
        await sendEmail(user.email, 'Verify your Email', `Click <a href="${url}">here</a> to verify.`);

        return { message: 'Check your email to verify your account' };
    }

    static async login(data: any) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
            throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
        }

        if (!user.isVerified) {
            throw new AppError(403, 'FORBIDDEN', 'Please verify your email first');
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Save refresh token
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        await prisma.refreshToken.create({
            data: { token: refreshToken, userId: user.id, expiresAt: expiryDate }
        });
        await redis.set(`refresh:${refreshToken}`, user.id, 'EX', 7 * 24 * 60 * 60);

        return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } };
    }

    static async refresh(token: string) {
        if (!token) throw new AppError(401, 'UNAUTHORIZED', 'No refresh token provided');

        const userIdRedis = await redis.get(`refresh:${token}`);
        if (!userIdRedis) throw new AppError(401, 'UNAUTHORIZED', 'Invalid refresh token');

        const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new AppError(401, 'UNAUTHORIZED', 'Refresh token expired or invalid');
        }

        const newAccessToken = generateAccessToken(userIdRedis);
        const newRefreshToken = generateRefreshToken(userIdRedis);

        // Rotate
        await prisma.refreshToken.delete({ where: { token } });
        await redis.del(`refresh:${token}`);

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        await prisma.refreshToken.create({
            data: { token: newRefreshToken, userId: userIdRedis, expiresAt: expiryDate }
        });
        await redis.set(`refresh:${newRefreshToken}`, userIdRedis, 'EX', 7 * 24 * 60 * 60);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    static async logout(token: string) {
        if (token) {
            await prisma.refreshToken.deleteMany({ where: { token } });
            await redis.del(`refresh:${token}`);
        }
    }

    static async verifyEmail(token: string) {
        const userId = await redis.get(`verify:${token}`);
        if (!userId) throw new AppError(400, 'BAD_REQUEST', 'Invalid or expired token');

        await prisma.user.update({ where: { id: userId }, data: { isVerified: true } });
        await redis.del(`verify:${token}`);
    }

    static async forgotPassword(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return { message: 'If email exists, reset link sent' }; // Same message to avoid email enumeration

        const resetToken = crypto.randomBytes(32).toString('hex');
        await redis.setex(`reset:${resetToken}`, 15 * 60, user.id); // Valid 15m

        const url = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await sendEmail(user.email, 'Reset your Password', `Click <a href="${url}">here</a> to reset.`);

        return { message: 'If email exists, reset link sent' };
    }

    static async resetPassword(token: string, password: string) {
        const userId = await redis.get(`reset:${token}`);
        if (!userId) throw new AppError(400, 'BAD_REQUEST', 'Invalid or expired token');

        const passwordHash = await bcrypt.hash(password, 12);
        await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

        // Invalidate all sessions
        const tokens = await prisma.refreshToken.findMany({ where: { userId } });
        for (const t of tokens) {
            await redis.del(`refresh:${t.token}`);
        }
        await prisma.refreshToken.deleteMany({ where: { userId } });

        await redis.del(`reset:${token}`);
    }
}
