import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Todo } from '../interfaces/storeInterfaces';

import Icon from 'react-native-vector-icons/Ionicons';
import { RootState, useAppDispatch } from '../store/store';
import { useSelector } from 'react-redux';
import { startDeleteTodo, startUpdateTodo } from '../store/todos/thunks';
import { Controller, useForm } from 'react-hook-form';
import { TodoSubmit } from '../interfaces/formsData';
import { stylesInput } from './Input';
import { FloatButton } from './FloatButton';

interface Props {
    todo: Todo,
}

const rightSwipeActions = () => {
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
            }}
        >
            <Icon
                name="trash-outline"
                size={30}
                color={'red'}
                style={{
                    paddingHorizontal: 40,
                }}
            />
        </View>
    );
};

export const ListItem = ({todo}: Props) => {

    const { control, handleSubmit, formState:{errors}, watch} = useForm<TodoSubmit>({defaultValues: {
        description: todo.description,
        done: todo.done,
    }});

    const dispatch = useAppDispatch();
    const {activeEvent} = useSelector((state: RootState) => state.calendar);


    const onSubmit = (data: TodoSubmit) => {
        const updateTodo = {
            ...todo,
            ...data,
        };
        dispatch(startUpdateTodo(activeEvent!.id, updateTodo));
        // dispatch(startAddTodo(data.description, data.done, activeEvent!.id));
    };

    return (
        <Swipeable
            onSwipeableOpen={() => {
                dispatch(startDeleteTodo(activeEvent!.id, todo.id));
            }}
            renderRightActions={rightSwipeActions}
            containerStyle={{
                backgroundColor: '#fda4a4',
                borderRadius: 5,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,

                elevation: 3,
                marginBottom: 20,
            }}
        >
            <View style={{...styles.todoContainer}}>
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <CheckBox
                            value={value}
                            onValueChange={onChange}
                            boxType="circle"
                            tintColors={{
                                true: '#466fff',
                                false: '#466fff',
                            }}
                        />
                    )}
                    name="done"
                />
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({field: {onChange, value, onBlur}}) => (
                        <TextInput
                            onPressIn={() => console.log('Hizo presion')}
                            style={{
                                color: `${ watch('done') ? '#858585' : '#000'}`,
                                paddingLeft: 0,
                                paddingVertical: 16,
                                width: '60%',
                                fontSize: 17,
                                fontWeight: '500',
                                textDecorationLine: `${ watch('done') ? 'line-through' : 'none'}`,
                            }}
                            autoCorrect={false}
                            multiline
                            onChangeText={onChange}
                            editable={!watch('done')}
                            value={value}
                            onBlur={() => {
                                Keyboard.dismiss();
                                onBlur();
                            }}
                        />
                    )}
                    name="description"
                />
                <FloatButton
                    icon="save-outline"
                    color="#1f3fae"
                    fn={handleSubmit(onSubmit)}
                    size={24}
                    style={{
                        left: 30,
                        // justifyContent: 'center',
                        // padding: 10,
                    }}
                    styleButton={{
                        padding: 6,
                        backgroundColor: '#eff4ff',
                        borderTopLeftRadius: 7,
                        borderTopRightRadius: 7,
                        borderBottomLeftRadius: 7,
                        borderBottomRightRadius: 7,
                    }}
                />
            </View>
            {errors.description && <Text style={{...stylesInput.labelError, padding: 5}}>⚠ This is required</Text>}
        </Swipeable>
    );
};


const styles = StyleSheet.create({
    todoContainer: {
        backgroundColor: '#eff4ff',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 25,
        gap: 10,
    },
});
