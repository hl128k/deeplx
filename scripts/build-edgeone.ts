import fs from 'node:fs/promises'
import path from 'node:path'

import { build } from 'esbuild'

console.log('Building EdgeOne Pages...')

await fs.rm('dist', { recursive: true, force: true })
await fs.mkdir('dist', { recursive: true })

// Optional: a tiny index so root GET has content
const html =
  '<!doctype html><meta charset="utf-8"><title>DeepL Translate API</title><pre>POST {"text":"Hello","target_lang":"ZH"} to /translate</pre>'
await fs.writeFile('dist/index.html', html)

console.log('Bundling _worker...')
await build({
  entryPoints: ['edgeone/_worker.ts'],
  outfile: 'dist/_worker.js',
  bundle: true,
  platform: 'neutral',
  target: 'es2022',
  format: 'esm',
  sourcemap: true,
  plugins: [
    {
      name: 'alias-whatlang-node',
      setup(b) {
        b.onResolve({ filter: /^whatlang-node$/ }, () => ({
          path: path.resolve('edgeone/shims/whatlang-node.ts'),
        }))
      },
    },
  ],
})

console.log('Done. Deploy dist/_worker.js and dist/index.html')
