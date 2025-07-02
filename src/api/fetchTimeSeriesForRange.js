import { API_KEY } from '../config';

const BASE_URL = 'https://www.alphavantage.co/query';

export async function fetchTimeSeriesForRange(symbol, range) {
  let url;

  if (range === '1D') {
    // Intraday 5min interval
    url = `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=compact&apikey=${API_KEY}`;
  } else if (['1W', '1M', '3M'].includes(range)) {
    // Daily data
    url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
  } else if (['6M', '1Y'].includes(range)) {
    // Weekly data
    url = `${BASE_URL}?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${API_KEY}`;
  } else {
    // Fallback to daily
    url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    let series;
    if (range === '1D') {
      series = data['Time Series (5min)'];
    } else if (['1W', '1M', '3M'].includes(range)) {
      series = data['Time Series (Daily)'];
    } else if (['6M', '1Y'].includes(range)) {
      series = data['Weekly Time Series'];
    }

    if (!series) return [];

    const dates = Object.keys(series).sort();
    return dates.map(date => ({
      date,
      close: parseFloat(series[date]['4. close'])
    }));
  } catch (err) {
    console.error(`Error fetching ${range} time series:`, err);
    return [];
  }
}
