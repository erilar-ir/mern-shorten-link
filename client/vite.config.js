import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import config from "config";

let baseUrl
if (process.env.NODE_ENV === 'production') {
  baseUrl = process.env.BASE_URL
}
if (process.env.NODE_ENV === 'development') {
  baseUrl = config.get('baseUrl')
}
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: baseUrl,
        changeOrigin: true
      }
    }
  },
  plugins: [reactRefresh()],

})
