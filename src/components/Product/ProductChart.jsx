import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const ProductChart = ({ chartData, chartLoading, theme }) => (
  <View style={[styles.chartWrapper, { backgroundColor: theme.card }]}>
    {chartLoading ? (
      <ActivityIndicator size="small" />
    ) : chartData.length > 0 ? (
      <LineChart
        data={chartData}
        curved
        thickness={2}
        color={theme.isDark ? '#1abc9c' : theme.accent}
        hideDataPoints
        initialSpacing={0}
        spacing={10}
        showYAxis={false}
        showVerticalLines={false}
        showXAxisIndices={false}
        yAxisTextColor={theme.isDark ? '#ffffff' : '#333333'}
        showYAxisLines={false}
        backgroundLinesColor="transparent"
        rulesColor="transparent"
        areaChart
        startFillColor={theme.accent}
        endFillColor={theme.background}
        startOpacity={0.2}
        endOpacity={0}
        isAnimated
      />
    ) : (
      <Text style={{ textAlign: 'center', marginTop: 10, color: theme.secondaryText }}>
        No chart data available
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  chartWrapper: {
    borderRadius: 12,
    padding: 12,
    elevation: 3,
    marginVertical: 12,
  },
});

export default ProductChart;