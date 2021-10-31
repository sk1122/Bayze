import express, { Request, Response } from "express"

import { verifyJWT } from "../authentication/middlewares/verifyJWT"
import { checkRoles } from "../authentication/middlewares/checkRoles"
import { ProjectController } from "./controllers/ProjectController"

// To Establish Connection

const projectController = new ProjectController()
export const projectRouter = express.Router()

projectRouter.get("/", [verifyJWT], (req: Request, res: Response) => projectController.get(req, res))
projectRouter.post("/", [verifyJWT], (req: Request, res: Response) => projectController.create(req, res))
projectRouter.patch("/:id", [verifyJWT], (req: Request, res: Response) => projectController.update(req, res))
projectRouter.delete("/:id", [verifyJWT], (req: Request, res: Response) => projectController.delete(req, res))