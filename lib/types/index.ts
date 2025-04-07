import { OrderItem } from "@/components/orders/create/types";

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

  children: ICategory[];
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
  count: number
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

export type IAdminRole = "ADMIN" | "OPERATOR" | "CASHIER";

export interface IAdmin {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  fullname: string;
  is_staff: boolean;
  role: IAdminRole;
}

export interface ILocation {
  id: string;
  latitude: number;
  longitude: number;
  address: null;
}

export interface IPayment {
  id: string;
  amount: number;
  provider: string;
  status: string;
  user: IUser;
  // order?: IOrder;
  order: string;
  order_id: string;

  created_at: string;
}

export type PaginatedPaymentResponse = {
  count: number; // Total number of orders
  current_page: number; // Current page number
  next: string | null; // URL for the next page
  previous: string | null; // URL for the previous page
  page_size: number; // Number of items per page
  results: IPayment[]; // List of orders for the current page
};

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
  username: string | null;
  lang: string;
  has_order: boolean;

  carts?: IOrder[];
  current_order?: IOrder;
}

export type PaginatedUserResponse = {
  count: number; // Total number of orders
  current_page: number; // Current page number
  next: string | null; // URL for the next page
  previous: string | null; // URL for the previous page
  page_size: number; // Number of items per page
  results: IUser[]; // List of orders for the current page
};

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
  iiko_order_id?: number;

  user?: IUser;

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

  delivery: "DELIVER" | "TAKEAWAY";

  comment: string;

  taxi: ITaxi | null | undefined;

  items: IOrderItem[];
};

export type IOrderList = {
  saving: number;
  id: string;
  order_id?: number;
  iiko_order_id?: number;

  user: string;

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

  delivery: "DELIVER" | "TAKEAWAY";

  comment: string;

  taxi: ITaxi | null | undefined;

  items: IOrderItem[];
};
export type PaginatedOrderResponse = {
  count: number; // Total number of orders
  current_page: number; // Current page number
  next: string | null; // URL for the next page
  previous: string | null; // URL for the previous page
  page_size: number; // Number of items per page
  results: IOrderList[]; // List of orders for the current page
};

type IOrderArray = Array<IOrderList>;

export type IPromocode<T = IOrderArray> = {
  id: string;
  name_uz: string;
  name_ru: string;
  code: string;
  measurement: "ABSOLUTE" | "PERCENT";
  amount: number;
  count: number;
  end_date: Date | string | null;

  min_amount: number;
  max_amount: number;

  is_limited: boolean;
  is_max_limited: boolean;

  total_savings: number;
  total_sold: number;

  orders: T;
};

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

export interface IPhoneNumber {
  id: string;
  number: string;
}

export interface IMainAnalytics {
  filials: {
    filial: string;
    count: number;
  }[];

  sales: number[];
  sales_year: number[];
}


export type DashboardData = {
  user_count: number;
  user_delta: number;
  orders_count: number;
  all_orders: number;
  orders_delta: number;
  today_revenue: number;
  revenue_delta_percent: number;
  active_users: number;
  active_users_delta: number;
  bot_orders: BotOrder[];
  recent_orders: RecentOrder[];
  this_month_revenue: number;
};

type BotOrder = {
  bot: string;
  order_count: number;
  success_orders: number;
  canceled_orders: number;
  today_orders: number;
  this_month_orders: number;
  today_revenue: number;
  this_month_revenue: number;
};

type RecentOrder = {
  id: string;
  order_id: number;
  iiko_order_id: string | null;
  user: IUser;
  phone_number: string | null;
  products_count: number;
  promocode: string | null;
  order_time: string;
  time: string | null;
  delivery: string;
  status: string;
  price: number;
  discount_price: number;
  saving: number;
  items: OrderItem[];
  comment: string | null;
  payment: IPayment; // replace with a specific type if you have it
  filial: IFilial; // replace with a specific type if you have it
  location: ILocation; // replace with a specific type if you have it
  taxi: ITaxi; // replace with a specific type if you have it
};