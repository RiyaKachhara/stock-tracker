

import { fetchFromApi } from './baseApi';
import { TimeSeriesPoint } from './stockDataApi';

export const fetchTimeSeriesForRange = async (
  symbol: string,
  range: string
): Promise<TimeSeriesPoint[]> => {
  let func: string;
  let interval: string | undefined;

  if (range === '1D') {
    func = 'TIME_SERIES_INTRADAY';
    interval = '5min';
  } else if (['1W', '1M', '3M'].includes(range)) {
    func = 'TIME_SERIES_DAILY';
  } else {
    func = 'TIME_SERIES_WEEKLY';
  }

  const params: Record<string, string> = {
    function: func,
    symbol,
    outputsize: 'compact',
  };

  if (interval) params.interval = interval;

  const data = await fetchFromApi(params);

  const series =
    data['Time Series (5min)'] ||
    data['Time Series (Daily)'] ||
    data['Weekly Time Series'] ||
    {};

  return Object.keys(series)
    .sort()
    .map((date) => ({
      date,
      close: parseFloat(series[date]['4. close']),
    }));
};
