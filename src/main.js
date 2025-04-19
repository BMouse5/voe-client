import { createSSRApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from '../routes/route'
import './style.css'

export function createApp(url) {
  const app = createSSRApp(App)
  const router = createAppRouter()

  app.use(router)

  // Только на клиенте
//   if (!import.meta.env.SSR) {
//     app.use(VueTheMask);
//   }

  router.push(url)

  return new Promise((resolve) => {
    router.isReady().then(() => resolve(app))
  })
}
