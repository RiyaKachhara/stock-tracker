

import { useState, useEffect } from 'react';
import { fetchTimeSeriesForRange } from '../api/timeRangeApi';

type ChartPoint = { value: number };

export const useChartData = (symbol: string, selectedRange: string) => {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChart() {
      setChartLoading(true);
      try {
        const series = await fetchTimeSeriesForRange(symbol, selectedRange);
        if (!series || series.length === 0) {
          setChartError('Chart data unavailable.');
          setChartData([]);
          return;
        }

        const parsed: ChartPoint[] = series.map((point: { close: number }) => ({
          value: point.close,
        }));

        setChartData(parsed);
        setChartError(null);
      } catch (err) {
        setChartError('Failed to load chart data.');
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    }

    loadChart();
  }, [symbol, selectedRange]);

  return { chartData, chartLoading, chartError };
};
