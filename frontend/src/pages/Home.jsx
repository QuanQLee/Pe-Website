import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

// 左侧文章/项目，右侧展示一到两张图片
const galleryImages = ['/images/pic1.jpg', '/images/pic2.jpg'];

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/blogs').then(res => setBlogs(res.data));
    api.get('/projects').then(res => setProjects(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row items-start gap-12">

        {/* 左侧内容 */}
        <div className="flex-1 space-y-10">
          {/* Hero */}
          <section className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              你好，我是 <span className="text-blue-600">Li</span>
            </h1>
            <p className="text-gray-600 text-lg">欢迎来到我的个人网站，这里分享我的博客和项目。</p>
            <Link to="/blog" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg">
              阅读文章
            </Link>
          </section>

          {/* 最新文章 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">最新文章</h2>
            {blogs.length > 0 ? (
              <div className="space-y-3">
                {blogs.map(b => (
                  <Link
                    key={b.slug}
                    to={`/blog/${b.slug}`}
                    className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                  >
                    {b.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">暂无文章</p>
            )}
          </section>

          {/* 项目展示 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">项目展示</h2>
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map(p => (
                  <Link
                    key={p.id}
                    to={`/projects/${p.id}`}
                    className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">暂无项目</p>
            )}
          </section>
        </div>

        {/* 右侧图片展示 */}
        <div className="w-full md:w-1/2 grid grid-cols-1 gap-6">
          {galleryImages.map((src, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden rounded-xl shadow-lg transition"
            >
              <img src={src} alt={`作品 ${idx + 1}`} className="w-full h-64 md:h-80 object-cover" />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
