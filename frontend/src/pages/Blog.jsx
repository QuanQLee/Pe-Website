import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => { api.get('/blogs').then(r => setBlogs(r.data)); }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">博客</h1>
      {blogs.length===0 ? <p>暂无文章</p> : (
        <ul className="space-y-4">
          {blogs.map(b => (
            <li key={b._id} className="p-4 bg-white rounded-lg shadow">
              <Link to={`/blog/${b.slug || b._id}`} className="text-xl font-semibold hover:text-primary-600">
                {b.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">{new Date(b.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}