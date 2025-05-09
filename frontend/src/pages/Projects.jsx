import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => { api.get('/projects').then(r=>setProjects(r.data)); }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">项目</h1>
      {projects.length===0 ? <p>暂无项目</p> : (
        <ul className="grid md:grid-cols-3 gap-6">
          {projects.map(p=> (
            <li key={p._id} className="bg-white rounded-lg shadow p-4">
              <Link to={`/projects/${p._id}`} className="text-xl font-semibold hover:text-primary-600">
                {p.name}
              </Link>
              <p className="text-sm text-gray-500 mt-1">{p.tagline}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}