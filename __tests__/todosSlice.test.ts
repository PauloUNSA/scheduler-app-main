import {Todo, TodosResponse} from '../src/interfaces/storeInterfaces';
import {describe, expect, it} from '@jest/globals';
import {
    onLoadTodos,
    onSetTodoFilters,
    onTodosFailure,
    todosSlice,
} from '../src/store/todos/todosSlice';

const todo: Todo = {
    id: '7c430fee-c3e8-47f9-8ba0-3194472d4057',
    description: 'Preparar la demostración',
    done: false,
    priority: 'high',
    dueAt: '2026-07-22T15:00:00.000Z',
    assignee: null,
    createdAt: '2026-07-21T15:00:00.000Z',
    updatedAt: '2026-07-21T15:00:00.000Z',
};

const response: TodosResponse = {
    items: [todo],
    meta: {page: 1, limit: 20, total: 1, totalPages: 1},
    summary: {total: 1, completed: 0, pending: 1, overdue: 0},
};

describe('todosSlice', () => {
    it('stores a paginated response and summary', () => {
        const state = todosSlice.reducer(undefined, onLoadTodos(response));

        expect(state.todos).toEqual([todo]);
        expect(state.summary.pending).toBe(1);
        expect(state.meta.totalPages).toBe(1);
        expect(state.isLoading).toBe(false);
    });

    it('merges filters without discarding the remaining selection', () => {
        const state = todosSlice.reducer(
            undefined,
            onSetTodoFilters({priority: 'high', assignedToMe: true}),
        );

        expect(state.filters.priority).toBe('high');
        expect(state.filters.assignedToMe).toBe(true);
        expect(state.filters.status).toBe('all');
    });

    it('exposes a recoverable request error', () => {
        const state = todosSlice.reducer(undefined, onTodosFailure('Sin conexión'));

        expect(state.error).toBe('Sin conexión');
        expect(state.isLoading).toBe(false);
        expect(state.isSaving).toBe(false);
    });
});
