import { useSelector } from 'react-redux';
import { useAppDispatch, RootState } from '../store/store';
import { onCheckingInvitations, onLoadInvitations, onResponseInvitation, onUncheckingInvitations } from '../store/invitations/invitationSlice';
import { schedulerApi } from '../api/schedulerApi';
import { Invitation, InvitationStatus } from '../interfaces/storeInterfaces';
import { Alert } from 'react-native';
import { useCallback } from 'react';
import { getApiErrorMessage } from '../helpers/getApiErrorMessage';

export const useInvitationStore = () => {

    const dispatch = useAppDispatch();
    const {invitations, isLoading} = useSelector((state: RootState) => state.invitation);

    const startLoadInvitations = useCallback(async() => {
        try {
            dispatch(onCheckingInvitations());

            const {data} = await schedulerApi.get<Invitation[]>('/events/participants/invitations/me');

            dispatch(onLoadInvitations(data));

        } catch (error: unknown) {
            dispatch(onUncheckingInvitations());
            Alert.alert(getApiErrorMessage(error, 'No se pudieron cargar las invitaciones.'));
        }
    }, [dispatch]);

    const startResponseInvitation = useCallback(async(invitation: Invitation, status: InvitationStatus) => {
        try {

            const {event} = invitation;

            dispatch(onCheckingInvitations());
            await schedulerApi.post(`/events/${event?.id}/participants/replies`, {
                status,
            });

            const newInvitation = {
                ...invitation,
                status,
            };
            dispatch(onResponseInvitation(newInvitation));

        } catch (error: unknown) {
            dispatch(onUncheckingInvitations());
            Alert.alert(getApiErrorMessage(error, 'No se pudo responder la invitación.'));
        }
    }, [dispatch]);

    return {
        // datos del InvitationStore
        invitations,
        isLoading,

        // thunks del InvitationsStore
        startLoadInvitations,
        startResponseInvitation,
    };
};
