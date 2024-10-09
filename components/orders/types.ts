import { IProduct } from "@/lib/types";


export type OrderItem = {
    product: IProduct;
    quantity: number;
}

export type FormData = {
    user: string;
    phone: string;
    comment: string;
    promocode?: string;
    delivery: 'pickup' | 'delivery';
    filial: string;
    time: string | null;
    location: {
        latitude: number,
        longitude: number
    }


    items: OrderItem[]
}