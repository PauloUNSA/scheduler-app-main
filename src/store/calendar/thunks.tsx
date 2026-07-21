import { SubmitEvent } from '../../interfaces/events';
import { schedulerApi } from '../../api/schedulerApi';
import { EventResponse } from '../../interfaces/userResponseInterfaces';
import { onAddNewEvent, onCheckingEvents, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUncheckingEvents, onUpdateEvent } from './calendarSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { Event } from '../../interfaces/storeInterfaces';
import { Alert } from 'react-native';
import { getApiErrorMessage } from '../../helpers/getApiErrorMessage';

export const startSetActiveEvent = (event: Event) => {
    return (dispatch: Dispatch) => {
        dispatch(onSetActiveEvent(event));
    };
};

export const startCreateEvent = ({title, description, start, end, color, participants = []}: SubmitEvent) => {
    //Agrega correctamente a los usuarios
    return async(dispatch: Dispatch) => {

        try {
            dispatch(onCheckingEvents());
            const {data} = await schedulerApi.post<EventResponse>('/events', {
                title,
                description,
                start,
                end,
                color,
            });

            if (participants.length !== 0){
                const promises = participants.map((participant) => {
                    return schedulerApi.post(`/events/${data.id}/participants`, {idUser: participant.id});
                });
                await Promise.all(promises);
                data.participants = participants;
            }

            dispatch(onAddNewEvent(data));
            return true;

        } catch (error: unknown) {
            dispatch(onUncheckingEvents());
            Alert.alert(getApiErrorMessage(error, 'No se pudo crear el evento.'));
            return false;
        }
    };
};

export const startLoadEvents = () => {
    return async(dispatch: Dispatch) => {
        try {
            dispatch(onCheckingEvents());
            const {data} = await schedulerApi.get<Event[]>('/events/me');
            dispatch(onLoadEvents(data));
        } catch (error: unknown) {
            dispatch(onUncheckingEvents());
            Alert.alert(getApiErrorMessage(error, 'No se pudieron cargar los eventos.'));
        }
    };
};

export const startDeleteEvent = (event: Event) => {
    return async(dispatch: Dispatch) => {
        try {
            dispatch(onCheckingEvents());
            await schedulerApi.delete(`/events/${event.id}`);
            dispatch(onDeleteEvent(event));
        } catch (error: unknown) {
            dispatch(onUncheckingEvents());
            Alert.alert(getApiErrorMessage(error, 'No se pudo eliminar el evento.'));
        }
    };
};

export const startUpdateEvent = (event: Event, pastParticipants: any) => {
    return async(dispatch: Dispatch) => {
        try {

            dispatch(onCheckingEvents());

            const {id, title, description, start, end, color, participants} = event;

            const {data} = await schedulerApi.patch<Event>(`/events/${id}`, {
                title,
                description,
                start,
                end,
                color,
            });

            if (participants.length !== 0){
                const newParticipants = participants.filter((participant) => !pastParticipants.some((pastParticipant: any) => (pastParticipant?.user?.id ?? pastParticipant.id) === participant.id));
                const promises = newParticipants.map((participant) => {
                    return schedulerApi.post(`/events/${data.id}/participants`, {idUser: participant.id});
                });
                await Promise.all(promises);
                data.participants = participants;
            }
            dispatch(onUpdateEvent(data));
            return true;
        } catch (error: unknown) {
            dispatch(onUncheckingEvents());
            Alert.alert(getApiErrorMessage(error, 'No se pudo actualizar el evento.'));
            return false;
        }
    };
};
