
export interface ICategory {
    id: number;
    name_uz: string;
    name_ru: string;
    products_count: number;
}

export interface IFile {
    id: string;
    file: string;
    filename: string;
    created_at: string;
    updated_at: string;
}

export interface IProduct {
    id: number;

    name_uz: string;
    name_ru: string;

    caption_uz: string;
    caption_ru: string;

    category: string;

    image: IFile | string;

    price: number;
}


export interface ICategoryWithStats {
    id: string;
    name_uz: string;
    name_ru: string;
    products_count: number;

    products: IProduct[]
}



export interface IAdmin {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    fullname: string;
    is_staff: boolean;
}







export interface ILocation {
    id: string;
    latitude: number;
    longitude: number;
    address: null
}



export interface IPayment {
    id: string;
    amount: string;
    provider: string;
    status: string;
    data: unknown;
    user: IUser;

}

export interface ICart {
    id: string;
    location: ILocation;

    created_at: Date;
    phone_number: string;
    comment: string;
    status: string;
    delivery: string;
    time: Date;
    payment: IPayment;

}



export interface IUser {
    id: string;
    chat_id: number;
    name: string;
    number: string;
    tg_name: string;
    username: string;
    lang: string;
    has_order: boolean;


    orders?: IOrder[];
    current_order?: IOrder;
}





export interface IOrderItem {
    id: number;
    product: IProduct;
    count: number;
    price: number;

}




export type IOrder = {
    saving: number;
    id: string;
    order_id: number;
    user: IUser;
    products_count: number;
    promocode?: IPromocode;
    order_time: Date;
    status: string;
    price: number;
    discount_price: number;
    payment: IPayment;

    delivery: "DELIVER" | "TAKEAWAY"

    comment: string;

    items: IOrderItem[]
}



type IOrderArray = Array<IOrder>;


export type IPromocode<T = IOrderArray> = {
    id: string;
    name: string;
    code: string;
    measurement: "ABSOLUTE" | "PERCENT";
    amount: number;
    count: number;
    end_date: Date | null;

    min_amount: number;
    max_amount: number;

    is_limited: boolean;
    is_max_limited: boolean;


    orders: T;
}