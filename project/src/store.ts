import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import ticketSlicer from './features/ticketsSlice'
import commentsReducer from './features/commentsSlice'
import usersReducer from './features/usersSlice'
import prioritiesReducer from './features/prioritySlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        tickets: ticketSlicer,
        comments: commentsReducer,
        users: usersReducer,
        priorities: prioritiesReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

