import { Dispatch } from '@reduxjs/toolkit';
import { addErrorMessage, onChecking, onLogin, onLogout } from './authSlice';

import { schedulerApi } from '../../api/schedulerApi';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserWithToken } from '../../helpers/getUserWithToken';

import { UserPropsLogin, UserPropsRegister } from '../../interfaces/payloadInterfaces';
import { UserLoginResponse, UserResponse } from '../../interfaces/userResponseInterfaces';

export const checkingAuthToken = () => {
    return async(dispatch: Dispatch) => {
        dispatch(onChecking());
        const token = await AsyncStorage.getItem('token');
        if (!token) {return dispatch(onLogout());}

        try {
            const data = await getUserWithToken(token);
            await AsyncStorage.setItem('token', data.token);
            dispatch(onLogin({name:data.name, email: data.email, id: data.id, roles: data.roles}));

        } catch (error){
            await AsyncStorage.clear();
            dispatch(onLogout());
        }
    };
};

export const startLogin = ({email, password} : UserPropsLogin) => {
    return async(dispatch: Dispatch) => {

        try {

            const {data: {token}} = await schedulerApi.post<UserLoginResponse>('/auth/login', {
                email,
                password,
            });
            dispatch(onChecking());
            const data = await getUserWithToken(token);

            //Guardar el token con el asyncStorage
            await AsyncStorage.setItem('token', data.token);

            dispatch(onLogin({name:data.name, email: data.email, id: data.id, roles: data.roles}));
        } catch (error: any) {
            await AsyncStorage.clear();
            dispatch(addErrorMessage(error.response.data.message));
        }

    };
};


export const startRegister = ({name, email, password}: UserPropsRegister) => {
    return async(dispatch: Dispatch) => {

        try {

            const {data} = await schedulerApi.post<UserResponse>('/auth/register', {
                name,
                email,
                password,
            });
            dispatch(onChecking());

            //Guardar el token con el asyncStorage
            await AsyncStorage.setItem('token', data.token);

            dispatch(onLogin({name:data.name, email: data.email, id: data.id, roles: data.roles}));

        } catch (error: any) {
            await AsyncStorage.clear();
            dispatch(addErrorMessage(error.response.data.message));
        }
    };
};

export const startLogout = () => {
    return async(dispatch: Dispatch) => {
        await AsyncStorage.clear();
        dispatch(onLogout());
    };
};


