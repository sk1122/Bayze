import * as bcrypt from "bcryptjs"

export const hashPassword = (password: string) => {
    return bcrypt.hashSync(password, 8)
}

export const checkIfUnencryptedPasswordIsValid = async (unencryptedPassword: string, encryptedPassword: string) => {
    let isCorrect = bcrypt.compareSync(unencryptedPassword, encryptedPassword)

    return isCorrect
}