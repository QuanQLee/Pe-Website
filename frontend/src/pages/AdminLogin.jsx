import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminLogin() {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const { token } = (await api.post('/auth/login', { username, password })).data;
      localStorage.setItem('jwt', token);
      navigate('/admin');
    } catch {
      alert('Wrong credentials');
    }
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-24 space-y-4">
      <input value={username} onChange={e => setU(e.target.value)} placeholder="Username" className="input w-full" />
      <input type="password" value={password} onChange={e => setP(e.target.value)} placeholder="Password" className="input w-full" />
      <button className="btn-primary w-full">Login</button>
    </form>
  );
}
