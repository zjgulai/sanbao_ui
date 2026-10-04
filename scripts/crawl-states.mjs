#!/usr/bin/env node
/**
 * crawl-states.mjs —— 206 条状态路由爬检。
 *
 * 用法：pnpm build && node scripts/crawl-states.mjs [--host]
 * 对每条 state id：无头加载 dist/index.html?state=<id>，断言
 *   - 页面挂载出 .prototype 根；
 *   - title 未变成 DIAG/异常标记；
 *   - body 未出现 React 崩溃签名（"Application error"/"Minified React error"）。
 * --host：加载前注入全能力 host stub（有壳分支不得崩溃）。
 * 结果写 evidence/wiring/crawl-results[-host].csv；任一失败 exit 1。
 */
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { extname, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')
const states = JSON.parse(readFileSync(join(root, 'src/catalog-data.json'), 'utf8')).states.map(state => state.id)
const withHost = process.argv.includes('--host')
const hostScript = `<script src="./__crawl-host.js"></script>`
if (withHost) {
  writeFileSync(join(dist, '__crawl-host.js'), `// 爬检用全能力 host stub（只读事实 + 动作回执；无真实调用）。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () { return { state: 'read', name: 'crawl-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' }; },
  startRequirement: async function () { return { state: 'opened', sessionRef: 'session-crawl-001' }; },
  readSession: async function (ref) { return { state: 'read', sessionRef: ref, streaming: false, pendingClarification: null, messages: [{ role: 'assistant', text: '爬检壳侧消息。' }], artifacts: [{ name: 'demo.html', kind: 'output', additions: 1, deletions: 0 }] }; },
  stopSession: async function () { return { state: 'stopped' }; },
  answerClarification: async function () { return { state: 'submitted' }; },
  searchSessions: async function () { return { state: 'read', results: [{ sessionRef: 'session-crawl-001', title: '爬检命中', subtitle: 'shell' }] }; },
  readAutomations: async function () { return { state: 'read', items: [{ title: '爬检自动化', schedule: '每天 09:00', enabled: true }] }; },
  readUsage: async function () { return { state: 'read', plan: { remaining: 1, total: 2 }, resources: { remaining: 1, total: 2 } }; },
  openArtifact: async function () { return { state: 'opened' }; },
  readSettings: async function () { return { state: 'read', namespaces: [{ ns: 'llm', saved: 'user', applies: 'live', revision: 1, secrets: { set: 1, total: 1 } }] }; },
  readCapabilities: async function () { return { state: 'read', entries: [{ id: 'crawl', label: '爬检能力', configured: true, enabled: false }] }; }
};`)
}

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

let entryPage = 'index.html'
if (withHost) {
  entryPage = '__crawl.html'
  writeFileSync(join(dist, entryPage), readFileSync(join(dist, 'index.html'), 'utf8').replace('</head>', `    ${hostScript}\n  </head>`))
}

function load(stateId) {
  return new Promise(done => {
    const child = spawn(chrome, ['--headless=new', '--disable-gpu', '--force-device-scale-factor=1', '--virtual-time-budget=2500', '--window-size=1280,800', '--dump-dom', `http://127.0.0.1:${port}/${entryPage}?state=${stateId}`], { stdio: ['ignore', 'pipe', 'pipe'] })
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
if (withHost) { try { unlinkSync(join(dist, '__crawl.html')); unlinkSync(join(dist, '__crawl-host.js')) } catch {} }
const fails = results.filter(row => !row.ok)
const outName = withHost ? 'crawl-results-host.csv' : 'crawl-results.csv'
writeFileSync(join(root, 'evidence/wiring', outName), `state_id,ok,mounted,crashed,killed\n${results.map(row => `${row.stateId},${row.ok},${row.mounted},${row.crashed},${row.killed}`).join('\n')}\n`)
console.log(`crawl${withHost ? ' (host)' : ''}: ${results.length - fails.length}/${results.length} ok; failures: ${fails.length}`)
process.exit(fails.length ? 1 : 0)
