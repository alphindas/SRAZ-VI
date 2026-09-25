// Inlines the built JS, CSS, images and favicon into one shareable HTML file.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'outputs/srazvi-site'
const MIME = { png: 'image/png', webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml' }
const dataUri = (file) => {
  const ext = file.split('.').pop().toLowerCase()
  return `data:${MIME[ext]};base64,${readFileSync(file).toString('base64')}`
}

let html = readFileSync(join(dir, 'index.html'), 'utf8')

html = html.replace(
  /<link rel="stylesheet"[^>]*href="\.?\/?(assets\/[^"]+\.css)"[^>]*>/g,
  (_, f) => `<style>${readFileSync(join(dir, f), 'utf8')}</style>`,
)
html = html.replace(/<link rel="icon"([^>]*)href="\.?\/?([^"]+\.svg)"([^>]*)>/g, (_, a, f, b) => {
  return `<link rel="icon"${a}href="${dataUri(join(dir, f))}"${b}>`
})
html = html.replace(
  /<script type="module"[^>]*src="\.?\/?(assets\/[^"]+\.js)"[^>]*><\/script>/g,
  (_, f) => {
    // Images are referenced as new URL(`name.ext`, import.meta.url).href next to the JS file.
    // Once the JS is inlined that path no longer resolves, so embed the images as data URIs.
    const js = readFileSync(join(dir, f), 'utf8').replace(
      /new URL\(`([^`]+\.(?:png|webp|jpe?g|svg))`,\s*import\.meta\.url\)\.href/g,
      (_m, img) => JSON.stringify(dataUri(join(dir, 'assets', img))),
    )
    return `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`
  },
)

writeFileSync(join(dir, 'srazvi-standalone.html'), html)
console.log('Wrote', join(dir, 'srazvi-standalone.html'))
