import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'

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

// 编译 TypeScript 函数
console.log('Compiling EdgeOne functions...')
// eslint-disable-next-line sonarjs/no-os-command-from-path
execSync('yarn tsc -p tsconfig.edgeone.json', { stdio: 'inherit' })

// 将编译后的函数文件移动到正确位置
console.log('Organizing function files...')
try {
  await fs.copyFile('dist/api/edgeone/translate.js', 'dist/api/translate.js')
  // 清理多余的目录
  await fs.rm('dist/api/edgeone', { recursive: true, force: true })
  await fs.rm('dist/api/packages', { recursive: true, force: true })
  // 删除 tsbuildinfo 文件
  await fs.unlink('dist/api/tsconfig.edgeone.tsbuildinfo')
} catch (error) {
  console.log('Error organizing files:', error)
}

console.log('EdgeOne Pages build completed!')
console.log('Deploy files:')
console.log('- dist/index.html (static)')
console.log('- dist/api/translate.js (function)')
console.log('- dist/*.png (static assets)')
