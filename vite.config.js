import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps every asset reference relative, so the same build works on
// GitHub Pages project paths, Netlify, Vercel, or a plain static folder.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
