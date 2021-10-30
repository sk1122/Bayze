import * as dotenv from "dotenv"
import { Client } from "@sendgrid/client"
const sgMail = require('@sendgrid/mail')
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

dotenv.config()

export async function getEmailFromAdmin(admins: Array<object>) {
	let userEmails = []
	for(let i=0;i<admins.length;i++) {
		let admin = admins[i]

		let user = await prisma.users.findFirst({
			where: {
				id: admin["userId"]
			},
			select: {
				email: true
			}
		})

		if(!user) continue

		userEmails.push({"email": user["email"]})
	}

	return userEmails
}

export async function sendEmail(emails: Array<object>, data: object) {
	const apiKey = process.env.SENDGRID_API_KEY
	sgMail.setApiKey(apiKey)

	var msg = {
		from: 'hello@bayze.in', // Change to your verified sender
		template_id: "d-d93d96272ab34492a2ce2bca34b191d8",
		personalizations: [{
			to: emails,
			dynamic_template_data: {
				first_name: data["employee_first_name"],
				last_name: data["employee_last_name"],
				email: data["employee_email"],
				organization: data["organization_name"],
				id: data["organization_id"],
				employee_id: data["employee_id"]
			}
		}]
	}
	console.log(msg.personalizations[0])
	sgMail.send(msg)
		.then((data) => console.log(data))
}