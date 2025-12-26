import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getAllPriorities, postPriority } from "../services/priorities";
import type { Priority } from "../models/priority";

export interface PriorityInput {
    name: string;
}

interface PrioritiesState {
    list: Priority[];
    loading: boolean;
    error: string | null;
}

const initialState: PrioritiesState = {
    list: [],
    loading: false,
    error: null,
};

const extractErrorMessage = (error: any, fallbackMessage: string): string => {
    return error.response?.data?.message || fallbackMessage;
};

export const fetchAllPriorities = createAsyncThunk<Priority[], void, { rejectValue: string }>(
    "priorities/fetchAll",
    async (_, thunkAPI) => {
        try {
            return await getAllPriorities();
        } catch (error: any) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error, "נכשל בטעינת עדיפויות"));
        }
    }
);

export const addPriorityAsync = createAsyncThunk<Priority, PriorityInput, { rejectValue: string }>(
    "priorities/add",
    async (newPriority, thunkAPI) => {
        try {
            return await postPriority(newPriority);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error, "הוספת עדיפות נכשלה"));
        }
    }
);

const prioritiesSlice = createSlice({
    name: "priorities",
    initialState,
    reducers: {
        clearPrioritiesError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPriorities.fulfilled, (state, action: PayloadAction<Priority[]>) => {
                state.list = action.payload;
            })
            .addCase(addPriorityAsync.fulfilled, (state, action: PayloadAction<Priority>) => {
                state.list.push(action.payload);
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
                    state.error = action.payload || "התרחשה שגיאה בניהול עדיפויות";
                }
            );
    },
});

export const { clearPrioritiesError } = prioritiesSlice.actions;
export default prioritiesSlice.reducer;