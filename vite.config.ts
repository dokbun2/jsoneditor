import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/jsoneditor/', // GitHub Pages 배포를 위한 경로
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})