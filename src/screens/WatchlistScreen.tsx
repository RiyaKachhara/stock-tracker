

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../utils/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WatchlistStackParamList } from '../navigation/WatchlistStackNavigator';

type Props = NativeStackScreenProps<WatchlistStackParamList, 'Watchlist'>;

type Watchlists = Record<string, { symbol: string; name: string }[]>;

const WatchlistScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [watchlists, setWatchlists] = useState<Watchlists>({});

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      async function load() {
        try {
          const saved = await AsyncStorage.getItem('WATCHLISTS');
          if (saved && active) {
            setWatchlists(JSON.parse(saved));
          }
        } finally {
          if (active) setLoading(false);
        }
      }
      load();
      return () => {
        active = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator />
        <Text style={{ color: theme.text }}>Loading...</Text>
      </View>
    );
  }

  const lists = Object.keys(watchlists);

  if (lists.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>No watchlists yet.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Watchlists</Text>
      <FlatList
        data={lists}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('WatchlistDetail', { listName: item })}
          >
            <Text style={[styles.name, { color: theme.text }]}>{item}</Text>
            <Text style={[styles.count, { color: theme.secondaryText }]}>
              {watchlists[item].length} items
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '600' },
  count: { fontSize: 14 },
});

export default WatchlistScreen;
