import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: process.env.BASE_URL,
        changeOrigin: true
      }
    }
  },
  plugins: [reactRefresh()],

})
