import express, { Request, Response } from "express"
import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import * as dotenv from "dotenv"
import { storeAccessToken } from "../utils/storeAccesstokens";
import SocialController from "../controllers/socialController";
import { hashPassword } from "../utils/hashPassword";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const googleOAuthRouter = express.Router()

googleOAuthRouter.use(passport.initialize())
googleOAuthRouter.use(passport.session())

passport.serializeUser(function (user, done) {
	done(null, user)
})

passport.deserializeUser(function (user: any, done) {
	done(null, user)
})

passport.use(new GoogleStrategy({
		clientID: "477779090597-9nconrc7icuuc09amo4q4cpuhbha2p7t.apps.googleusercontent.com",
		clientSecret: "bW708KMVTsuCvRNTs-WYjm_9",
		callbackURL: `${process.env.DOMAIN_URL}/api/accounts/google/callback`
	}, async function(accessToken, refreshToken, profile, cb) {
		const userData = {
			"email": profile["emails"][0]["value"],
			"password": hashPassword("password")
		}

		const data_user = await prisma.users.upsert({
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
		storeAccessToken(profile, accessToken, 'google')
		return cb(null, profile)
  	}
));

const socialController = new SocialController("google")

googleOAuthRouter.get("/", 
	passport.authenticate('google', { scope: ['email', 'profile', 'https://www.googleapis.com/auth/adwords'] }));

googleOAuthRouter.get('/callback', 
	passport.authenticate('google', { failureRedirect: '/api/accounts/login' }),
	(req: Request, res: Response) => socialController.social_login(req, res)
);