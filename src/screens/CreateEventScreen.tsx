import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SubmitEvent } from '../interfaces/events';
import { addHours } from 'date-fns';
import { Input } from '../components/Input';
import { DateInput } from '../components/DateInput';
import { ButtonSubmit } from '../components/ButtonSubmit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../store/store';
import { startCreateEvent, startUpdateEvent } from '../store/calendar/thunks';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParams } from '../navigators/ScheduleNavigator';
import { ColorPicker } from 'react-native-color-picker';
import { fromHsv } from 'react-native-color-picker';
import { SearchInput } from '../components/SearchInput';
import { UserStore } from '../interfaces/storeInterfaces';
import { schedulerApi } from '../api/schedulerApi';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FloatButton } from '../components/FloatButton';
import { onClearTodos } from '../store/todos/todosSlice';
import Icon from 'react-native-vector-icons/Ionicons';

const {width: windowWidth} = Dimensions.get('window');

interface Props extends DrawerScreenProps<RootStackParams, 'CreateEventScreen'>{}
export const CreateEventScreen = ({route}: Props) => {

    let {event} = route.params ?? {};

    const [term, setTerm] = useState('');
    const [users, setUsers] = useState<UserStore[]>([]);
    const [participants, setParticipants] = useState<UserStore[]>(event?.participants?.map((participant: any) => participant.user ?? participant) || []);

    const addParticipant = (newParticipant: UserStore) => {
        if (participants.some((participant) => participant.id === newParticipant.id)) {return;}
        setParticipants([
            ...participants,
            newParticipant,
        ]);
    };

    const {goBack} = useNavigation();
    const {top} = useSafeAreaInsets();

    const currentColor = useRef('#c0d3fd');

    const dispatch = useAppDispatch();

    const { control, handleSubmit, reset, formState:{errors}, watch} = useForm<SubmitEvent>({defaultValues: {
        title: event?.title || '',
        description: event?.description || '',
        start: event?.start || new Date().toISOString(),
        end:  event?.end || addHours(new Date(), 2).toISOString(),
    }});

    const onSubmit = (data: SubmitEvent) => {

        const pastParticipants = event?.participants ?? [];

        if (event) {
            event = {
                ...event,
                ...data,
                color: currentColor.current,
                participants,
            };
            dispatch(startUpdateEvent(event, pastParticipants));
        } else {
            data.color = currentColor.current;
            data.participants = participants;
            dispatch(startCreateEvent(data));
        }

        reset({
            title: '',
            description: '',
            start: new Date().toISOString(),
            end: addHours(new Date(), 2).toISOString(),
        });
        goBack();
    };

    const searchUsers = async(searchText: string) => {
        const {data} = await schedulerApi.get<UserStore[]>('/users/search', {
            params: {
                name: searchText,
                email: searchText,
            },
        });
        setUsers([...data]);
    };

    useEffect(() => {

        if (term.length === 0) {
            return setUsers([]);
        }

        searchUsers(term);
    }, [term]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex:1}}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    <FloatButton
                        color="#1f4dd6"
                        icon="arrow-back-outline"
                        fn={() => {
                            dispatch(onClearTodos());
                            goBack();
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

                    <ScrollView style={{...styles.container, paddingTop: 45}}>

                        <View style={{alignItems: 'center', gap: 25}}>

                            <Text style={{...styles.title, marginTop: top + 20}}>{
                                (event) ? 'Editando evento' : 'Creando evento'
                            }</Text>

                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <View style={styles.containerForm}>

                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({field: {onChange, value, onBlur}}) => (
                                            <Input style={{height: 40}} errors={errors.title} onBlur={onBlur} onChange={onChange} value={value} label="Título" placeholder="ej. Hacer tarea" keyboardType="default"/>
                                        )}
                                        name="title"
                                    />

                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({field: {onChange, value, onBlur}}) => (
                                            <Input style={{height: 40}} errors={errors.description} onBlur={onBlur} onChange={onChange} value={value} label="Descripción" placeholder="ej. descripción..." keyboardType="default"/>
                                        )}
                                        name="description"
                                    />

                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({field: {onChange, value}}) => (
                                            <DateInput onChange={onChange} title="Fecha de inicio" value={value}/>
                                        )}
                                        name="start"
                                    />

                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({field: {onChange, value}}) => (
                                            <DateInput onChange={onChange} title="Fecha de finalización" value={value} minimunDate={watch('start')}/>
                                        )}
                                        name="end"
                                    />

                                    <View style={{width: windowWidth - 80, gap: 8}}>
                                        <Text style={{
                                            fontWeight: '600',
                                            color:'rgba(0, 0, 0, 0.4)',
                                            fontSize: 14,
                                        }}>Agregar usuario</Text>
                                        <SearchInput
                                            onDebounce={(value) => setTerm(value)}
                                            style={{
                                                width: '100%',
                                            }}
                                        />

                                        {
                                            users.map((user) => (
                                                <TouchableOpacity
                                                    onPress={() => addParticipant(user)}
                                                    activeOpacity={0.8}
                                                    key={user.id}
                                                    style={{backgroundColor: '#0d35a2', padding: 8, marginTop: -5, borderRadius: 3, flexDirection: 'row', alignItems: 'center', gap: 10}}
                                                >
                                                    <Icon
                                                        name="person-add-outline"
                                                        size={20}
                                                        color={'#eff8ff'}
                                                    />
                                                    <Text style={{color: '#f1f1f1', fontSize: 15}}>{user.name}</Text>
                                                </TouchableOpacity>
                                            ))
                                        }

                                        <Text style={{
                                            fontWeight: '600',
                                            color:'rgba(0, 0, 0, 0.4)',
                                            fontSize: 14,
                                        }}>
                                        Usuarios agregados:
                                        </Text>
                                        {
                                            participants.map((participant) => (
                                                <View key={participant.id} style={{
                                                    backgroundColor: '#1d468b',
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 20,
                                                    borderRadius: 3,
                                                    marginTop: -5,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: 10,
                                                }}>
                                                    <Icon
                                                        name="person-circle-outline"
                                                        size={25}
                                                        color={'#eff8ff'}
                                                    />
                                                    <Text style={{color: '#eff8ff', fontWeight: '600', fontSize: 16}}>
                                                        {participant.name}
                                                    </Text>
                                                </View>
                                            ))
                                        }
                                    </View>

                                    <View style={{flex: 1}}>
                                        <Text style={{
                                            fontSize: 15,
                                            color: 'rgba(0, 0, 0, 0.4)',
                                            fontWeight: '500',
                                        }}>
                                        Elige un color
                                        </Text>
                                        <View style={{flex:1, alignItems: 'center'}}>
                                            <ColorPicker
                                                onColorChange={(selectedColor) =>{
                                                    currentColor.current = fromHsv(selectedColor);
                                                }}
                                                hideSliders
                                                defaultColor={event?.color ?? '#c0d3fd'}
                                                style={{
                                                    width: 200,
                                                    height: 200,
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{}}>
                                        <ButtonSubmit title={(event) ? 'Editar evento' : 'Crear evento'} handleSubmit={handleSubmit} onSubmit={onSubmit}/>
                                    </View>
                                    {/* Espacio para poder hacer scroll */}
                                    <View style={{height: 60}} />
                                </View>
                            </View>
                        </View>

                    </ScrollView>
                </>

            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7f2ff',
    },
    containerForm: {
        width: windowWidth - 80,
        borderRadius: 5,
        gap: 23,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#202020',
        textAlign: 'center',
    },
});
