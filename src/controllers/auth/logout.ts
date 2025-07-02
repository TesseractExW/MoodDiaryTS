import express from "express";
import * as refModel from "@models/refreshToken";

export default async (
	req: express.Request,
	res: express.Response
): Promise<void> => {
	const { refToken } = req.cookies;

	if (refToken) {
		try {
			await refModel.database.deleteOne({ token: refToken });
		} catch (err) {
			console.log("Failed to delete refresh token :", err);
		}
	}

	res.clearCookie("accessToken");
	res.clearCookie("refToken");

	res.status(200).json({
		message: "Logout successfully.",
	});
};
