import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    api.get(`/blogs?page=${page}&limit=10`).then(r => setBlogs(r.data)).catch(console.error);
  }, [page]);

  const next = () => {
    setPage(p => {
      const n = p + 1;
      setSearchParams({ page: n });
      return n;
    });
  };
  const prev = () => {
    setPage(p => {
      const n = Math.max(1, p - 1);
      setSearchParams({ page: n });
      return n;
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <ul className="space-y-4 max-w-2xl">
        {blogs.map(b => (
          <li key={b.slug} className="p-4 bg-white rounded-xl shadow">
            <Link to={`/blog/${b.slug}`} className="text-xl font-semibold">
              {b.title}
            </Link>
            <p className="text-sm text-gray-500">
              {new Date(b.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 mt-6">
        <button onClick={prev} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
          ← Prev
        </button>
        <span className="self-center">Page {page}</span>
        <button onClick={next} className="px-3 py-1 bg-gray-200 rounded">
          Next →
        </button>
      </div>
    </div>
  );
}
