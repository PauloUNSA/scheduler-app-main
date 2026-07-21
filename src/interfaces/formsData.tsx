export interface LoginFormData {
    email: string,
    password: string,
}

export interface RegisterFormData {
    name: string,
    email: string,
    password: string,
}

import { TodoPriority } from './storeInterfaces';

export interface TodoSubmit {
    description: string,
    priority: TodoPriority,
    dueAt: string | null,
    assigneeId: string | null,
}
