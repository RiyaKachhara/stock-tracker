


import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type StockItem = {
  symbol: string;
  price: string;
};

type Theme = {
  card: string;
  text: string;
  secondaryText: string;
};

type Props = {
  item: StockItem;
  section: 'gainers' | 'losers';
  theme: Theme;
  onPress: () => void;
};

const ViewAllStockCard: React.FC<Props> = ({ item, section, theme, onPress }) => {
  const isGainer = section === 'gainers';
  const iconName = isGainer ? 'trending-up' : 'trending-down';
  const iconColor = isGainer ? '#27ae60' : '#c0392b';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Icon name={iconName} size={20} color={iconColor} />
        <Text style={[styles.symbol, { color: iconColor }]}>{item.symbol}</Text>
      </View>
      <Text style={[styles.price, { color: theme.secondaryText }]}>{item.price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default ViewAllStockCard;
