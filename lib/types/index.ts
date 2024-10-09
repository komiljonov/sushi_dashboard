
export interface ICategory {
    id: string;
    name_uz: string;
    name_ru: string;
    products_count: number;
    today_visits: number;
    active: boolean;
    children_count: number;

    content_type: "CATEGORY" | "PRODUCT";

    parent: string;

    children: ICategory[]

}

export interface IFile {
    id: string;
    file: string;
    filename: string;
    created_at: string;
    updated_at: string;
}

export interface IProduct {
    id: string;

    name_uz: string;
    name_ru: string;

    caption_uz: string;
    caption_ru: string;

    category: string;

    image?: IFile | string;

    price: number;
    sale_count: number;
}


export interface ICategoryWithStats extends ICategory {
    products: IProduct[];

    visits: {
        date: string;
        visits: number;
    }[];

    average_visit_time: {
        hour: string;
        visit_count: number;
    }[];
}



export interface IAdmin {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    fullname: string;
    is_staff: boolean;
    filial: string;
    role: string;
}







export interface ILocation {
    id: string;
    latitude: number;
    longitude: number;
    address: null
}



export interface IPayment {
    id: string;
    amount: number;
    provider: string;
    status: string;
    data: unknown;
    user: IUser;
    order?: IOrder;

    created_at: string;

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


    carts?: IOrder[];
    current_order?: IOrder;
}





export interface IOrderItem {
    id: number;
    product?: IProduct;
    count: number;
    price: number;

}




export type IOrder = {
    saving: number;
    id: string;
    order_id?: number;
    user: IUser;
    phone_number?: string;
    products_count?: number;
    promocode?: IPromocode;
    order_time: Date;
    time?: Date | null;
    status: string;
    price?: number;
    discount_price: number;
    payment?: IPayment;
    filial?: IFilial;

    location?: ILocation;

    delivery: "DELIVER" | "TAKEAWAY"

    comment: string;

    taxi: ITaxi | null | undefined;

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
    end_date: Date | string | null;

    min_amount: number;
    max_amount: number;

    is_limited: boolean;
    is_max_limited: boolean;


    orders: T;
}






export interface IFilial {
    id: string;
    name_uz: string;
    name_ru: string;

    location: ILocation;
}





export interface ITaxi {
    mark: string;
    car_model: string;
    car_color: string;
    car_number: string;
    total_sum: number;
    driver_phone_number: string;
}





export interface DeliveryPrice {
    address: string;
    cost: number;
}