import * as store from 'store';
import axiosClient from 'axios';

export const axios = axiosClient.create({
  baseURL: '/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${store.get('token', '<missing>')}`;

  return config;
});
