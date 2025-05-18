import { createSSRApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from '../routes/route'
import { createPinia } from 'pinia'
import './style.css'

export function createApp(url) {
  const app = createSSRApp(App)
  const router = createAppRouter()
  const pinia = createPinia()
  app.use(router)
  app.use(pinia)
  // Только на клиенте
//   if (!import.meta.env.SSR) {
//     app.use(VueTheMask);
//   }

  router.push(url)

  return new Promise((resolve) => {
    router.isReady().then(() => resolve(app))
  })
}
