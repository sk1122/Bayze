import express, { Request, Response, NextFunction } from "express"

export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
	let access_token = res.locals.access_token
	let client = res.locals.client
	const customer = client.Customer({
		customer_id: '2417463413',
		refresh_token: access_token,
		login_customer_id: '5102220142'
	})
	res.locals.customer = customer
    next()
}