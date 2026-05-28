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
  const token = store.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
