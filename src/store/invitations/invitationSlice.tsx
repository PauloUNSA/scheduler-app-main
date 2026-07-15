import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invitation } from '../../interfaces/storeInterfaces';

interface InvitationState {
    invitations: Invitation[],
    isLoading: boolean,
}

const initialState: InvitationState = {
    invitations: [],
    isLoading: true,
};

export const invitationSlice = createSlice({
    name: 'invitation',
    initialState,
    reducers: {
        onLoadInvitations: (state, {payload}: PayloadAction<Invitation[]>) => {
            state.invitations = payload;
            state.isLoading = false;
        },
        onResponseInvitation: (state, {payload}: PayloadAction<Invitation>) => {
            state.invitations = state.invitations.map((invitation) => {
                if (invitation.id === payload.id) {
                    return payload;
                }
                return invitation;
            });
            state.isLoading = false;
        },
        onCheckingInvitations: (state) => {
            state.isLoading = true;
        },
        onUncheckingInvitations: (state) => {
            state.isLoading = false;
        },
    },
});

export const {
    onLoadInvitations,
    onResponseInvitation,
    onCheckingInvitations,
    onUncheckingInvitations,
} = invitationSlice.actions;
