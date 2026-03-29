import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' });
};
