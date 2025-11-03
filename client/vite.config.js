import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
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
    }
  }
})
