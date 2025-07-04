// src/api/baseApi.js
import { API_KEY } from '../config';

const BASE_URL = 'https://www.alphavantage.co/query';

export const buildUrl = (params) => {
  const query = new URLSearchParams({ ...params, apikey: API_KEY });
  return `${BASE_URL}?${query}`;
};

export const fetchFromApi = async (params) => {
  try {
    const url = buildUrl(params);
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};
