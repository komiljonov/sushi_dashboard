import { IProduct } from "@/lib/types";


export type OrderItem = {
    _product: IProduct;
    product: string;
    quantity: number;
}

export type CreateOrderForm = {
    user: string | null;
    phone: string;
    comment: string;
    promocode?: string;
    delivery: 'PICKUP' | 'DELIVER';
    filial: string;
    phone_number: string;
    time: string | null;
    location: {
        latitude: number,
        longitude: number
    }

    items: OrderItem[]
}