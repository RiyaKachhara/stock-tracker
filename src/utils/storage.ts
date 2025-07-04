
import AsyncStorage from '@react-native-async-storage/async-storage';

export type StockItem = {
  symbol: string;
  name: string;
};

export type Watchlists = Record<string, StockItem[]>;

/**
 * Retrieves all watchlists from AsyncStorage.
 */
export const getWatchlists = async (): Promise<Watchlists> => {
  const saved = await AsyncStorage.getItem('WATCHLISTS');
  return saved ? (JSON.parse(saved) as Watchlists) : {};
};

/**
 * Saves the given watchlists object to AsyncStorage.
 * @param data - A mapping of list names to arrays of stock items.
 */
export const saveWatchlists = async (data: Watchlists): Promise<void> => {
  await AsyncStorage.setItem('WATCHLISTS', JSON.stringify(data));
};

/**
 * Checks whether the given symbol exists in any watchlist.
 * @param symbol - The stock symbol to check.
 */
export const isInWatchlist = async (symbol: string): Promise<boolean> => {
  const all = await getWatchlists();
  return Object.values(all).some((list) => list.some((s) => s.symbol === symbol));
};
