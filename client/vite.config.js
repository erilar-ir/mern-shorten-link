import { defineConfig, loadEnv } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true
          }
        }
      },
      plugins: [reactRefresh()]    }
  } else {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())}
    return {
      server: {
        proxy: {
          '/api': {
            target: process.env.VITE_BASE_URL,
            changeOrigin: true
          }
        }
      },
      plugins: [reactRefresh()]      }
  }
})
