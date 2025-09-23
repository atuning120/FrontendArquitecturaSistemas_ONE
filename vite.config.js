import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['sockjs-client']
  },
  server: {
    host: true,      // Permite acceder desde la red local
    port: 5173       // (puedes usar el puerto que quieras)
  }




})
