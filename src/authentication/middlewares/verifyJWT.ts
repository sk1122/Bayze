import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../controllers/config/config";
import { getRepository } from "typeorm";
import { Users } from "../models/entity/Users.entity";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader("Content-Type", "application/json")
	let token: string = <string>req.headers["authorization"]
	try {
		token = token.split(" ")[1]
	} catch (errors) {
		res.status(401).send("Specify Token")
		return
	}
	let jwtPayload
	try {
		jwtPayload = <any>jwt.verify(token, config.jwtSecret)
		res.locals.jwtPayload = jwtPayload
	} catch (error) {
		res.status(401).send("Error Loading Token")
		return
	}
	
	const { userId, email } = jwtPayload
	const newToken = jwt.sign({ userId, email }, config.jwtSecret, {
		expiresIn: '1h'
	})
	
	let user;

	try {
		user = await prisma.users.findUnique({
			where: {
				email: email
			},
			select: {
				password: false,
				id: true,
				email: true,
				role: true,
				is_accepted_to_org: true,
				create_date: true,
				update_column: true,
				is_active: true,
				access_token: true,
				admin: true,
				employee: true,
				page: true,
				social_account: true,
				_count: true
			}
		})
	} catch (errors) {
		res.status(401).send("Error loading user")
		return
	}
	req.user = user

	res.setHeader("token", newToken)
	next()
}