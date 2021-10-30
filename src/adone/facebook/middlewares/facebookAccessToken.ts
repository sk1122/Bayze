import express, { Request, Response, NextFunction } from "express"
import { getRepository } from "typeorm"

import { AccessToken } from "../../../authentication/models/entity/AccessToken.entity"

export const facebookAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    const accessTokenRepository = getRepository(AccessToken)
    let accessToken: AccessToken = new AccessToken()
    try {
        accessToken = await accessTokenRepository.findOneOrFail({ where: { user: req.user, provider: 'facebook' } }) 
    } catch (errors) {
        res.status(401).send("Cannot Find Access Token, Login Again")    
    }

    res.locals.access_token = accessToken.access_token
    next()
}