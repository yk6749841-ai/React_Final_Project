import api from "../api/interceptorToken";
const API_URL = "/tickets";
export const getCommentsByPostId = async (postId: number) => {        
        const response = await api.get(`${API_URL}/${postId}/comments`);
        return response.data;
};
export const postComment = async (postId: number, commentData: string) => {        
        const response = await api.post(`${API_URL}/${postId}/comments`,{content: commentData});
        return response.data;
};
