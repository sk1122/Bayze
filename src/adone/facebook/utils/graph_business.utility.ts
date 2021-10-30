import {FB, FacebookApiException} from 'fb';
import fetch from "node-fetch"

export class GraphBusiness {
    access_token: string
    constructor(access_token: string) {
        this.access_token = access_token
    }

    async get_business_id() {
        FB.options({ version: 'v10.0' })
	    FB.setAccessToken(this.access_token)
        let response_data: object
        return FB.api("me/businesses")
    }

    get_business_user_ad_accounts(business_id: string) {
        return fetch('https://graph.facebook.com/v10.0/' + business_id + '/owned_ad_accounts?access_token=' + this.access_token)
            .then((res) => res.json())
    }

    get_business_user_pages(business_id: string) {
        return fetch('https://graph.facebook.com/v10.0/' + business_id + '/owned_pages?access_token=' + this.access_token)
            .then((res) => res.json())    
    }
}