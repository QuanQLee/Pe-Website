import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
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
      <section className="mb-12 text-center">
        <h1 className="mx-auto mb-4 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          Hi, I’m <span className="text-primary">Li</span>. I build
          <span className="relative mx-2 inline-block before:absolute before:-inset-1 before:-skew-y-3 before:bg-primary">
            <span className="relative text-background">creative</span>
          </span>
          web experiences.
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Physics enthusiast · React developer · Content creator
        </p>
      </section>

      {/* Latest blog */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          <Link to="/blog" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        {blogs.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {blogs.map(b => (
              <article key={b._id} className="rounded-xl border p-5 shadow-sm hover:shadow-md">
                <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
                  <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                </h3>
                <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">{b.content.slice(0, 80)}…</p>
                <time className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleDateString()}</time>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">暂无文章</p>
        )}
      </section>

      {/* Projects */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Link to="/projects" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        {projects.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map(p => (
              <article key={p._id} className="group relative overflow-hidden rounded-xl border shadow-sm">
                <img src={p.image} alt={p.name} className="h-40 w-full object-cover transition-transform group-hover:scale-105" />
                <div className="p-4">
                  <h3 className="mb-1 text-lg font-semibold">
                    <Link to={`/projects/${p._id}`}>{p.name}</Link>
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{p.tagline}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">暂无项目</p>
        )}
      </section>
    </>
  );
}