import axiosInstance from "../../../api/axiosInstance";

export interface CreateOrderPayload {
  user: number;
  product: number;
  quantity: number;
  status: "credit" | "paid";
  price: number;
  credit_price: number | null;
}

export const getOrders = async () => {
  const { data } = await axiosInstance.get("/orders");
  return data;
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const { data } = await axiosInstance.post("/orders/", payload);

  return data;
};

export const updateOrder = async (id: number, payload: any) => {
  const { data } = await axiosInstance.patch(`/orders/${id}/`, payload);

  return data;
};