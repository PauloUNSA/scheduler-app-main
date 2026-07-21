import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
    Todo,
    TodoFilters,
    TodoPagination,
    TodoSummary,
    TodosResponse,
} from '../../interfaces/storeInterfaces';

export interface TodosState {
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    todos: Todo[];
    activeTodo?: Todo;
    filters: TodoFilters;
    meta: TodoPagination;
    summary: TodoSummary;
}

const initialFilters: TodoFilters = {
    status: 'all',
    priority: 'all',
    assignedToMe: false,
    overdue: false,
    search: '',
    page: 1,
    limit: 20,
};

const initialState: TodosState = {
    isLoading: true,
    isSaving: false,
    error: null,
    todos: [],
    activeTodo: undefined,
    filters: initialFilters,
    meta: {page: 1, limit: 20, total: 0, totalPages: 0},
    summary: {total: 0, completed: 0, pending: 0, overdue: 0},
};

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        onLoadTodos: (state, {payload}: PayloadAction<TodosResponse>) => {
            state.isLoading = false;
            state.error = null;
            state.todos = payload.items;
            state.meta = payload.meta;
            state.summary = payload.summary;
        },
        onSetTodoFilters: (state, {payload}: PayloadAction<Partial<TodoFilters>>) => {
            state.filters = {...state.filters, ...payload};
        },
        onSetActiveTodo: (state, {payload}: PayloadAction<Todo | undefined>) => {
            state.activeTodo = payload;
        },
        onCheckingTodos: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        onSavingTodo: (state) => {
            state.isSaving = true;
            state.error = null;
        },
        onFinishSavingTodo: (state) => {
            state.isSaving = false;
        },
        onTodosFailure: (state, {payload}: PayloadAction<string>) => {
            state.isLoading = false;
            state.isSaving = false;
            state.error = payload;
        },
        onClearTodos: (state) => {
            Object.assign(state, initialState);
        },
    },
});

export const {
    onLoadTodos,
    onSetTodoFilters,
    onSetActiveTodo,
    onCheckingTodos,
    onSavingTodo,
    onFinishSavingTodo,
    onTodosFailure,
    onClearTodos,
} = todosSlice.actions;
