import express, { Request, Response } from "express";
import { FB } from 'fb';
import { getRepository } from "typeorm"
import { AdAccount } from "facebook-nodejs-business-sdk";

import { AccessToken } from "../../../authentication/models/entity/AccessToken.entity"
import { Page } from "../models/entities/user_pages";
import { ResponseData } from "./interface/response_data.interface";

class GraphAPIController {
	getPages = async (req: Request, res: Response) => {
		let pages: Page[] = []
		try {
			pages = await getRepository(Page)
							.createQueryBuilder("page")
							.where("page.user = :user", { user: req.user.id })
							.getMany();
		} catch (errors) {
			res.status(401).send("Error Loading Pages " + errors)
			return
		}

		res.status(200).send(pages)
	}

	getAccountID = async (req: Request, res: Response) => {
		let response_data: any;

		FB.options({ version: 'v11.0' })
		await FB.api("me/adaccounts", async function(response: ResponseData) {
			response_data = response.data
			var promises = []
			for (let i=0;i<response_data.length;i++) {
			    let ad_account_id = response_data[i]["id"]
			    let fields, params;
			    fields = [
			        'name',
					'business',
					'business_name',
					'tos_accepted',
					'user_tos_accepted',
					'is_personal'
			    ];
			    params = {};
			    const data = await (new AdAccount(ad_account_id)).get(
			        fields,
			        params
			    )
			    promises.push(data)
			}
			await Promise.all([...promises]).then(values => {
			    for(let i=0;i<response_data.length;i++) {
			        response_data[i].name = values[i]["_data"]["name"]
			        response_data[i].business = values[i]["_data"]["business"]
			        response_data[i].business_name = values[i]["_data"]["business_name"]
			        response_data[i].tos_accepted = values[i]["_data"]["tos_accepted"]
			        response_data[i].user_tos_accepted = values[i]["_data"]["user_tos_accepted"]
			        response_data[i].is_personal = values[i]["_data"]["is_personal"]
			    }
			    res.status(200).send(response_data)
			})
		})
		// res.status(400).send({"error": "Can't connect to FB"})
	}
}

export default GraphAPIController;