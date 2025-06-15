import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Pe-Website/',               // ★ 加这一行，仓库名
});
