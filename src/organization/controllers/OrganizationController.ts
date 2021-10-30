import { Request, Response } from "express"
import { createAdmin } from "../utils/createAdmin"

import { PrismaClient } from '@prisma/client'
import { addEmployeeToOrg, createEmployee } from "../utils/createEmployee"
import { getEmailFromAdmin, sendEmail } from "../utils/getEmailFromAdmin"
const prisma = new PrismaClient()

export class OrganizationController {
	
	get = async (req: Request, res: Response) => {
		const id = req.params["id"]
		if(isNaN(Number(id))) {
			res.status(400).json({ "error": "id should be a number" })
			return
		}

		let organization = await prisma.organization.findFirst({
			where: {
				id: Number(id)
			},
			include: {
				admin: true,
				employee: true
			}
		})
		if(!organization) {
			res.status(400).send({"error": "Organization with id " + String(id) + " not found"})
		}
		res.status(200).send(organization)
	}

	list = async (req: Request, res: Response) => {
		let admin = await prisma.admin.findFirst({
			where: {
				userId: req.user.id
			},
			select: {
				id: true,
				userId: true,
				organization: true
			}
		})

		if(!admin || !admin["organization"]) {
			res.status(200).send([])
			return
		}

		let organization = await prisma.organization.findFirst({
			where: {
				id: admin["organization"]["id"]
			},
			include: {
				admin: true,
				employee: true
			}
		})
		res.status(200).send(organization)
	}

	create = async (req: Request, res: Response) => {
		let { admin, ...data } = req.body
		const organization = await prisma.organization.create({ data: data })
		admin = createAdmin(admin, organization)
		res.status(200).send(organization)
	}

	update = async (req: Request, res: Response) => {
		const id = req.params["id"]
		let { employee, admin, ...data } = req.body
		
		if(isNaN(Number(id))) {
			res.status(400).json({ "error": "id should be a number" })
			return
		}
		
		const organization = await prisma.organization.update({
			where: {
				id: Number(id)
			},
			data: {
				...data
			}
		})

		if(employee) {
			console.log("dsa")
			let employees = await createEmployee(employee, Number(id))
			let org_with_emp = addEmployeeToOrg(employees, Number(id))
		}
		
		if(admin) {
			console.log("dsa`")
			createAdmin(admin, organization)
		}

		if(!organization) {
			res.status(400).send({"error": "organization not found"})
			return
		}

		res.status(200).json({ "employee": employee, "data": data, "organization": organization })
	}

	delete = async (req: Request, res: Response) => {
		const id = req.params["id"]
		
		if(isNaN(Number(id))) {
			res.status(400).json({ "error": "id should be a number" })
			return
		}

		try {
			var deleteOrg = await prisma.organization.delete({
				where: {
					id: Number(id)
				}
			})
		} catch (err) {
			res.status(400).send({"error": "Organization with id " + String(id) + " not found"})
			return
		}
		res.status(200).send(deleteOrg)
	}

	joinOrg = async (req: Request, res: Response) => {
		const id = req.params["id"]
		
		if(isNaN(Number(id))) {
			res.status(400).json({ "error": "id should be a number" })
			return
		}

		let organization = await prisma.organization.findFirst({
			where: {
				id: Number(id)
			},
			select: {
				email: true,
				admin: true,
				employee: true
			}
		})
		if(!organization) {
			res.status(400).send({"error": "Organization with id " + String(id) + " not found"})
		}

		// TODO: Send Email to Org Email and to all the admins
		let emails = [{"email": organization.email}]
		let adminEmail = await getEmailFromAdmin(organization.admin)
		emails.push(...adminEmail)
		let employee = await createEmployee([{"id": req.user.id}], Number(id))

		let data = {
			employee_first_name: "Satyam",
			employee_last_name: "Kulkarni",
			employee_email: "punekar.satyam@gmail.com",
			organization_name: "Bayze",
			organization_id: 18,
			employee_id: 39
		}

		await sendEmail(emails, data)

		res.status(200).send({"success": "Organization is notified"})
	}

	acceptToOrg = async (req: Request, res: Response) => {
		let employee_id = req.params["employee_id"]
		const id = req.params["id"]
		
		if(isNaN(Number(id)) && isNaN(Number(employee_id))) {
			res.status(400).json({ "error": "id/employee_id should be a number" })
			return
		}
		
		try {
			var employee = await prisma.employee.update({
				where: {
					id: Number(employee_id)
				},
				data: {
					organizationId: Number(id)
				},
				select: {
					id: true,
					userId: true
				}
			})
		} catch (err) {
			console.log("dsa")
			res.status(400).send(err)
			return
		}
		
		try {
			let org_with_emp = await prisma.organization.update({
				where: {
					id: Number(id)
				},
				data: {
					employee: {
						connect: [{"id": employee["id"]}]
					}
				}
			})
			let user = await prisma.users.update({
				where: {
					id: employee["userId"]
				},
				data: {
					is_accepted_to_org: true
				}
			})
		} catch (err) {
			res.status(400).send(err)
			return
		}

		res.status(200).send("Employee Added")
	}

}