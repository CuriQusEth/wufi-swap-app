import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.VITE_TEST_API_KEY': JSON.stringify(env.TEST_API_KEY || 'aktif'),
      'import.meta.env.VITE_KIT_KEY': JSON.stringify(env.VITE_KIT_KEY || 'KIT_KEY:820bd698a4b2db9f0780ae8b79ec5d98:43cb8280ebb7ee3907d460d8a085698e'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
