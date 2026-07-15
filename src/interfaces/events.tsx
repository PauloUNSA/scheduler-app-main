import { UserStore } from './storeInterfaces';

export interface SubmitEvent {
    title: string,
    description: string,
    start: string,
    end: string,
    color: string,
    participants: UserStore[]
}
