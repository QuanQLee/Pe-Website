import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://pe-website-production-fe71.up.railway.app/api'
    : 'http://localhost:4000/api'
});

// 自动带上 JWT
api.interceptors.request.use(cfg => {
  // key 必须统一为 'token'！
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// 响应拦截器：遇到 401 自动退出并跳到登录页
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
      // 单页应用推荐用 window.location.hash
      if (window.location.hash) {
        window.location.hash = '#/admin/login';
      } else {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
