import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    style?: StyleProp<ViewStyle>
    styleButton?: StyleProp<ViewStyle>
    color: string,
    icon: string,
    size?: number,
    fn: () => void,
}

export const FloatButton = ({style, styleButton, color, icon, fn, size = 35}: Props) => {

    return (
        <View style={{...style as any, zIndex: 999}}>
            <TouchableOpacity activeOpacity={0.7} onPress={fn}>
                <Icon
                    name={icon}
                    size={size}
                    color={color}
                    style={{
                        padding: 7.5,
                        backgroundColor: '#fff',
                        borderRadius: 100,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 5,
                        ...styleButton as any,
                    }}
                />
            </TouchableOpacity>
        </View>
    );
};
