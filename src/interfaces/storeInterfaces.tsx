export interface UserStore {
    email: string,
    name: string,
    id: string,
    roles: string[]
}


export interface Event {
    id:          string;
    title:       string;
    description: string;
    start:       string;
    end:         string;
    user?: UserStore;
    participants: UserStore[];
    color?: string,
    todos:       Todo[];
}

export interface Todo {
    id:          string;
    description: string;
    done:        boolean;
}

export type InvitationStatus = 'accepted' | 'rejected' | 'unreplied';

export interface Invitation {
    id: string,
    status: InvitationStatus,
    event: Event | null,
}
