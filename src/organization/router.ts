import express, { Request, Response } from "express"

import { verifyJWT } from "../authentication/middlewares/verifyJWT"
import { checkRoles } from "../authentication/middlewares/checkRoles"
import { OrganizationController } from "./controllers/OrganizationController"

// To Establish Connection

const organizationController = new OrganizationController()

export const organizationRouter = express.Router()

organizationRouter.get('/:id', [verifyJWT, checkRoles(["ADMIN", "EMPLOYEE"])], (req: Request, res: Response) => organizationController.get(req, res))
organizationRouter.get('/', [verifyJWT, checkRoles(["ADMIN", "EMPLOYEE"])], (req: Request, res: Response) => organizationController.list(req, res))
organizationRouter.post('/', [verifyJWT, checkRoles(["ADMIN", "EMPLOYEE"])], (req: Request, res: Response) => organizationController.create(req, res))
organizationRouter.patch('/:id', [verifyJWT, checkRoles(["ADMIN", "EMPLOYEE"])], (req: Request, res: Response) => organizationController.update(req, res))
organizationRouter.delete('/:id', [verifyJWT, checkRoles(["ADMIN", "EMPLOYEE"])], (req: Request, res: Response) => organizationController.delete(req, res))
organizationRouter.get('/join/:id', [verifyJWT, checkRoles(["ADMIN", "EMPLOYEE"])], (req: Request, res: Response) => organizationController.joinOrg(req, res))
organizationRouter.get('/join/:id/accept/:employee_id', (req: Request, res: Response) => organizationController.acceptToOrg(req, res))