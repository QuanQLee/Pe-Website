// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: '/test/',
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
