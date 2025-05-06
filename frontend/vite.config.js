import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  /* ⚠️ 仓库名一定要对，末尾斜杠不能少 */
  base: '/<test>/'
});
