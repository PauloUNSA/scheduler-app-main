import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAppDispatch, RootState } from '../store/store';
import { startSetActiveEvent } from '../store/calendar/thunks';
import { Event } from '../interfaces/storeInterfaces';
import { useNavigation } from '@react-navigation/native';
import { getFormatHourTime } from '../helpers/getFormatHourTime';
import { useSelector } from 'react-redux';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParams } from '../navigators/ScheduleNavigator';

interface Props {
    event: Event,
}

export const DateDataItem = ({event}: Props) => {

    const dispatch = useAppDispatch();
    const {navigate} = useNavigation<DrawerNavigationProp<RootStackParams>>();
    const {user: currentUser} = useSelector((state: RootState) => state.auth);

    const user = event?.user ?? currentUser;

    const setActiveEvent = () => {
        dispatch(startSetActiveEvent(event));
    };

    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.container} onPress={setActiveEvent} onLongPress={() => navigate('CreateEventScreen', {event})}>
            <View style={{gap: 3}}>
                <Text style={styles.hour} numberOfLines={1}>
                    {`${getFormatHourTime(event.start)} - ${getFormatHourTime(event.end)}`}
                </Text>
                <Text style={{...styles.title, width: 185}} numberOfLines={1}>
                    {event.title}
                </Text>
                <Text numberOfLines={2} style={{...styles.description, width: 130}}>
                    {event.description}
                </Text>
            </View>
            <View style={{...styles.circle, backgroundColor: event.color}}>
                <Text style={{fontWeight: '600', fontSize: 25}}>
                    {user.name[0].toUpperCase()}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex:1,
        backgroundColor: '#fff',
        marginRight: 15,
        paddingHorizontal: 10,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    hour: {
        fontSize: 16,
        color: '#000',
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#202020',
    },
    description: {
        fontSize: 13,
        fontWeight: '400',
        color: '#353535',
    },
    circle: {
        backgroundColor: '#a5b3f8',
        width: 50,
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
