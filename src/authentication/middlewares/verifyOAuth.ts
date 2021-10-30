import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const verifyOAuth = (providers: Array<string>) => {
	return async (req: Request, res: Response, next: NextFunction) => {		
		let provider_obj: Array<object> = []
		for(let i=0;i<providers.length;i++) {
			provider_obj.push({"provider": providers[i], "email": req.user.email})
		}
		
		const socialAccounts = await prisma.social_account.findMany({
			where: {
				OR: provider_obj
			}
		})

		if(socialAccounts.length === providers.length) next()
		else {
			res.status(401).send("Connect this " + providers + " Required Social Accounts to access this route")
		}
	}
}