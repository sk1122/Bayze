import { Request, Response } from "express";
import { GoogleAdsApi, resources, enums, ResourceNames } from "google-ads-api";

interface google_campaign {
	entity: string
	ad_serving_optimization_status: number
	advertising_channel_sub_type: number
	advertising_channel_type: number
	base_campaign: string
	bidding_strategy_type: number
	campaign_budget: string
	end_date: string
	experiment_type: number
	frequency_caps: Array<any>
	geo_target_type_setting: object
	id: number
	labels: Array<any>
	name: string
	network_settings: {
		target_content_network: boolean
		target_google_search: boolean
		target_partner_search_network: boolean
		target_search_network: boolean
	},
	payment_mode: number
	resource_name: string
	serving_status: number
	start_date: string
	status: number
	target_spend: { cpc_bid_ceiling_micros: number },
	url_custom_parameters: Array<any>
	video_brand_safety_suitability: number	  
}

export class AdsController {
	getAccessibleAccounts = async (req: Request, res: Response) => {
		let access_token = res.locals.access_token
		let client = res.locals.client
		const customers = await client.listAccessibleCustomers(access_token.access_token);
		const customer = client.Customer({
			customer_id: '5102220142',
			refresh_token: access_token,
		})
	}

	listCampaigns = async (req: Request, res: Response) => {		
		const customer = res.locals.customer
		let date = new Date()
		let from_date = "2018-02-25"
		let to_date = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
		try {
			var campaigns = await customer.report({
				entity: "campaign",
				attributes: [
					"campaign.accessible_bidding_strategy",
					" campaign.ad_serving_optimization_status",
					" campaign.advertising_channel_sub_type",
					" segments.ad_network_type",
					" campaign.video_brand_safety_suitability",
					" campaign.vanity_pharma.vanity_pharma_text",
					" campaign.vanity_pharma.vanity_pharma_display_url_mode",
					" campaign.url_custom_parameters",
					" campaign.tracking_url_template",
					" campaign.tracking_setting.tracking_url",
					" campaign.targeting_setting.target_restrictions",
					" campaign.target_spend.target_spend_micros",
					" campaign.target_spend.cpc_bid_ceiling_micros",
					" campaign.target_roas.cpc_bid_floor_micros",
					" campaign.target_roas.target_roas",
					" campaign.target_roas.cpc_bid_ceiling_micros",
					" campaign.target_impression_share.location_fraction_micros",
					" campaign.target_impression_share.location",
					" campaign.target_impression_share.cpc_bid_ceiling_micros",
					" campaign.target_cpm",
					" campaign.target_cpa.target_cpa_micros",
					" campaign.target_cpa.cpc_bid_floor_micros",
					" campaign.target_cpa.cpc_bid_ceiling_micros",
					" campaign.start_date",
					" campaign.shopping_setting.sales_country",
					" campaign.shopping_setting.merchant_id",
					" campaign.status",
					" campaign.shopping_setting.campaign_priority",
					" campaign.shopping_setting.enable_local",
					" campaign.serving_status",
					" campaign.resource_name",
					" campaign.selective_optimization.conversion_actions",
					" campaign.real_time_bidding_setting.opt_in",
					" campaign.percent_cpc.enhanced_cpc_enabled",
					" campaign.percent_cpc.cpc_bid_ceiling_micros",
					" campaign.payment_mode",
					" campaign.optimization_score",
					" campaign.optimization_goal_setting.optimization_goal_types",
					" campaign.network_settings.target_partner_search_network",
					" campaign.network_settings.target_search_network",
					" campaign.network_settings.target_google_search",
					" campaign.network_settings.target_content_network",
					" campaign.name",
					" campaign.maximize_conversions.target_cpa",
					" campaign.maximize_conversion_value.target_roas",
					" campaign.manual_cpv",
					" campaign.manual_cpm",
				],
				from_date: from_date,
				to_date: to_date,
				order_by: 'metrics.impressions',
				sort_order: 'DESC',
				// limit: 3,
			})
			// var campaigns = await customer.query(`
			// 	SELECT campaign.accessible_bidding_strategy, campaign.ad_serving_optimization_status, campaign.advertising_channel_sub_type, segments.ad_network_type, campaign.video_brand_safety_suitability, campaign.vanity_pharma.vanity_pharma_text, campaign.vanity_pharma.vanity_pharma_display_url_mode, campaign.url_custom_parameters, campaign.tracking_url_template, campaign.tracking_setting.tracking_url, campaign.targeting_setting.target_restrictions, campaign.target_spend.target_spend_micros, campaign.target_spend.cpc_bid_ceiling_micros, campaign.target_roas.cpc_bid_floor_micros, campaign.target_roas.target_roas, campaign.target_roas.cpc_bid_ceiling_micros, campaign.target_impression_share.location_fraction_micros, campaign.target_impression_share.location, campaign.target_impression_share.cpc_bid_ceiling_micros, campaign.target_cpm, campaign.target_cpa.target_cpa_micros, campaign.target_cpa.cpc_bid_floor_micros, campaign.target_cpa.cpc_bid_ceiling_micros, campaign.start_date, campaign.shopping_setting.sales_country, campaign.shopping_setting.merchant_id, campaign.status, campaign.shopping_setting.campaign_priority, campaign.shopping_setting.enable_local, campaign.serving_status, campaign.resource_name, campaign.selective_optimization.conversion_actions, campaign.real_time_bidding_setting.opt_in, campaign.percent_cpc.enhanced_cpc_enabled, campaign.percent_cpc.cpc_bid_ceiling_micros, campaign.payment_mode, campaign.optimization_score, campaign.optimization_goal_setting.optimization_goal_types, campaign.network_settings.target_partner_search_network, campaign.network_settings.target_search_network, campaign.network_settings.target_google_search, campaign.network_settings.target_content_network, campaign.name, campaign.maximize_conversions.target_cpa, campaign.maximize_conversion_value.target_roas, campaign.manual_cpv, campaign.manual_cpm FROM campaign
			// `)
		} catch (err) {
			console.log(err)
			res.status(400).send(err)
			return
		}
		res.send(campaigns)
	}

	getCampaign = async (req: Request, res: Response) => {
		const campaign_id = req.query["campaign"]
		const google_ad_user_id = req.query["user_id"]
		const customer = res.locals.customer
		
		try {
			var campaign = await customer.campaigns.get(`customers/${google_ad_user_id}/campaigns/${campaign_id}`)
		} catch (err) {
			res.status(400).send(err)
			return
		}
		res.status(200).send(campaign)
	}

	createCampaign = async (req: Request, res: Response) => {
		console.log(1)
		const customer = res.locals.customer
		console.log(2)
		// let campaign = {
		// 	name: 'new-campaign',
		// 	campaign_budget: 'customers/2417463413/campaignBudgets/123',
		// 	advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
		// 	status: enums.CampaignStatus.PAUSED,
		// }
		
		// try {
		// 	console.log(3)
		// 	var result = await customer.campaigns.create([campaign])
		// 	console.log(4)
		// } catch (err) {
		// 	console.log(5)
		// 	console.log(err)
		// 	console.log(6)
		// 	res.status(400).send(err)
		// }
		// console.log(7)
		let result = await customer.campaignBudgets.list()
		res.status(200).send(result)
	}
}