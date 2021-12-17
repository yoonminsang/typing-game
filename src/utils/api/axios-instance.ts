import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'https://my-json-server.typicode.com/',
  baseURL: 'https://my-json-server.typicode.com/',
  withCredentials: true,
});

export default axiosInstance;
