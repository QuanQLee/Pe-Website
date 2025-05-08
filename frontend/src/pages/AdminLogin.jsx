import { useState } from 'react';
import api from '../api';

export default function AdminLogin() {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const submit = async e => {
    e.preventDefault();
    try {
      const { token } = (await api.post('/auth/login', { username, password })).data;
      localStorage.setItem('jwt', token);
      location.href = '/admin';      // 登录后跳转
    } catch {
      alert('Wrong credentials');
    }
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-24 space-y-4">
      <input value={username} onChange={e => setU(e.target.value)} placeholder="Username" className="input" />
      <input value={password} onChange={e => setP(e.target.value)} type="password" placeholder="Password" className="input" />
      <button className="btn-primary w-full">Login</button>
    </form>
  );
}
