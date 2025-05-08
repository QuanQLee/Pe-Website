import { useState } from 'react';
import api from '../api';

api.defaults.headers.common.Authorization = `Bearer ${localStorage.jwt || ''}`;

export default function AdminDashboard() {
  const [title, setT] = useState('');
  const [slug, setS] = useState('');
  const [content, setC] = useState('');

  const publish = async e => {
    e.preventDefault();
    await api.post('/blogs', { title, slug, content });
    alert('Published!');
    setT(''); setS(''); setC('');
  };

  return (
    <form onSubmit={publish} className="prose mx-auto mt-16">
      <h2>New Post</h2>
      <input value={title} onChange={e => setT(e.target.value)} placeholder="Title" className="input w-full" />
      <input value={slug} onChange={e => setS(e.target.value)} placeholder="slug" className="input w-full" />
      <textarea value={content} onChange={e => setC(e.target.value)} rows={12} className="input w-full" />
      <button className="btn-primary mt-4">Publish</button>
    </form>
  );
}
