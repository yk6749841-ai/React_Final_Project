import api from "../api/interceptorToken";
import type { FormValues } from "../components/login";
import type { FormValuesRegister } from "../components/register";

const API_URL = "/auth";

export const postRegister = async (data: FormValuesRegister) => {
    const response = await api.post(API_URL + '/register', data);
    return response.data;
};

export const postLogin = async (data: FormValues) => {
    const response = await api.post(API_URL + '/login', data);
    const token = response.data.token;
    
    if (token) {
        localStorage.setItem('token', token);
    }
    
    return response.data;
};

export const getMe = async () => {
    try {
        const response = await api.get(API_URL + '/me');    
        return response.data;
    } catch (err) {
        return null; 
    }
};
