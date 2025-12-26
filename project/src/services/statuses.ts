import api from "../api/interceptorToken";

const API_URL = "/statuses";
export const getAllStatuses = async () => {
        const response = await api.get(API_URL);
        return response.data;
};
export const postStatus = async (statusName: string) => {
        const response = await api.post(API_URL, { name: statusName });
        return response.data;
};