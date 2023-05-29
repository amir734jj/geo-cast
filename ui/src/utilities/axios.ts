import * as store from 'store';
import axiosClient from 'axios';

export const axios = axiosClient.create({
  baseURL: '/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, Authorization, Content-Type, Accept',
  },
});

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${store.get('token', '<missing>')}`;

  return config;
});
