import { Dispatch } from '@reduxjs/toolkit';
import { Event, Todo } from '../../interfaces/storeInterfaces';
import { onAddTodo, onCheckingTodos, onDeleteTodo, onLoadTodos, onUncheckingTodos, onUpdateTodo } from './todosSlice';
import { schedulerApi } from '../../api/schedulerApi';
import { Alert } from 'react-native';

interface ResponseTodo {
    id: string,
    description: string,
    done: boolean,
    event: Event,
}

export const startLoadTodos = (id: string) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(onCheckingTodos());
            const {data} = await schedulerApi.get<Event>(`/events/${id}`);
            dispatch(onLoadTodos(data.todos));

        } catch (error: any) {
            console.log(error);
            dispatch(onUncheckingTodos());
            Alert.alert(error.response.data.message);
        }
    };
};

export const startAddTodo = (description: string, done: boolean, idEvent: string) => {
    return async(dispatch: Dispatch) => {
        try {
            const {data} = await schedulerApi.post<ResponseTodo>(`/events/${idEvent}/todos`, {
                description,
                done,
            });
            dispatch(onAddTodo({
                id: data.id,
                description: data.description,
                done: data.done,
            }));

        } catch (error: any) {
            console.log(error);
            dispatch(onUncheckingTodos());
            Alert.alert(error.response.data.message);
        }
    };
};

export const startDeleteTodo = (idEvent: string, idTodo: string) => {
    return async(dispatch: Dispatch) => {
        try {
            await schedulerApi.delete(`/events/${idEvent}/todos/${idTodo}`);
            dispatch(onDeleteTodo(idTodo));
        } catch (error: any) {
            console.log(error);
            dispatch(onUncheckingTodos());
            Alert.alert(error.response.data.message);
        }
    };
};

export const startUpdateTodo = (idEvent: string, todo: Todo) => {
    return async(dispatch: Dispatch) => {
        try {
            const {data} = await schedulerApi.patch<Todo>(`/events/${idEvent}/todos/${todo.id}`, {
                description: todo.description,
                done: todo.done,
            });
            dispatch(onUpdateTodo(data));
        } catch (error: any) {
            console.log(error);
            dispatch(onUncheckingTodos());
            Alert.alert(error.response.data.message);
        }
    };
};

