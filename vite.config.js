// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Mona_Fashions/', // 👈 This must match your GitHub repo name
  plugins: [react()],
  base: '/Mona_Fashions/',
});
