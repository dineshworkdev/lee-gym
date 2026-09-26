import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Static assets (images, icons, etc.) live at the workspace root — Lee-Gym/public/
  // Vite's default publicDir is relative to the project root (client/), so we point
  // one level up to reach Lee-Gym/public/.
  publicDir: '../public',

  server: {
    port: 5173,
  },
});
