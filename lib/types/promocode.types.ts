import { IProduct } from ".";

export interface IPromocodeProduct {
  product: string;
  quantity: number;
}

export interface IPromocodeProductDetails {
  product: IProduct;
  id: string;
  quantity: number;
}

export interface ICreatePromocode {
  name_uz: string;
  name_ru: string;
  code: string;
  measurement: string;
  amount: number;
  is_active: boolean;
  count: number;
  min_amount: number;
  end_date: Date | string;
  promocode_products: IPromocodeProduct[];
}
