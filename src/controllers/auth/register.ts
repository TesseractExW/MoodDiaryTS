import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as refModel from "@models/refreshToken";
import * as userModel from "@models/user";
import env from "@config/env";

export default async (
	req: express.Request,
	res: express.Response
): Promise<void> => {
	const { username, password } = req.body;
	const { atoken_key, atoken_expire, rtoken_key, rtoken_expire } = env.get();

	if (req.cookies.refToken) {
		try {
			const payload = await jwt.verify(req.cookies.refToken, rtoken_key);
			res.status(300).json({
				message: "Please logout before register.",
			});
			return;
		} catch (err) {}
	}

	if (!username || !password) {
		res.status(300).json({
			message: "Please enter valid username and password.",
		});
		return;
	}
	const user: userModel.IUserDocument | null =
		await userModel.database.findByUsername(username);

	if (user) {
		res.status(300).json({
			message: "User has already exists.",
		});
		return;
	}

	const _user: userModel.IUser = {
		username: username,
		password: await bcrypt.hash(password, 10),
		moods: [],
	};
	await userModel.database.create(_user);

	const accessToken: string = jwt.sign({ username: username }, atoken_key, {
		expiresIn: atoken_expire,
	});
	const refToken: string = jwt.sign({ username: username }, rtoken_key, {
		expiresIn: rtoken_expire,
	});

	await refModel.database.create({ token: refToken });

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		maxAge: atoken_expire,
	});
	res.cookie("refToken", refToken, {
		httpOnly: true,
		maxAge: rtoken_expire,
	});

	res.status(200).json({
		message: "Register successfully.",
	});
};
