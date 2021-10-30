import express, { Request, Response } from "express"

import { facebookRouter } from "./facebook/router"
import { googleRouter } from "./google/router"

import { verifyJWT } from "../authentication/middlewares/verifyJWT"
import { checkRoles } from "../authentication/middlewares/checkRoles"
import { facebookOAuthRouter } from "../authentication/oauth_routers/facebook.router"
import { googleOAuthRouter } from "../authentication/oauth_routers/google_router"

// To Establish Connection

export const adoneRouter = express.Router()

adoneRouter.use("/facebook/", facebookRouter)
adoneRouter.use("/google/", googleRouter)