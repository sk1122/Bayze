import express, { Request, Response, Router } from "express"

import { verifyJWT } from "../../authentication/middlewares/verifyJWT"
import { checkRoles } from "../../authentication/middlewares/checkRoles"
import { validateParams } from "../facebook/middlewares/checkParams"
import { AdsController } from "./controllers/AdsController"
import { initGoogleClient } from "./middlewares/initGoogleClient"
import { googleAccessToken } from "./middlewares/googleAccesstoken"
import { getCustomer } from "./middlewares/getCustomer"

export const googleRouter = Router() 

const adsController = new AdsController()

googleRouter.get("/", [verifyJWT, checkRoles(["ADMIN"]), initGoogleClient, googleAccessToken, getCustomer], (req: Request, res: Response) => adsController.listCampaigns(req, res))
googleRouter.get("/campaign", [verifyJWT, checkRoles(["ADMIN"]), initGoogleClient, googleAccessToken, getCustomer], (req: Request, res: Response) => adsController.getCampaign(req, res))
googleRouter.post("/campaign/create", [verifyJWT, checkRoles(["ADMIN"]), initGoogleClient, googleAccessToken, getCustomer], (req: Request, res: Response) => adsController.createCampaign(req, res))