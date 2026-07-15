import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '../../interfaces/storeInterfaces';

export interface CalendarState {
    isLoading: boolean,
    events: Event[],
    activeEvent: Event | null,
}

const initialState: CalendarState = {
    isLoading: true,
    events: [],
    activeEvent: null,
};


export const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        onLoadEvents: (state, {payload = []}: PayloadAction<Event[]>) => {
            state.isLoading = false;
            state.events = payload;
        },

        onSetActiveEvent: (state, {payload}: PayloadAction<Event>) => {
            state.activeEvent = payload;
        },

        onAddNewEvent: (state, {payload}: PayloadAction<Event>) => {
            state.events.push(payload);
            state.isLoading = false;
            state.activeEvent = null;
        },

        onUpdateEvent: (state, {payload}: PayloadAction<Event>) => {
            state.isLoading = false;
            state.events = state.events.map(event => {
                if (event.id === payload.id) {
                    return payload;
                }
                return event;
            });
        },

        onDeleteEvent: (state, {payload}: PayloadAction<Event>) => {
            state.events = state.events.filter(event => event.id !== payload.id);
            state.activeEvent = null;
            state.isLoading = false;
        },

        onLogoutCalendar: (state) => {
            state.isLoading = true;
            state.events = [];
            state.activeEvent = null;
        },

        onDeleteActiveEvent: (state) => {
            state.activeEvent = null;
        },

        onCheckingEvents: (state) => {
            state.isLoading = true;
        },
        onUncheckingEvents: (state) => {
            state.isLoading = false;
        },
    },
});

export const {
    onLoadEvents,
    onSetActiveEvent,
    onAddNewEvent,
    onUpdateEvent,
    onDeleteEvent,
    onLogoutCalendar,
    onDeleteActiveEvent,
    onCheckingEvents,
    onUncheckingEvents,
} = calendarSlice.actions;
