import { CreateOrderForm } from "@/components/orders/create/types";
import { request } from '@/lib/api'
import { NewUser } from "./types";




export const CreateOrder = async (data: CreateOrderForm) => {
    console.log(data);


    const { data: res_data } = await request.post('orders/create', data);
    return res_data;
}


export const createUser = async (data: NewUser) => {

    const { data: res_data } = await request.post('new-user/', data);
    return res_data;
}



export const requestSync = async () => {
    await request.get('sync')
}




export const cancelOrder = async (orderId: string) => {
    return await request.get(`orders/${orderId}/cancel`);
}


export const acceptOrder = async (orderId: string) => {
    return await request.get(`orders/${orderId}/accept`);
}


