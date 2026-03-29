import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await AuthService.register(req.body);
        res.status(201).json({ success: true, data: result, message: result.message });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accessToken, refreshToken, user } = await AuthService.login(req.body);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({ success: true, data: { accessToken, user }, message: 'Login successful' });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.refreshToken;
        const { accessToken, refreshToken } = await AuthService.refresh(token);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ success: true, data: { accessToken }, message: 'Token refreshed' });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.refreshToken;
        await AuthService.logout(token);
        res.clearCookie('refreshToken');
        res.status(200).json({ success: true, data: {}, message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await AuthService.verifyEmail(req.params.token);
        res.status(200).json({ success: true, data: {}, message: 'Email verified successfully' });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await AuthService.forgotPassword(req.body.email);
        res.status(200).json({ success: true, data: result, message: result.message });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await AuthService.resetPassword(req.params.token, req.body.password);
        res.status(200).json({ success: true, data: {}, message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        res.status(200).json({ success: true, data: user, message: 'User retrieved' });
    } catch (error) {
        next(error);
    }
};
