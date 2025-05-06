import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const style = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <span className="text-xl font-bold">Li&nbsp;Site</span>
        <div className="space-x-2">
          <NavLink to="/" className={style} end>
            Home
          </NavLink>
          <NavLink to="/blog" className={style}>
            Blog
          </NavLink>
          <NavLink to="/projects" className={style}>
            Projects
          </NavLink>
          <NavLink to="/contact" className={style}>
            Contact
          </NavLink>
        </div>
      </div>
    </nav>
  );
}