import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

function RequireAuth({ children }) {
  const token = localStorage.getItem('jwt');
  const loc   = useLocation();
  return token ? children : <Navigate to="/admin/login" state={{ from: loc }} replace />;
}

export default function Admin() {
  return (
    <Routes>
      {/* 直接 /admin 根根据 JWT 判断 */}
      <Route
        index
        element={
          localStorage.getItem('jwt')
            ? <Navigate to="dashboard" replace />
            : <Navigate to="login"     replace />
        }
      />
      <Route path="login"     element={<AdminLogin />} />
      <Route
        path="dashboard"
        element={
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        }
      />
      {/* 任何未知路径回到根 */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
