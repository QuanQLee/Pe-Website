import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
import clsx from 'clsx';

export default function Navbar() {
  const { theme, toggle } = useTheme();

  const linkCls = ({ isActive }) =>
    clsx(
      'px-3 py-2 rounded-lg text-sm font-medium transition',
      isActive ? 'bg-primary/90 text-white' : 'hover:bg-muted'
    );

  return (
    <nav className="bg-background sticky top-0 z-50 shadow">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <span className="text-xl font-bold tracking-tight">Li&nbsp;Site</span>
        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkCls} end>
            Home
          </NavLink>
          <NavLink to="/blog" className={linkCls}>
            Blog
          </NavLink>
          <NavLink to="/projects" className={linkCls}>
            Projects
          </NavLink>
          <NavLink to="/contact" className={linkCls}>
            Contact
          </NavLink>
          <button
            onClick={toggle}
            className="ml-2 p-2 rounded-lg hover:bg-muted"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}