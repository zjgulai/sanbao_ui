#!/usr/bin/env node
/**
 * crawl-states.mjs —— 206 条状态路由的空壳爬检（无 host，fixture 模式）。
 *
 * 用法：pnpm build && node scripts/crawl-states.mjs
 * 对每条 state id：无头加载 dist/index.html?state=<id>，断言
 *   - 页面挂载出 .prototype 根；
 *   - title 未变成 DIAG/异常标记；
 *   - body 未出现 React 崩溃签名（"Application error"/"Minified React error"）。
 * 结果写 evidence/wiring/crawl-results.csv；任一失败 exit 1。
 */
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { extname, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')
const states = JSON.parse(readFileSync(join(root, 'src/catalog-data.json'), 'utf8')).states.map(state => state.id)

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.map': 'application/json', '.png': 'image/png' }
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')
  const file = join(dist, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname))
  if (!file.startsWith(dist)) { res.writeHead(403).end(); return }
  try {
    const body = readFileSync(file)
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch { res.writeHead(404).end() }
})
await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen))
const port = server.address().port
const chrome = process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

function load(stateId) {
  return new Promise(done => {
    const child = spawn(chrome, ['--headless=new', '--disable-gpu', '--force-device-scale-factor=1', '--virtual-time-budget=2500', '--window-size=1280,800', '--dump-dom', `http://127.0.0.1:${port}/index.html?state=${stateId}`], { stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    child.stdout.on('data', chunk => { out += chunk })
    const killer = setTimeout(() => { child.kill('SIGKILL'); done({ dom: out, killed: true }) }, 25000)
    child.on('close', () => { clearTimeout(killer); done({ dom: out, killed: false }) })
  })
}

const results = []
for (const stateId of states) {
  const { dom, killed } = await load(stateId)
  const mounted = dom.includes('class="prototype"')
  const crashed = /Application error|Minified React error/.test(dom)
  const diag = /<title>DIAG/.test(dom)
  const ok = mounted && !crashed && !diag && !killed
  results.push({ stateId, ok, mounted, crashed, killed })
  if (!ok) console.log(`FAIL ${stateId} mounted=${mounted} crashed=${crashed} killed=${killed}`)
}
server.close()
const fails = results.filter(row => !row.ok)
writeFileSync(join(root, 'evidence/wiring/crawl-results.csv'), `state_id,ok,mounted,crashed,killed\n${results.map(row => `${row.stateId},${row.ok},${row.mounted},${row.crashed},${row.killed}`).join('\n')}\n`)
console.log(`crawl: ${results.length - fails.length}/${results.length} ok; failures: ${fails.length}`)
process.exit(fails.length ? 1 : 0)
