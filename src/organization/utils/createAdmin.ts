import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function createAdmin(data: Array<string>, organization: object) {
	let admin_object = []

	for(let i=0;i<data.length;i++) {
		let admin = data[i]
		let _admin = await prisma.admin.upsert({
			where: {
				userId: admin["id"],
			},
			update: {
				organizationId: organization["id"]
			},
			create: {
				userId: admin["id"],
				organizationId: organization["id"]
			}
		})
		admin_object.push({"id": _admin["id"]})
	}

	console.log(admin_object)
	await prisma.organization.update({
		where: {
			id: organization["id"]
		},
		data: {
			admin: {
				connect: admin_object
			}
		}
	})
}