import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDebounceValue } from '../hooks/useDebounceValue';

interface Props {
    style?: StyleProp<ViewStyle>,
    onDebounce: (value: string) => void
}

export const SearchInput = ({style, onDebounce}: Props) => {

    const [textValue, setTextValue] = useState('');

    const {debouncedValue} = useDebounceValue({input: textValue, time: 500});

    useEffect(() => {
        onDebounce(debouncedValue);
    }, [debouncedValue]);

    return (
        <View style={{
            ...styles.container,
            ...style as any,
        }}>
            <View style={styles.textBackground}>
                <TextInput
                    placeholder="Buscar un usuario"
                    style={styles.textInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={textValue}
                    onChangeText={setTextValue}
                />
                <Icon
                    name="search-outline"
                    size={30}
                    color={'#0a5dff'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'red'
        // marginHorizontal: 20,
    },
    textBackground: {
        backgroundColor: '#b1d3ff',
        borderRadius: 5,
        color: '#0a5dff',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    textInput: {
        // top: 1,
        flex: 1,
        fontSize: 18,
        color: '#0a5dff',
    },
});
