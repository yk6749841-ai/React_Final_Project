import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Comment } from "../models/comment";
import { getCommentsByPostId, postComment } from "../services/comments";

interface CommentsState {
    comments: Comment[];
    loading: boolean;
    error: string | null;
}

const initialState: CommentsState = {
    comments: [],
    loading: false,
    error: null,
};

const extractErrorMessage = (error: any, fallbackMessage: string): string => {
    return error.response?.data?.message || fallbackMessage;
};

export const getCommentsId = createAsyncThunk<Comment[], number, { rejectValue: string }>(
    "comments/fetchComments",
    async (ticketId, thunkAPI) => {
        try {
            const response = await getCommentsByPostId(ticketId);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error, "נכשלה טעינת התגובות"));
        }
    }
);

export const postAComment = createAsyncThunk<Comment, { postId: number, commentData: string }, { rejectValue: string }>(
    "comments/postComment",
    async ({ postId, commentData }, thunkAPI) => {
        try {
            const response = await postComment(postId, commentData);
            return response.data || response; 
        } catch (error: any) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error, "שגיאה בשליחת התגובה"));
        }
    }
);

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetComments: (state) => {
            state.comments = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCommentsId.fulfilled, (state, action: PayloadAction<Comment[]>) => {
                state.comments = action.payload;
            })
            .addCase(postAComment.fulfilled, (state, action: PayloadAction<Comment>) => {
                state.comments.push(action.payload); 
            })
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action: any) => {
                    state.loading = false;
                    state.error = action.payload || "התרחשה שגיאה בלתי צפויה";
                }
            );
    },
});

export const { clearError, resetComments } = commentsSlice.actions;
export default commentsSlice.reducer;