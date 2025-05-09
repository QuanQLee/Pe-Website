import React, { useState } from 'react';
import api from '../api';

export default function Admin() {
  // 登录令牌
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  // 表单数据
  const [form, setForm] = useState({ title: '', slug: '', content: '' });
  // 错误提示
  const [err, setErr] = useState('');

  // 登录：弹出 prompt 输入密码
  const handleLogin = async () => {
    const password = prompt('Password');
    if (!password) return;
    try {
      const r = await api.post('/auth/login', { password });
      localStorage.setItem('token', r.data.token);
      setToken(r.data.token);
      setErr(''); // 清空错误
    } catch (error) {
      console.error(error);
      setErr('Wrong credentials');
    }
  };

  // 发布新文章
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post(
        '/blogs',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Saved!');
      setForm({ title: '', slug: '', content: '' });
      setErr(''); // 清空错误
    } catch (error) {
      console.error(error);
      setErr('Save failed');
    }
  };

  // 没登录先让用户点登录
  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <button className="btn" onClick={handleLogin}>
          Login
        </button>
        {err && <p className="text-red-500">{err}</p>}
      </div>
    );
  }

  // 登录后显示新文章表单
  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4">
      <h2 className="text-2xl font-bold">New Blog</h2>
      {err && <p className="text-red-500">{err}</p>}
      <input
        className="input"
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <input
        className="input"
        placeholder="Slug"
        value={form.slug}
        onChange={e => setForm({ ...form, slug: e.target.value })}
      />
      <textarea
        className="textarea h-40"
        placeholder="Markdown content"
        value={form.content}
        onChange={e => setForm({ ...form, content: e.target.value })}
      />
      <button className="btn-primary" type="submit">
        Publish
      </button>
    </form>
  );
}
