import React from 'react';
import { UseFormHandleSubmit } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
    title: string,
    handleSubmit: UseFormHandleSubmit<any, undefined>,
    onSubmit: (data: any) => void,
    disabled?: boolean,
    isLoading?: boolean,
}

export const ButtonSubmit = ({
    title,
    handleSubmit,
    onSubmit,
    disabled = false,
    isLoading = false,
}: Props) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.buttonContainer, disabled && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={title}
            accessibilityState={{disabled, busy: isLoading}}
        >
            {isLoading
                ? <ActivityIndicator color="#ffffff" />
                : <Text style={styles.buttonText}>{title}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#4438ca',
        height: 45,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        top: -1,
        color: '#e4e4e4',
        fontSize: 15,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.55,
    },
});
