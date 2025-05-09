import React, { useState } from 'react';
import api from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [status, setStatus] = useState('');
  const change=e=>setForm(f=>({...f,[e.target.name]:e.target.value}));
  const submit=async e=>{
    e.preventDefault();
    try { await api.post('/messages',form); setStatus('发送成功'); setForm({ name:'', email:'', subject:'', message:'' }); }
    catch{ setStatus('发送失败，请重试'); }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-4">
      <h1 className="text-3xl font-bold">联系方式</h1>
      <form onSubmit={submit} className="space-y-4">
        <input name="name" value={form.name} onChange={change} required placeholder="姓名" className="w-full p-2 border rounded" />
        <input name="email" type="email" value={form.email} onChange={change} required placeholder="邮箱" className="w-full p-2 border rounded" />
        <input name="subject" value={form.subject} onChange={change} placeholder="主题" className="w-full p-2 border rounded" />
        <textarea name="message" value={form.message} onChange={change} required placeholder="留言" className="w-full p-2 border rounded h-32" />
        <button type="submit" className="btn-primary w-full">发送</button>
        {status && <p className="text-sm text-gray-600">{status}</p>}
      </form>
    </div>
  );
}