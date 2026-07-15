import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useEffect } from 'react';
import { AboutScreen } from '../screens/AboutScreen';
import { SchedulerScreen } from '../screens/SchedulerScreen';
import { Dimensions } from 'react-native';

import { useAppDispatch } from '../store/store';
import { CreateEventScreen } from '../screens/CreateEventScreen';
import { TodosScreen } from '../screens/TodosScreen';
import { DateData } from 'react-native-calendars';
import { SchedulerDayViewScreen } from '../screens/SchedulerDayViewScreen';
import { SchedulerWeekViewScreen } from '../screens/SchedulerWeekViewScreen';
import { Event, Invitation } from '../interfaces/storeInterfaces';
import { startLoadEvents } from '../store/calendar/thunks';
import { MenuInterno } from '../components/MenuInterno';
import { NotificationScreen } from '../screens/NotificationScreen';

const windowWitdh = Dimensions.get('window').width;

export type RootStackParams = {
    SchedulerScreen: undefined,
    AboutScreen: undefined,
    TodosScreen: undefined,
    CreateEventScreen: {event: Event},
    SchedulerDayViewScreen: {date: DateData}
    SchedulerWeekViewScreen: undefined,
    NotificationScreen: {invitation: Invitation},
}

const Drawer = createDrawerNavigator<RootStackParams>();

export const SchedulerNavigator = () => {

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(startLoadEvents());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Drawer.Navigator
            backBehavior="history"
            // initialRouteName="SchedulerScreen"
            screenOptions={{
                drawerStatusBarAnimation: 'fade',
                drawerStyle: {
                    backgroundColor: 'red',
                    width: windowWitdh * 0.8,
                },
            }}

            drawerContent={(props) => <MenuInterno {...props}/>}
        >
            <Drawer.Screen name="SchedulerScreen" component={SchedulerScreen} />
            <Drawer.Screen name="SchedulerWeekViewScreen" component={SchedulerWeekViewScreen} />
            <Drawer.Screen name="SchedulerDayViewScreen" options={{unmountOnBlur: true}} component={SchedulerDayViewScreen} />
            <Drawer.Screen name="AboutScreen" component={AboutScreen} />
            <Drawer.Screen name="CreateEventScreen" options={{unmountOnBlur: true, headerShown: false}} component={CreateEventScreen} />
            <Drawer.Screen name="TodosScreen" options={{headerShown: false, unmountOnBlur: true}} component={TodosScreen} />
            <Drawer.Screen name="NotificationScreen" options={{headerShown: false, unmountOnBlur: true}} component={NotificationScreen} />
        </Drawer.Navigator>
    );
};

