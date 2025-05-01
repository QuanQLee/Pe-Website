import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/test/'          // ⚠️ 若仓库名不同请修改
});
VITE_API_BASE=https://personal-site-production.up.railway.app/api
