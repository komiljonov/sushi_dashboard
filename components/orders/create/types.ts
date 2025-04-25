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
    delivery_price: number;
    filial: string;
    phone_number: string;
    time: string | null;
    payment_type: string;
    location: {
        latitude: number,
        longitude: number
    }

    items: OrderItem[]
}