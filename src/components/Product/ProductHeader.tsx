

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Overview = {
  Name: string;
  Symbol: string;
};

type Theme = {
  text: string;
  secondaryText: string;
  accent: string;
};

type Props = {
  overview: Overview;
  isInWatchlist: boolean;
  onBookmarkPress: () => void;
  theme: Theme;
};

const ProductHeader: React.FC<Props> = ({
  overview,
  isInWatchlist,
  onBookmarkPress,
  theme,
}) => (
  <View style={styles.headerSection}>
    <View style={{ flex: 1, paddingRight: 32 }}>
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={2} adjustsFontSizeToFit>
        {overview.Name}
      </Text>
      <Text style={[styles.symbol, { color: theme.secondaryText }]}>{overview.Symbol}</Text>
    </View>
    <TouchableOpacity onPress={onBookmarkPress} style={styles.bookmarkButton}>
      <Icon name={isInWatchlist ? 'bookmark' : 'bookmark-border'} size={24} color={theme.accent} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  symbol: {
    fontSize: 18,
    marginBottom: 6,
  },
  bookmarkButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default ProductHeader;
