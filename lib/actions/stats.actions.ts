import { request } from "../api";

export const fetchOrderLocations = async ({ from, to }: { from: string; to: string }) => {
  const res = await request.get(`/locations`, { params: { from, to } });
  return res.data;
};