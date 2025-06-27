import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userDb, { IUser, IUserDocument, Mood } from '@models/user';
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

    if (user)
    {
        res.status(300).json({
            message: "User has already exists."
        });
        return;
    }

    const _user : IUser = {
        username: username,
        password: await bcrypt.hash(password, 10),
        moods: [],
    };
    await userDb.create(_user);

    const accessToken = jwt.sign({ username : username }, atoken_key, {
        expiresIn: atoken_expire,
    })
    const refToken = jwt.sign({ username : username }, rtoken_key, {
        expiresIn: rtoken_expire,
    });

    res.cookie('acessToken', accessToken, {
        maxAge: atoken_expire,
    });
    res.cookie('refToken', refToken, {
        maxAge: rtoken_expire,
    });
    
    res.status(200).json({
        message: "Register successfully."
    });
}