

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCompanyOverview } from '../api/companyApi';

const CACHE_EXPIRATION_MS = 5 * 60 * 1000;

type Overview = {
  Name: string;
  Symbol: string;
  Description: string;
  Industry: string;
  Sector: string;
  '52WeekLow': string;
  '52WeekHigh': string;
  MarketCapitalization: string;
  PERatio?: string;
  Beta?: string;
  DividendYield?: string;
  [key: string]: any; // in case API includes more
};

export const useProductData = (symbol: string) => {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      const OVERVIEW_CACHE_KEY = `OVERVIEW_${symbol}`;
      const OVERVIEW_CACHE_TIME_KEY = `OVERVIEW_TIME_${symbol}`;
      const now = Date.now();

      try {
        let overviewData: Overview;
        const cachedOverview = await AsyncStorage.getItem(OVERVIEW_CACHE_KEY);
        const cachedTime = await AsyncStorage.getItem(OVERVIEW_CACHE_TIME_KEY);

        if (cachedOverview && cachedTime && now - parseInt(cachedTime) < CACHE_EXPIRATION_MS) {
          overviewData = JSON.parse(cachedOverview);
        } else {
          overviewData = await fetchCompanyOverview(symbol);
          await AsyncStorage.setItem(OVERVIEW_CACHE_KEY, JSON.stringify(overviewData));
          await AsyncStorage.setItem(OVERVIEW_CACHE_TIME_KEY, now.toString());
        }

        setOverview(overviewData);
        await checkWatchlist(symbol);
      } catch (err) {
        setError('Failed to load company info.');
      } finally {
        setLoading(false);
      }
    }

    async function checkWatchlist(sym: string) {
      const saved = await AsyncStorage.getItem('WATCHLISTS');
      if (!saved) return setIsInWatchlist(false);
      const all = JSON.parse(saved);
      const allItems = Object.values(all).flat() as { symbol: string }[];
      const exists = allItems.some((item) => item.symbol === sym);
      setIsInWatchlist(exists);
    }

    loadData();
  }, [symbol]);

  return { overview, loading, error, isInWatchlist, setIsInWatchlist };
};
