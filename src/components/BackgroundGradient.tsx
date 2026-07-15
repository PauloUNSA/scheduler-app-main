import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
    children: JSX.Element | JSX.Element[],
    colors: string[],
    style?: StyleProp<ViewStyle>
}

export const BackgroundGradient = ({children, colors, style}: Props) => {
    return (
        <LinearGradient
            colors={colors}
            style={{...style as any}}
            start={{
                x: 0.2,
                y: 0.4,
            }}
            end={{
                x: 1,
                y: 0.5,
            }}
        >
            {children}
        </LinearGradient>
    );
};
