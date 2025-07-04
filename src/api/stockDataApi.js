import { fetchFromApi } from './baseApi';

export const fetchTopGainersLosers = async () =>
  await fetchFromApi({ function: 'TOP_GAINERS_LOSERS' });

export const fetchDailyTimeSeries = async (symbol) => {
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
