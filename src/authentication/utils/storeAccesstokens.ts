import {FB} from 'fb';
import { getRepository } from "typeorm"
import { validate } from "class-validator"

import { FacebookAdsApi, Page as UserPage } from 'facebook-nodejs-business-sdk';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function storeUserPages(user: object, access_token: string) {
	console.log(access_token)
	FB.options({ version: 'v11.0' })
	FB.setAccessToken(access_token)
	// var BayzeApp = FB.extend({ appId: '4118143361578217', appSecret: 'cfa0eab1d7e579e74f3f87aaf89ed774' })
	FB.api("me/accounts", async function(response: any) {
		if(!response || response.error) {
			return false
		}

		let page_data = response.data
		for(let page_no = 0; page_no < page_data.length; page_no++) {
			let single_page = page_data[page_no]
			let page = await prisma.page.findFirst({ where: { page_id: single_page.id } })
			FacebookAdsApi.init(access_token)
			let promises = []
			let fields, params;
			fields = [
				'name',
				'business'
			];
			params = {};
			const page_business = await (new UserPage(single_page.id)).get(
				fields,
				params
			)
			promises.push(page_business)
			
			let properties = {
				page_id: single_page.id,
				name: single_page.name,
				category: single_page.category,
				category_list: single_page.category_list,
				tasks: single_page.tasks,
				userId: user["id"]
			}

			
			await Promise.all([...promises]).then(async values => {
				// console.log(values)
				// console.log(values[0]["_data"])
				properties["business"] = values[0]["_data"]["business"]
				if(!page) page = await prisma.page.create({ data: properties })
			})
		}

		return true
	})
	return true
}

export async function storeAccessToken(profile: object, access_token: string, provider: string) {
	const user = await prisma.users.findUnique({
		where: {
			email: profile["emails"][0]["value"]
		}
	})

	let accessToken = await prisma.access_token.updateMany({
		where: {
			provider: provider,
			userId: user.id
		},
		data: {
			access_token: access_token,
			provider: provider,
			userId: user.id
		}
	})

	console.log(accessToken)
	
	if(!accessToken || accessToken["count"] === 0) {
		let accessToken = await prisma.access_token.create({
			data: {
				access_token: access_token,
				provider: provider,
				userId: user.id
			}
		})
	}

	storeUserPages(user, access_token)
	console.log(accessToken)
}