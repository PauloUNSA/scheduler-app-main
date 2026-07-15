import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserStore } from '../../interfaces/storeInterfaces';

export interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated'
    user: UserStore,
    errorMessage: string[],
}

const initialUser: UserStore = {
    name: '',
    id: '',
    email: '',
    roles: [],
};

const initialState: AuthState = {
    status: 'not-authenticated',
    user: initialUser,
    errorMessage: [],
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        onLogin: (state, {payload} : {payload: UserStore}) => {
            state.user = payload;
            state.errorMessage = [];
            state.status = 'authenticated';
        },
        onLogout: (state) => {
            state.user = initialUser;
            state.errorMessage = [];
            state.status = 'not-authenticated';
        },
        onChecking: (state) => {
            state.status = 'checking';
            state.user = initialUser;
            state.errorMessage = [];
        },
        addErrorMessage: (state, {payload}: PayloadAction<string[]> ) => {
            state.user = initialUser;
            state.status = 'not-authenticated';
            state.errorMessage = payload;
        },
        clearErrorMessage: (state) => {
            state.errorMessage = [];
            state.status = 'not-authenticated';
        },
    },
});


export const {onLogin, onLogout, onChecking, addErrorMessage, clearErrorMessage} = authSlice.actions;

