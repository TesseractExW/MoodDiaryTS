import express from 'express';
import jwt from 'jsonwebtoken';
import getEnv from '@config/env';
import refDb from '@models/refreshToken';
import { IUser } from '@models/user';

export default async (req: express.Request, res: express.Response) : Promise<void> => {
    const {
        rtoken_key,
        rtoken_expire,
    } = getEnv();

    const { refToken } = req.cookies;

    if (!refToken)
    {
        res.status(300).json({
            message: "No token found."
        });
        return;
    }

    jwt.verify(refToken, rtoken_key, async (err : jwt.VerifyErrors | null, payload : any) => {
        if (err)
        {
            res.status(300).json({
                message: "Token expired or invalid."
            });
            return;
        }
        const user = payload as IUser;
        
        const newRefToken = jwt.sign({ username : user.username }, rtoken_key, {
            expiresIn: rtoken_expire,
        });

        await refDb.deleteOne({ token : refToken });
        
        await refDb.create({
            token : newRefToken,
        });

    });

    
}