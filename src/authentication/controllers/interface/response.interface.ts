interface Name {
	familyName?: string
	givenName?: string
	middleName?: string
}

interface ValuesInList {
	value?: string
}

export interface ResponseData {
	id?: string
	username?: string
	displayName?: string
	name?: Name
	gender?: string
	profileUrl?: string
	emails?: Array<ValuesInList>
	photos?: Array<ValuesInList>
	provider?: string
	_json?: object
}