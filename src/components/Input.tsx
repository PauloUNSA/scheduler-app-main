import React from 'react';
import { KeyboardTypeOptions, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';

interface Props {
    label: string,
    placeholder: string,
    keyboardType: KeyboardTypeOptions,
    secureText?: boolean,
    onChange: () => void,
    onBlur: () => void,
    value: string,
    errors?: object,
    style?: StyleProp<ViewStyle>
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined
}

export const Input = ({autoCapitalize, style, errors, label, placeholder, keyboardType = 'default', secureText = false, onChange, onBlur, value}: Props) => {

    return (
        <View style={stylesInput.inputContainer}>
            <Text style={{
                ...stylesInput.inputLabel,
                color: (errors) ? 'rgba(191, 22, 80, 0.65)' : 'rgba(0, 0, 0, 0.4)',
            }}>
                {label}
            </Text>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={(errors) ? 'rgba(191, 22, 80, 0.3)' : 'rgba(0, 0, 0, 0.4)'}
                style={{
                    ...stylesInput.input,
                    borderColor: (errors) ? '#bf1650' : 'rgba(0, 0, 0, 0.3)',
                    ...style as any,
                }}
                keyboardType={keyboardType}
                secureTextEntry={secureText}
                autoCorrect={false}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                autoCapitalize={autoCapitalize}
            />
            {errors && <Text style={stylesInput.labelError}>⚠ This is required</Text>}
        </View>
    );
};

export const stylesInput = StyleSheet.create({
    inputContainer: {
        gap: 7,
    },
    inputLabel: {
        fontWeight: '600',
        color:'rgba(0, 0, 0, 0.65)',
        fontSize: 14,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 2.5,
        borderColor: 'rgba(0, 0, 0, 0.3)',
        paddingLeft: 13,
        fontWeight: '500',
        fontSize: 15,
        color: 'rgba(0, 0, 0, 0.7)',
        height: 50,
        marginBottom: 5,
    },
    labelError: {
        color: '#bf1650',
        fontSize: 16,
        fontWeight: '400',
    },
});
