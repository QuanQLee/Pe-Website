import jwtDecode from 'jwt-decode';
const token = localStorage.getItem('jwt');
try {
  const { exp } = jwtDecode(token);
  if (Date.now() >= exp * 1000) throw new Error('expired');
} catch {
  localStorage.removeItem('jwt');
  return <Navigate to="/admin/login" replace/>;
}
