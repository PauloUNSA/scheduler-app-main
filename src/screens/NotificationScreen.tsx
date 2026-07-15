import { DrawerScreenProps } from '@react-navigation/drawer';
import React from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { RootStackParams } from '../navigators/ScheduleNavigator';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/Ionicons';
import { useInvitationStore } from '../hooks/useInvitationStore';
import { useAppDispatch } from '../store/store';
import { startLoadEvents } from '../store/calendar/thunks';
import { LoadingScreen } from './LoadingScreen';
import { FloatButton } from '../components/FloatButton';

const windowWidth = Dimensions.get('window').width;

interface Props extends DrawerScreenProps<RootStackParams, 'NotificationScreen'>{}
export const NotificationScreen = (props: Props) => {


    const invitation = props.route.params.invitation;
    const {startResponseInvitation, isLoading} = useInvitationStore();
    const {navigation} = props;
    const dispatch = useAppDispatch();

    const canceledInvitation = () => {
        Alert.alert('Rechazar invitación', '¿Está seguro de rechazar la invitación?', [
            {
                text: 'Cancel',
                onPress: () => navigation.goBack(),
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    startResponseInvitation(invitation, 'rejected');
                },
                style: 'default',
            },
        ]);
    };

    const acceptedInvitation = async() => {
        await startResponseInvitation(invitation, 'accepted');
        dispatch(startLoadEvents());
        navigation.goBack();
    };

    return (
        <View style={styles.container}>

            {
                isLoading
                    ? <LoadingScreen />
                    :
                    <>
                        <FloatButton
                            color="#1f4dd6"
                            icon="arrow-back-outline"
                            fn={() => {
                                navigation.goBack();
                            }}
                            style={{
                                position: 'absolute',
                                left: 15,
                                top: 15,
                            }}
                            styleButton={{
                                backgroundColor: '#c0dafd',
                            }}
                        />
                        <View style={{...styles.notificationContainer, backgroundColor: invitation.event?.color}}>
                            <Text style={styles.notificationTitle}>{invitation.event?.title}</Text>
                            <View>
                                <Text style={styles.notificationSubtitle}>
                        Fechas:
                                </Text>
                                <Text style={styles.notificationDate}>
                        Inicia: {new Date(invitation.event!.start).toLocaleDateString('es-PE', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true,
                                    })}
                                </Text>
                                <Text style={styles.notificationDate}>
                        Termina: {new Date(invitation.event!.end).toLocaleDateString('es-PE', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true,
                                    })}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.notificationSubtitle}>
                        Descripción:
                                </Text>
                                <Text style={{...styles.notificationDescription, fontSize: 15, color: '#404040'}}>
                                    {invitation.event?.description}
                                </Text>
                            </View>
                        </View>

                        {/* Botones */}
                        <View
                            style={styles.buttonsContainer}
                        >


                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={canceledInvitation}
                                style={{...styles.button, backgroundColor: '#ff3131'}}
                            >
                                <Icon
                                    name="close-outline"
                                    size={30}
                                    color={'#fff1f1'}
                                />
                                <Text style={{...styles.buttonText, color: '#fff1f1'}}>
                        Rechazar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={acceptedInvitation}
                                style={styles.button}
                            >
                                <Icon
                                    name="checkmark-outline"
                                    size={30}
                                    color={'#cdfec9'}
                                />
                                <Text style={{...styles.buttonText, color: '#e8ffe6'}}>
                        Aceptar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
            }


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f8fe',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsContainer: {
        width: '100%',
        height: 80,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#06aa0a',
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        width: windowWidth / 2,
    },
    buttonText: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
    },
    notificationContainer: {
        width: windowWidth - 70,
        top: -40,
        gap: 15,
        padding: 20,
        borderRadius: 5,
    },
    notificationTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    notificationSubtitle: {
        fontSize: 16,
        color: '#252525',
        fontWeight: '500',
    },
    notificationDate: {
        color: '#252525',
        fontSize: 14,
        fontWeight: '400',
    },
    notificationDescription: {
        fontSize: 15,
        fontWeight: '500',
        color: '#252525',
    },
});
