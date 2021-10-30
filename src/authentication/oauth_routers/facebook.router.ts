import express, { Request, Response } from "express"
import passport from "passport"
import { Strategy } from "passport-facebook"
import * as dotenv from "dotenv"

import SocialController from "../controllers/socialController"

import { storeAccessToken } from "../utils/storeAccesstokens"
import { hashPassword } from "../utils/hashPassword";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
dotenv.config()

export const facebookOAuthRouter = express.Router()

facebookOAuthRouter.use(passport.initialize())
facebookOAuthRouter.use(passport.session())

passport.serializeUser(function (user, done) {
	done(null, user)
})

passport.deserializeUser(function (user: any, done) {
	done(null, user)
})

let DOMAIN_URL = process.env.DOMAIN_URL
passport.use(
	new Strategy({
		clientID: "466995494586303",
		clientSecret: "98db49701eedfd1de86fbd29fbffde38",
		callbackURL: `${DOMAIN_URL}/api/accounts/facebook/callback`,
		profileFields: ['id', 'displayName', 'email', 'verified']
	}, async function (accessToken, refreshToken, profile, cb) {
		const userData = {
			"email": profile["emails"][0]["value"],
			"password": hashPassword("password")
		}

		await prisma.users.upsert({
			where: {
				email: userData.email
			},
			update: {},
			create: userData,
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
		storeAccessToken(profile, accessToken, 'facebook')
		return cb(null, profile)
	})
)

const socialController = new SocialController("facebook")

const facebook_scope = ['email', 'user_friends', 'business_management', 'pages_manage_ads', 'pages_show_list', 'instagram_basic', 'instagram_manage_insights', 'read_insights', 'pages_read_engagement', 'ads_management', 'ads_read', 'instagram_content_publish', 'instagram_manage_comments', 'pages_read_user_content', 'pages_manage_engagement', 'public_profile']

facebookOAuthRouter.get("/",
	passport.authenticate('facebook', { authType: 'reauthenticate', scope: facebook_scope })
)

facebookOAuthRouter.get("/callback", 
	passport.authenticate("facebook", { failureRedirect: "/" }), 
	(req: Request, res: Response) => socialController.social_login(req, res)
)