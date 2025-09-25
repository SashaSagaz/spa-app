import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://109.73.206.144:6969',
        changeOrigin: true,
        // 👇 эта строчка удаляет "/api" перед отправкой на сервер
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
