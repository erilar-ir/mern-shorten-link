import {defineConfig, loadEnv} from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig(({command, mode}) => {

    if (command === 'serve') {
        return {
            // define: {
            //     'process.env': process.env
            // },
            server: {
                proxy: {
                    '/api': {
                        target: 'http://localhost:5000',
                        changeOrigin: true
                    }
                }
            },
            plugins: [reactRefresh()],
            logLevel: 'error',
            build: {
                minify: false,
            }
        }
    } else {
        process.env = {...process.env, ...loadEnv(mode, process.cwd())}
        return {
            // define: {
            //     'process.env': process.env
            // },
            server: {
                proxy: {
                    '/api': {
                        target: process.env.VITE_BASE_URL,
                        changeOrigin: true
                    }
                }
            },
            plugins: [reactRefresh()],
            logLevel: 'error',
            build: {
                minify: false,
            }
        }
    }

})
