import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    message: string
}

export const EmptyDateData = ({message}: Props) => {
    return (
        <View style={styles.container}>
            <Icon
                color={'#202020'}
                name="happy-outline"
                size={30}
            />

            <Text style={styles.emptyText}>
                {message}
            </Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    emptyText: {
        color: '#202020',
        fontWeight: '500',
        fontSize: 20,
        marginHorizontal: 20,
    },
});
