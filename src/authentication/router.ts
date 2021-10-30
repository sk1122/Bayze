import express, { Request, Response } from "express"

import AuthController from "./controllers/authController"
import UserController from "./controllers/userController"

import { verifyJWT } from "./middlewares/verifyJWT"
import { checkRoles } from "./middlewares/checkRoles"
import { facebookOAuthRouter } from "./oauth_routers/facebook.router"
import { googleOAuthRouter } from "./oauth_routers/google_router"
import { verifyOAuth } from "./middlewares/verifyOAuth"

// To Establish Connection

export const authRouter = express.Router()

authRouter.use("/facebook", facebookOAuthRouter)
authRouter.use("/google", googleOAuthRouter)

authRouter.post('/register', UserController.register)
// authRouter.get('/all', UserController.getAllUsers)
authRouter.post('/login', AuthController.login)
authRouter.post('/refresh/token', AuthController.refreshToken)
authRouter.post('/password_reset', [verifyJWT, checkRoles(["ADMIN", "CUSTOMER"])], AuthController.changePassword)
authRouter.get("/profile", [verifyJWT, verifyOAuth(["facebook", "google"])], UserController.getUserInfo)