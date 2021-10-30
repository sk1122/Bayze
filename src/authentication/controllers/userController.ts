import { Request, Response } from "express"
import { hashPassword } from "../utils/hashPassword";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class UserController {
	static register = async (req: Request, res: Response) => {
	
		const user = await prisma.users.findFirst({
			where: { email: req.body["email"] }
		})

		if(user) {
			res.status(400).send({"error": "User with same email already exists!"})
			return
		}
		
		req.body["role"] = { set: req.body["role"] }
		req.body["password"] = hashPassword(req.body["password"])

		const data_user = await prisma.users.create({
			data: req.body,
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

		res.status(201).send(data_user)
	};

	// static getAllUsers = async (req: Request, res: Response) => {
	// 	const userRepository = getRepository(Users)
	// 	let user: Users[] = []
	// 	try {
	// 		user = await userRepository.find()
	// 	} catch (error) {
	// 		res.status(401).send("No Users Found")
	// 	}

	// 	res.send(user)
	// }

	static getUserInfo = async (req: Request, res: Response) => {
		// const userRepository = getRepository(Users)
		// let user: Users = new Users()
		// try {
		// 	user = await userRepository.findOneOrFail()
		// }
		console.log(req.user)
		res.send(req.user)
	}
}

export default UserController