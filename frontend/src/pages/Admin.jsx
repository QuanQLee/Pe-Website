import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

/** 根据 localStorage 里有没有 jwt 判断是否登录 */
const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  useEffect(() => {
    if (!token) navigate('/admin/login', { replace: true });
  }, [token]);
  return token ? children : null;
};

/** /admin/* 的入口：负责路由分发 */
export default function Admin() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="dashboard"
        element={
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        }
      />
      {/* 其他地址全部重定向到 Dashboard（会再跳转 Login 如未登录） */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
