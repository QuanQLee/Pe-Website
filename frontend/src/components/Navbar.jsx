import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {ThemeCtx} from '../App';
import {Sun, Moon} from 'lucide-react';

export default function Navbar() {
  const {theme, setTheme} = useContext(ThemeCtx);

  const linkCls = ({isActive}) =>
    `text-sm font-medium px-3 py-2 rounded-xl transition-colors ${
      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
    }`;

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <NavLink to="/" className="text-2xl font-bold">
          Li&nbsp;<span className="text-primary">Site</span>
        </NavLink>
        <nav className="hidden gap-2 md:flex">
          <NavLink to="/blog" className={linkCls}>Blog</NavLink>
          <NavLink to="/projects" className={linkCls}>Projects</NavLink>
          <NavLink to="/contact" className={linkCls}>Contact</NavLink>
        </nav>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="rounded-full p-2 hover:bg-muted">
          {theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}
        </button>
      </div>
    </header>
  );
}