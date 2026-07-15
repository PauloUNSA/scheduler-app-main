import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import React, { useEffect } from 'react';

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RootState } from '../store/store';
import { useSelector } from 'react-redux';

import { BackgroundGradient } from './BackgroundGradient';


import Icon from 'react-native-vector-icons/Ionicons';
import { MenuItem } from './MenuItem';
import { useInvitationStore } from '../hooks/useInvitationStore';

interface ItemScreen {
    title: string,
    icon: string,
    component: string,
}

const Screens: ItemScreen[] = [
    {
        title: 'Calendario',
        icon: 'calendar-number-outline',
        component: 'SchedulerScreen',
    },
    {
        title: 'Week',
        icon: 'calendar-outline',
        component: 'SchedulerWeekViewScreen',
    },
    {
        title: 'Day',
        icon: 'today-outline',
        component: 'SchedulerDayViewScreen',
    },
    {
        title: 'About',
        icon: 'people-outline',
        component: 'AboutScreen',
    },
];

export const MenuInterno = (props: DrawerContentComponentProps) => {

    const {user} = useSelector((state: RootState) => state.auth);
    const {navigation} = props;

    const {invitations, startLoadInvitations} = useInvitationStore();

    useEffect(() => {
        startLoadInvitations();
    }, []);

    return (
        <BackgroundGradient style={{flex: 1}} colors={['#1074b9', '#1e93d9']}>
            <DrawerContentScrollView>
                <View style={styles.container}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        marginTop: 15,
                    }}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.closeIconContainer}>
                            <Icon
                                onPress={() => navigation.closeDrawer()}
                                name="arrow-back-outline"
                                size={35}
                                color={'#e2f0fc'}
                                style={styles.closeIcon}
                            />
                        </TouchableOpacity>
                    </View>


                    <View style={styles.userContainer}>
                        <Image
                            source={require('../assets/profile.png')}
                            style={styles.image}
                        />
                        <View style={styles.userInformation}>
                            <Text style={styles.textInformationName}>
                                {user.name}
                            </Text>
                            <Text style={styles.textInformationEmail}>
                                {user.email}
                            </Text>
                        </View>
                    </View>

                    <View style={{
                        gap: 5,
                    }}>
                        {
                            Screens.map((screen, i) => (
                                <MenuItem
                                    focused={(i === props.state.index) ? true : false}
                                    key={screen.title}
                                    title={screen.title}
                                    icon={screen.icon}
                                    component={screen.component}
                                />
                            ))
                        }
                        <MenuItem
                            focused={false}
                            title="Logout"
                            icon="log-out-outline"
                        />
                    </View>

                    <View style={styles.notificationContainer}>
                        <View style={styles.notificationTitleContainer}>
                            <Text style={styles.notificationText}>
                                Notificaciones
                            </Text>
                            <View style={styles.notificationCountContainer}>
                                <Text style={styles.notificationNumber}>
                                    {invitations.reduce((acum, curr) => {
                                        if (curr.status === 'unreplied') {
                                            return acum + 1;
                                        }
                                        return acum + 0;
                                    }, 0)}
                                </Text>
                            </View>
                        </View>
                        <View style={{gap: 15, flexDirection:'column', marginTop: 13}}>
                            {invitations.map((invitation) => (
                                invitation.status === 'unreplied' &&
                                <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen', {invitation})} key={invitation.id} activeOpacity={0.7} style={{
                                    flex:1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#e2f0fc',
                                    paddingVertical: 5,
                                    paddingHorizontal: 20,
                                    borderRadius: 5,
                                }}>
                                    <View>
                                        <Text numberOfLines={1} style={{...styles.notificationText, color: '#0e5d96', fontWeight: '500', width: 150}}>
                                            {invitation.event?.title}
                                        </Text>
                                        <Text numberOfLines={1} style={{...styles.notificationText, fontSize:14, color: '#1074b9', width: 150}}>
                                            {invitation.event?.description}
                                        </Text>
                                    </View>
                                    <Icon
                                        name="mail-unread-outline"
                                        size={35}
                                        color={'#104f7c'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                </View>
            </DrawerContentScrollView>
        </BackgroundGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 13,
        gap: 15,
    },

    closeIconContainer: {
        borderRadius: 100,
        backgroundColor: '#1074b9',
    },
    closeIcon: {
        padding: 8,
        borderRadius: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    userContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
    },
    image: {
        width: 85,
        height: 85,
        resizeMode: 'cover',
    },
    userInformation: {
        flex: 1,
        gap: 2,
    },
    textInformationName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#f1f1f1',
    },
    textInformationEmail: {
        fontSize: 15,
        fontWeight: '500',
        color: '#ddd',
    },
    panelText: {
        fontSize: 20,
        color: '#151515',
        fontWeight: '600',
    },

    notificationContainer: {
        paddingHorizontal: 10,
    },
    notificationTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomColor: '#a5a5a5',
        borderBottomWidth: 2,
        marginTop: 20,
    },
    notificationText: {
        color: '#f1f1f1',
        fontSize: 18,
    },

    notificationCountContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f5d95',
        borderRadius: 15,
        width: 45,
        height: 30,
    },
    notificationNumber: {
        color: '#f1f1f1',
        fontSize: 16,
        top: -1,
        fontWeight: 'bold',
    },
});
