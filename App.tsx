import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './src/navigators/Navigator';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

export const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Navigator />
            </NavigationContainer>
        </Provider>
    );
};
