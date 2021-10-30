import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function createEmployee(data: Array<object>, organization: number) {
	let employee_object = []
	for(let i=0;i<data.length;i++) {
		let employee = data[i]
		let _employee = await prisma.employee.upsert({
			where: {
				userId: employee["id"],
			},
			update: {},
			create: {
				userId: employee["id"],
			}
		})
		console.log(_employee)
		employee_object.push({"id": _employee["id"]})
	}
	return employee_object
}

export async function addEmployeeToOrg(employee: object[], organization_id: number) {
	try {
		return await prisma.organization.update({
			where: {
				id: organization_id
			},
			data: {
				employee: {
					connect: employee
				}
			}
		})
	} catch (err) {
		return err
	}
}