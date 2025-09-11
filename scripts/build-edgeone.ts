import fs from 'node:fs/promises'

console.log('Building EdgeOne Pages...')

await fs.rm('dist', { recursive: true, force: true })
await fs.mkdir('dist', { recursive: true })

// Optional: a tiny index so root GET has content
const html =
  '<!doctype html><meta charset="utf-8"><title>DeepL Translate API</title><pre>POST {"text":"Hello","target_lang":"ZH"} to /translate</pre>'
await fs.writeFile('dist/index.html', html)

console.log(
  'Done. EdgeOne will automatically handle ./edge-functions directory.',
)
