import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export const useAnimations = () => {

    const translateX = useSharedValue(-8);
    const translateY = useSharedValue(-8);

    const floatingBounce = useAnimatedStyle(() => {
        return {
            transform: [{translateX: translateX.value}, {translateY: translateY.value}],
        };
    });

    useEffect(() => {
        translateX.value = withRepeat(withTiming(0, {duration: 2500}), -1, true);
        translateY.value = withRepeat(withTiming(0, {duration: 2200}), -1, true);
    });

    return {
        floatingBounce,
    };
};
