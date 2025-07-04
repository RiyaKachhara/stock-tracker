


import { fetchFromApi } from './baseApi';

export const fetchTopGainersLosers = async (): Promise<any> => {
  return await fetchFromApi({ function: 'TOP_GAINERS_LOSERS' });
};

export interface TimeSeriesPoint {
  date: string;
  close: number;
}

export const fetchDailyTimeSeries = async (symbol: string): Promise<TimeSeriesPoint[]> => {
  const data = await fetchFromApi({
    function: 'TIME_SERIES_DAILY',
    symbol,
    outputsize: 'compact',
  });

  const series = data['Time Series (Daily)'] || {};

  return Object.keys(series)
    .sort()
    .map((date) => ({
      date,
      close: parseFloat(series[date]['4. close']),
    }));
};
