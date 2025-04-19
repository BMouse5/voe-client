import { createApp } from 'vue'
import App from './src/App.vue'
import { createAppRouter } from './routes/route'

const app = createApp(App)
const router = createAppRouter()

app.use(router)
router.isReady().then(() => {
  app.mount('#app')
})
