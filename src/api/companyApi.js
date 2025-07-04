import { fetchFromApi } from './baseApi';

export const fetchCompanyOverview = async (symbol) =>
  await fetchFromApi({ function: 'OVERVIEW', symbol });
