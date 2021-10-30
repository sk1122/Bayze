import express, { Request, Response, NextFunction } from "express"
import { getRepository } from "typeorm"

import { AccessToken } from "../../../authentication/models/entity/AccessToken.entity"

export const googleAccessToken = async (req: Request, res: Response, next: NextFunction) => {
	const accessTokenRepo = await getRepository(AccessToken)
	var access_token: AccessToken;
	try {
		access_token = await accessTokenRepo.findOneOrFail({ where: { user: req.user, provider: 'google' } })
	} catch (err) {
		res.status(401).send("Login with Google Account")
		return
	}
    res.locals.access_token = access_token.access_token
    next()
}
