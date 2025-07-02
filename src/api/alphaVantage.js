import { API_KEY } from '../config';

const BASE_URL = 'https://www.alphavantage.co/query';

export async function fetchTopGainersLosers() {
  try {
    const response = await fetch(`${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Top Gainers/Losers:', error);
    throw error;
  }
}


export async function fetchCompanyOverview(symbol) {
  try {
    const response = await fetch(
      `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching company overview for ${symbol}:`, error);
    throw error;
  }
}



export async function fetchDailyTimeSeries(symbol) {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`
    );
    const data = await response.json();
    const timeSeries = data['Time Series (Daily)'];

    if (!timeSeries) return [];

    const dates = Object.keys(timeSeries).sort(); 
    const closingPrices = dates.map((date) => ({
      date,
      close: parseFloat(timeSeries[date]['4. close']),
    }));

    return closingPrices;
  } catch (err) {
    console.error('Error fetching time series:', err);
    return [];
  }
}




