import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptDirectory, '..');
const catalogPath = path.join(appRoot, 'src/catalog-data.json');
const appPath = path.join(appRoot, 'src/app.tsx');

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const appSource = readFileSync(appPath, 'utf8');
const observationLiteral = appSource.match(/export const IMPLEMENTED_OBSERVATIONS\s*=\s*\[([\s\S]*?)\]\s*as const;/);

const problems = [];
const addProblem = (message) => problems.push(message);
const unique = (values) => [...new Set(values)];
const duplicateValues = (values) => values.filter((value, index) => values.indexOf(value) !== index);

if (!observationLiteral) addProblem('src/app.tsx 中未找到 IMPLEMENTED_OBSERVATIONS 常量。');

const implementedObservations = observationLiteral
  ? [...observationLiteral[1].matchAll(/'([^']+)'/g)].map((match) => match[1])
  : [];
const states = Array.isArray(catalog.states) ? catalog.states : [];
const groups = Array.isArray(catalog.groups) ? catalog.groups : [];
const groupIds = new Set(groups.map((group) => group.id));
const stateIds = states.map((state) => state.id);
const stateObservationIds = (state) => Array.isArray(state.observationIds) ? state.observationIds : [];
const knownObservationIds = new Set(states.flatMap(stateObservationIds));
const implementedSet = new Set(implementedObservations);

for (const id of unique(duplicateValues(stateIds))) addProblem(`目录存在重复状态 ID：${id}`);
for (const id of unique(duplicateValues(implementedObservations))) addProblem(`IMPLEMENTED_OBSERVATIONS 存在重复观察 ID：${id}`);

for (const state of states) {
  const observationIds = stateObservationIds(state);
  if (!state.id) addProblem('目录存在缺失状态 ID 的记录。');
  if (!state.title) addProblem(`${state.id} 缺少标题。`);
  if (!Array.isArray(state.observationIds)) addProblem(`${state.id} 的 observationIds 不是数组。`);
  if (state.sourceKind === 'observed' && observationIds.length === 0) addProblem(`${state.id} 是已观察叶状态，却缺少 observationIds。`);
  if (!state.trigger?.trim()) addProblem(`${state.id} 缺少进入触发说明。`);
  if (!state.exit?.trim()) addProblem(`${state.id} 缺少退出或恢复说明。`);
  if (!state.evidence?.trim()) addProblem(`${state.id} 缺少证据说明。`);
  if (!['observed', 'entry-observed', 'static-only'].includes(state.sourceKind)) addProblem(`${state.id} 的 sourceKind 无效：${String(state.sourceKind)}`);
  for (const groupId of state.groupIds ?? []) {
    if (!groupIds.has(groupId)) addProblem(`${state.id} 引用了未知候选组：${groupId}`);
  }
}

for (const observationId of implementedSet) {
  if (!knownObservationIds.has(observationId)) addProblem(`IMPLEMENTED_OBSERVATIONS 引用了目录外观察 ID：${observationId}`);
}

const runtimeStates = states.filter((state) => stateObservationIds(state).some((id) => implementedSet.has(id)));
const researchStates = states.filter((state) => !stateObservationIds(state).some((id) => implementedSet.has(id)));
for (const state of runtimeStates) {
  if (state.sourceKind === 'static-only') addProblem(`${state.id} 是 static-only，却被列为可运行场景。`);
}

const countBy = (items, key) => Object.fromEntries([...new Set(items.map(key))].sort().map((name) => [name, items.filter((item) => key(item) === name).length]));
const report = {
  status: problems.length ? 'FAIL' : 'PASS',
  catalog: {
    groups: groups.length,
    states: states.length,
    sourceKinds: countBy(states, (state) => state.sourceKind),
  },
  runtime: {
    declaredObservations: implementedObservations.length,
    renderedStates: runtimeStates.length,
    researchDetails: researchStates.length,
  },
  interactionContract: {
    entriesWithTrigger: states.filter((state) => state.trigger?.trim()).length,
    entriesWithExitOrRecovery: states.filter((state) => state.exit?.trim()).length,
    entriesWithEvidence: states.filter((state) => state.evidence?.trim()).length,
  },
  problems,
};

if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
else if (problems.length) console.error(`FAIL: ${problems.join('\n')}`);
else console.log(`PASS: ${report.catalog.groups} groups; ${report.catalog.states} catalog entries; ${report.runtime.renderedStates} runtime scenes; ${report.runtime.researchDetails} research details; ${report.runtime.declaredObservations} implementation observations; trigger/exit/evidence complete.`);

process.exitCode = problems.length ? 1 : 0;
