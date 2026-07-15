import React, { useState } from 'react';

import { RootState, useAppDispatch } from '../store/store';
import { useSelector } from 'react-redux';
import { startAddTodo } from '../store/todos/thunks';

import { ButtonSubmit } from './ButtonSubmit';
import { Input } from './Input';

import { Dimensions, KeyboardAvoidingView, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';

import { Controller, useForm } from 'react-hook-form';
import { FloatButton } from './FloatButton';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/Ionicons';
import { TodoSubmit } from '../interfaces/formsData';


const {width: windowWidth} = Dimensions.get('window');

export const CreateTodoModal = () => {

    const [isVisible, setIsVisible] = useState(false);

    const dispatch = useAppDispatch();
    const {activeEvent} = useSelector((state: RootState) => state.calendar);

    const { control, handleSubmit, reset, formState:{errors}} = useForm<TodoSubmit>({defaultValues: {
        description: '',
        done: false,
    }});

    const closeModal = () => {
        setIsVisible(false);
        reset({
            description: '',
            done: false,
        });
    };

    const onSubmit = (data: TodoSubmit) => {
        console.log(data);
        setIsVisible(false);
        dispatch(startAddTodo(data.description, data.done, activeEvent!.id));
        closeModal();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{zIndex: 999}}
        >
            <FloatButton style={{position: 'absolute', bottom: 25, right: 25, zIndex: 999}} styleButton={{backgroundColor: '#2560e9'}} color="#c0dafd" icon="add-outline" fn={() => setIsVisible(true)}/>
            <Modal
                animationType="fade"
                visible={isVisible}
                transparent
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 999,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        width: windowWidth - 70,
                        backgroundColor: '#daebff',
                        borderRadius: 5,
                        paddingHorizontal: 25,
                        paddingTop: 15,
                        paddingBottom: 18,
                        gap: 10,
                    }}>
                        <TouchableOpacity onPress={closeModal} activeOpacity={0.7} style={{
                            position: 'absolute',
                            right: -15,
                            top: -15,
                        }}>
                            <Icon
                                name="close-outline"
                                size={35}
                                color={'#2644ff'}
                                style={{
                                    backgroundColor: '#94beff',
                                    borderRadius: 100,
                                }}
                            />
                        </TouchableOpacity>

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, value, onBlur}}) => (
                                <Input style={{height: 40}} autoCapitalize="sentences" errors={errors.description} onBlur={onBlur} onChange={onChange} value={value} label="Descripción" placeholder="ej. descripción..." keyboardType="default"/>
                            )}
                            name="description"
                        />
                        <Controller
                            control={control}
                            render={({field: {onChange, value}}) => (
                                <View style={{flexDirection: 'row', gap: 5, alignItems: 'center', left: -6}}>
                                    <CheckBox
                                        value={value}
                                        onValueChange={onChange}
                                        boxType="circle"
                                        onAnimationType="fade"
                                        tintColors={{
                                            true: '#5780fd',
                                            false: '#5780fd',
                                        }}
                                    />
                                    <Text style={{color: '#5780fd', fontSize: 15, fontWeight: '600'}}>
                                        Estado
                                    </Text>
                                </View>
                            )}
                            name="done"
                        />
                        <ButtonSubmit title="Crear tarea" handleSubmit={handleSubmit} onSubmit={onSubmit}/>

                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};
