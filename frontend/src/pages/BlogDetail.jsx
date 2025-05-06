import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/blogs/${slug}`).then(r => setPost(r.data)).catch(console.error);
  }, [slug]);

  if (!post) return <p>Loading…</p>;

  return (
    <article className="prose max-w-none">
      <h1>{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}