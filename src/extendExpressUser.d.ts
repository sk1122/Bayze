import { uuidv4 as uuid } from "uuidv4"

declare global {
	namespace Express {
		interface User extends SomeOtherUserTypeYouHaveDefined {
			id?: uuid;
			email?: string;
		}
	}
  }