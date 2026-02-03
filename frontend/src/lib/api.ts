import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for auth later (Bearer token or API Key)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
