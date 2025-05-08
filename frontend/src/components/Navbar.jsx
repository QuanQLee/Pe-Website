import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
export default function Navbar() {
  const [scrolled, setS] = useState(false);
  useEffect(() => {
    const onScroll = () => setS(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const cls =
    'fixed inset-x-0 top-0 z-50 backdrop-blur transition-all ' +
    (scrolled ? 'bg-white/80 dark:bg-slate-900/80 shadow' : 'bg-transparent');
  const link = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'bg-primary-600 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700/70'}`;
  return (
    <nav className={cls}>
      <div className="container mx-auto flex items-center justify-between px-4 h-14">
        <span className="font-bold">Li Site</span>
        <div className="space-x-1">
          <NavLink to="/" className={link} end>
            Home
          </NavLink>
          <NavLink to="/blog" className={link}>
            Blog
          </NavLink>
          <NavLink to="/projects" className={link}>
            Projects
          </NavLink>
          <NavLink to="/contact" className={link}>
            Contact
          </NavLink>
        </div>
      </div>
    </nav>
  );
}