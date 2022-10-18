import crypto from 'crypto'
import { login } from '../interfaces/login.interface';
import { credential } from '../models/credential.model';

export async function GenPassword<T extends string>(input: T) {
    const hash512 = crypto.createHash('sha512');
    const hashData = hash512.update(input, 'utf-8');
    const hashedPassword = hashData.digest("hex");
    return hashedPassword

}



export async function validatePassword<T extends login>(input: T): Promise<Boolean> {
    const username = input.username
    const InputPassword = input.password
    const hashedPassword = await GenPassword(InputPassword)

    try {
        let user = await credential.findOne({ username: username })
        if (user) {
            const { password } = user
            return hashedPassword === password
        } else {
            return false
        }
    } catch (error) {
        return false
    }

}
