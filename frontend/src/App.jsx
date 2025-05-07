import React, {useState, createContext} from 'react';
import {Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import {ThemeProvider} from '@/components/ui/theme-provider';

export const ThemeCtx = createContext();

export default function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ThemeCtx.Provider value={{theme, setTheme}}>
        <Navbar />
        <main className="container mx-auto max-w-7xl px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogDetail />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="admin" element={<Admin />} />
          </Routes>
        </main>
      </ThemeCtx.Provider>
    </ThemeProvider>
  );
}
