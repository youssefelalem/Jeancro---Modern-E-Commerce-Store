import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      react({
        // Include .js files in Fast Refresh
        include: '**/*.{jsx,tsx,js,ts}',
      }),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env['GEMINI_API_KEY']),
      'process.env.GEMINI_API_KEY': JSON.stringify(env['GEMINI_API_KEY']),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      open: true,
      cors: true,
    },
    build: {
      target: 'es2022',
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ai: ['@google/generative-ai'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
  };
});
