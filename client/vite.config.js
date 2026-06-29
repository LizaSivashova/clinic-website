import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api to the Express server during development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ['uncurled-acrobat-paralyze.ngrok-free.dev', '.ngrok-free.dev', '.ngrok.app'],
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
