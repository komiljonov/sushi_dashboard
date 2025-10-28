import { request } from "../api";
import { ICreatePromocode } from "../types/promocode.types";

export const createPromocode = async (data: ICreatePromocode) => {
  const res = await request.post("/promocodes/", data);
  return res.data;
};
