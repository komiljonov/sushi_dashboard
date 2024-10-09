import { request } from "./api"
import { IFilial, IProduct, IPromocode } from "./types"



export const fetchFilials = async (): Promise<IFilial[]> => {
    const { data } = await request.get('filials')
    return data
}


export const fetchPromocodes = async (): Promise<IPromocode[]> => {
    const { data } = await request.get('promocodes/');
    return data;
}

export const fetchProducts = async (): Promise<IProduct[]> => {
    const { data } = await request.get('products');
    return data;
}
