import { Request, Response } from "express"
import * as jwt from "jsonwebtoken"
import { validate } from "class-validator"

import config from "./config/config"
import { checkIfUnencryptedPasswordIsValid, hashPassword } from "../utils/hashPassword"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class AuthController {
	static login = async (req: Request, res: Response) => {
		//Check if email and password are set
		let { email, password } = req.body;
		if (!(email && password)) {
			res.status(400).send("Enter Email or Password");
			return
		}

		//Get user from database
		const user = await prisma.users.findUnique({
			where: {
				email: email
			}
		})

		if(!user) {
			res.status(401).send({"error": "Not Found User"})
			return
		}

		if(!(await checkIfUnencryptedPasswordIsValid(password, user.password))) {
			res.status(401).send({"error": "Password is Incorrect!"})
			return
		}

		// Sign JWT, valid for 1 hour
		const access_token = jwt.sign(
			{ userId: user.id, email: user.email },
			config.jwtSecret,
			{ expiresIn: "3h" }
		);

		const refresh_token = jwt.sign(
			{ userId: user.id, email: user.email },
			config.jwtRefreshSecret,
			{ expiresIn: "3d" }
		);

		let jsonData = {
			"email": email,
			"access_token": access_token,
			"refresh_token": refresh_token
		}

		//Send the jwt in the response
		res.send(jsonData);
	};

	static changePassword = async (req: Request, res: Response) => {
		const { userId } = res.locals.jwtPayload

		let { oldPassword, newPassword } = req.body
		if (!(oldPassword && newPassword)) {
			res.status(400).send("Enter Passwords")
		}

		const user = await prisma.users.findUnique({
			where: {
				id: userId
			}
		})

		if(!user) {
			res.status(401).send({"error": "Not Found User"})
			return
		}

		if (!(await checkIfUnencryptedPasswordIsValid(oldPassword, user.password))) {
			res.status(401).send({"error": "Password is Incorrect!"})
			return
		}

		if(oldPassword == newPassword) {
			res.status(401).send({"error": "New Password and Old Password cannot be same"})
			return
		}

		newPassword = hashPassword(newPassword)
		console.log(newPassword, "dsa")
		const newUser = await prisma.users.update({
			where: {
				id: userId
			},
			data: {
				password: newPassword
			},
			select: {
				email: true
			}
		})

		res.status(200).send(newUser)
	};

	static refreshToken = async (req: Request, res: Response) => {
		const refresh_token = req.body["refresh_token"]
		let jwtPayload
		try {
			jwtPayload = <any>jwt.verify(refresh_token, config.jwtRefreshSecret)
			res.locals.jwtPayload = jwtPayload
		} catch (error) {
			res.status(401).send("Error Loading Token")
			return
		}
		const access_token = jwt.sign(
			{ userId: jwtPayload.userId, email: jwtPayload.email },
			config.jwtSecret,
			{ expiresIn: "1h" }
		);

		res.status(200).send({
			"access_token": access_token
		})
	}

}

export default AuthController