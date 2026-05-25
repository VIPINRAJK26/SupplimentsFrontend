import axiosInstance from "../../../api/axiosInstance";

const login = async (username: string, password: string) => {
    const response = await axiosInstance.post('/login/', { username, password });
    return response.data;
}

export default login;