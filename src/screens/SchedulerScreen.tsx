import React from 'react';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Alert, Dimensions, View } from 'react-native';

import { FloatButton } from '../components/FloatButton';

import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store/store';
import { startDeleteEvent } from '../store/calendar/thunks';

import { onDeleteActiveEvent } from '../store/calendar/calendarSlice';
import { ViewAgenda } from '../components/ViewAgenda';

const {width: windowWidth} = Dimensions.get('window');

interface Props extends DrawerScreenProps<any, any>{}
export const SchedulerScreen = ({navigation}: Props) => {

    const dispatch = useAppDispatch();
    const {events, activeEvent} = useSelector((state: RootState) => state.calendar);

    const navigateToAddEvent = () => {
        navigation.navigate('CreateEventScreen');
    };
    const navigateToTodoScreen = () => {
        navigation.navigate('TodosScreen');
    };

    const deleteEvent = () => {
        Alert.alert('Eliminar evento', '¿Está seguro de eliminar este evento?', [
            {
                text: 'Cancel',
                onPress: () => dispatch(onDeleteActiveEvent()),
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => dispatch(startDeleteEvent(activeEvent!)),
                style: 'default',
            },
        ]);
    };

    return (
        <View style={{
            flex:1,
        }}>

            <ViewAgenda events={events}/>

            <FloatButton style={{position: 'absolute', bottom: 35, right: 35}} icon="add-outline" color="#202020" fn={navigateToAddEvent}/>

            {
                activeEvent && (
                    <>
                        <FloatButton style={{position: 'absolute', bottom: 35, left: 35}} icon="trash-outline" color="#ff2929" fn={deleteEvent}/>
                        <FloatButton style={{position: 'absolute', bottom: 35, left: (windowWidth / 2) - 22.5}} icon="checkmark-done-outline" color="#228bec" fn={navigateToTodoScreen}/>
                    </>
                )
            }

        </View>
    );
};
