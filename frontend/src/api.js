import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://test-production-fe71.up.railway.app/api'
    : 'http://localhost:4000/api'
});

// 自动带上 JWT
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('jwt');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export default api;

