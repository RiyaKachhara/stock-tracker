import { useState, useEffect } from 'react';
import { fetchTimeSeriesForRange } from '../api/timeRangeApi';

export const useChartData = (symbol, selectedRange) => {
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);

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
        const parsed = series.map((point) => ({ value: point.close }));
        setChartData(parsed);
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
