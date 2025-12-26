import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Ticket } from "../models/tickets";
import { deleteTicket, getListTickets, getTicketById, patchTicket, postTicket, updateStatusTicket } from "../services/ticketApi";

interface UpdateStatusParams {
    id: number;
    status_id: number;
    priority_id?: number;
}

interface TicketsState {
    list: Ticket[];
    loading: boolean;
    error: string | null;
}

const initialState: TicketsState = {
    list: [],
    loading: false,
    error: null,
};

const extractErrorMessage = (error: any, fallbackMessage: string): string => {
    return error.response?.data?.message || fallbackMessage;
};

export const fetchAllTickets = createAsyncThunk<Ticket[], void, { rejectValue: string }>(
    "tickets/fetchTickets",
    async (_, thunkAPI) => {
        try {
            return await getListTickets();
        } catch (error: any) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error, "נכשלה טעינת הפניות"));
        }
    }
);

export const fetchTicketByID = createAsyncThunk<Ticket, number, { rejectValue: string }>(
    "tickets/fetchTicketsByID",
    async (id, thunkAPI) => {
        try {
            return await getTicketById(id);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error, "לא ניתן למצוא את הפניה המבוקשת"));
        }
    }
);

export const deleteATicket = createAsyncThunk<number, number, { rejectValue: string }>(
    "tickets/deleteTicket",
    async (id, thunkAPI) => {
        try {
            await deleteTicket(id);
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error, "לא ניתן למחוק את הפניה המבוקשת"));
        }
    }
);

export const postTicketAsync = createAsyncThunk<Ticket, { subject: string; description: string }, { rejectValue: string }>(
    "tickets/postTicket",
    async (newTicket, thunkAPI) => {
        try {
            return await postTicket(newTicket.subject, newTicket.description);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error, "שגיאה ביצירת הפנייה"));
        }
    }
);

export const updateStatus = createAsyncThunk<Ticket, UpdateStatusParams, { rejectValue: string }>(
    "tickets/updateStatus",
    async ({ id, status_id }, thunkAPI) => {
        try {
            return await updateStatusTicket(id, { status_id });
        } catch (error: any) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error, "עדכון הסטטוס נכשל"));
        }
    }
);

export const patchTicketAgent = createAsyncThunk<Ticket, { id: number; assigned_to: number }, { rejectValue: string }>(
    "tickets/patchTicketAgent",
    async ({ id, assigned_to }, thunkAPI) => {
        try {
            return await patchTicket(id, { assigned_to });
        } catch (error: any) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error, "עדכון הסוכן נכשל"));
        }
    }
);

export const updatePriority = createAsyncThunk<Ticket, { id: number; priority_id: number }, { rejectValue: string }>(
    "tickets/updatePriority",
    async ({ id, priority_id }, thunkAPI) => {
        try {
            return await patchTicket(id, { priority_id });
        } catch (error: any) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error, "עדכון העדיפות נכשל"));
        }
    }
);

const ticketsSlice = createSlice({
    name: "tickets",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        sortTickets: (state, action: PayloadAction<'newest' | 'oldest'>) => {
            state.list.sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : (a.id || 0);
                const dateB = b.created_at ? new Date(b.created_at).getTime() : (b.id || 0);

                if (action.payload === 'newest') {
                    return dateB - dateA; 
                } else {
                    return dateA - dateB; 
                }
            });
        },
        resetTicketsState: (state) => {
            state.list = []; 
            state.loading = false; 
            state.error = null;    
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTickets.fulfilled, (state, action: PayloadAction<Ticket[]>) => {
                state.list = action.payload;
            })
            .addCase(fetchTicketByID.fulfilled, (state, action: PayloadAction<Ticket>) => {
                state.list = [action.payload];
            })
            .addCase(postTicketAsync.fulfilled, (state, action: PayloadAction<Ticket>) => {
                state.list.push(action.payload);
            })
            .addCase(deleteATicket.fulfilled, (state, action: PayloadAction<number>) => {
                state.list = state.list.filter(ticket => ticket.id !== action.payload);
            })
            .addCase(updateStatus.fulfilled, (state, action: PayloadAction<Ticket>) => {
                const index = state.list.findIndex(ticket => ticket.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(patchTicketAgent.fulfilled, (state, action: PayloadAction<Ticket>) => {
                const index = state.list.findIndex(ticket => ticket.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(updatePriority.fulfilled, (state, action: PayloadAction<Ticket>) => {
                const index = state.list.findIndex(ticket => ticket.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
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

export const { clearError, sortTickets, resetTicketsState } = ticketsSlice.actions;
export default ticketsSlice.reducer;