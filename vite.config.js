import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192x192.png', 'icons/mf_logo.png'],
      manifest: {
        name: 'Queens Court',
        short_name: 'QueensCourt',
        description: 'Queens Court Fashion Store',
        start_url: '/',
        display: 'standalone',
        background_color: 'black',
        theme_color: '#000000', 
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/mf_logo.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ]
});
