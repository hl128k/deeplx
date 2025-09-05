import fs from 'node:fs/promises'

import { build } from 'esbuild'

console.log('Building EdgeOne Pages...')

// 清理并重新创建 dist 目录
try {
  await fs.rm('dist', { recursive: true, force: true })
} catch {
  // 目录不存在，忽略
}
await fs.mkdir('dist', { recursive: true })

// 复制静态文件到 dist 根目录
console.log('Copying static files...')
try {
  const publicFiles = await fs.readdir('public')
  for (const file of publicFiles) {
    await fs.copyFile(`public/${file}`, `dist/${file}`)
  }
  console.log('Static files copied successfully')
} catch {
  console.log('No public directory found, skipping static files')
}

// 创建 api 目录用于函数
await fs.mkdir('dist/api', { recursive: true })

// 使用 esbuild 打包函数及其所有依赖
console.log('Bundling EdgeOne function...')
try {
  await build({
    entryPoints: ['edgeone/translate.ts'],
    bundle: true,
    outfile: 'dist/api/translate.js',
    platform: 'node', // 改为 node 平台
    target: 'node18',
    format: 'esm',
    minify: false, // 不压缩，便于调试
    external: [], // 不排除任何依赖，全部打包
  })
  console.log('Function bundled successfully')
} catch (error) {
  console.log('Function bundling failed:', error)
  console.log('Falling back to TypeScript compilation...')
  // 回退到 TypeScript 编译
  const { execSync } = await import('node:child_process')
  execSync('yarn tsc -p tsconfig.edgeone.json', { stdio: 'inherit' })
  // 复制编译后的文件
  await fs.copyFile('dist/api/edgeone/translate.js', 'dist/api/translate.js')
  await fs.rm('dist/api/edgeone', { recursive: true, force: true })
  await fs.rm('dist/api/packages', { recursive: true, force: true })
}

// 确保生成 index.html
console.log('Generating index.html...')
try {
  // 如果 public/index.html 不存在，运行 build 脚本生成它
  const indexExists = await fs
    .access('dist/index.html')
    .then(() => true)
    .catch(() => false)
  if (!indexExists) {
    console.log('index.html not found, running build script...')
    const { execSync } = await import('node:child_process')
    execSync('yarn tsx scripts/build.ts', { stdio: 'inherit' })
  }
} catch (error) {
  console.log('Error generating index.html:', error)
}

console.log('EdgeOne Pages build completed!')
console.log('Deploy files:')
console.log('- dist/index.html (static)')
console.log('- dist/api/translate.js (function)')
console.log(
  '- dist/apple-touch-icon.png dist/favicon_16.png dist/favicon_32.png dist/favicon_96.png (static assets)',
)
