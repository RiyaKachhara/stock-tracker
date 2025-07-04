
import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ThemeType } from '../../utils/theme';

type ChartPoint = { value: number };

type Props = {
  chartData: ChartPoint[];
  chartLoading: boolean;
  theme: ThemeType;
};

const ProductChart: React.FC<Props> = ({ chartData, chartLoading, theme }) => (
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
        yAxisThickness={0}
        xAxisThickness={0}
        areaChart
        startFillColor={theme.accent}
        endFillColor={theme.background}
        startOpacity={0.2}
        endOpacity={0}
        backgroundColor="transparent"
        hideRules
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
