import express from "express";
import jwt from "jsonwebtoken";
import * as refModel from "@models/refreshToken";
import * as userModel from "@models/user";
import env from "@config/env";

export default async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
): Promise<void> => {
	const { rtoken_key, rtoken_expire, atoken_key, atoken_expire } = env.get();

	const { accessToken, refToken } = req.cookies;

	if (!accessToken && !refToken) {
		res.status(400).json({
			message: "Access denied. No token found",
		});
		return;
	}

	try {
		// console.log(accessToken);
		const payload: any = jwt.verify(accessToken, atoken_key);
		const user: userModel.IUserDocument | null =
			await userModel.database.findByUsername(payload.username);

		req.data = user!.toJSON() as userModel.IUser;
		next();
	} catch (err) {
		if (!refToken) {
			res.status(401).json({
				message: "Access denied. No refresh token found.",
			});
			return;
		}
		try {
			const payload: any = jwt.verify(refToken, rtoken_key);
			const user: userModel.IUserDocument | null =
				await userModel.database.findByUsername(payload.username);

			if (!user)
			{
				res.clearCookie("accessToken");
				res.clearCookie("refToken");
				res.status(400).json({
					message: "Token invalid. No user found",
				})
				return;
			}

			const newRefToken: string = jwt.sign(
				{ username: user!.username },
				rtoken_key,
				{ expiresIn: rtoken_expire }
			);
			const newAccessToken: string = jwt.sign(
				{ username: user!.username },
				atoken_key,
				{ expiresIn: atoken_expire }
			);

			await refModel.database.deleteOne({ token: refToken });

			await refModel.database.create({ token: newRefToken });

			res.cookie("accessToken", newAccessToken, {
				httpOnly: true,
				maxAge: atoken_expire,
			});
			res.cookie("refToken", newRefToken, {
				httpOnly: true,
				maxAge: rtoken_expire,
			});

			req.data = user!.toJSON() as userModel.IUser;
			next();
		} catch (err) {
			console.log(err);
			res.status(400).json({
				message: "Token expired or invalid.",
			});
			return;
		}
	}
};
