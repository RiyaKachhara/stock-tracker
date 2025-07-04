

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
import { fetchTopGainersLosers } from '../api/stockDataApi';
import { useExploreData } from '../hooks/useExploreData';
import Icon from 'react-native-vector-icons/Feather';
import SearchBar from '../components/SearchBar';
import { useTheme } from '../utils/ThemeContext';
import StockCard from '../components/StockCard';



const ExploreScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const { loading, gainers, losers, error } = useExploreData();

  const renderItem = ({ item }) => (
  <StockCard
    item={item}
    theme={theme}
    onPress={() => navigation.navigate('Product', { symbol: item.symbol })}
  />
);


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
