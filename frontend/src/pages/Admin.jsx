import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminEditor from './AdminEditor';

/** 简单鉴权包装 */
const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');        // ← 注意这里用 token
  useEffect(() => {
    if (!token) navigate('/admin/login', { replace: true });
  }, [token, navigate]);
  return token ? children : null;
};

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

      {/* 新增：全屏编辑页（type=blog|project, id 可选） */}
      <Route
        path="editor/:type/:id?"
        element={
          <RequireAuth>
            <AdminEditor />
          </RequireAuth>
        }
      />

      {/* 其余全部指向后台首页 */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
