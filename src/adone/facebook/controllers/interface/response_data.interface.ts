export interface Data {
	name?: string
	business?: string
	business_name?: string
	tos_accepted?: string
	user_tos_accepted?: string
	is_personal?: string
}

export interface ResponseData {
	data?: Array<Data>
	paging?: object
}