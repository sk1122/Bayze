import * as jwt from "jsonwebtoken"
import { validate } from "class-validator"
import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { SocialAccount } from "../models/entity/SocialAccount.entity"
import { Users } from "../models/entity/Users.entity"
import { ResponseData } from "./interface/response.interface"
import config from "./config/config"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function storeSocialAccount(user: ResponseData, provider: string) {
	// return - found user account, user
	let socialAccount;
	
	try {
		var users = await prisma.users.findFirst({
			where: { email: user.emails[0]["value"] }
		})
	} catch (err) {
		return [false, null]
	}
	let socialAccountData = {
		"provider_id": user.id,
		"username": user.username,
		"profileURL": user.profileUrl,
		"displayName": user.displayName,
		"photos": JSON.stringify(user.photos),
		"email": user.emails[0]["value"],
		"gender": user.gender,
		"json": user._json,
		"provider": provider,
		"userId": users.id
	}
	
	let socialAccountID: number;
	try {
		socialAccount = await prisma.social_account.upsert({
			where: {
				email: user.emails[0]["value"]
			},
			update: {},
			create: socialAccountData
		}) 
		socialAccountID = socialAccount.id
	} catch (error) {
		// pass
		console.log(error)
	}
	
	return [true, users]
}
class SocialController {
	public provider = ''

	constructor (provider: string) {
		this.provider = provider
	}

	social_login = async (req: Request, res: Response) => {
		let email: string = <string>req.user["emails"][0]["value"]
		let [success, user] = await storeSocialAccount(req.user as ResponseData, this.provider)
		if(!success) {
			res.status(401).send(`No Account Associated with this Email, Login with ${this.provider} Email ID`)
			return
		}
		
		user = user as Users
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
			"provider": this.provider,
			"email": email,
			"access_token": access_token,
			"refresh_token": refresh_token
		}

		res.json(jsonData)
	}
}

export default SocialController