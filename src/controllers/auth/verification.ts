import express from 'express';
import jwt from 'jsonwebtoken';
import env from '@config/env';

export default async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const {
        atoken_key,
    } = env.get();

    const { accessToken } = req.cookies;

    if (!accessToken) {
        res.status(300).json({
            message: "No token found. Please Login again."
        });
        return;
    }

    try {
        const payload: any = jwt.verify(accessToken, atoken_key);
        req.body.username = (payload as any).username;
        next();
    } catch (err) {
        res.status(300).json({
            message: "Token expired or invalid."
        });
    }
}