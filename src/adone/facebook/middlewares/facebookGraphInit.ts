// Use after facebookAccessToken middleware

import express, { Request, Response, NextFunction } from "express"
import { FB } from "fb"

export const facebookGraphInit = async (req: Request, res: Response, next: NextFunction) => {
    const api = FB.setAccessToken(res.locals.access_token)
    next()
}