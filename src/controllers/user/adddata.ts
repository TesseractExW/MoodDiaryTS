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
	const username = req.data!.username;
	const user = await userModel.database.findByUsername(username);
	const { happiness, sadness, fear, disgust, anger, surprise, description } =
		req.body;

	if (!user) {
		res.status(400).json({
			message: "User not found.",
		});
		return;
	} else if (
		!happiness ||
		!sadness ||
		!fear ||
		!disgust ||
		!anger ||
		!surprise ||
		!description
	) {
		res.status(400).json({
			message: "Please input all the informations.",
		});
		return;
	}

	user.moods.push({
		happiness,
		sadness,
		fear,
		disgust,
		anger,
		surprise,
		description,
		date: new Date(),
	});

	await user.save();

	res.status(200).json({
		message: "Add new mood successfully.",
	});
};
