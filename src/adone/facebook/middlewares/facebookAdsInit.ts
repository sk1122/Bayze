// Use after facebookAccessToken middleware

import express, { Request, Response, NextFunction } from "express"
import { FacebookAdsApi, AdAccount, User } from "facebook-nodejs-business-sdk"

export const facebookAdsInit = async (req: Request, res: Response, next: NextFunction) => {
    const api = FacebookAdsApi.init(res.locals.access_token)
    res.locals.facebook_api = api
    next()
}