

import { API_KEY } from '../config';

const BASE_URL = 'https://www.alphavantage.co/query';

export const buildUrl = (params: Record<string, string>) => {
  const query = new URLSearchParams({ ...params, apikey: API_KEY });
  return `${BASE_URL}?${query.toString()}`;
};

export const fetchFromApi = async (params: Record<string, string>): Promise<any> => {
  try {
    const url = buildUrl(params);
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};
