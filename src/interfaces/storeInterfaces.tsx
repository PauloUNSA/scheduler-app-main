export interface UserStore {
    email: string,
    name: string,
    id: string,
    roles: string[]
}

export type InvitationStatus = 'accepted' | 'rejected' | 'unreplied';

export interface EventParticipant {
    id: string;
    status: InvitationStatus;
    user: UserStore;
}

export interface Event {
    id:          string;
    title:       string;
    description: string;
    start:       string;
    end:         string;
    user?: UserStore;
    participants: Array<EventParticipant | UserStore>;
    color?: string,
    todos:       Todo[];
}

export interface Todo {
    id:          string;
    description: string;
    done:        boolean;
    priority:    TodoPriority;
    dueAt:       string | null;
    assignee:    UserStore | null;
    createdAt:   string;
    updatedAt:   string;
}

export type TodoPriority = 'low' | 'medium' | 'high';

export type TodoStatusFilter = 'all' | 'pending' | 'completed';

export interface TodoFilters {
    status: TodoStatusFilter;
    priority: 'all' | TodoPriority;
    assignedToMe: boolean;
    overdue: boolean;
    search: string;
    page: number;
    limit: number;
}

export interface TodoSummary {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
}

export interface TodoPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface TodosResponse {
    items: Todo[];
    meta: TodoPagination;
    summary: TodoSummary;
}

export interface Invitation {
    id: string,
    status: InvitationStatus,
    event: Event | null,
}
