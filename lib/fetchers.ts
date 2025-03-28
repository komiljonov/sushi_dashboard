import { request } from "./api"
import { DeliveryPrice, IFilial, IMainAnalytics, IPhoneNumber, IProduct, IPromocode, IUser } from "./types"



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



export const getDeliveryPrice = async (loc_data: { latitude: number; longitude: number }): Promise<DeliveryPrice> => {
    const { data } = await request.post('delivery/calculate', loc_data);
    return data;
}



export const fetchUsers = async (): Promise<IUser[]> => {
    const { data } = await request.get(`/users`);
    return data;
}


export const fetchUsersMin = async (): Promise<IUser[]> => {
    const { data } = await request.get(`/users/min`);
    return data;
}


export const fetchPaginatedUsers = async (page: number, q: string) => {
    const { data } = await request.get(`/users/min2?page=${page}&q=${q}`);
    return data;
}


export const fetchNumbers = async (): Promise<IPhoneNumber[]> => {
    const { data } = await request.get(`/numbers`);
    return data;
}


export const fetchDateAnalytics = async (): Promise<IMainAnalytics> => {
    const { data } = await request.get(`/yearly_statistics`);
    return data;
}
