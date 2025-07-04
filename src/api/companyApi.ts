
import { fetchFromApi } from './baseApi';

export const fetchCompanyOverview = async (symbol: string): Promise<any> => {
  return await fetchFromApi({ function: 'OVERVIEW', symbol });
};
