import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/test/',            // 和你 gh-pages 的子路径保持一致
  plugins: [react()],
})
