
// import React from 'react';
// import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import StocksStackNavigator from './src/navigation/StocksStackNavigator';
// import WatchlistStackNavigator from './src/navigation/WatchlistStackNavigator';
// import Toast from 'react-native-toast-message';
// import Icon from 'react-native-vector-icons/Feather'; 

// import { ThemeProvider, useTheme } from './src/utils/ThemeContext';

// const Tab = createBottomTabNavigator();

// function AppContent() {
//   const { isDark } = useTheme();
//   return (
//     <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
//       <Tab.Navigator screenOptions={{ headerShown: false }}>
//         <Tab.Screen name="Home" component={StocksStackNavigator} />
//         <Tab.Screen name="Watchlist" component={WatchlistStackNavigator} />
//       </Tab.Navigator>
//       <Toast />
//     </NavigationContainer>
//   );
// }

// export default function App() {
//   return (
//     <ThemeProvider>
//       <AppContent />
//     </ThemeProvider>
//   );
// }

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StocksStackNavigator from './src/navigation/StocksStackNavigator';
import WatchlistStackNavigator from './src/navigation/WatchlistStackNavigator';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';

import { ThemeProvider, useTheme } from './src/utils/ThemeContext';

const Tab = createBottomTabNavigator();

function AppContent() {
  const { isDark } = useTheme();

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'bar-chart-2' : 'bar-chart'; // Feather icons
            } else if (route.name === 'Watchlist') {
              iconName = focused ? 'bookmark' : 'bookmark';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2e86de',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={StocksStackNavigator} />
        <Tab.Screen name="Watchlist" component={WatchlistStackNavigator} />
      </Tab.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
