import { schedulerApi } from '../../api/schedulerApi';
import { getApiErrorMessage } from '../../helpers/getApiErrorMessage';
import {
    TodoFilters,
    TodoPriority,
    TodosResponse,
} from '../../interfaces/storeInterfaces';
import type { AppDispatch, RootState } from '../store';
import {
    onCheckingTodos,
    onFinishSavingTodo,
    onLoadTodos,
    onSavingTodo,
    onSetTodoFilters,
    onTodosFailure,
} from './todosSlice';

export interface TodoMutationInput {
    description: string;
    priority: TodoPriority;
    dueAt: string | null;
    assigneeId: string | null;
}

const toQueryParams = (filters: TodoFilters) => {
    const params: Record<string, string | number | boolean> = {
        page: filters.page,
        limit: filters.limit,
    };

    if (filters.status !== 'all') {
        params.done = filters.status === 'completed';
    }
    if (filters.priority !== 'all') {
        params.priority = filters.priority;
    }
    if (filters.assignedToMe) {
        params.assignedToMe = true;
    }
    if (filters.overdue) {
        params.overdue = true;
    }
    if (filters.search.trim()) {
        params.search = filters.search.trim();
    }

    return params;
};

export const startLoadTodos = (
    idEvent: string,
    nextFilters?: Partial<TodoFilters>,
    silent = false,
) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const filters = {...getState().todos.filters, ...nextFilters};
        dispatch(onSetTodoFilters(filters));
        if (!silent) {
            dispatch(onCheckingTodos());
        }

        try {
            const {data} = await schedulerApi.get<TodosResponse>(
                `/events/${idEvent}/todos`,
                {params: toQueryParams(filters)},
            );
            dispatch(onLoadTodos(data));
            return true;
        } catch (error: unknown) {
            dispatch(onTodosFailure(getApiErrorMessage(error, 'No se pudieron cargar las tareas.')));
            return false;
        }
    };
};

export const startAddTodo = (idEvent: string, input: TodoMutationInput) => {
    return async (dispatch: AppDispatch) => {
        dispatch(onSavingTodo());
        try {
            await schedulerApi.post(`/events/${idEvent}/todos`, input);
            await dispatch(startLoadTodos(idEvent, {page: 1}, true));
            dispatch(onFinishSavingTodo());
            return true;
        } catch (error: unknown) {
            dispatch(onTodosFailure(getApiErrorMessage(error, 'No se pudo crear la tarea.')));
            return false;
        }
    };
};

export const startUpdateTodo = (
    idEvent: string,
    idTodo: string,
    input: TodoMutationInput,
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(onSavingTodo());
        try {
            await schedulerApi.patch(`/events/${idEvent}/todos/${idTodo}`, input);
            await dispatch(startLoadTodos(idEvent, undefined, true));
            dispatch(onFinishSavingTodo());
            return true;
        } catch (error: unknown) {
            dispatch(onTodosFailure(getApiErrorMessage(error, 'No se pudo actualizar la tarea.')));
            return false;
        }
    };
};

export const startSetTodoCompletion = (
    idEvent: string,
    idTodo: string,
    done: boolean,
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(onSavingTodo());
        try {
            await schedulerApi.patch(
                `/events/${idEvent}/todos/${idTodo}/completion`,
                {done},
            );
            await dispatch(startLoadTodos(idEvent, undefined, true));
            dispatch(onFinishSavingTodo());
            return true;
        } catch (error: unknown) {
            dispatch(onTodosFailure(getApiErrorMessage(error, 'No se pudo cambiar el estado de la tarea.')));
            return false;
        }
    };
};

export const startDeleteTodo = (idEvent: string, idTodo: string) => {
    return async (dispatch: AppDispatch) => {
        dispatch(onSavingTodo());
        try {
            await schedulerApi.delete(`/events/${idEvent}/todos/${idTodo}`);
            await dispatch(startLoadTodos(idEvent, undefined, true));
            dispatch(onFinishSavingTodo());
            return true;
        } catch (error: unknown) {
            dispatch(onTodosFailure(getApiErrorMessage(error, 'No se pudo eliminar la tarea.')));
            return false;
        }
    };
};
