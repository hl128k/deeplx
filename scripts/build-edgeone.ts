import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'

console.log('Building EdgeOne functions...')

// 确保 dist/edgeone 目录存在
await fs.mkdir('dist/edgeone', { recursive: true })

// 使用 TypeScript 编译
console.log('Compiling TypeScript...')
// eslint-disable-next-line sonarjs/no-os-command-from-path
execSync('yarn tsc -p tsconfig.edgeone.json', { stdio: 'inherit' })

// 复制 EdgeOne 配置文件
console.log('Copying EdgeOne configuration...')
await fs.copyFile('edgeone.json', 'dist/edgeone.json')

// 生成 package.json 用于 EdgeOne 部署
const packageJson = {
  name: 'deeplx-edgeone',
  version: '1.0.0',
  type: 'module',
  main: './edgeone/translate.js',
  dependencies: {
    // EdgeOne 边缘函数通常需要将依赖打包，这里只是示例
  },
}

await fs.writeFile('dist/package.json', JSON.stringify(packageJson, null, 2))

console.log('EdgeOne build completed!')
console.log('Deploy files:')
console.log('- dist/edgeone/translate.js')
console.log('- dist/edgeone.json')
console.log('- dist/package.json')
