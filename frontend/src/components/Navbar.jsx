import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const active = 'text-primary-600 font-semibold';
  const normal = 'text-gray-700 hover:text-primary-500';
  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">LI的网站</div>
        <div className="space-x-4">
          <NavLink to="/" className={({isActive}) => isActive ? active : normal}>首页</NavLink>
          <NavLink to="/blog" className={({isActive}) => isActive ? active : normal}>博客</NavLink>
          <NavLink to="/projects" className={({isActive}) => isActive ? active : normal}>项目</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? active : normal}>联系</NavLink>
          <NavLink to="/admin/login" className={({isActive}) => isActive ? active : normal}>管理</NavLink>
        </div>
      </div>
    </nav>
  );
}