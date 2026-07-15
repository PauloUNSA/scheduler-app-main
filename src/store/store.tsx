import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth/authSlice';
import { useDispatch } from 'react-redux';
import { calendarSlice } from './calendar/calendarSlice';
import { todosSlice } from './todos/todosSlice';
import { invitationSlice } from './invitations/invitationSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        calendar: calendarSlice.reducer,
        todos: todosSlice.reducer,
        invitation: invitationSlice.reducer,
    },
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch;

