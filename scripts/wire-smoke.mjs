#!/usr/bin/env node
/**
 * wire-smoke.mjs —— 206 页接线批次的浏览器证据跑器（无头 Chrome + title 读数通道）。
 *
 * 用法：
 *   pnpm build                                   # 先构建（dist/ 必须新）
 *   node scripts/wire-smoke.mjs <scenario-dir> [stateId] [virtualTimeBudget]
 *
 * scenario-dir 约定（照抄 evidence/wiring/example-session/）：
 *   host.js    可选：注入 window.__SANBAO_HOST__ stub（页面脚本前执行）
 *   param.js   可选：设定 window.__SMOKE_EXPECT__ 等参数（host 之后执行）
 *   grader.js  必须：分级交互 + document.title 写 READY {...} / FAIL-* / DIAG
 *
 * 输出：<title> 文本。exit 0 = READY，1 = FAIL/TIMEOUT/无标题。
 * CSP 注意：原型页 script-src 'self'，一切证据脚本必须以同源外链方式注入（本脚本负责）。
 */
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const scenarioDir = process.argv[2]
if (!scenarioDir) {
  console.error('usage: node scripts/wire-smoke.mjs <scenario-dir> [stateId] [budgetMs]')
  process.exit(2)
}
const stateId = process.argv[3] ?? 'QDR.P01.home.workspace'
const budget = process.argv[4] ?? '15000'
const dist = join(root, 'dist')
const page = join(dist, '__wire-smoke.html')

const graderPath = join(scenarioDir, 'grader.js')
if (!existsSync(graderPath)) { console.error(`missing ${graderPath}`); process.exit(2) }
const optional = ['host.js', 'param.js'].map(name => ({ name, path: join(scenarioDir, name) }))

let html = readFileSync(join(dist, 'index.html'), 'utf8')
const headTags = optional.filter(item => existsSync(item.path))
  .map(item => `    <script src="./__wire-smoke-${item.name}"></script>`)
  .join('\n')
html = html.replace('</head>', `${headTags}\n  </head>`)
html = html.replace('<script type="module" src="./main.js?build=B24-VIS-W12"></script>', '<script type="module" src="./main.js?build=B24-VIS-W12"></script><script src="./__wire-smoke-grader.js"></script>')
writeFileSync(page, html)
for (const item of optional) {
  if (existsSync(item.path)) writeFileSync(join(dist, `__wire-smoke-${item.name}`), readFileSync(item.path, 'utf8'))
}
writeFileSync(join(dist, '__wire-smoke-grader.js'), readFileSync(graderPath, 'utf8'))

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.map': 'application/json', '.png': 'image/png' }
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')
  const file = join(dist, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname))
  if (!file.startsWith(dist)) { res.writeHead(403).end(); return }
  try {
    const body = readFileSync(file)
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end()
  }
})
await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen))
const port = server.address().port

const chrome = process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const args = ['--headless=new', '--disable-gpu', '--force-device-scale-factor=1', `--virtual-time-budget=${budget}`, '--window-size=1440,900', '--dump-dom', `http://127.0.0.1:${port}/__wire-smoke.html?state=${stateId}`]
const { dom } = await new Promise(done => {
  const child = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'pipe'] })
  let out = ''
  child.stdout.on('data', chunk => { out += chunk })
  child.on('close', code => done({ dom: out, code }))
})

const title = dom.match(/<title>([^<]*)<\/title>/)?.[1] ?? '(no title)'
console.log(title)

server.close()
for (const name of ['__wire-smoke.html', '__wire-smoke-host.js', '__wire-smoke-param.js', '__wire-smoke-grader.js']) {
  try { unlinkSync(join(dist, name)) } catch {}
}
process.exit(title.startsWith('READY') ? 0 : 1)
