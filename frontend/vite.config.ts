import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'axios', 'clsx', 'tailwind-merge', 'react-helmet-async'],
          tanstack: ['@tanstack/react-router', '@tanstack/react-query'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          ui: ['lucide-react'],
        }
      }
    }
  }
})
