



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
    name: string;
    email: string;
    active: boolean;
}

