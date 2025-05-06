import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <ul className="grid md:grid-cols-3 gap-4">
        {projects.map(p => (
          <li key={p._id} className="p-4 bg-white rounded-xl shadow">
            <Link to={`/projects/${p._id}`} className="text-lg font-bold">
              {p.name}
            </Link>
            <p className="text-sm text-gray-500 mb-2">{p.tagline}</p>
            {p.image && <img src={p.image} alt={p.name} className="rounded" />}
          </li>
        ))}
      </ul>
    </div>
  );
}