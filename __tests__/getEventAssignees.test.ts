import {getEventAssignees} from '../src/helpers/getEventAssignees';
import {Event, UserStore} from '../src/interfaces/storeInterfaces';
import {describe, expect, it} from '@jest/globals';

const owner: UserStore = {id: 'owner', name: 'Organizadora', email: 'owner@example.com', roles: ['user']};
const accepted: UserStore = {id: 'accepted', name: 'Participante', email: 'accepted@example.com', roles: ['user']};
const pending: UserStore = {id: 'pending', name: 'Pendiente', email: 'pending@example.com', roles: ['user']};

const event: Event = {
    id: 'event',
    title: 'Demo',
    description: '',
    start: '2026-07-21T15:00:00.000Z',
    end: '2026-07-21T16:00:00.000Z',
    user: owner,
    participants: [
        {id: 'invitation-a', status: 'accepted', user: accepted},
        {id: 'invitation-b', status: 'unreplied', user: pending},
    ],
    todos: [],
};

describe('getEventAssignees', () => {
    it('returns the owner and accepted participants only', () => {
        const assignees = getEventAssignees(event, accepted);

        expect(assignees.map(({id}) => id)).toEqual(['owner', 'accepted']);
    });
});
