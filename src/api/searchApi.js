// src/api/searchApi.js
import { fetchFromApi } from './baseApi';

export const fetchSymbolSearch = async (keywords) => {
  const data = await fetchFromApi({
    function: 'SYMBOL_SEARCH',
    keywords,
  });

  const matches = data.bestMatches || [];

  return matches.map((item) => ({
    symbol: item['1. symbol'],
    name: item['2. name'],
  }));
};
