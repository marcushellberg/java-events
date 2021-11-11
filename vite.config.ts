import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import dsv from '@rollup/plugin-dsv';

// https://vitejs.dev/config/
export default defineConfig({
  build: {},
  plugins: [
    VitePWA({
      manifest: {
        name: 'Java Events',
        short_name: 'JEvents',
      },
    }),
  ],
});
