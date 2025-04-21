// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ command, ssrBuild }) => ({
  plugins: [vue()],
  build: {
    outDir: ssrBuild ? 'dist-ssr' : 'dist',
    ssrManifest: true,
    rollupOptions: {
      input: ssrBuild ? './entry-server.js' : './entry-client.js',
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  ssr: {
    noExternal: ['vue-the-mask'], // нужно для SSR
  }
}))
