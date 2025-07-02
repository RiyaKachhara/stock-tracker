

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTopGainersLosers } from '../api/alphaVantage';
import Icon from 'react-native-vector-icons/Feather';
import SearchBar from '../components/SearchBar';
import { useTheme } from '../utils/ThemeContext';

const CACHE_KEY = 'TOP_GAINERS_CACHE';
const CACHE_TIME_KEY = 'TOP_GAINERS_CACHE_TIME';
const CACHE_EXPIRATION_MS = 5 * 60 * 1000;

const ExploreScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        const cachedTime = await AsyncStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();

        if (
          cachedData &&
          cachedTime &&
          now - parseInt(cachedTime) < CACHE_EXPIRATION_MS
        ) {
          let data = JSON.parse(cachedData);
          if (!data?.top_gainers || !data?.top_losers) throw new Error();
          processData(data);
        } else {
          const data = await fetchTopGainersLosers();
          if (!data.top_gainers || !data.top_losers)
            throw new Error('API returned invalid structure.');
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
          await AsyncStorage.setItem(CACHE_TIME_KEY, now.toString());
          processData(data);
        }
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    }

    function processData(data) {
      setGainers(
        data.top_gainers.map((item, index) => ({
          id: `g-${index}`,
          symbol: item.ticker,
          price: `$${item.price}`,
        }))
      );
      setLosers(
        data.top_losers.map((item, index) => ({
          id: `l-${index}`,
          symbol: item.ticker,
          price: `$${item.price}`,
        }))
      );
    }

    loadData();
  }, []);

  const renderItem = ({ item }) => {
    const isGainer = item.id.startsWith('g');
    const iconName = isGainer ? 'trending-up' : 'trending-down';
    const iconColor = isGainer ? '#27ae60' : '#c0392b';

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate('Product', { symbol: item.symbol })}
      >
        <View style={styles.cardHeader}>
          <Icon name={iconName} size={20} color={iconColor} />
          <Text style={[styles.symbol, { color: iconColor }]}>{item.symbol}</Text>
        </View>
        <Text style={[styles.price, { color: theme.secondaryText }]}>{item.price}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ color: theme.text }}>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.text }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SearchBar navigation={navigation} />

      {/* Gainers */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Gainers</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity onPress={toggleTheme}>
            <Icon name="sun" size={20} color={theme.accent} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ViewAll', { section: 'gainers', data: gainers })
            }
          >
            <Text style={[styles.viewAll, { color: theme.accent }]}>View All →</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={gainers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />

      {/* Losers */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Losers</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ViewAll', { section: 'losers', data: losers })
          }
        >
          <Text style={[styles.viewAll, { color: theme.accent }]}>View All →</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={losers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flex: 0.48,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default ExploreScreen;
