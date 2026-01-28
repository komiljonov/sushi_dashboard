import { request } from "../api";

export const fetchOrderLocations = async () => {
  const res = await request.get(`/locations`);
  return res.data;
};