import { Request, Response } from "express"
import { AdAccount, AdSet, Ad } from "facebook-nodejs-business-sdk"
import { FB } from "fb"

class AdsController {
	getCampaigns = async (req: Request, res: Response) => {
		let ad_account_id = req.query["ad_account"]
		
		let promises = []
		
		let api = res.locals.facebook_api
		api.setDebug(true)
		let fields = [
			'name',
			'objective',
			'can_use_spend_cap',
			'daily_budget',
			'special_ad_categories',
			'special_ad_category',
			'special_ad_category_country',
			'start_time',
			'account_id',
			'ad_strategy_id',
			'adlabels',
			"status"
		];
		let params = {
			'effective_status' : ['ACTIVE','PAUSED'],
		};
		const campaigns = await (new AdAccount(ad_account_id)).getCampaigns(fields, params)
		promises.push(campaigns)
		
		await Promise.all(promises).then(values => {
			let response_data = []
			for(let i=0;i<values.length;i++) {
				let value = values[i]
				for(let j=0;j<value.length;j++) {
					response_data.push(value[j]["_data"])
				}	
			}
			res.status(200).send(response_data)
		})
	}
	
	getCampaignInsights = async (req: Request, res: Response) => {
		let ad_account_id = req.query["ad_account"]
		let promises = []
		
		let api = res.locals.facebook_api
		api.setDebug(true)
		let fields = [
			'account_id',
			'objective',
			'cpc'
		];
		let params = {};
		// const campaign_insights = await fetch("https://graph.facebook.com/v11.0/act_203132874856467/insights?access_token=" + res.locals.access_token)
		// 		.then(res => res.json())
		const campaign_insights = await (new AdAccount(ad_account_id)).getInsights(fields, params)
		promises.push(campaign_insights)
		
		await Promise.all(promises).then(values => {
			res.status(200).send(values[0])
		})
	}
	
	getAdsets = async (req: Request, res: Response) => {
		let promises = []
		
		let api = res.locals.facebook_api
		api.setDebug(true)
		let fields = [
			'name',
			'objective',
			'can_use_spend_cap',
			'daily_budget',
			'special_ad_categories',
			'special_ad_category',
			'special_ad_category_country',
			'start_time',
			'account_id',
			'ad_strategy_id',
			'adlabels',
		];
		let params = {
			'effective_status' : ['ACTIVE','PAUSED'],
		};
		const campaigns = await (new AdAccount("act_203132874856467")).getAdSets(fields, params)
		promises.push(campaigns)

		await Promise.all(promises).then(values => {
			let response_data = []
			for(let i=0;i<values.length;i++) {
				let value = values[i]
				for(let j=0;j<value.length;j++) {
					response_data.push(value[j]["_data"])
				}	
			}
			res.status(200).send(response_data)
		})
	}
	
	getAdsetInsights = async (req: Request, res: Response) => {
		let promises = []
		
		let api = res.locals.facebook_api
		api.setDebug(true)
		let fields = [
			'account_id',
			'objective',
			'cpc'
		];
		let params = {};
		// const campaign_insights = await fetch("https://graph.facebook.com/v11.0/act_203132874856467/insights?access_token=" + res.locals.access_token)
		// 		.then(res => res.json())
		const campaign_insights = await (new AdSet("23847729909630715")).getInsights(fields, params)
		promises.push(campaign_insights)
		
		await Promise.all(promises).then(values => {
			res.status(200).send(values[0])
		})
	}
	
	getAds = async (req: Request, res: Response) => {
		let ad_account_id = req.query["ad_account"]
		let promises = []
		
		let api = res.locals.facebook_api
		api.setDebug(true)
		let fields = [
			'name',
			'objective',
			'can_use_spend_cap',
			'daily_budget',
			'special_ad_categories',
			'special_ad_category',
			'special_ad_category_country',
			'start_time',
			'account_id',
			'ad_strategy_id',
			'adlabels',
		];
		let params = {
			'effective_status' : ['ACTIVE','PAUSED'],
		};
		const campaigns = await (new AdAccount(ad_account_id)).getAds(fields, params)
		promises.push(campaigns)

		await Promise.all(promises).then(values => {
			let response_data = []
			for(let i=0;i<values.length;i++) {
				let value = values[i]
				for(let j=0;j<value.length;j++) {
					response_data.push(value[j]["_data"])
				}	
			}
			res.status(200).send(response_data)
		})
	}

	getAdsInsights = async (req: Request, res: Response) => {
		let ad_id = req.query["ad"]
		let promises = []
		
		let api = res.locals.facebook_api
		api.setDebug(true)
		let fields = [
			'account_id',
			'objective',
			'cpc'
		];
		let params = {};
		// const campaign_insights = await fetch("https://graph.facebook.com/v11.0/act_203132874856467/insights?access_token=" + res.locals.access_token)
		// 		.then(res => res.json())
		const campaign_insights = await (new Ad(ad_id)).getInsights(fields, params)
		promises.push(campaign_insights)

		await Promise.all(promises).then(values => {
			res.status(200).send(values[0])
		})
	}

	getInterestsForAds = async (req: Request, res: Response) => {
		const keywords = req.body["keywords"]
		console.log(keywords, typeof(keywords), `search?type=adinterest&q=${keywords}&limit=10000&locale=en_US`)
		FB.api(`search?type=adinterest&q=[${keywords}]&limit=10000&locale=en_US`)
			.then(response => {
				res.status(200).send(response)
			})
			.catch(error => {
				res.status(400).send(error)
			})
	}

	getSuggestionForKeyword = async (req: Request, res: Response) => {
		let keywords = req.body["keywords"]
		for(let i=0;i<keywords.length;i++) keywords[i] = `%22${keywords[i]}%22`
		console.log(keywords, `search?type=adinterestsuggestion&interest_list=[${keywords}]&limit=10000&locale=en_US`)
		FB.api(`search?type=adinterestsuggestion&interest_list=[${keywords}]&limit=1000&locale=en_US`)
			.then(response => {
				res.status(200).send(response)
			})
			.catch(error => {
				res.status(400).send(error)
			})
	}
}

export default AdsController