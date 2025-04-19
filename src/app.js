import { createSSRApp } from 'vue'
import App from './App.vue'
import router from '../routes/route'
import './style.css'
//import VueTheMask from 'vue-the-mask'

export function createApp() {
  const app = createSSRApp(App)
  app.use(router)
//   if (!import.meta.env.SSR) {
//     app.use(VueTheMask);
//   }
  return { app, router }
}
