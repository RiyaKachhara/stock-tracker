import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductAbout = ({ overview, theme }) => {
  const formatMarketCap = (cap) => {
    const val = Number(cap);
    return val > 1e12 ? (val / 1e12).toFixed(2) + 'T' : (val / 1e9).toFixed(2) + 'B';
  };

  return (
    <View style={[styles.aboutCard, { backgroundColor: theme.card }]}> 
      <Text style={[styles.aboutTitle, { color: theme.text }]}>About {overview.Name}</Text>
      <Text style={[styles.description, { color: theme.secondaryText }]}>{overview.Description}</Text>

      <View style={styles.chipRow}>
        <Text style={styles.chip}>Industry: {overview.Industry}</Text>
        <Text style={styles.chip}>Sector: {overview.Sector}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statsItem}>
          <Text style={[styles.statsLabel, { color: theme.secondaryText }]}>52-Week Low</Text>
          <Text style={[styles.statsValue, { color: theme.text }]}>${Number(overview["52WeekLow"]).toFixed(2)}</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={[styles.statsLabel, { color: theme.secondaryText }]}>52-Week High</Text>
          <Text style={[styles.statsValue, { color: theme.text }]}>${Number(overview["52WeekHigh"]).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statsGrid}>
        <View style={styles.statsGridItem}>
          <Text style={[styles.statsLabel, { color: theme.secondaryText }]}>Market Cap</Text>
          <Text style={[styles.statsValue, { color: theme.text }]}>{`$${formatMarketCap(overview.MarketCapitalization)}`}</Text>
        </View>
        <View style={styles.statsGridItem}>
          <Text style={[styles.statsLabel, { color: theme.secondaryText }]}>P/E Ratio</Text>
          <Text style={[styles.statsValue, { color: theme.text }]}>{overview.PERatio || 'N/A'}</Text>
        </View>
        <View style={styles.statsGridItem}>
          <Text style={[styles.statsLabel, { color: theme.secondaryText }]}>Beta</Text>
          <Text style={[styles.statsValue, { color: theme.text }]}>{overview.Beta || 'N/A'}</Text>
        </View>
        <View style={styles.statsGridItem}>
          <Text style={[styles.statsLabel, { color: theme.secondaryText }]}>Dividend Yield</Text>
          <Text style={[styles.statsValue, { color: theme.text }]}>{overview.DividendYield ? `${(parseFloat(overview.DividendYield) * 100).toFixed(2)}%` : 'N/A'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  aboutCard: {
    borderRadius: 12,
    padding: 16,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 12,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#f7d9c7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    fontSize: 13,
    color: '#765341',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 12,
  },
  statsValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: '25%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
  },
  statsGridItem: {
    width: '47%',
    marginBottom: 12,
  },
});

export default ProductAbout;