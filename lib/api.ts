// lib/axios.ts
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const request = axios.create({
  baseURL: apiUrl,
});




request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    // Modify the request config before sending it
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('Request Interceptor', config);
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export { request };