import express, { Request, Response, Router } from "express"

import { verifyJWT } from "../../authentication/middlewares/verifyJWT"
import { checkRoles } from "../../authentication/middlewares/checkRoles"
import { facebookAccessToken } from "./middlewares/facebookAccessToken"
import { facebookAdsInit } from "./middlewares/facebookAdsInit"
import { validateParams } from "./middlewares/checkParams"

import GraphAPIController from "./controllers/GraphAPIController"
import BusinessController from "./controllers/BusinessController"
import AdsController from "./controllers/AdsController"
import { facebookGraphInit } from "./middlewares/facebookGraphInit"

export const facebookRouter = Router() 

const businessController = new BusinessController()
const graphApiController = new GraphAPIController()
const adsController = new AdsController()

facebookRouter.get("/", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookGraphInit], (req: Request, res: Response) => graphApiController.getPages(req, res))

facebookRouter.get("/ad_account", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookAdsInit, facebookGraphInit], (req: Request, res: Response) => graphApiController.getAccountID(req, res))

facebookRouter.get("/campaigns", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookAdsInit], (req: Request, res: Response) => adsController.getCampaigns(req, res))
facebookRouter.get("/campaigns/insights", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookAdsInit], (req: Request, res: Response) => adsController.getCampaignInsights(req, res))

facebookRouter.get("/adsets/", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookAdsInit], (req: Request, res: Response) => adsController.getAdsets(req, res))
facebookRouter.get("/adsets/insights", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookAdsInit], (req: Request, res: Response) => adsController.getAdsetInsights(req, res))

facebookRouter.get("/ads/", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookAdsInit], (req: Request, res: Response) => adsController.getAds(req, res))
facebookRouter.get("/ads/insights", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookAdsInit], (req: Request, res: Response) => adsController.getAdsInsights(req, res))

facebookRouter.get("/business_users", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookAdsInit], (req: Request, res: Response) => businessController.businessUsers(req, res))
facebookRouter.get("/business_ad_accounts", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookAdsInit, validateParams([{
        param_key: 'business_id',
        required: true,
        type: 'string',
        validator_functions: [(param: any) => {return param !== ""}]
    }])], (req: Request, res: Response) => businessController.businessUserAdAccounts(req, res))
facebookRouter.get("/business_user_pages", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookAdsInit, validateParams([{
        param_key: 'business_id',
        required: true,
        type: 'string',
        validator_functions: [(param: any) => {return param !== ""}]
    }])], (req: Request, res: Response) => businessController.businessUserPages(req, res))

facebookRouter.post("/interest_keywords", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookGraphInit], (req: Request, res: Response) => adsController.getInterestsForAds(req, res))
facebookRouter.post("/suggest_keywords", [verifyJWT, checkRoles(["ADMIN"]), facebookAccessToken, facebookGraphInit], (req: Request, res: Response) => adsController.getSuggestionForKeyword(req, res))