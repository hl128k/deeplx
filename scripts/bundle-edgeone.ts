import { build } from 'esbuild'

console.log('Bundling EdgeOne function...')

// 使用 esbuild 打包函数及其所有依赖
await build({
  entryPoints: ['edgeone/translate.ts'],
  bundle: true,
  outfile: 'dist/api/translate.js',
  platform: 'neutral',
  target: 'es2022',
  format: 'esm',
  minify: true,
  external: [], // 不排除任何依赖，全部打包
})

console.log('Function bundled successfully!')
