
import api from "../api/interceptorToken";

const API_URL = "/tickets";

export const getListTickets = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

export const postTicket = async (subject: string, description: string) => {
    const response = await api.post(API_URL, { subject, description });
    return response.data;
};

export const deleteTicket = async (id: number) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
};

export const getTicketById = async (id: number) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
};

export const updateStatusTicket = async (id: number, data: { status_id: number }) => {
    const response = await api.patch(`${API_URL}/${id}`, data);
    return response.data;
};
export const patchTicket = async (id: number, data: { assigned_to?: number; priority_id?: number }) => {
const response = await api.patch(`${API_URL}/${id}`, data);    return response.data;
};
