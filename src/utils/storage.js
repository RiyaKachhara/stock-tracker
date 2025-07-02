import AsyncStorage from '@react-native-async-storage/async-storage';

export const getWatchlists = async () => {
  const saved = await AsyncStorage.getItem('WATCHLISTS');
  return saved ? JSON.parse(saved) : {};
};

export const saveWatchlists = async (data) => {
  await AsyncStorage.setItem('WATCHLISTS', JSON.stringify(data));
};

export const isInWatchlist = async (symbol) => {
  const all = await getWatchlists();
  return Object.values(all).some((list) => list.find((s) => s.symbol === symbol));
};
