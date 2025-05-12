import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_API_BASE          // 生产：Railway
    : 'http://localhost:4000/api',          // 本地
});

// 自动带 JWT
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('jwt');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
