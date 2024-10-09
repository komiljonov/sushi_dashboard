import { IProduct } from "@/lib/types";


export type OrderItem = {
    _product: IProduct;
    product: string;
    quantity: number;
}

export type CreateOrderForm = {
    user: string;
    phone: string;
    comment: string;
    promocode?: string;
    delivery: 'PICKUP' | 'DELIVERY';
    filial: string;
    time: string | null;
    location: {
        latitude: number,
        longitude: number
    }

    items: OrderItem[]
}