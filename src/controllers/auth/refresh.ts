import express from 'express';
import jwt from 'jsonwebtoken';
import env from '@config/env';
import refDb from '@models/refreshToken';
import { IUser } from '@models/user';

export default async (req: express.Request, res: express.Response): Promise<void> => {
    const {
        rtoken_key,
        rtoken_expire,
        atoken_key,
        atoken_expire,
    } = env.get();

    const { refToken } = req.cookies;

    if (!refToken) {
        res.status(300).json({
            message: "No token found."
        });
        return;
    }
    try {
        const payload: any = jwt.verify(refToken, rtoken_key);
        const user: IUser = payload as IUser;

        const newRefToken: string = jwt.sign(
            { username: user.username },
            rtoken_key,
            { expiresIn: rtoken_expire }
        );
        const newAccessToken: string = jwt.sign(
            { username: user.username },
            atoken_key,
            { expiresIn: atoken_expire }
        );

        await refDb.deleteOne({ token: refToken });

        await refDb.create({ token: newRefToken });

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            maxAge: atoken_expire,
        });
        res.cookie('refToken', newRefToken, {
            httpOnly: true,
            maxAge: rtoken_expire,
        });
        res.status(200).json({
            message: "Token refresh sucessfully."
        });
    } catch (err) {
        res.status(400).json({
            message: "Token expired or invalid."
        });
        return;
    }
}