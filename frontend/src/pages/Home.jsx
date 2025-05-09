import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    api.get('/blogs').then(r => setBlogs(r.data));
    api.get('/projects').then(r => setProjects(r.data));
  }, []);

  return (
    <>
      <section className="grid md:grid-cols-2 items-center gap-8 py-12">
        <div>
          <h1 className="text-5xl font-bold mb-4">你好，我是 <span className="text-primary-600">Li</span></h1>
          <p className="text-lg text-gray-600 mb-6">欢迎来到我的个人网站，这里分享我的博客和项目。</p>
          <Link to="/blog" className="btn-primary">阅读博客</Link>
        </div>
        <motion.img src="https://illustrations.popsy.co/gray/web-development.svg" alt="" className="w-full"
          initial={{ opacity:0, x:50 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }} />
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-4">最新文章</h2>
        {blogs.length === 0 ? <p>暂无文章</p> : (
          <div className="grid md:grid-cols-3 gap-6">
            {blogs.map(b => (
              <Link key={b.slug} to={`/blog/${b.slug}`} className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-4">项目展示</h2>
        {projects.length === 0 ? <p>暂无项目</p> : (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map(p => (
              <Link key={p._id} to={`/projects/${p._id}`} className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{p.tagline}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}