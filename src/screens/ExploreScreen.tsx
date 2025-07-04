

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';

import { useExploreData } from '../hooks/useExploreData';
import SearchBar from '../components/SearchBar';
import StockCard from '../components/StockCard';
import { useTheme } from '../utils/ThemeContext';
import { StocksStackParamList } from '../navigation/StocksStackNavigator';

type Props = NativeStackScreenProps<StocksStackParamList, 'Explore'>;

type StockItem = {
  id: string;
  symbol: string;
  price: string;
};

const ExploreScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const { loading, gainers, losers, error } = useExploreData();

  const renderItem: ListRenderItem<StockItem> = ({ item }) => (
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
});

export default ExploreScreen;
