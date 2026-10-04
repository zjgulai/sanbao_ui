#!/usr/bin/env node
/**
 * run-battery.mjs —— 全族回归电池（一条命令跑完所有接线场景）。
 *
 * 用法：pnpm build && node scripts/run-battery.mjs
 * 对每个 [场景目录, stateId] 组合跑 scripts/wire-smoke.mjs；任一非 READY exit 1。
 */
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const PAIRS = [
  ['example-session', 'QDR.P01.home.workspace'],
  ['example-session-fixture', 'QDR.P01.home.workspace'],
  ['session-streaming', 'QDR.P01.home.workspace'],
  ['session-streaming-fixture', 'QDR.P01.home.workspace'],
  ['search', 'QDR.P02.search.empty'],
  ['search-fixture', 'QDR.P02.search.empty'],
  ['search-nosearch', 'QDR.P02.search.empty'],
  ['automation', 'QDR.P03.list.empty'],
  ['automation-fixture', 'QDR.P03.list.empty'],
  ['automation-noread', 'QDR.P03.list.empty'],
  ['usage', 'QDR.OBS01.usage.open'],
  ['usage-fixture', 'QDR.OBS01.usage.open'],
  ['usage-noread', 'QDR.OBS01.usage.open'],
  ['workspace', 'QDR.P13.create.empty'],
  ['workspace-fixture', 'QDR.P13.create.ready'],
  ['artifacts', 'QDR.P01.home.workspace'],
  ['artifacts-noopen', 'QDR.P01.home.workspace'],
  ['artifacts-fixture', 'QDR.P01.home.workspace'],
  ['settings', 'QDR.P06.settings.models.default'],
  ['settings-fixture', 'QDR.P06.settings.models.default'],
  ['settings-no-method', 'QDR.P06.settings.models.default'],
  ['extensions', 'QDR.P04.market.plugins.default'],
  ['extensions-fixture', 'QDR.P04.market.plugins.default'],
  ['extensions-nocap', 'QDR.P04.installed.plugins.empty'],
  ['knowledge', 'QDR.OBS02.knowledge.empty'],
  ['knowledge-fixture', 'QDR.OBS02.knowledge.empty'],
  ['knowledge-wiki-honest', 'QDR.OBS02.repo-wiki.default'],
  ['knowledge-unavailable', 'QDR.OBS02.knowledge.empty'],
  ['sites', 'QDR.OBS03.sites.empty'],
  ['sites-fixture', 'QDR.OBS03.sites.empty'],
  ['sites-honest', 'QDR.OBS03.sites.shared.empty'],
  ['sites-unavailable', 'QDR.OBS03.sites.empty'],
]

let ok = 0
const failures = []
for (const [dir, state] of PAIRS) {
  try {
    const out = execFileSync('node', [join(root, 'scripts/wire-smoke.mjs'), join(root, 'evidence/wiring', dir), state], { encoding: 'utf8', cwd: root })
    if (!out.trim().startsWith('READY')) throw new Error(out.trim().slice(0, 120))
    ok += 1
  } catch (error) {
    failures.push(`${dir} @ ${state}: ${String(error.stdout ?? error.message).trim().slice(0, 200)}`)
  }
}
console.log(`battery: ${ok}/${PAIRS.length} READY`)
for (const line of failures) console.log(`FAIL ${line}`)
process.exit(failures.length ? 1 : 0)
