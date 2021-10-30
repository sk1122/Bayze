import { Users } from "../models/entity/Users.entity";
import { getRepository } from "typeorm"
import { validate } from "class-validator";
import { connection } from "../../connection"

test("Create a User", async () => {
    connection.then(async () => { })
    
    let user: Users = new Users()
    user.email = "punekar.satyam@gmail.com"
    user.password = "sk1122"
    user.role = "ADMIN"
    
    user.hashPassword()

    const errors = await validate(user)
    if (errors.length > 0) {
        throw new Error(errors.toString())
    }
    
    await getRepository(Users).save(user)
    
    user = new Users()
	try {
        user = await getRepository(Users).findOneOrFail({ where: { email: "punekar.satyam@gmail.com" } })
	} catch (errors) {
        throw new Error(errors.toString())
	}
    
    expect(user.email).toBe("punekar.satyam@gmail.com")

    if(!user.checkIfUnencryptedPasswordIsValid("sk1122")) {
        throw new Error("Passwords not Matching")
    }
})