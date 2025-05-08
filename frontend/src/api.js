import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
});

api.interceptors.request.use(cfg => {
  const jwt = localStorage.getItem('jwt');
  if (jwt) cfg.headers.Authorization = `Bearer ${jwt}`;
  return cfg;
});

export default api;
