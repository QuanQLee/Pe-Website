import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/test/' // ← 记得替换为你的仓库名, 前后斜杠保留
});
