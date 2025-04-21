import { renderToString } from '@vue/server-renderer'
import { createApp } from './src/app'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Получаем текущий путь к файлу
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Пытаемся загрузить критический CSS
let criticalCSS = ''
try {
  const cssPath = resolve(__dirname, './src/style.css')
  criticalCSS = fs.readFileSync(cssPath, 'utf-8')
} catch (e) {
  console.warn('Critical CSS not found:', e.message)
}

import { fetchProducts, fetchCategories } from './src/services/api.service'

export async function render(url, manifest) {
  try {
    // === Заранее получаем данные ===
    const [products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories()
    ])

    const preloadImage = products[0]
      ? `http://localhost:3000${products[0].image_url}`
      : null

    // Создаем приложение с этими данными
    const { app, router } = await createApp(url, { products, categories })

    const ctx = {}
    const appHtml = await renderToString(app, ctx)

    const currentRoute = router.currentRoute.value
    const meta = {
      title: currentRoute.meta?.title || 'Victory Oil Energy',
      description: currentRoute.meta?.description || 'Производство аналоговых нефтегазовых деталей'
    }

    const cssLinks = []
    if (manifest && ctx.modules) {
      for (const id of ctx.modules) {
        const files = manifest[id]
        if (files?.css) {
          cssLinks.push(...files.css.map(file =>
            `<link rel="stylesheet" href="${file}">`))
        }
      }
    }

    return `
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}">
    <link rel="icon" href="/favicon.ico">
    ${criticalCSS ? `<style>${criticalCSS}</style>` : ''}
    ${cssLinks.join('\n')}
    ${preloadImage ? `<link rel="preload" as="image" href="${preloadImage}" fetchpriority="high">` : ''}
  </head>
  <body>
    <div id="app">${appHtml}</div>
    <script type="module" src="/entry-client.js"></script>
  </body>
</html>`
  } catch (err) {
    console.error('Render error:', err)
    return `<!DOCTYPE html><html><head><title>Error</title></head><body>Server error occurred</body></html>`
  }
}
