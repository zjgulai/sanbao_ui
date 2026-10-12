import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptDirectory, '..');
const repositoryRoot = path.resolve(appRoot, '../..');
const matrixPath = path.join(repositoryRoot, 'docs/research/qoder/batch26-qoder-cn-044-shell-quicknotes-preflight.json');
const manifestPath = path.join(repositoryRoot, 'docs/research/qoder/batch26-qoder-cn-044-candidate-manifest.json');
const catalogPath = path.join(appRoot, 'src/catalog-data.json');
const appPath = path.join(appRoot, 'src/app.tsx');
const fixturePaths = {
  taskSearch: path.join(appRoot, 'src/pages/TaskSearchWorkspaceWorkbench.tsx'),
  sessionEntry: path.join(appRoot, 'src/pages/SessionWorkspaceEntryWorkbench.tsx'),
  artifact: path.join(appRoot, 'src/pages/ArtifactWorkspaceWorkbench.tsx'),
};

const matrix = JSON.parse(readFileSync(matrixPath, 'utf8'));
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const states = Array.isArray(catalog.states) ? catalog.states : [];
const stateById = new Map(states.map((state) => [state.id, state]));
const appSource = readFileSync(appPath, 'utf8');
const fixtureSource = Object.fromEntries(Object.entries(fixturePaths).map(([key, filePath]) => [key, readFileSync(filePath, 'utf8')]));
const problems = [];
const allowedPrototypeStatuses = new Set([
  'partial-related-fixture',
  'related-fixture-only',
  'partial-split-fixtures',
  'partial-layout-fixture',
  'sidechat-close-fixture-only',
  'create-close-fixture-without-context',
  'partial-related-fixtures',
  'no-dedicated-route',
]);

const add = (message) => problems.push(message);

const fixtureIntegrityAnchors = [
  ['taskSearch', 'taskWorkspaceTask'],
  ['taskSearch', 'taskWorkspaceBulk'],
  ['taskSearch', "event.key === 'Escape'"],
  ['taskSearch', 'archiveRestored'],
  ['sessionEntry', 'PopStateEvent'],
  ['artifact', '摘要定位仅更新本地提示'],
];
const missingFixtureIntegrityAnchors = fixtureIntegrityAnchors
  .filter(([fileKey, anchor]) => !fixtureSource[fileKey].includes(anchor))
  .map(([fileKey, anchor]) => `${fileKey}:${anchor}`);
for (const anchor of missingFixtureIntegrityAnchors) add(`本地 fixture 完整性锚点缺失：${anchor}`);

if (matrix.schema !== 'sanbao.batch26.shell-quicknotes-preflight.v1') add('矩阵 schema 不匹配。');
if (matrix.qoder?.version !== '0.4.4') add(`矩阵 Qoder 版本不是 0.4.4：${String(matrix.qoder?.version)}`);
if (matrix.qoder?.nativeCaptureReady !== false) add('nativeCaptureReady 必须保持 false，直到隔离会话取证完成。');
if (matrix.qoder?.nativeStatus !== 'blocked-active-user-session') add('当前 nativeStatus 必须明确记录活动用户会话阻塞。');
if (matrix.qoder?.nativeStatusMeaning !== 'summary-blocker-class') add('矩阵 nativeStatusMeaning 必须说明这是概括阻塞类别。');
if (matrix.qoder?.latestGateRecheck?.result !== 'blocked-no-isolated-session') add('最新闸门复核必须保持 blocked-no-isolated-session。');
if (matrix.qoder?.latestGateRecheck?.resultMeaning !== 'latest-observed-gate-result') add('矩阵 latestGateRecheck.resultMeaning 必须说明这是最新观测结果。');
if (matrix.prototype?.catalogStateCount !== states.length) add(`目录数量漂移：矩阵=${matrix.prototype?.catalogStateCount}，源码=${states.length}。`);
if (!Array.isArray(matrix.leaves) || matrix.leaves.length !== 8) add(`首批叶数量必须为 8，实际为 ${matrix.leaves?.length ?? 0}。`);

const manifestCatalog = manifest.catalogBaseline ?? {};
if (manifest.schemaVersion !== 'batch26-candidate-manifest-1') add('candidate manifest schema 不匹配。');
if (manifest.qoder?.version !== matrix.qoder?.version) add('candidate manifest 与矩阵的 Qoder 版本不一致。');
if (manifestCatalog.groups !== catalog.groups.length) add(`candidate manifest groups 数量漂移：manifest=${manifestCatalog.groups}，源码=${catalog.groups.length}。`);
if (manifestCatalog.observed !== matrix.prototype?.catalogSourceKinds?.observed) add('candidate manifest observed 数量与矩阵不一致。');
if (manifestCatalog.entryObserved !== matrix.prototype?.catalogSourceKinds?.['entry-observed']) add('candidate manifest entryObserved 数量与矩阵不一致。');
if (manifestCatalog.staticOnly !== matrix.prototype?.catalogSourceKinds?.['static-only']) add('candidate manifest staticOnly 数量与矩阵不一致。');
if (manifestCatalog.nativeObserved044 !== 0) add('candidate manifest nativeObserved044 必须保持 0。');
if (manifest.localPreflight?.status !== 'pass') add('candidate manifest localPreflight 必须为 pass。');
if (manifest.localPreflight?.nativeStatus !== matrix.qoder?.nativeStatus) add('candidate manifest 与矩阵的 nativeStatus 概括阻塞类别不一致。');
if (manifest.localPreflight?.nativeStatusMeaning !== 'summary-blocker-class') add('candidate manifest nativeStatusMeaning 必须说明这是概括阻塞类别。');
if (manifest.localPreflight?.checks !== 36) add(`candidate manifest localPreflight.checks 必须为 36，实际为 ${String(manifest.localPreflight?.checks)}`);
if (manifest.localPreflight?.localFixturePreflight !== '36/36 PASS; pageErrors=0') add('candidate manifest 必须记录最新 36/36 本地 fixture 预检。');
if (manifest.localPreflight?.latestGateRecheck?.result !== matrix.qoder?.latestGateRecheck?.result) add('candidate manifest 与矩阵的 latestGateRecheck.result 不一致。');
if (manifest.localPreflight?.latestGateRecheck?.nativeCaptureReady !== matrix.qoder?.nativeCaptureReady) add('candidate manifest 与矩阵的 nativeCaptureReady 不一致。');
if (manifest.localPreflight?.latestVerification?.localFixturePreflight !== '36/36 PASS; pageErrors=0') add('candidate manifest latestVerification 必须记录 36/36 本地 fixture 预检。');
if (manifest.localPreflight?.latestVerification?.checkedAt !== matrix.prototype?.latestVerification?.checkedAt) add('candidate manifest 与矩阵的 latestVerification.checkedAt 不一致。');
if (manifest.localPreflight?.latestVerification?.checkBatch26 !== 'pass: 8/8 leaves; catalog=206') add('candidate manifest latestVerification 的 checkBatch26 摘要不一致。');
if (manifest.localPreflight?.latestVerification?.crawl !== '206/206 ok; failures=0') add('candidate manifest latestVerification 的 crawl 摘要不一致。');
if (manifest.localPreflight?.latestVerification?.crawlHost !== '206/206 ok; failures=0') add('candidate manifest latestVerification 的 host crawl 摘要不一致。');
if (manifest.latestConsistencyCheck?.nativeCaptureReady !== matrix.qoder?.nativeCaptureReady) add('candidate manifest 最新一致性检查的 nativeCaptureReady 不一致。');
if (manifest.latestConsistencyCheck?.leaves !== '8/8 bundle-static') add('candidate manifest 最新一致性检查必须保持 8/8 bundle-static。');
if (manifest.latestConsistencyCheck?.modelSubmissions !== '6/6') add('candidate manifest 最新一致性检查必须保持 6/6 提交。');
if (manifest.latestConsistencyCheck?.manifestPreflightCrossCheck !== true) add('candidate manifest 必须记录 manifest/preflight 交叉检查通过。');
if (manifest.latestConsistencyCheck?.localFixturePreflight !== '36/36 PASS; pageErrors=0') add('candidate manifest 最新一致性检查必须记录 36/36 本地 fixture 预检。');

const seen = new Set();
for (const leaf of matrix.leaves ?? []) {
  if (!leaf.id || seen.has(leaf.id)) add(`叶 ID 缺失或重复：${leaf.id ?? '(empty)'}`);
  seen.add(leaf.id);
  if (leaf.sourceKind !== 'bundle-static') add(`${leaf.id} 的 sourceKind 必须保持 bundle-static。`);
  if (!allowedPrototypeStatuses.has(leaf.prototypeStatus)) add(`${leaf.id} 使用了未登记的 prototypeStatus：${leaf.prototypeStatus}`);
  if (leaf.nativeStatus || /native-observed/i.test(JSON.stringify(leaf))) add(`${leaf.id} 不得写入 native-observed 状态。`);
  for (const stateId of leaf.catalogStateIds ?? []) {
    const state = stateById.get(stateId);
    if (!state) {
      add(`${leaf.id} 引用了不存在的目录状态：${stateId}`);
      continue;
    }
    if (!['observed', 'entry-observed', 'static-only'].includes(state.sourceKind)) add(`${stateId} sourceKind 无效：${state.sourceKind}`);
  }
  for (const component of leaf.prototypeComponents ?? []) {
    if (!appSource.includes(component)) {
      const componentFiles = [
        path.join(appRoot, 'src/pages', `${component}.tsx`),
        path.join(appRoot, 'src/components', `${component}.tsx`),
      ];
      if (!componentFiles.some(existsSync)) add(`${leaf.id} 的组件锚点不存在：${component}`);
    }
  }
  if (!leaf.nativeGate?.includes('CAP-00') || !leaf.nativeGate?.includes('B24-1')) add(`${leaf.id} 缺少 CAP-00/B24-1 闸门。`);
  if (!leaf.nextAction?.trim()) add(`${leaf.id} 缺少下一动作。`);
}

const report = {
  status: problems.length ? 'FAIL' : 'PASS',
  qoderVersion: matrix.qoder?.version,
  nativeCaptureReady: matrix.qoder?.nativeCaptureReady,
  nativeStatus: matrix.qoder?.nativeStatus,
  leaves: matrix.leaves?.length ?? 0,
  sourceKind: 'bundle-static',
  catalogStates: states.length,
  localFixtureIntegrity: missingFixtureIntegrityAnchors.length ? 'FAIL' : 'PASS',
  manifestConsistency: problems.some((problem) => problem.includes('candidate manifest')) ? 'FAIL' : 'PASS',
  problems,
};

if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
else if (problems.length) console.error(`FAIL: ${problems.join('\n')}`);
else console.log(`PASS: ${report.leaves} B26 leaves; all bundle-static; native capture blocked; catalog=${report.catalogStates}.`);

process.exitCode = problems.length ? 1 : 0;
