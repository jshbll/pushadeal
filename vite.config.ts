import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_SQUARE_APPLICATION_ID': JSON.stringify(process.env.VITE_SQUARE_APPLICATION_ID),
    'import.meta.env.VITE_SQUARE_LOCATION_ID': JSON.stringify(process.env.VITE_SQUARE_LOCATION_ID),
    'import.meta.env.VITE_SQUARE_ACCESS_TOKEN': JSON.stringify(process.env.VITE_SQUARE_ACCESS_TOKEN),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '.cert/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '.cert/cert.pem')),
    },
    host: 'localhost',
    port: 5173,
  },
  base: process.env.NODE_ENV === 'production' ? '/pushadeal.github.io/' : '/',
  build: {
    outDir: 'dist',
  },
});