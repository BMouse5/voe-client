import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isSSR = mode === 'ssr' || process.env.VITE_SSR_BUILD === 'true'

  return {
    plugins: [vue()],
    build: {
      outDir: isSSR ? 'dist-ssr' : 'dist',
      ssr: isSSR ? 'entry-server.js' : undefined,
      cssCodeSplit: true,
      ssrManifest: !isSSR,
      rollupOptions: {
        input: isSSR ? 'entry-server.js' : 'entry-client.js',
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
    ssr: {
      noExternal: ['vue-the-mask'],
    },
  }
})