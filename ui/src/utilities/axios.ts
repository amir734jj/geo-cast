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

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && store.get('token')) {
      store.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
