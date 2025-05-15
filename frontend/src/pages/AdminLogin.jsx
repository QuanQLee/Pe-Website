import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminLogin() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      // 发起登录请求，拿到 token
      const { token } = (await api.post('/auth/login', { username: u, password: p })).data;
      // 关键：存入 localStorage
      localStorage.setItem('token', token);
      // 跳转后台
      nav('/admin');
    } catch {
      alert('登录失败');
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto mt-24 space-y-4">
      <input value={u} onChange={e => setU(e.target.value)} placeholder="用户名" className="input w-full" />
      <input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="密码" className="input w-full" />
      <button className="btn-primary w-full">登录</button>
    </form>
  );
}
