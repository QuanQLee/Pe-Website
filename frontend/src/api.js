import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://test-production-fe71.up.railway.app/api'
    : 'http://localhost:4000/api'
});

// 自动带上 JWT
api.interceptors.request.use(cfg => {
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
      if (window.location.hash) {
        window.location.hash = '#/admin/login';
      } else {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// ========== 下面是你需要补全的 API 方法 ==========
const apiExport = {
  // 文章
  getBlogs:    () => api.get('/blogs'),
  createBlog:  (data) => api.post('/blogs', data),
  updateBlog:  (id, data) => api.put(`/blogs/${id}`, data),
  deleteBlog:  (id) => api.delete(`/blogs/${id}`),
  // 项目
  getProjects: () => api.get('/projects'),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  // 你如果后端有其它API可以继续加
};

export default apiExport;
