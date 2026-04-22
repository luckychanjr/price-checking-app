/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}: {children: React.ReactNode}) => children,
  DefaultTheme: {
    colors: {
      primary: '#000000',
      background: '#ffffff',
      card: '#ffffff',
      text: '#000000',
      border: '#dddddd',
      notification: '#000000',
    },
  },
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({children}: {children: React.ReactNode}) => children,
    Screen: () => null,
  }),
}));

jest.mock('../src/screens/WishlistScreen', () => 'WishlistScreen');
jest.mock('../src/screens/ProductDetailsScreen', () => 'ProductDetailsScreen');

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
