import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const { token } = (await api.post('/auth/login', { username, password })).data;
      localStorage.setItem('jwt', token);
      navigate('/admin');              // ✓ HashRouter 下跳到 #/admin
    } catch {
      setErr('Wrong credentials');
    }
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-32 space-y-4 p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center">Admin Login</h2>
      <input className="input" placeholder="Username" value={username} onChange={e=>setU(e.target.value)} />
      <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setP(e.target.value)} />
      {err && <p className="text-red-500 text-sm">{err}</p>}
      <button className="btn-primary w-full">Login</button>
    </form>
  );
}