import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Home() {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/blogs?limit=3').then(r => setLatestBlogs(r.data)).catch(console.error);
    api.get('/projects?limit=3').then(r => setProjects(r.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-10">
      {/* BLOG PREVIEW */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
        <ul className="grid gap-4 max-w-2xl">
          {latestBlogs.map(b => (
            <li key={b.slug} className="p-4 bg-white rounded-xl shadow">
              <Link to={`/blog/${b.slug}`} className="text-lg font-bold">
                {b.title}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(b.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
        <Link to="/blog" className="inline-block mt-4 text-blue-600">
          View&nbsp;all&nbsp;→
        </Link>
      </section>

      {/* PROJECT PREVIEW */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <ul className="grid md:grid-cols-3 gap-4">
          {projects.map(p => (
            <li key={p._id} className="p-4 bg-white rounded-xl shadow">
              <Link to={`/projects/${p._id}`} className="text-lg font-bold">
                {p.name}
              </Link>
              <p className="text-sm text-gray-500">{p.tagline}</p>
            </li>
          ))}
        </ul>
        <Link to="/projects" className="inline-block mt-4 text-blue-600">
          View&nbsp;all&nbsp;→
        </Link>
      </section>
    </div>
  );
}