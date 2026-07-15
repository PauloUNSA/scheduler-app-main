import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { useAppDispatch } from '../store/store';
import { startLogout } from '../store/auth/thunks';
import { onLogoutCalendar } from '../store/calendar/calendarSlice';
import { DrawerItem } from '@react-navigation/drawer';

interface Props {
    title: string,
    icon: string,
    component?: string,
    focused: boolean
}

export const MenuItem = ({title, icon, component = '', focused}: Props) => {

    const dispatch = useAppDispatch();
    const {navigate} = useNavigation();

    return (
        <View style={{justifyContent: 'center'}}>
            <DrawerItem
                style={{
                    zIndex: 20,
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    left: -10,
                    width: '100%',
                }}
                focused = {focused}
                activeBackgroundColor="#104f7c"
                label={title}
                pressColor="#104f7c"
                onPress={() => {
                    if (component) {
                        navigate(component as never);
                    } else {
                        dispatch(startLogout());
                        dispatch(onLogoutCalendar());
                    }
                }}
                icon={() => <Icon name={icon} size={40} color={'#d9d9d9'}/>}
                labelStyle={{
                    fontSize: 19,
                    left: -18,
                    fontWeight: '500',
                    color: '#d9d9d9',
                }}
            />
            <Icon
                name="chevron-forward-outline"
                size={35}
                color={'#e9e9e9'}
                style={{
                    position: 'absolute',
                    right: 15,
                    pointerEvents: 'none',
                    zIndex: 10,
                }}
            />
        </View>
    );
};
