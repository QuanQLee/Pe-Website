import React, {useState} from 'react';
import api from '../api';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [form, setForm] = useState({title:'', slug:'', content:''});

  const handleLogin = () => {
    // Very naive: hit /auth/login get token
    api.post('/auth/login',{password: prompt('Password')}).then(r=>{
      localStorage.setItem('token', r.data.token);
      setToken(r.data.token);
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    api.post('/blogs', form,{headers:{Authorization:`Bearer ${token}`}}).then(()=>{
      alert('saved!');
      setForm({title:'',slug:'',content:''});
    });
  };

  if(!token){
    return <div className="space-y-4 text-center"><button className="btn" onClick={handleLogin}>Login</button></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4">
      <h2 className="text-2xl font-bold">New Blog</h2>
      <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
      <input className="input" placeholder="Slug" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})}/>
      <textarea className="textarea h-40" placeholder="Markdown content" value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/>
      <button className="btn-primary" type="submit">Publish</button>
    </form>
  );
}
