import { CalendarViewMode, PackedEvent, TimelineCalendar } from '@howljs/calendar-kit';
import React, { useState } from 'react';
import { Alert, Dimensions, RefreshControl, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store/store';
import { FloatButton } from '../components/FloatButton';
import { onDeleteActiveEvent } from '../store/calendar/calendarSlice';
import { startDeleteEvent, startLoadEvents, startSetActiveEvent } from '../store/calendar/thunks';
import { Event } from '../interfaces/storeInterfaces';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParams } from '../navigators/ScheduleNavigator';
import { useInvitationStore } from '../hooks/useInvitationStore';

const windowWidth = Dimensions.get('window').width;

interface Props {
    mode: CalendarViewMode
    currentDate?: string
}
export const SchedulerViewModeScreen = ({mode, currentDate}: Props) => {

    const {events, activeEvent} = useSelector((state: RootState) => state.calendar);
    const {startLoadInvitations} = useInvitationStore();

    const {navigate} = useNavigation<DrawerNavigationProp<RootStackParams>>();

    const dispatch = useAppDispatch();

    const navigateToAddEvent = () => {
        navigate('CreateEventScreen' as never);
    };

    const navigateToTodoScreen = () => {
        navigate('TodosScreen' as never);
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

    const setActiveEvent = (event: Event) => {
        dispatch(startSetActiveEvent(event));
    };

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            startLoadInvitations();
            dispatch(startLoadEvents());
            setRefreshing(false);
        }, 850);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        progressViewOffset={10}
                        progressBackgroundColor={'#3976f8'}
                        colors={['#fff']}
                    />
                }
            >
                <TimelineCalendar
                    events={events}
                    viewMode={mode}
                    locale="es"
                    initialDate={currentDate}
                    allowPinchToZoom
                    initialTimeIntervalHeight={60}
                    minTimeIntervalHeight={29}
                    maxTimeIntervalHeight={110}
                    onPressEvent={(eventItem) => {
                        const {description, end, start, todos, id, title, participants} = eventItem;
                        const newEvent: Event = {
                            id,
                            description,
                            end,
                            start,
                            todos,
                            participants,
                            title: title!,
                        };
                        setActiveEvent(newEvent);
                    }}
                    onLongPressEvent={(eventItem: PackedEvent) => {
                        const {id, start, end, description, title, todos, participants} = eventItem;
                        const event: Event = {
                            id,
                            description,
                            end,
                            start,
                            todos,
                            participants,
                            title: title!,
                        };
                        navigate('CreateEventScreen', {event});
                    }}
                />
            </ScrollView>
            <FloatButton style={{position: 'absolute', bottom: 35, right: 35}} icon="add-outline" color="#202020" fn={navigateToAddEvent}/>

            {
                activeEvent && (
                    <>
                        <FloatButton style={{position: 'absolute', bottom: 35, left: 35}} icon="trash-outline" color="#ff2929" fn={deleteEvent}/>
                        <FloatButton style={{position: 'absolute', bottom: 35, left: (windowWidth / 2) - 22.5}} icon="checkmark-done-outline" color="#228bec" fn={navigateToTodoScreen}/>
                    </>
                )
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
});
