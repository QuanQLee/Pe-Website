import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 仓库名 = 你的 GitHub repo 名；末尾的斜杠别丢
export default defineConfig({
  plugins: [react()],
  base: '/test/'          // ★ 改成你的仓库名
});
