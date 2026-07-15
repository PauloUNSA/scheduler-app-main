import { Todo, UserStore } from './storeInterfaces';

export interface UserLoginResponse {
    email: string;
    id:    string;
    roles: string[];
    token: string;
}
export interface UserResponse {
    name:  string;
    email: string;
    id:    string;
    roles: string[];
    token: string;
}

export interface EventResponse {
    id:          string;
    title:       string;
    description: string;
    start:       string;
    end:         string;
    user?: UserStore;
    participants: UserStore[];
    todos:       Todo[];
}

