import React, { useEffect } from 'react';
import { Text, ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { ListItem } from '../components/ListItem';
import { useAppDispatch, RootState } from '../store/store';
import { startLoadTodos } from '../store/todos/thunks';
import { useSelector } from 'react-redux';
import { LoadingScreen } from './LoadingScreen';
import { CreateTodoModal } from '../components/CreateTodoModal';
import Animated from 'react-native-reanimated';
import { useAnimations } from '../hooks/useAnimations';
import { getFormatHourTime } from '../helpers/getFormatHourTime';
import { FloatButton } from '../components/FloatButton';
import { useNavigation } from '@react-navigation/native';
import { onClearTodos } from '../store/todos/todosSlice';
import { EmptyDateData } from '../components/EmptyDateData';

const windowHeight = Dimensions.get('window').height;

export const TodosScreen = () => {

    const dispatch = useAppDispatch();
    const {activeEvent} = useSelector((state: RootState) => state.calendar);
    const {todos, isLoading} = useSelector((state: RootState) => state.todos);

    const {floatingBounce} = useAnimations();

    const {goBack} = useNavigation();

    useEffect(() => {
        dispatch(startLoadTodos((activeEvent?.id + '')));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {
                isLoading
                    ?
                    <LoadingScreen/>
                    :
                    <ScrollView style={{flex: 1, backgroundColor: '#3665f2'}}>
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
                        <Text style={{...styles.title, textAlign: 'center', marginVertical: 64, color: '#fff'}}>
                            {activeEvent?.title}
                        </Text>
                        <View style={{
                            backgroundColor: '#c0dafd',
                            minHeight: windowHeight - 160,
                            borderTopLeftRadius: 45,
                            borderTopRightRadius: 45,
                            paddingHorizontal: 15,
                            paddingTop: 10,
                            paddingBottom: 75,
                        }}>
                            <View style={{flexDirection: 'column', position: 'relative' , justifyContent: 'center', height: 120}}>
                                <Animated.Image
                                    source={require('../assets/todoImage.png')}
                                    style={[
                                        {
                                            position: 'absolute',
                                            width: 200,
                                            height: 200,
                                            bottom: -10,
                                            right: -25,
                                            zIndex: 999,
                                        },
                                        floatingBounce,
                                    ]}
                                />
                                <Text style={{
                                    color: '#252525',
                                    fontSize: 25,
                                    fontWeight: '500',
                                }}>
                                    Tareas a realizar
                                </Text>
                                <Text style={{
                                    color: '#404040',
                                    fontSize: 15,
                                    fontWeight: '400',
                                    paddingLeft: 17,
                                }}>
                                    {`${getFormatHourTime(activeEvent!.start)} - ${getFormatHourTime(activeEvent!.end)}`}
                                </Text>
                            </View>
                            {
                                todos.length === 0
                                    ?
                                    (<EmptyDateData message="No existe ninguna tarea creada"/>)
                                    :
                                    (todos.map((todo) => (
                                        <ListItem key={todo.id} todo={todo} />
                                    )))
                            }
                        </View>
                    </ScrollView>
            }
            <CreateTodoModal />
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        top: 8,
        fontSize: 30,
        fontWeight: 'bold',
        color: '#202020',
    },
    todosContainer: {
        width: '100%',
        backgroundColor: '#3985f8',
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
    },
});
