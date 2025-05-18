import { createApp } from 'vue'
import App from './src/App.vue'
import { createAppRouter } from './routes/route'
import { createPinia } from 'pinia'
const app = createApp(App)
const router = createAppRouter()
const pinia = createPinia()
app.use(router)
app.use(pinia)
router.isReady().then(() => {
  app.mount('#app')
})
