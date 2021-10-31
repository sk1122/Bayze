import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export class ProjectController {
	get = async (req: Request, res: Response) => {
		let admin = await prisma.admin.findFirst({
			where: {
				userId: req.user.id
			}
		})
		let project = await prisma.project.findMany({
			where: {
				organizationId: admin.organizationId
			}
		})

		res.send(project)
	}

	create = async (req: Request, res: Response) => {
		let project = await prisma.project.create({
			data: req.body
		})

		res.status(200).send(project)
	}

	update = async (req: Request, res: Response) => {
		const id = Number(req.params["id"])
		if(isNaN(id)) {
			res.status(400).json({ "error": "id should be a number" })
			return
		}
		let project = await prisma.project.update({
			where: {
				id: id
			},
			data: req.body
		})

		res.status(200).send(project)
	}

	delete = async (req: Request, res: Response) => {
		const id = Number(req.params["id"])
		if(isNaN(id)) {
			res.status(400).json({ "error": "id should be a number" })
			return
		}
		let project = await prisma.project.delete({
			where: {
				id: id
			}
		})

		res.status(200).send(project)	
	}
}