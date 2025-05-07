// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';      // ← 纯粹一行 import，没有前缀符号

export default defineConfig({
  plugins: [react()],
  base: '/test/',                    // 仓库名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 别名
    }
  }
});
