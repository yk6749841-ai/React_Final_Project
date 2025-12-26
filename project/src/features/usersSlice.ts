import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../models/user";
import { createUser, getUserById, getUsers } from "../services/usersApi";
import type { AddAUserProps } from "../components/addUser";

interface UsersState {
    list: User[];
    loading: boolean;
    error: string | null;
}
const initialState: UsersState = {
    list: [],
    loading: false,
    error: null,
};
export const getAllUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
    "users/fetchUsers",
    async (_, thunkAPI) => {
        try {
            const response = await getUsers();
            return response;
        }
        catch (error: any) {
            const message = error.response?.data?.message || 'נכשלה טעינת המשתמשים';
            return thunkAPI.rejectWithValue(message);

        }
    }
)
export const getAUserById = createAsyncThunk<User, number, { rejectValue: string }>(
    "users/fetchUserById",
    async (id, thunkAPI) => {
        try {
            const response = await getUserById(id);
            return response;
        }
        catch (error: any) {
            const message = error.response?.data?.message || 'נכשל טעינת המשתמש';
            return thunkAPI.rejectWithValue(message);

        }
    }

)

export const postAUser = createAsyncThunk<User, AddAUserProps, { rejectValue: string }>(
    "users/postUser",
    async (userData, thunkAPI) => {
        try {
            const response = await createUser(userData);
            return response;

        }
        catch (error: any) {
            const message = error.response?.data?.message || 'נכשל הוספת המשתמש';
            return thunkAPI.rejectWithValue(message);

        }
    }

)

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'שגיאה לא ידועה';
            })

            .addCase(postAUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.list.push(action.payload);
            });
    }
})
export const { clearError} = usersSlice.actions;

export default usersSlice.reducer;

