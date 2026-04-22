import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import { pastelTheme } from './src/theme/pastel';

const Stack = createNativeStackNavigator();
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: pastelTheme.accentDeep,
    background: pastelTheme.background,
    card: pastelTheme.surface,
    text: pastelTheme.heading,
    border: pastelTheme.border,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: pastelTheme.surface,
          },
          headerShadowVisible: false,
          headerTintColor: pastelTheme.heading,
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: pastelTheme.background,
          },
        }}
      >
        <Stack.Screen
          name="Wishlist"
          component={WishlistScreen}
          options={{ title: 'Pastel Price Pal' }}
        />
        <Stack.Screen
          name="Product Details"
          component={ProductDetailsScreen}
          options={{ title: 'Retailer Comparison' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
