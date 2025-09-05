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

// 生成简单的 index.html（不依赖 GitHub API）
console.log('Generating index.html...')
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeepL Translate API</title>
    <link rel="icon" type="image/png" href="/favicon_16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="/favicon_32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicon_96.png" sizes="96x96">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 2rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        h1 {
            color: #2d3748;
            border-bottom: 3px solid #667eea;
            padding-bottom: 0.5rem;
        }
        .api-section {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 1rem;
            margin: 1.5rem 0;
            border-radius: 4px;
        }
        code {
            background: #e2e8f0;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.9em;
        }
        pre {
            background: #2d3748;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
        }
        pre code {
            background: none;
            color: inherit;
        }
        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            margin-right: 0.5rem;
        }
        .method.get { background: #48bb78; color: white; }
        .method.post { background: #4299e1; color: white; }
        a {
            color: #667eea;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #718096;
        }
        .notice {
            background: #fef2e8;
            border: 1px solid #f6ad55;
            border-radius: 4px;
            padding: 1rem;
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 DeepL Translate API</h1>
        
        <p>An unofficial but powerful and easy-to-use yet free DeepL API client.</p>
        
        <div class="notice">
            <strong>📍 Note:</strong> This is the documentation page. The actual API endpoint is at <code>/translate</code>
        </div>

        <div class="api-section">
            <h2>API Endpoint</h2>
            <p><strong>Base URL:</strong> <code>/translate</code></p>
            <p>GET /translate → Returns API usage instructions</p>
            <p>POST /translate → Performs translation</p>
        </div>

        <div class="api-section">
            <h2>Available Methods</h2>
            
            <h3><span class="method get">GET</span> /translate</h3>
            <p>Returns API usage instructions (text/plain response).</p>
            
            <h3><span class="method post">POST</span> /translate</h3>
            <p>Translates text using DeepL.</p>
            
            <h4>Request Body:</h4>
            <pre><code>{
  "text": "Hello, world!",
  "source_lang": "EN",    // Optional: auto-detect if not specified
  "target_lang": "ZH"     // Required: target language code
}</code></pre>
            
            <h4>Response:</h4>
            <pre><code>{
  "code": 200,
  "data": "你好，世界！"
}</code></pre>
        </div>

        <div class="api-section">
            <h2>Supported Languages</h2>
            <p>
                BG (Bulgarian), ZH (Chinese), CS (Czech), DA (Danish), NL (Dutch), 
                EN (English), ET (Estonian), FI (Finnish), FR (French), DE (German), 
                EL (Greek), HU (Hungarian), IT (Italian), JA (Japanese), LV (Latvian), 
                LT (Lithuanian), PL (Polish), PT (Portuguese), RO (Romanian), 
                RU (Russian), SK (Slovak), SL (Slovenian), ES (Spanish), 
                SV (Swedish), UK (Ukrainian)
            </p>
        </div>

        <div class="api-section">
            <h2>Example Usage</h2>
            
            <h4>Using cURL:</h4>
            <pre><code># Get API info
curl https://your-domain.com/translate

# Translate text
curl -X POST https://your-domain.com/translate \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Hello", "target_lang": "ZH"}'</code></pre>
            
            <h4>Using JavaScript:</h4>
            <pre><code>const response = await fetch('/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Hello, world!',
    target_lang: 'ZH'
  })
});
const result = await response.json();</code></pre>
        </div>

        <div class="footer">
            <p>
                Powered by <a href="https://github.com/un-ts/deeplx" target="_blank">DeepLX</a> | 
                <a href="https://github.com/un-ts/deeplx" target="_blank">GitHub Repository</a>
            </p>
        </div>
    </div>
</body>
</html>`

await fs.writeFile('dist/index.html', indexHtml)
console.log('index.html generated successfully')

// 复制静态文件到 dist 根目录
console.log('Copying static files...')
try {
  const publicFiles = await fs.readdir('public')
  for (const file of publicFiles) {
    if (file.endsWith('.png')) {
      // 只复制图片文件
      await fs.copyFile(`public/${file}`, `dist/${file}`)
    }
  }
  console.log('Static files copied successfully')
} catch {
  console.log('No public directory found, creating default favicons...')
  // 如果没有 public 目录，创建默认的占位图标
  const defaultIcon = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64',
  )
  await fs.writeFile('dist/favicon_16.png', defaultIcon)
  await fs.writeFile('dist/favicon_32.png', defaultIcon)
  await fs.writeFile('dist/favicon_96.png', defaultIcon)
  await fs.writeFile('dist/apple-touch-icon.png', defaultIcon)
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
    platform: 'node',
    target: 'node18',
    format: 'esm',
    minify: false,
    external: [],
  })
  console.log('Function bundled successfully')
} catch {
  console.log(
    'Function bundling failed, falling back to TypeScript compilation...',
  )
  // 回退到 TypeScript 编译
  const { execSync } = await import('node:child_process')
  execSync('yarn tsc -p tsconfig.edgeone.json', { stdio: 'inherit' })
  // 复制编译后的文件
  try {
    await fs.copyFile('dist/api/edgeone/translate.js', 'dist/api/translate.js')
    await fs.rm('dist/api/edgeone', { recursive: true, force: true })
    await fs.rm('dist/api/packages', { recursive: true, force: true })
  } catch {
    console.log('Error organizing compiled files')
  }
}

console.log('EdgeOne Pages build completed!')
console.log('Deploy files:')
console.log('- dist/index.html (static)')
console.log('- dist/api/translate.js (function)')
console.log('- dist/*.png (static assets)')
