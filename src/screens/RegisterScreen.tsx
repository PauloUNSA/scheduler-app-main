import React from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { RootStackParams } from '../navigators/Navigator';
import { StackScreenProps } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { Input, stylesInput } from '../components/Input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonSubmit } from '../components/ButtonSubmit';
import { Controller, useForm } from 'react-hook-form';
import { RegisterFormData } from '../interfaces/formsData';
import { useAppDispatch } from '../store/store';
import { startRegister } from '../store/auth/thunks';

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'>{}
export const RegisterScreen = ({navigation}: Props) => {

    const {top} = useSafeAreaInsets();
    const {control, handleSubmit, formState: {errors}} = useForm<RegisterFormData>();

    const dispatch = useAppDispatch();

    const onSubmit = (data: RegisterFormData) => {
        dispatch(startRegister(data));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex:1, marginTop: top + 10}}
            enabled={true}
        >

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView showsVerticalScrollIndicator={false} style={{padding: 5}}>
                    <View style={{
                        flex:1,
                        justifyContent: 'center',
                        gap: 35,
                    }}>

                        <View style={{
                            alignItems: 'center',
                            paddingVertical: 5,
                        }}>
                            <Image
                                source={require('../assets/register.png')}
                                resizeMode="cover"
                                style={{
                                    width: 250,
                                    height: 250,
                                }}
                            />
                        </View>

                        <View
                            style={{paddingHorizontal: 50, gap: 25}}
                        >
                            {/* <Text style={{
                                textAlign: 'center',
                                fontSize: 40,
                                fontWeight: '800',
                                color: '#353535',
                                // marginBottom: 30,
                            }}>
                                    Registrate
                            </Text> */}

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({field: {onBlur, onChange, value}}) => (
                                    <View style={stylesInput.inputContainer}>
                                        <Text style={{
                                            ...stylesInput.inputLabel,
                                            color: (errors.name) ? 'rgba(191, 22, 80, 0.65)' : 'rgba(0, 0, 0, 0.4)',
                                        }}>
                                        Nombre Completo
                                        </Text>
                                        <TextInput
                                            placeholder={'Nombre'}
                                            placeholderTextColor={(errors.name) ? 'rgba(191, 22, 80, 0.3)' : 'rgba(0, 0, 0, 0.4)'}
                                            style={{
                                                ...stylesInput.input,
                                                borderColor: (errors.name) ? '#bf1650' : 'rgba(0, 0, 0, 0.3)',
                                            }}
                                            keyboardType={'default'}
                                            autoCapitalize={'words'}
                                            autoCorrect={false}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                        {errors.name && <Text style={stylesInput.labelError}>⚠ This is required</Text>}
                                    </View>
                                )}
                                name="name"
                            />


                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({field: {onBlur, onChange, value}}) => (
                                    <Input errors={errors.email} onBlur={onBlur} onChange={onChange} value={value} label="Correo electronico" placeholder="example@gmail.com" keyboardType="email-address"/>
                                )}
                                name="email"
                            />

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({field: {onBlur, onChange, value}}) => (
                                    <Input errors={errors.password} onBlur={onBlur} onChange={onChange} value={value} label="Contraseña" placeholder="*********" keyboardType="default" secureText={true}/>
                                )}
                                name="password"
                            />

                            <ButtonSubmit title="Completar registro" handleSubmit={handleSubmit} onSubmit={onSubmit}/>

                            <View>
                                <Text
                                    onPress={() => navigation.navigate('LoginScreen')}
                                    style={{
                                        textAlign: 'center',
                                        color: '#2d2dc8',
                                        fontWeight: '500',
                                        top:-8,
                                    }}
                                >
                                    ¿Ya tienes una cuenta?
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
