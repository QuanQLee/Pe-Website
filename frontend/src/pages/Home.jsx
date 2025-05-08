import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    api.get('/blogs?limit=3').then(r => setBlogs(r.data));
    api.get('/projects?limit=3').then(r => setProjects(r.data));
  }, []);
  return (
    <>
      {/* Hero */}
      <section className="min-h-[70vh] grid md:grid-cols-2 place-items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Hi, I’m <span className="text-primary-600">Li</span>.<br />I build <span className="underline decoration-wavy">Physics</span> & AI stuff.
          </h1>
          <p className="text-gray-600 dark:text-gray-300 md:text-xl max-w-lg">
            Follow my journey in coding, science and creative tech.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl px-6 py-3 shadow-lg transition"
          >
            Read the Blog ↗
          </Link>
        </div>
        <motion.img
          src="https://illustrations.popsy.co/gray/web-development.svg"
          alt="hero"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-80 md:w-full select-none pointer-events-none"
        />
      </section>

      {/* Blogs */}
      <section className="py-12">
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((b, i) => (
            <motion.article
              key={b.slug}
              className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-2xl p-6 shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:-translate-y-1 hover:shadow-2xl transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/blog/${b.slug}`} className="text-lg font-semibold hover:underline">
                {b.title}
              </Link>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{b.content}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="py-12">
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.article
              key={p._id}
              className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-2xl p-6 shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:-translate-y-1 hover:shadow-2xl transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/projects/${p._id}`} className="text-lg font-semibold hover:underline">
                {p.name}
              </Link>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{p.tagline}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
