import axiosInstance from "../../../api/axiosInstance";

const getProducts = async () => {
    const response = await axiosInstance.get('/products');
    return response.data;
}

export default getProducts;