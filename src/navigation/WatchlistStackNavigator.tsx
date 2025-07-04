

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WatchlistScreen from '../screens/WatchlistScreen';
import WatchlistDetailScreen from '../screens/WatchlistDetailScreen';
import ProductScreen from '../screens/ProductScreen';

export type WatchlistStackParamList = {
  Watchlist: undefined;
  WatchlistDetail: { listName: string };
  Product: { symbol: string };
};

const Stack = createNativeStackNavigator<WatchlistStackParamList>();

export default function WatchlistStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Watchlist" component={WatchlistScreen} />
      <Stack.Screen name="WatchlistDetail" component={WatchlistDetailScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
    </Stack.Navigator>
  );
}
