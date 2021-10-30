import { createConnection, Connection } from "typeorm"
import { AccessToken } from "./authentication/models/entity/AccessToken.entity";
import { Users } from "./authentication/models/entity/Users.entity"
import { Page } from "./adone/facebook/models/entities/user_pages";
import { SocialAccount } from "./authentication/models/entity/SocialAccount.entity";
import { Organization } from "./organization/models/entity/Organization.entity";
import { Admin } from "./organization/models/entity/Admin.entity";
import { Employee } from "./organization/models/entity/Employee.entity";

export const connection = createConnection({
	type: "postgres",
	host: "localhost",
	port: 5432, // default port of postgres
	username: "sk1122", // our created username, you can have your own user name
	password: "satyam#789", // our created username, you can have your own password
	database: "bayze", // our created database name, you can have your own
	entities: [
		// Page,
		// Users,
		// AccessToken,
		// SocialAccount,
		// Organization,
		// Admin,
		// Employee
	],
	synchronize: true,
	logging: false
});