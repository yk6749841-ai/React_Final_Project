import type { Priority } from "../models/priority";
import type { PriorityInput } from "../features/prioritySlice";
import api from "../api/interceptorToken";

const ENDPOINT = "/priorities";

export const getAllPriorities = async () => {
    const response = await api.get<Priority[]>(ENDPOINT);
    return response.data;
};

export const postPriority = async (newPriority: PriorityInput) => {
    const response = await api.post<Priority>(ENDPOINT, newPriority);
    return response.data;
};