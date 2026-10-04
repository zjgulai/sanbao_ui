#!/usr/bin/env node
/**
 * wiring-ledger.mjs —— 206 页接线账本合成器。
 *
 * 用法：node scripts/wiring-ledger.mjs [--check]
 *   （默认）把 evidence/wiring/ledger.csv 与全部 evidence/wiring/ledger-delta-*.csv 合成，
 *   写回 ledger.csv（status/evidence 翻新），并打印覆盖统计。
 *   --check：只读校验——任何行仍为 todo 时 exit 1 并列出。
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dir = join(root, 'evidence/wiring')
const checkOnly = process.argv.includes('--check')

function parseCsv(text) {
  const lines = text.trim().split('\n')
  const head = lines[0].split(',')
  return lines.slice(1).map(line => {
    const cells = []
    let cur = ''
    let quoted = false
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i]
      if (quoted) {
        if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i += 1 } else quoted = false } else cur += ch
      } else if (ch === '"') quoted = true
      else if (ch === ',') { cells.push(cur); cur = '' }
      else cur += ch
    }
    cells.push(cur)
    return Object.fromEntries(head.map((key, index) => [key, cells[index] ?? '']))
  })
}

const ledger = parseCsv(readFileSync(join(dir, 'ledger.csv'), 'utf8'))
const byId = new Map(ledger.map(row => [row.state_id, row]))
const deltas = readdirSync(dir).filter(name => /^ledger-delta-.*\.csv$/.test(name)).sort()
const seen = new Set()
for (const name of deltas) {
  for (const row of parseCsv(readFileSync(join(dir, name), 'utf8'))) {
    const target = byId.get(row.state_id)
    if (!target) { console.error(`delta ${name}: unknown state ${row.state_id}`); process.exit(2) }
    if (seen.has(row.state_id)) console.warn(`warn: ${row.state_id} covered by multiple deltas; last (${name}) wins`)
    seen.add(row.state_id)
    target.status = row.status
    if (row.wire_depth_target) target.wire_depth_target = row.wire_depth_target
    if (row.evidence) target.evidence = row.evidence
  }
}

const counts = {}
for (const row of ledger) counts[row.status.split('(')[0]] = (counts[row.status.split('(')[0]] ?? 0) + 1
console.log(`deltas: ${deltas.length}; rows: ${ledger.length}`)
console.log('status:', JSON.stringify(counts))
const todos = ledger.filter(row => row.status.startsWith('todo'))
if (todos.length) {
  console.log(`todo (${todos.length}):`)
  for (const row of todos) console.log(`  ${row.state_id} | ${row.groups} | ${row.page}`)
}
if (checkOnly) process.exit(todos.length ? 1 : 0)

const header = 'state_id,groups,page,variant,source_kind,class,wire_depth_target,status,evidence'
const esc = value => /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
const body = ledger.map(row => [row.state_id, row.groups, row.page, row.variant, row.source_kind, row.class, row.wire_depth_target, row.status, row.evidence].map(esc).join(','))
writeFileSync(join(dir, 'ledger.csv'), `${header}\n${body.join('\n')}\n`)
console.log('ledger.csv updated')
process.exit(0)
