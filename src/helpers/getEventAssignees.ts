import { Event, EventParticipant, UserStore } from '../interfaces/storeInterfaces';

const isParticipant = (
    participant: EventParticipant | UserStore,
): participant is EventParticipant => 'user' in participant;

export const getEventAssignees = (event: Event, currentUser: UserStore) => {
    const candidates: UserStore[] = [];

    if (event.user) {
        candidates.push(event.user);
    } else {
        candidates.push(currentUser);
    }

    event.participants.forEach((participant) => {
        if (isParticipant(participant)) {
            if (participant.status === 'accepted') {
                candidates.push(participant.user);
            }
            return;
        }
        candidates.push(participant);
    });

    return candidates.filter(
        (candidate, index) => candidates.findIndex(({id}) => id === candidate.id) === index,
    );
};
