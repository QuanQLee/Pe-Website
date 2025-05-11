import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    // 生产环境走你的 Railway URL
    ? 'https://test-production-fe71.up.railway.app/api'
    // 本地开发 fallback
    : 'http://localhost:4000/api'
});

// frontend/src/api.js
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export default api;