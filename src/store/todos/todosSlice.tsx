import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Todo } from '../../interfaces/storeInterfaces';

interface TodosState {
    isLoading: boolean,
    todos: Todo[],
    activeTodo?: Todo,
}

const initialState: TodosState = {
    isLoading: true,
    todos: [],
    activeTodo: undefined,
};

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        onLoadTodos: (state, {payload}: PayloadAction<Todo[]>) => {
            state.isLoading = false;
            state.todos = payload;
        },
        onAddTodo: (state, {payload}: PayloadAction<Todo>) => {
            state.todos.push(payload);
        },
        onUpdateTodo: (state, {payload}: PayloadAction<Todo>) => {
            state.todos = state.todos.map((todo) => {
                if (todo.id === payload.id) {
                    return payload;
                }
                return todo;
            });
        },
        onDeleteTodo: (state, {payload}: PayloadAction<string>) => {
            state.todos = state.todos.filter(todo => todo.id !== payload);
        },
        onSetActiveTodo: (state, {payload}: PayloadAction<Todo>) => {
            state.activeTodo = payload;
        },
        onCheckingTodos: (state) => {
            state.isLoading = true;
        },
        onClearTodos: (state) => {
            state.isLoading = true;
            state.todos = [];
            state.activeTodo = undefined;
        },
        onUncheckingTodos: (state) => {
            state.isLoading = false;
        },
    },
});


export const {
    onLoadTodos,
    onAddTodo,
    onUpdateTodo,
    onDeleteTodo,
    onSetActiveTodo,
    onCheckingTodos,
    onClearTodos,
    onUncheckingTodos,
} = todosSlice.actions;
