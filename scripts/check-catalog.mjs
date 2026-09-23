import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const { groups, states } = JSON.parse(await readFile(new URL('../src/catalog-data.json', import.meta.url), 'utf8'));
const baselineIds = Object.entries({ P: 17, O: 14, S: 13, M: 5, A: 6 }).flatMap(([prefix, count]) =>
  Array.from({ length: count }, (_, index) => `${prefix}${String(index + 1).padStart(2, '0')}`));
const batch01 = {
  'QB1-01': 'QDR.P03.list.empty',
  'QB1-02': 'QDR.P03.create.empty',
  'QB1-03': 'QDR.P02.search.empty',
  'QB1-04': 'QDR.P13.create.empty',
  'QB1-05': 'QDR.P13.create.ready',
  'QB1-06': 'QDR.P01.home.workspace',
  'QB1-07': 'QDR.S01.session.running',
  'QB1-08': 'QDR.S01.session.streaming',
  'QB1-09': 'QDR.S02.clarification.waiting',
  'QB1-10': 'QDR.S02.clarification.custom',
  'QB1-11': 'QDR.S02.clarification.submitted',
  'QB1-12': 'QDR.M01.reply.completed',
  'QB1-13': 'QDR.M01.reply.actions',
  'QB1-14': 'QDR.P16.review.summary',
  'QB1-15': 'QDR.S10.context.usage',
  'QB1-16': 'QDR.OBS01.usage.open',
  'QB1-17': 'QDR.M02.file.writing',
  'QB1-18': 'QDR.A02.output.html',
  'QB1-19': 'QDR.A01.changes.created',
  'QB1-20': 'QDR.P14.preview.html',
  'QB1-21': 'QDR.A01.diff.created',
  'QB1-22': 'QDR.M02.edit.expanded',
  'QB1-23': 'QDR.A01.diff.modified',
  'QB1-24': 'QDR.S08.reply.interrupted',
  'QB1-25': 'QDR.S08.reply.continued',
  'QB1-26': 'QDR.P01.anchor.preview',
};
const historical = {
  'QD0-01': { id: 'QDR.OBS02.knowledge.entry', sourceKind: 'entry-observed', groupIds: ["OBS02"] },
  'QD0-02': { id: 'QDR.OBS03.sites.entry', sourceKind: 'entry-observed', groupIds: ["OBS03"] },
  'QD0-03': { id: 'QDR.O01.context.menu.open', sourceKind: 'observed', groupIds: ["O01","O02"] },
  'QD0-04': { id: 'QDR.O02.skills.menu.open', sourceKind: 'observed', groupIds: ["O02"] },
  'QD0-05': { id: 'QDR.P06.settings.mobile.partial', sourceKind: 'observed', groupIds: ["P06"] },
  'QD0-06': { id: 'QDR.P14.terminal.entry', sourceKind: 'entry-observed', groupIds: ["P14"] },
  'QD0-07': { id: 'QDR.P14.sidepanel.entry', sourceKind: 'entry-observed', groupIds: ["P14"] },
};
const batch03 = {
  'QB3-01': { id: 'QDR.P06.settings.appearance.default', group: 'P06', page: 'settings', variant: 'default' },
  'QB3-02': { id: 'QDR.P06.settings.appearance.color-mode.open', group: 'P06', page: 'settings', variant: 'color-mode' },
  'QB3-03': { id: 'QDR.P06.settings.appearance.terminal-theme.open', group: 'P06', page: 'settings', variant: 'terminal-theme' },
  'QB3-04': { id: 'QDR.P06.settings.appearance.language.open', group: 'P06', page: 'settings', variant: 'language' },
  'QB3-05': { id: 'QDR.P06.settings.appearance.font-style.open', group: 'P06', page: 'settings', variant: 'font-style' },
  'QB3-06': { id: 'QDR.P06.settings.appearance.content-width.open', group: 'P06', page: 'settings', variant: 'content-width' },
  'QB3-07': { id: 'QDR.P06.settings.appearance.file-icons.open', group: 'P06', page: 'settings', variant: 'file-icons' },
  'QB3-08': { id: 'QDR.P06.settings.appearance.icon-appearance.open', group: 'P06', page: 'settings', variant: 'icon-appearance' },
  'QB3-09': { id: 'QDR.OBS04.user.menu.open', group: 'OBS04', page: 'discovery', variant: 'user-menu' },
  'QB3-10': { id: 'QDR.OBS04.appearance.menu.open', group: 'OBS04', page: 'discovery', variant: 'appearance-menu' },
  'QB3-11': { id: 'QDR.OBS04.appearance.language.open', group: 'OBS04', page: 'discovery', variant: 'quick-appearance-language' },
  'QB3-12': { id: 'QDR.OBS04.appearance.color-mode.open', group: 'OBS04', page: 'discovery', variant: 'quick-appearance-color-mode' },
  'QB3-13': { id: 'QDR.OBS04.appearance.theme.open', group: 'OBS04', page: 'discovery', variant: 'quick-appearance-theme' },
  'QB3-14': { id: 'QDR.OBS04.appearance.font-style.open', group: 'OBS04', page: 'discovery', variant: 'quick-appearance-font-style' },
  'QB3-15': { id: 'QDR.OBS04.appearance.text-size.open', group: 'OBS04', page: 'discovery', variant: 'quick-appearance-text-size' },
  'QB3-16': { id: 'QDR.OBS04.appearance.ui-scale.open', group: 'OBS04', page: 'discovery', variant: 'quick-appearance-ui-scale' },
  'QB3-17': { id: 'QDR.OBS04.appearance.content-width.open', group: 'OBS04', page: 'discovery', variant: 'quick-appearance-content-width' },
};
const batch05 = {
  'QB5-01': { id: 'QDR.O02.goal.mode.active', group: 'O02', page: 'home', variant: 'goal-mode' },
  'QB5-02': { id: 'QDR.O02.plan.mode.active', group: 'O02', page: 'home', variant: 'plan-mode' },
  'QB5-03': { id: 'QDR.O02.sites.templates.open', group: 'O02', page: 'home', variant: 'site-templates' },
  'QB5-04': { id: 'QDR.O02.files.menu.open', group: 'O02', page: 'home', variant: 'files-menu' },
  'QB5-05': { id: 'QDR.OBS02.knowledge.empty', group: 'OBS02', page: 'knowledge', variant: 'empty' },
  'QB5-06': { id: 'QDR.OBS02.knowledge.create.open', group: 'OBS02', page: 'knowledge', variant: 'create' },
  'QB5-07': { id: 'QDR.OBS03.sites.empty', group: 'OBS03', page: 'sites', variant: 'empty' },
};
const batch06 = {
  'QB6-01': { id: 'QDR.O02.plugins.menu.open', group: 'O02', page: 'home', variant: 'plugins-menu' },
  'QB6-02': { id: 'QDR.OBS02.knowledge.workspace-filter.open', group: 'OBS02', page: 'knowledge', variant: 'workspace-filter' },
  'QB6-03': { id: 'QDR.OBS02.repo-wiki.default', group: 'OBS02', page: 'knowledge', variant: 'repo-wiki' },
  'QB6-04': { id: 'QDR.OBS02.repo-wiki.generated.empty', group: 'OBS02', page: 'knowledge', variant: 'repo-wiki-generated' },
  'QB6-05': { id: 'QDR.OBS02.repo-wiki.list', group: 'OBS02', page: 'knowledge', variant: 'repo-wiki-list' },
  'QB6-06': { id: 'QDR.OBS02.repo-wiki.setup', group: 'OBS02', page: 'knowledge', variant: 'repo-wiki-setup' },
  'QB6-07': { id: 'QDR.OBS03.sites.shared.empty', group: 'OBS03', page: 'sites', variant: 'shared' },
  'QB6-08': { id: 'QDR.OBS03.sites.loading', group: 'OBS03', page: 'sites', variant: 'loading' },
};
const batch07 = {
  'QB7-01': { id: 'QDR.P06.settings.profile.default', group: 'P06', page: 'settings', variant: 'profile' },
};
const batch08 = {
  'QB8-01': { id: 'QDR.P04.installed.plugins.empty', groupIds: ["P04", "P06"], page: 'settings', variant: 'extensions-plugins' },
  'QB8-02': { id: 'QDR.P04.installed.skills.empty', groupIds: ["P04", "P06"], page: 'settings', variant: 'extensions-skills' },
  'QB8-03': { id: 'QDR.P04.installed.connectors.empty', groupIds: ["P04", "P06"], page: 'settings', variant: 'extensions-connectors' },
  'QB8-04': { id: 'QDR.P04.installed.agents.empty', groupIds: ["P04", "P06"], page: 'settings', variant: 'extensions-agents' },
  'QB8-05': { id: 'QDR.P04.installed.plugins.add.open', groupIds: ["P04", "P06"], page: 'settings', variant: 'extensions-plugin-add' },
  'QB8-06': { id: 'QDR.P04.installed.skills.add.open', groupIds: ["P04", "P06"], page: 'settings', variant: 'extensions-skill-add' },
  'QB8-07': { id: 'QDR.P04.market.skills.default', groupIds: ["P04"], page: 'extensions', variant: 'skills' },
  'QB8-08': { id: 'QDR.P04.market.plugins.default', groupIds: ["P04"], page: 'extensions', variant: 'plugins' },
};
const batch09 = {
  'QB9-01': { id: 'QDR.P04.market.plugins.ppt.detail', groupIds: ['P04'], page: 'extensions', variant: 'plugins-ppt-detail' },
};
const batch10 = {
  'QB10-01': { id: 'QDR.P04.market.skills.deep-research.detail', groupIds: ['P04'], page: 'extensions', variant: 'skills-deep-research-detail' },
  'QB10-02': { id: 'QDR.P04.market.skills.search.match', groupIds: ['P04'], page: 'extensions', variant: 'skills-search-match' },
  'QB10-03': { id: 'QDR.P04.market.skills.search.empty', groupIds: ['P04'], page: 'extensions', variant: 'skills-search-empty' },
  'QB10-04': { id: 'QDR.P04.market.skills.featured', groupIds: ['P04'], page: 'extensions', variant: 'skills-featured' },
  'QB10-05': { id: 'QDR.P04.market.skills.latest', groupIds: ['P04'], page: 'extensions', variant: 'skills-latest' },
  'QB10-06': { id: 'QDR.P04.market.connectors.default', groupIds: ['P04'], page: 'extensions', variant: 'connectors' },
  'QB10-07': { id: 'QDR.P04.market.connectors.github.detail', groupIds: ['P04'], page: 'extensions', variant: 'connectors-github-detail' },
};
const batch11 = {
  'QB11-01': { id: 'QDR.O08.mcp.form.empty', groupIds: ['O08', 'P04'], page: 'settings', variant: 'extensions-connectors-mcp-form' },
  'QB11-02': { id: 'QDR.O08.mcp.json.default', groupIds: ['O08', 'P04'], page: 'settings', variant: 'extensions-connectors-mcp-json' },
  'QB11-03': { id: 'QDR.O08.mcp.transport.open', groupIds: ['O08', 'P04'], page: 'settings', variant: 'extensions-connectors-mcp-transport' },
  'QB11-04': { id: 'QDR.O08.mcp.form.stdio', groupIds: ['O08', 'P04'], page: 'settings', variant: 'extensions-connectors-mcp-stdio' },
};
const batch12 = {
  'QB12-01': { id: 'QDR.O08.mcp.form.http', groupIds: ['O08', 'P04'], page: 'settings', variant: 'extensions-connectors-mcp-http' },
  'QB12-02': { id: 'QDR.O08.mcp.http.header-row', groupIds: ['O08', 'P04'], page: 'settings', variant: 'extensions-connectors-mcp-http-header' },
  'QB12-03': { id: 'QDR.O08.mcp.form.sse', groupIds: ['O08', 'P04'], page: 'settings', variant: 'extensions-connectors-mcp-sse' },
  'QB12-04': { id: 'QDR.O08.mcp.name.preview', groupIds: ['O08', 'P04'], page: 'settings', variant: 'extensions-connectors-mcp-sse-named' },
  'QB12-05': { id: 'QDR.O08.mcp.discard.open', groupIds: ['O08', 'P04'], page: 'settings', variant: 'extensions-connectors-mcp-discard' },
  'QB12-06': { id: 'QDR.O08.mcp.stdio.argument-row', groupIds: ['O08', 'P04'], page: 'settings', variant: 'extensions-connectors-mcp-stdio-argument' },
  'QB12-07': { id: 'QDR.O08.mcp.stdio.environment-row', groupIds: ['O08', 'P04'], page: 'settings', variant: 'extensions-connectors-mcp-stdio-env' },
};
const batch13 = {
  'QB13-01': { id: 'QDR.P04.market.plugins.superpowers.detail', groupIds: ['P04'], page: 'extensions', variant: 'plugins-superpowers-detail' },
  'QB13-02': { id: 'QDR.P04.market.plugins.superpowers.expanded', groupIds: ['P04'], page: 'extensions', variant: 'plugins-superpowers-expanded' },
  'QB13-03': { id: 'QDR.P04.market.plugins.context7.detail', groupIds: ['P04'], page: 'extensions', variant: 'plugins-context7-detail' },
  'QB13-04': { id: 'QDR.P04.market.connectors.context7.error', groupIds: ['P04'], page: 'extensions', variant: 'connectors-context7-error' },
};
const batch14 = {
  'QB14-01': { id: 'QDR.OBS02.knowledge.create.workspace', groupIds: ['OBS02'], page: 'knowledge', variant: 'create-workspace' },
  'QB14-02': { id: 'QDR.OBS02.knowledge.create.ready', groupIds: ['OBS02'], page: 'knowledge', variant: 'create-ready' },
  'QB14-03': { id: 'QDR.OBS02.repo-wiki.search.empty', groupIds: ['OBS02'], page: 'knowledge', variant: 'repo-wiki-search-empty' },
  'QB14-04': { id: 'QDR.OBS02.repo-wiki.knowledge-cards', groupIds: ['OBS02'], page: 'knowledge', variant: 'repo-wiki-knowledge-cards' },
  'QB14-05': { id: 'QDR.OBS02.repo-wiki.knowledge-cards.wide', groupIds: ['OBS02'], page: 'knowledge', variant: 'repo-wiki-knowledge-cards-wide' },
};
const batch15 = {
  'QB15-01': { id: 'QDR.P06.settings.general.default', groupIds: ['P06'], page: 'settings', variant: 'general' },
  'QB15-02': { id: 'QDR.P06.settings.mode.default', groupIds: ['P06'], page: 'settings', variant: 'mode' },
};
const batch16 = {
  'QB16-01': { id: 'QDR.P06.settings.task-monitor.default', groupIds: ['P06'], page: 'settings', variant: 'task-monitor' },
};
const batch17 = {
  'QB17-01': { id: 'QDR.P06.settings.shortcuts.default', groupIds: ['P06'], page: 'settings', variant: 'shortcuts' },
};
const batch18 = {
  'QB18-01': { id: 'QDR.P06.settings.shortcuts.search.voice', groupIds: ['P06'], page: 'settings', variant: 'shortcuts.search.voice' },
  'QB18-02': { id: 'QDR.P06.settings.shortcuts.search.empty', groupIds: ['P06'], page: 'settings', variant: 'shortcuts.search.empty' },
  'QB18-03': { id: 'QDR.P06.settings.shortcuts.send-menu.open', groupIds: ['P06'], page: 'settings', variant: 'shortcuts.send-menu.open' },
  'QB18-04': { id: 'QDR.P06.settings.shortcuts.edit.settings', groupIds: ['P06'], page: 'settings', variant: 'shortcuts.edit.settings' },
  'QB18-05': { id: 'QDR.P06.settings.voice.default', groupIds: ['P06'], page: 'settings', variant: 'voice' },
  'QB18-06': { id: 'QDR.P06.settings.voice.tone.open', groupIds: ['P06'], page: 'settings', variant: 'voice.tone.open' },
  'QB18-07': { id: 'QDR.P06.settings.voice.speed.open', groupIds: ['P06'], page: 'settings', variant: 'voice.speed.open' },
  'QB18-08': { id: 'QDR.P06.settings.voice.duration.open', groupIds: ['P06'], page: 'settings', variant: 'voice.duration.open' },
};
const batch19 = {
  'QB19-01': { id: 'QDR.P06.settings.voice.input-device.open', groupIds: ['P06'], page: 'settings', variant: 'voice.input-device.open' },
  'QB19-02': { id: 'QDR.P06.settings.voice.shortcut.edit', groupIds: ['P06'], page: 'settings', variant: 'voice.shortcut.edit' },
  'QB19-03': { id: 'QDR.P06.settings.voice.word.draft', groupIds: ['P06'], page: 'settings', variant: 'voice.word.draft' },
};
const batch20 = {
  'QB20-01': { id: 'QDR.P06.settings.models.default', groupIds: ['P06'], page: 'settings', variant: 'models' },
  'QB20-02': { id: 'QDR.P06.settings.models.add.default', groupIds: ['P06'], page: 'settings', variant: 'models.add.default' },
  'QB20-03': { id: 'QDR.P06.settings.models.provider.open', groupIds: ['P06'], page: 'settings', variant: 'models.provider.open' },
  'QB20-04': { id: 'QDR.P06.settings.models.add.deepseek', groupIds: ['P06'], page: 'settings', variant: 'models.add.deepseek' },
  'QB20-05': { id: 'QDR.P06.settings.models.deepseek.models.open', groupIds: ['P06'], page: 'settings', variant: 'models.deepseek.models.open' },
  'QB20-06': { id: 'QDR.P06.settings.models.deepseek.type.open', groupIds: ['P06'], page: 'settings', variant: 'models.deepseek.type.open' },
  'QB20-07': { id: 'QDR.P06.settings.models.discard.open', groupIds: ['P06'], page: 'settings', variant: 'models.discard.open' },
};
const batch21 = {
  'QB21-01': { id: 'QDR.P06.settings.models.add.openai-compatible', groupIds: ['P06'], page: 'settings', variant: 'models.add.openai-compatible' },
  'QB21-02': { id: 'QDR.P06.settings.models.openai-compatible.api-type.open', groupIds: ['P06'], page: 'settings', variant: 'models.openai-compatible.api-type.open' },
  'QB21-03': { id: 'QDR.P06.settings.models.add.anthropic-compatible', groupIds: ['P06'], page: 'settings', variant: 'models.add.anthropic-compatible' },
};
const settingsSlugs = [
  'profile', 'general', 'mode', 'task-monitor', 'shortcuts', 'appearance', 'voice', 'models',
  'pet', 'memory', 'import', 'extensions', 'hooks', 'computer-control', 'mobile', 'git',
  'worktrees', 'workspace-index', 'connections', 'security', 'archived-tasks', 'experiments',
  'network', 'playground',
];
const expectedObservations = new Set([...Object.keys(batch01), ...Object.keys(historical), ...Object.keys(batch03), ...Object.keys(batch05), ...Object.keys(batch06), ...Object.keys(batch07), ...Object.keys(batch08), ...Object.keys(batch09), ...Object.keys(batch10), ...Object.keys(batch11), ...Object.keys(batch12), ...Object.keys(batch13), ...Object.keys(batch14), ...Object.keys(batch15), ...Object.keys(batch16), ...Object.keys(batch17), ...Object.keys(batch18), ...Object.keys(batch19), ...Object.keys(batch20), ...Object.keys(batch21)]);
assert.equal(groups.length, 59, '55 baseline groups + OBS01/OBS02/OBS03/OBS04');
assert.equal(states.length, 206, '203 preserved entries + 3 Batch21 observations; not total product pages');
const ids = new Set(groups.map(x => x.id));
assert.equal(ids.size, groups.length, 'Unique group IDs');
assert.deepEqual([...ids].sort(), [...baselineIds, 'OBS01', 'OBS02', 'OBS03', 'OBS04'].sort(), 'Preserve all original groups');
assert.equal(groups.find(x => x.id === 'OBS04').kind, 'overlay', 'User appearance menu is a supplemental overlay');
assert.equal(new Set(states.map(x => x.id)).size, states.length, 'Unique state IDs');
for (const state of states) {
  assert(Array.isArray(state.groupIds) && state.groupIds.length > 0);
  assert(Array.isArray(state.observationIds));
  assert.equal(new Set(state.groupIds).size, state.groupIds.length, 'No duplicate group references');
  assert.equal(new Set(state.observationIds).size, state.observationIds.length, 'No duplicate observation references');
  for (const id of state.groupIds) assert(ids.has(id), `Unknown group ${id}`);
  for (const id of state.observationIds) assert(expectedObservations.has(id), `Unknown observation ${id}`);
  assert(['observed', 'entry-observed', 'static-only'].includes(state.sourceKind));
  if (state.sourceKind === 'observed') assert(state.observationIds.length > 0, `Missing observation on ${state.id}`);
  if (state.sourceKind === 'static-only') assert.equal(state.observationIds.length, 0, 'Static scope must not claim observation');
  for (const key of ['title', 'page', 'variant', 'evidence', 'trigger', 'exit', 'notes']) assert(typeof state[key] === 'string' && state[key].length, `Missing ${key} on ${state.id}`);
  assert.equal(state.implemented, false, 'Catalog preserves research evidence; UI availability is independently declared');
}
assert.equal(Object.keys(batch01).length, 26, 'QB1 count remains independent of historical reconciliation');
for (const [observation, stateId] of Object.entries(batch01)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Observation ${observation} mapped exactly once`);
  assert.equal(matches[0].id, stateId, `Preserve stable QB1 identity for ${observation}`);
  assert.equal(matches[0].sourceKind, 'observed', `Preserve QB1 evidence kind for ${observation}`);
}
for (const [observation, expected] of Object.entries(historical)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Historical observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve historical identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Historical backfill must not reuse QB1 observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Historical group ownership for ${observation}`);
  assert.equal(state.sourceKind, expected.sourceKind, `Entry-only evidence must not become full observation: ${observation}`);
  assert.equal(state.page, 'discovery', 'Historical records are research details, not implemented scenes');
  assert(state.evidence.includes('docs/research/qoder/qoder-dsh-discovery.md#'), `Missing discovery source anchor for ${observation}`);
}
assert.equal(Object.keys(batch03).length, 17, 'QB3 count remains independent of QB1 and historical reconciliation');
for (const [observation, expected] of Object.entries(batch03)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch03 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch03 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch03 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, [expected.group], `Keep settings and quick appearance ownership separate for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch03 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch03 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch03 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch03-capture.md ${observation}`), `Missing Batch03 source reference for ${observation}`);
}
assert.equal(Object.keys(batch05).length, 7, 'QB5 count remains independent of earlier observations');
for (const [observation, expected] of Object.entries(batch05)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch05 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch05 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch05 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, [expected.group], `Batch05 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch05 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch05 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch05 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch05-capture.md ${observation}`), `Missing Batch05 source reference for ${observation}`);
}
assert.equal(Object.keys(batch06).length, 8, 'QB6 count remains independent of earlier observations');
for (const [observation, expected] of Object.entries(batch06)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch06 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch06 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch06 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, [expected.group], `Batch06 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch06 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch06 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch06 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch06-capture.md ${observation}`), `Missing Batch06 source reference for ${observation}`);
}
assert.equal(Object.keys(batch07).length, 1, 'QB7 contains only the confirmed observation and remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch07)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch07 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch07 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch07 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, [expected.group], `Batch07 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch07 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch07 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch07 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch07-capture.md ${observation}`), `Missing Batch07 source reference for ${observation}`);
}
assert.equal(Object.keys(batch08).length, 8, 'QB8 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch08)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch08 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch08 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch08 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch08 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch08 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch08 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch08 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch08-capture.md ${observation}`), `Missing Batch08 source reference for ${observation}`);
}
assert.equal(Object.keys(batch09).length, 1, 'QB9 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch09)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch09 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch09 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch09 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch09 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch09 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch09 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch09 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch09-capture.md ${observation}`), `Missing Batch09 source reference for ${observation}`);
}
assert.equal(Object.keys(batch10).length, 7, 'QB10 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch10)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch10 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch10 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch10 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch10 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch10 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch10 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch10 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch10-capture.md ${observation}`), `Missing Batch10 source reference for ${observation}`);
}
assert.equal(Object.keys(batch11).length, 4, 'QB11 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch11)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch11 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch11 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch11 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch11 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch11 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch11 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch11 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch11-capture.md ${observation}`), `Missing Batch11 source reference for ${observation}`);
}
assert.equal(Object.keys(batch12).length, 7, 'QB12 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch12)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch12 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch12 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch12 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch12 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch12 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch12 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch12 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch12-capture.md ${observation}`), `Missing Batch12 source reference for ${observation}`);
}
assert.equal(Object.keys(batch13).length, 4, 'QB13 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch13)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch13 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch13 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch13 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch13 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch13 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch13 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch13 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch13-capture.md ${observation}`), `Missing Batch13 source reference for ${observation}`);
}
assert.equal(Object.keys(batch14).length, 5, 'QB14 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch14)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch14 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch14 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch14 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch14 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch14 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch14 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch14 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch14-capture.md ${observation}`), `Missing Batch14 source reference for ${observation}`);
}
assert.equal(Object.keys(batch15).length, 2, 'QB15 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch15)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch15 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch15 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch15 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch15 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch15 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch15 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch15 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch15-capture.md ${observation}`), `Missing Batch15 source reference for ${observation}`);
}
assert.equal(Object.keys(batch16).length, 1, 'QB16 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch16)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch16 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch16 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch16 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch16 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch16 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch16 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch16 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch16-capture.md ${observation}`), `Missing Batch16 source reference for ${observation}`);
}
assert.equal(Object.keys(batch17).length, 1, 'QB17 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch17)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch17 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch17 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch17 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch17 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch17 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch17 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch17 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch17-capture.md ${observation}`), `Missing Batch17 source reference for ${observation}`);
}
assert.equal(Object.keys(batch18).length, 8, 'QB18 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch18)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch18 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch18 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch18 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch18 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch18 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch18 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch18 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch18-capture.md ${observation}`), `Missing Batch18 source reference for ${observation}`);
}
assert.equal(Object.keys(batch19).length, 3, 'QB19 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch19)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch19 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch19 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch19 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch19 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch19 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch19 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch19 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch19-capture.md ${observation}`), `Missing Batch19 source reference for ${observation}`);
}
assert.equal(Object.keys(batch20).length, 7, 'QB20 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch20)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch20 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id, `Preserve Batch20 identity for ${observation}`);
  assert.deepEqual(state.observationIds, [observation], 'Batch20 must not reuse earlier observations');
  assert.deepEqual(state.groupIds, expected.groupIds, `Batch20 group ownership for ${observation}`);
  assert.equal(state.sourceKind, 'observed', `Batch20 evidence kind for ${observation}`);
  assert.equal(state.page, expected.page, `Batch20 page for ${observation}`);
  assert.equal(state.variant, expected.variant, `Batch20 variant for ${observation}`);
  assert(state.evidence.includes(`docs/research/qoder/batch20-capture.md ${observation}`), `Missing Batch20 source reference for ${observation}`);
}
assert.equal(Object.keys(batch21).length, 3, 'QB21 count remains independent of earlier batches');
for (const [observation, expected] of Object.entries(batch21)) {
  const matches = states.filter(x => x.observationIds.includes(observation));
  assert.equal(matches.length, 1, `Batch21 observation ${observation} mapped exactly once`);
  const state = matches[0];
  assert.equal(state.id, expected.id);
  assert.deepEqual(state.observationIds, [observation]);
  assert.deepEqual(state.groupIds, expected.groupIds);
  assert.equal(state.sourceKind, 'observed');
  assert.equal(state.page, expected.page);
  assert.equal(state.variant, expected.variant);
  assert(state.evidence.includes(`docs/research/qoder/batch21-capture.json ${observation}`));
}
const settings = states.filter(x => /^QDR\.P06\.settings\.[^.]+\.entry$/.test(x.id));
assert.deepEqual(settings.map(x => x.id).sort(), settingsSlugs.map(slug => `QDR.P06.settings.${slug}.entry`).sort(), 'Preserve all 24 settings entry identities');
for (const state of settings) {
  assert.equal(state.sourceKind, 'entry-observed', 'Settings entries are not observed full pages');
  assert.deepEqual(state.groupIds, ['P06']);
  assert.deepEqual(state.observationIds, [], 'Settings entry identity stays separate from partial page observations');
}
assert.equal(states.filter(x => x.sourceKind === 'entry-observed').length, 28, '24 settings + 4 historical entry-only observations');
assert.equal(states.filter(x => x.sourceKind === 'observed').length, 123, '120 preserved observations + 3 QB21');
const scopes = states.filter(x => x.sourceKind === 'static-only');
assert.equal(scopes.length, 55, 'Retain exactly 55 original unexpanded scopes');
for (const id of baselineIds) {
  const scope = scopes.find(x => x.id === `QDR.${id}.scope.unexpanded`);
  assert(scope, `Missing unexpanded scope for ${id}`);
  assert.deepEqual(scope.groupIds, [id], `Preserve unexpanded scope ownership for ${id}`);
}
assert.deepEqual(states.find(x => x.observationIds.includes('QB1-16')).groupIds, ['OBS01'], 'Ordinary usage is not quota error');
console.log('PASS: 59 groups (55 baseline + 4 supplemental); 206 unique entries; QB1 26/26, historical QD0 7/7, QB3 17/17, QB5 7/7, QB6 8/8, QB7 1/1, QB8 8/8, QB9 1/1, QB10 7/7, QB11 4/4, QB12 7/7 QB13 4/4 QB14 5/5, QB15 2/2, QB16 1/1 QB17 1/1 QB18 8/8 QB19 3/3, QB20 7/7 and QB21 3/3 independently mapped; 24 settings entries; 55 preserved scopes; valid evidence and references.');
