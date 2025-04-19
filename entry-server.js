import { renderToString } from '@vue/server-renderer'
import { createApp } from './src/main' // или './entry-server'

export async function render(url) {
  const app = await createApp(url)
  const appHtml = await renderToString(app)
  return appHtml
}
