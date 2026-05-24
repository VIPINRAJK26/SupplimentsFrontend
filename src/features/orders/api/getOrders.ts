import axiosInstance from "../../../api/axiosInstance";

const getOrders = async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
}

export default getOrders;