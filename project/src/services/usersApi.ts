import api from "../api/interceptorToken";
import type { AddAUserProps } from "../components/addUser";
const API_URL = "/users";

export const getUsers = async () => {        const response = await api.get(API_URL);
        return response.data;
};

export const getUserById = async (id: number) => {
        const response = await api.get(`${API_URL}/${id}`);
        return response.data;
};

export const createUser = async (userData: AddAUserProps) => {
        const response = await api.post(API_URL, userData);
        return response.data;
};
