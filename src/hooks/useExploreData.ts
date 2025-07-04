
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTopGainersLosers } from '../api/stockDataApi';

const CACHE_KEY = 'TOP_GAINERS_CACHE';
const CACHE_TIME_KEY = 'TOP_GAINERS_CACHE_TIME';
const CACHE_EXPIRATION_MS = 5 * 60 * 1000;

type StockItem = {
  id: string;
  symbol: string;
  price: string;
};

type ApiStockItem = {
  ticker: string;
  price: number;
};

type ApiResponse = {
  top_gainers: ApiStockItem[];
  top_losers: ApiStockItem[];
};

export const useExploreData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [gainers, setGainers] = useState<StockItem[]>([]);
  const [losers, setLosers] = useState<StockItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        const cachedTime = await AsyncStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();

        if (
          cachedData &&
          cachedTime &&
          now - parseInt(cachedTime) < CACHE_EXPIRATION_MS
        ) {
          const data: ApiResponse = JSON.parse(cachedData);
          if (!data?.top_gainers || !data?.top_losers) throw new Error();
          process(data);
        } else {
          const data: ApiResponse = await fetchTopGainersLosers();
          if (!data.top_gainers || !data.top_losers)
            throw new Error('Invalid API structure');
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
          await AsyncStorage.setItem(CACHE_TIME_KEY, now.toString());
          process(data);
        }
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    }

    function process(data: ApiResponse) {
      const parsedGainers = data.top_gainers.map((item, index): StockItem => ({
        id: `g-${index}`,
        symbol: item.ticker,
        price: `$${item.price}`,
      }));

      const parsedLosers = data.top_losers.map((item, index): StockItem => ({
        id: `l-${index}`,
        symbol: item.ticker,
        price: `$${item.price}`,
      }));

      setGainers(parsedGainers);
      setLosers(parsedLosers);
    }

    loadData();
  }, []);

  return { loading, gainers, losers, error };
};
