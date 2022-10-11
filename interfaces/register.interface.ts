export interface register{
    username: string
    password: string
    email: string
}

export interface registerMerchant extends register{
    cac: number
    phonenumber: number
    bvn: number
}
