import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://test-production-fe71.up.railway.app/api"
    : "http://localhost:4000/api"
});

// JWT 自动带上
instance.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// 401 处理
instance.interceptors.response.use(
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

// 真正导出的对象
const api = {
  // 文章相关
  getBlogs: () => instance.get('/blogs'),
  createBlog: (data) => instance.post('/blogs', data),
  updateBlog: (id, data) => instance.put(`/blogs/${id}`, data),
  deleteBlog: (id) => instance.delete(`/blogs/${id}`),
  // 项目相关
  getProjects: () => instance.get('/projects'),
  createProject: (data) => instance.post('/projects', data),
  updateProject: (id, data) => instance.put(`/projects/${id}`, data),
  deleteProject: (id) => instance.delete(`/projects/${id}`),
};

export default api;
