import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  proxy: {
    '/camera-proxy': {
      target: 'https://webcams.transport.nsw.gov.au',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/camera-proxy/, ''),
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        });
      }
    }
  }
})