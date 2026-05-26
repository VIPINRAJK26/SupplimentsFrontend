import axiosInstance from "../../../api/axiosInstance";

export interface CreateOrderPayload {
  user: number;
  product: number;
  quantity: number;
  quantity_status: "bottle" | "loose";
  bottle_quantity: number | null;
  loose_quantity: number | null;
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