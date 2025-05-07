+ import { resolve } from 'path';
  import react from '@vitejs/plugin-react';

  export default defineConfig({
    plugins: [react()],
    base: '/test/',
+   resolve: {
+     alias: { '@': resolve(__dirname, 'src') }   // ← 新增
+   }
  });
