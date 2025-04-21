import { createSSRApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from '../routes/route'
import './style.css'

export async function createApp(url, initialData = {}) {
  const app = createSSRApp(App)
  const router = createAppRouter()

  app.provide('initialProducts', initialData.products || [])
  app.provide('initialCategories', initialData.categories || [])

  app.use(router)

  if (url) {
    try {
      await router.push(url)
      await router.isReady()
    } catch (err) {
      console.error('Router error:', err)
      // Можно добавить обработку ошибок маршрутизации
    }
  }

  return { app, router } // Теперь возвращаем оба объекта
}