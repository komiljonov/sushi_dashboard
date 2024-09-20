import { IProduct, IPromocode, IUser } from ".";





export interface IOrderItem {
    id: number;
    product: IProduct;
    count: number;
    price: number;

}




export interface IOrder {
    saving: number;
    id: string;
    order_id: number;
    user: IUser;
    products_count: number;
    promocode: IPromocode;
    order_time: Date;
    status: string;
    price: number;
    discount_price: number;

    comment: string;

    items: IOrderItem[]
}


