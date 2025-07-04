

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

type Theme = {
  card: string;
  text: string;
  secondaryText: string;
};

type StockItem = {
  symbol: string;
  name: string;
};

type Props = {
  item: StockItem;
  listName: string;
  theme: Theme;
  onNavigate: (symbol: string) => void;
  onRemove: (symbol: string) => void;
};

const WatchlistItemCard: React.FC<Props> = ({
  item,
  listName,
  theme,
  onNavigate,
  onRemove,
}) => {
  const handleRemove = () => {
    Alert.alert(
      'Remove Item',
      `Remove ${item.symbol} from "${listName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemove(item.symbol),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => onNavigate(item.symbol)}>
        <Text style={[styles.symbol, { color: theme.text }]}>{item.symbol}</Text>
        <Text style={[styles.name, { color: theme.secondaryText }]}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    flex: 0.48,
    elevation: 2,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
  },
  name: {
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default WatchlistItemCard;
