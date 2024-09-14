



export interface ICategory {
    id: number;
    name_uz: string;
    name_ru: string;
    products_count: number;
}



export interface IProduct {
    id: number;
    name_uz: string;
    name_ru: string;
    caption_uz: string;
    caption_ru: string;

    category: string;


    image: string;
    price: number;
}


export interface ICategoryWithStats {
    id: number;
    name_uz: string;
    name_ru: string;
    products_count: number;

    most_sold_products: IProduct[]
}