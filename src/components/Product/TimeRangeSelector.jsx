import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TimeRangeSelector = ({ selectedRange, setSelectedRange, loadChartDataForRange, theme }) => (
  <View style={styles.timeRange}>
    {["1D", "1W", "1M", "3M", "6M", "1Y"].map((label) => (
      <TouchableOpacity
        key={label}
        style={[styles.timeButton, { backgroundColor: theme.card }, selectedRange === label && { backgroundColor: theme.accent }]}
        onPress={() => {
          setSelectedRange(label);
          loadChartDataForRange(label);
        }}
      >
        <Text style={[styles.timeText, { color: theme.text }, selectedRange === label && { color: '#fff' }]}>{label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  timeRange: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  timeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  timeText: {
    fontWeight: '500',
  },
});

export default TimeRangeSelector;