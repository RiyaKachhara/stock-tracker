
import { fetchFromApi } from './baseApi';

export interface SearchResult {
  symbol: string;
  name: string;
}

export const fetchSymbolSearch = async (keywords: string): Promise<SearchResult[]> => {
  const data = await fetchFromApi({
    function: 'SYMBOL_SEARCH',
    keywords,
  });

  const matches = data.bestMatches || [];

  return matches.map((item: any) => ({
    symbol: item['1. symbol'],
    name: item['2. name'],
  }));
};
