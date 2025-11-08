import { request } from "../api";

export const fetchSigments = async () => {
  const res = await request.get(`/tulqindan_esdalik/`);
  return res.data;
};

export const createSigment = async (data: {
  name: string;
  days: number;
  min_orders: number;
  max_orders: number;
}) => {
  const res = await request.post(`/tulqindan_esdalik/`, data);
  return res.data;
};

export const deleteSigment = async (id: string) => {
  const res = await request.delete(`/tulqindan_esdalik/${id}/`);
  return res.data;
};

export const updateSigment = async (
  id: string,
  data: {
    name: string;
    days: number;
    min_orders: number;
    max_orders: number;
  }
) => {
  const res = await request.put(`/tulqindan_esdalik/${id}/`, data);
  return res.data;
};
