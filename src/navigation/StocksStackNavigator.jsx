

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExploreScreen from '../screens/ExploreScreen';
import ProductScreen from '../screens/ProductScreen';
import ViewAllScreen from '../screens/ViewAllScreen';

const Stack = createNativeStackNavigator();

export default function StocksStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="ViewAll" component={ViewAllScreen} />
    </Stack.Navigator>
  );
}
