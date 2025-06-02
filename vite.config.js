import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',  // or simply remove this line entirely (default is '/')
  plugins: [react()],
});
