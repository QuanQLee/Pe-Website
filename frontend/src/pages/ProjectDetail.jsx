import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    api.get(`/projects/${id}`).then(r => setProject(r.data)).catch(console.error);
  }, [id]);

  if (!project) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{project.name}</h1>
      <p className="text-gray-600">{project.description}</p>
      {project.image && <img src={project.image} alt={project.name} className="rounded" />}
      {project.link && (
        <a href={project.link} target="_blank" rel="noopener" className="text-blue-600 underline">
          View Source / Demo
        </a>
      )}
    </div>
  );
}