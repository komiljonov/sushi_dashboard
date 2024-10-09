import { CreateOrderForm } from "@/components/orders/types";
import { request } from '@/lib/api'




export const CreateOrder = async (data: CreateOrderForm) => {
    console.log(data);


    const { data: res_data } = await request.post('orders/create', data);
    return res_data;
}