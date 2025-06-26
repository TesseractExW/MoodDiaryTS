import express from 'express';

import jwt from 'jsonwebtoken';

import userDb, { IUserDocument } from '@models/user';
import refDb from '@models/refreshToken';

import getEnv from '@config/env';

export default async (req: express.Request, res: express.Response) : Promise<void> => {
    const { username , password } = req.body;    
    const {
        atoken_key,
        atoken_expire,
        rtoken_key,
        rtoken_expire,
    } = getEnv();
    
    if (!username || !password)
    {
        res.status(300).json({
            message: "Please enter valid username and password."
        });
        return;
    }
    const user : IUserDocument | null = await userDb.findByUsername(username);

    if (!user)
    {
        res.status(300).json({
            message: "User does not exist. Try registration."
        });
        return;
    } else if (!user.comparePassword(password))
    {
        res.status(300).json({
            message: "The password is incorrect."
        });
        return;
    }

    const accessToken = jwt.sign({ username : user.username }, atoken_key, {
        expiresIn: atoken_expire,
    })
    const refToken = jwt.sign({ username : user.username }, rtoken_key, {
        expiresIn: rtoken_expire,
    });

    res.cookie('acessToken', accessToken, {
        maxAge: atoken_expire,
    });
    res.cookie('refToken', accessToken, {
        maxAge: rtoken_expire,
    });
    
    res.status(200).json({
        message: "Login successfully."
    });
}