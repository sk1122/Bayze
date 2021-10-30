import { Request, Response, NextFunction } from "express";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const checkRoles = (roles: Array<string>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const id = res.locals.jwtPayload.userId
		let user;
		try {
			user = await prisma.users.findUnique({
				where: {
					id: id
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
		if(!user.role) {
			res.status(401).send("Not Authorized")
			return
		}
		if (roles.some(item => user.role.includes(item))) next()
		else res.status(401).send("Not Authorized")
	}
}