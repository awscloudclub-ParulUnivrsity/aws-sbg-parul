import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/meetup-rss': {
        target: 'https://www.meetup.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/meetup-rss/, ''),
        // preserve query string
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const qs = req.url.split('?')[1];
            if (qs) proxyReq.path += (proxyReq.path.includes('?') ? '&' : '?') + qs;
          });
        },
      }
    }
  }
})
