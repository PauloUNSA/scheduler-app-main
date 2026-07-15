import { Event } from './storeInterfaces';

export interface Notification {
    id: string,
    status: string,
    event: Event
}
