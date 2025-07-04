
import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../utils/ThemeContext';
import ViewAllStockCard from '../components/ViewAllStockCard';


export default function ViewAllScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { section, data } = route.params;
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = () => {
    if (visibleCount >= data.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 10, data.length));
      setIsLoadingMore(false);
    }, 700);
  };

  const visibleData = data.slice(0, visibleCount);

  const renderItem = ({ item }) => (
  <ViewAllStockCard
    item={item}
    section={section}
    theme={theme}
    onPress={() => navigation.navigate('Product', { symbol: item.symbol })}
  />
);


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        All {section === 'gainers' ? 'Top Gainers' : 'Top Losers'}
      </Text>

      <FlatList
        data={visibleData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : visibleCount >= data.length ? (
            <Text style={[styles.endText, { color: theme.secondaryText }]}>
              🎉 You’ve reached the end!
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    marginTop: 4,
  },
  endText: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 13,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

