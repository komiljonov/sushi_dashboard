import { request } from "../api";

export const fetchSigments = async () => {
  const res = await request.get(`/group/`);
  return res.data;
};

export const createSigment = async (data: {
  name: string;
  last_days: number;
  range_from: number;
  range_to: number;
}) => {
  const res = await request.post(`/group/`, data);
  return res.data;
};
