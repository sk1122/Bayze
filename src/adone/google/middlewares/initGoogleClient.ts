import express, { Request, Response, NextFunction } from "express"
import { GoogleAdsApi } from "google-ads-api";

import { AccessToken } from "../../../authentication/models/entity/AccessToken.entity"

export const initGoogleClient = async (req: Request, res: Response, next: NextFunction) => {
	const client = new GoogleAdsApi({
		client_id: "477779090597-9nconrc7icuuc09amo4q4cpuhbha2p7t.apps.googleusercontent.com",
		client_secret: "bW708KMVTsuCvRNTs-WYjm_9",
		developer_token: "3NZtGrIaUooqDRpzgLb6Qw"
	});
    res.locals.client = client
    next()
}