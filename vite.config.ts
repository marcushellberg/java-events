import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import dsv from '@rollup/plugin-dsv';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/java-events.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: /^lit/,
    },
  },
  plugins: [VitePWA({}), dsv()],
});
