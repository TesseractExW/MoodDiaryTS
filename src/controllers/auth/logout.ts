import express from 'express';

import jwt from 'jsonwebtoken';

import refDb from '@models/refreshToken';

export default async (req: express.Request, res: express.Response) : Promise<void> => {

    const { refToken } = req.cookies;
    
    if (refToken)
    {
        try {
            await refDb.deleteOne({ token : refToken });
        } catch (err) {
            console.log('Failed to delete refresh token :', err);
        }
    }

    res.clearCookie('acessToken',{
        httpOnly: true,
    });
    res.clearCookie('refToken',{
        httpOnly: true,
    });

    res.status(200).json({
        message: "Logout successfully."
    });
}