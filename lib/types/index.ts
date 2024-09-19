



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
    id: number;
    name_uz: string;
    name_ru: string;
    products_count: number;

    products: IProduct[]
}



export interface IUser {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    fullname: string;
    is_staff: boolean;
}



export interface IPromocode {
    id: string
    name: string
    code: string
    measurement: "ABSOLUTE" | "PERCENT"
    amount: number
    count: number
    end_date: Date | null
    min_amount: number
    max_amount: number

    is_limited: boolean;
    is_max_limited: boolean
}