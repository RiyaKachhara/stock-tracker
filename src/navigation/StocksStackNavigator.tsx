

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExploreScreen from '../screens/ExploreScreen';
import ProductScreen from '../screens/ProductScreen';
import ViewAllScreen from '../screens/ViewAllScreen';

export type StocksStackParamList = {
  Explore: undefined;
  Product: { symbol: string };
  ViewAll: { section: 'gainers' | 'losers'; data: { id: string; symbol: string; price: string }[] };
};

const Stack = createNativeStackNavigator<StocksStackParamList>();

export default function StocksStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="ViewAll" component={ViewAllScreen} />
    </Stack.Navigator>
  );
}
