import fs from 'node:fs/promises'
import path from 'node:path'

console.log('Building EdgeOne Pages...')

await fs.rm('dist', { recursive: true, force: true })
await fs.mkdir('dist', { recursive: true })

// Copy static files from public directory
const publicDir = 'public'
const publicExists = await fs.access(publicDir).then(
  () => true,
  () => false,
)

if (publicExists) {
  const entries = await fs.readdir(publicDir)
  for (const entry of entries) {
    const srcPath = path.join(publicDir, entry)
    const destPath = path.join('dist', entry)
    await fs.copyFile(srcPath, destPath)
  }
  console.log('Copied static files from public/ to dist/')
}

// Copy edge-functions directory to dist
const edgeFunctionsDir = 'edge-functions'
const edgeFunctionsExists = await fs.access(edgeFunctionsDir).then(
  () => true,
  () => false,
)

if (edgeFunctionsExists) {
  const destEdgeFunctionsDir = path.join('dist', 'edge-functions')
  await fs.mkdir(destEdgeFunctionsDir, { recursive: true })

  async function copyDirectory(src: string, dest: string) {
    const entries = await fs.readdir(src, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)

      if (entry.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true })
        await copyDirectory(srcPath, destPath)
      } else {
        await fs.copyFile(srcPath, destPath)
      }
    }
  }

  await copyDirectory(edgeFunctionsDir, destEdgeFunctionsDir)
  console.log('Copied edge-functions/ to dist/edge-functions/')
}

// Create index.html with API documentation
const html =
  '<!doctype html><meta charset="utf-8"><title>DeepL Translate API</title><pre>POST {"text":"Hello","target_lang":"ZH"} to /translate</pre>'
await fs.writeFile('dist/index.html', html)

console.log('Done. EdgeOne deployment package ready in dist/')
