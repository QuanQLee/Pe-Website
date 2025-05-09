import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => { api.get(`/blogs/${slug}`).then(r=>setPost(r.data)); }, [slug]);
  if (!post) return <p className="p-8">加载中……</p>;

  return (
    <article className="prose lg:prose-xl mx-auto py-8">
      <h1>{post.title}</h1>
      <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}