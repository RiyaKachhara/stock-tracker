import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTopGainersLosers } from '../api/stockDataApi';

const CACHE_KEY = 'TOP_GAINERS_CACHE';
const CACHE_TIME_KEY = 'TOP_GAINERS_CACHE_TIME';
const CACHE_EXPIRATION_MS = 5 * 60 * 1000;

export const useExploreData = () => {
  const [loading, setLoading] = useState(true);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [error, setError] = useState(null);

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
          const data = JSON.parse(cachedData);
          if (!data?.top_gainers || !data?.top_losers) throw new Error();
          process(data);
        } else {
          const data = await fetchTopGainersLosers();
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

    function process(data) {
      setGainers(
        data.top_gainers.map((item, index) => ({
          id: `g-${index}`,
          symbol: item.ticker,
          price: `$${item.price}`,
        }))
      );
      setLosers(
        data.top_losers.map((item, index) => ({
          id: `l-${index}`,
          symbol: item.ticker,
          price: `$${item.price}`,
        }))
      );
    }

    loadData();
  }, []);

  return { loading, gainers, losers, error };
};
