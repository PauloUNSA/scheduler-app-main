/**
 * @format
 */

import 'react-native';
import React from 'react';
import {App} from '../App';

// Note: import explicitly to use the types shiped with jest.
import {expect, it, jest} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-gesture-handler', () => ({}));
jest.mock('@react-navigation/native', () => {
    const actualReact = require('react');
    return {
        NavigationContainer: ({children}: {children: React.ReactNode}) =>
            actualReact.createElement(actualReact.Fragment, null, children),
    };
});
jest.mock('../src/navigators/Navigator', () => ({
    Navigator: () => null,
}));

it('renders correctly', () => {
    let component: renderer.ReactTestRenderer;
    renderer.act(() => {
        component = renderer.create(<App />);
    });
    expect(component!.toJSON()).toBeNull();
    renderer.act(() => component!.unmount());
});
