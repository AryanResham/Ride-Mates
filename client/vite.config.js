import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // For development, use localhost; for production, environment variable will be used in the frontend code
  const isDevelopment = mode === 'development';
  
  return {
    plugins: [
      tailwindcss(),
      react()
    ],
    server: {
      proxy: isDevelopment ? {
        '/api': {
          target: 'http://localhost:3500',
          changeOrigin: true,
        },
        '/register': {
          target: 'http://localhost:3500',
          changeOrigin: true,
        },
        '/auth': {
          target: 'http://localhost:3500',
          changeOrigin: true,
        },
        '/logout': {
          target: 'http://localhost:3500',
          changeOrigin: true,
        },
      } : {}
    }
  };
});
