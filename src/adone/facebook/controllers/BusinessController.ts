import express, { Request, Response } from "express";
import { FacebookAdsApi, AdAccount, Page } from "facebook-nodejs-business-sdk"
import { getRepository, Repository } from "typeorm"

import { AccessToken } from "../../../authentication/models/entity/AccessToken.entity"
import { Page as UserPage } from "../models/entities/user_pages";

import { GraphBusiness } from "../utils/graph_business.utility"

class BusinessController {
	businessUsers = async (req: Request, res: Response) => {
		let graph_business_api = new GraphBusiness(res.locals.access_token)

		let business_users: string = await graph_business_api.get_business_id()

		res.status(200).send(business_users)
	}

	businessUserAdAccounts = async (req: Request, res: Response) => {
		let business_id = req.query["business_id"]

		let graph_business_api = new GraphBusiness(res.locals.access_token)
		let business_user_ad_accounts = await graph_business_api.get_business_user_ad_accounts(business_id as string)

		let ad_account_ids = business_user_ad_accounts["data"]
		var promises = []
		for (let i=0;i<ad_account_ids.length;i++) {
			let ad_account_id = ad_account_ids[i]["id"]
			let fields, params;
			fields = [
				'name',
			];
			params = {};
			const data = await (new AdAccount(ad_account_id)).get(
				fields,
				params
			)
			promises.push(data)
		}
		await Promise.all([...promises]).then(values => {
			for(let i=0;i<ad_account_ids.length;i++) {
				business_user_ad_accounts["data"][i].name = values[i]["_data"]["name"]
			}
			res.status(200).send(business_user_ad_accounts)
		})
	}

	businessUserPages = async (req: Request, res: Response) => {
		let business_id = req.query["business_id"]
		let graph_business_api = new GraphBusiness(res.locals.access_token)
		let business_user_pages = await graph_business_api.get_business_user_pages(business_id as string)
		res.status(200).send(business_user_pages)
	}

	businessAdAccount = async (req: Request, res: Response) => {
		const api = res.locals.facebook_api
		api.setDebug(true)

		let ad_account_id = req.query["ad_account"]

		let fields, params;
		fields = [
			'name',
		];
		params = {};
		const sample_code = (new AdAccount(ad_account_id)).get(
			fields,
			params
		).then((response: any) => res.status(200).send(response["_data"]))
	}
}

export default BusinessController