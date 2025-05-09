import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  useEffect(() => { api.get(`/projects/${id}`).then(r=>setProject(r.data)); }, [id]);
  if (!project) return <p className="p-8">加载中……</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-4">
      <h1 className="text-3xl font-bold">{project.name}</h1>
      <p className="text-gray-700">{project.description}</p>
      {project.image && <img src={project.image} alt={project.name} className="rounded-lg" />}
      {project.link && <a href={project.link} className="text-primary-600 underline">查看源码 / 演示</a>}
    </div>
  );
}