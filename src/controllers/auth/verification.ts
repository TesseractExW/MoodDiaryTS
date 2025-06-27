import express from 'express';
import jwt from 'jsonwebtoken';
import getEnv from '@config/env';

export default async (req: express.Request, res: express.Response, next : express.NextFunction) : Promise<void> => {
    const {
        atoken_key,
    } = getEnv();

    const { accessToken } = req.cookies;

    if (!accessToken)
    {
        res.status(300).json({
            message: "Please Login before logging out."
        });
        return;
    }

    jwt.verify(accessToken, atoken_key, (err : jwt.VerifyErrors | null, payload : any)=>{
        if (err)
        {
            res.status(300).json({
                message: "Token expired or invalid."
            });
            return;
        }

        req.body.username = (payload as any).username;
        next();
    })
}