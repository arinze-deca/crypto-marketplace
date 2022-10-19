import crypto from "crypto";

const hashSomeData = (data: any):string =>{
    const hash512 = crypto.createHash('sha512');
    const hashData = hash512.update(data, 'utf-8');
    const hashedPassword = hashData.digest("hex");

    return hashedPassword;
}

export default hashSomeData;
