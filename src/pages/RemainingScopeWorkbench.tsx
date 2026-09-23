import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Controls';

export const REMAINING_SCOPE_VIEWS = [
  'market-directory', 'market-installed',
  'settings-overview', 'settings-search',
  'mcp-transport', 'mcp-json', 'mcp-unsaved',
  'diff-summary', 'diff-review',
  'html-preview', 'html-unavailable',
] as const;
export type RemainingScopeView = typeof REMAINING_SCOPE_VIEWS[number];
type RemainingScopeStateId = 'QDR.P04.scope.unexpanded' | 'QDR.P06.scope.unexpanded' | 'QDR.O08.scope.unexpanded' | 'QDR.A01.scope.unexpanded' | 'QDR.A02.scope.unexpanded';
type RemainingScopeEntry = { view: RemainingScopeView; stateId: RemainingScopeStateId; fixtureId: string; group: string; label: string; title: string; description: string };

export const REMAINING_SCOPE_ENTRIES: readonly RemainingScopeEntry[] = [
  { view: 'market-directory', stateId: 'QDR.P04.scope.unexpanded', fixtureId: 'SANBAO.P04.F01', group: '扩展市场', label: '市场目录', title: '扩展市场目录候选', description: '列表、搜索和候选卡均为本地示例，不安装或加载扩展。' },
  { view: 'market-installed', stateId: 'QDR.P04.scope.unexpanded', fixtureId: 'SANBAO.P04.F02', group: '扩展市场', label: '已安装', title: '已安装内容候选', description: '安装状态仅用于本地视觉和返回路径，不读取实际插件。' },
  { view: 'settings-overview', stateId: 'QDR.P06.scope.unexpanded', fixtureId: 'SANBAO.P06.F01', group: '设置总览', label: '设置分组', title: '设置总入口候选', description: '目录和选择只在内存中回放，不读取或改写真实设置。' },
  { view: 'settings-search', stateId: 'QDR.P06.scope.unexpanded', fixtureId: 'SANBAO.P06.F02', group: '设置总览', label: '搜索设置', title: '设置搜索候选', description: '筛选只是本地文本匹配，不调用系统设置或设备权限。' },
  { view: 'mcp-transport', stateId: 'QDR.O08.scope.unexpanded', fixtureId: 'SANBAO.O08.F01', group: 'MCP 配置', label: '传输选择', title: 'MCP 传输选择候选', description: '选择 STDIO、HTTP 或 SSE 不连接服务、不读取凭据。' },
  { view: 'mcp-json', stateId: 'QDR.O08.scope.unexpanded', fixtureId: 'SANBAO.O08.F02', group: 'MCP 配置', label: 'JSON 草稿', title: 'MCP JSON 草稿候选', description: '草稿仅用于校验编辑层级，不保存配置文件。' },
  { view: 'mcp-unsaved', stateId: 'QDR.O08.scope.unexpanded', fixtureId: 'SANBAO.O08.F03', group: 'MCP 配置', label: '未保存确认', title: '未保存修改确认候选', description: '确认只丢弃当前内存草稿，不删除真实配置。' },
  { view: 'diff-summary', stateId: 'QDR.A01.scope.unexpanded', fixtureId: 'SANBAO.A01.F01', group: 'Diff 审阅', label: '变更摘要', title: '变更摘要候选', description: '文件和统计为本地占位，不读取仓库、Git 或工作区。' },
  { view: 'diff-review', stateId: 'QDR.A01.scope.unexpanded', fixtureId: 'SANBAO.A01.F02', group: 'Diff 审阅', label: '审阅结果', title: '变更审阅候选', description: '接受与退回只生成页面内回执，不写入文件。' },
  { view: 'html-preview', stateId: 'QDR.A02.scope.unexpanded', fixtureId: 'SANBAO.A02.F01', group: 'HTML 预览', label: '预览窗口', title: 'HTML 预览候选', description: '预览是原创静态占位，不执行 HTML、脚本或网络内容。' },
  { view: 'html-unavailable', stateId: 'QDR.A02.scope.unexpanded', fixtureId: 'SANBAO.A02.F02', group: 'HTML 预览', label: '预览不可用', title: 'HTML 预览不可用候选', description: '恢复只重新显示本地占位，不重新加载产物。' },
];

export const REMAINING_SCOPE_STATE_BY_VIEW: Readonly<Record<RemainingScopeView, RemainingScopeStateId>> = Object.fromEntries(REMAINING_SCOPE_ENTRIES.map(entry => [entry.view, entry.stateId])) as Record<RemainingScopeView, RemainingScopeStateId>;
export type RemainingScopeWorkbenchProps = { view: RemainingScopeView; onNavigateView: (view: RemainingScopeView) => void; onExit: () => void; onReset: () => void };
function entryFor(view: RemainingScopeView) { return REMAINING_SCOPE_ENTRIES.find(entry => entry.view === view) ?? REMAINING_SCOPE_ENTRIES[0]; }

export function RemainingScopeWorkbench({ view, onNavigateView, onExit, onReset }: RemainingScopeWorkbenchProps) {
  const [activeView, setActiveView] = useState<RemainingScopeView>(view);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [transport, setTransport] = useState('HTTP');
  const [json, setJson] = useState('{\n  "mcpServers": {}\n}');
  const [status, setStatus] = useState<'idle' | 'ready' | 'unavailable'>('idle');
  const entry = entryFor(activeView);
  useEffect(() => { setActiveView(view); setQuery(''); setSelected(''); setStatus(view === 'html-unavailable' ? 'unavailable' : 'idle'); }, [view]);
  const navigate = (next: RemainingScopeView) => { setActiveView(next); setQuery(''); setSelected(''); setStatus(next === 'html-unavailable' ? 'unavailable' : 'idle'); onNavigateView(next); };
  const reset = () => { setQuery(''); setSelected(''); setTransport('HTTP'); setJson('{\n  "mcpServers": {}\n}'); setStatus('idle'); onReset(); };
  const groups = ['扩展市场', '设置总览', 'MCP 配置', 'Diff 审阅', 'HTML 预览'];
  return <section className="design-workbench remaining-scope-workbench" data-state-source="static-only" aria-label="Sanbao 其余组级入口设计工作面">
    <header className="remaining-scope-header"><div><span>Sanbao 设计工作面 · 静态候选</span><h1>剩余组级入口</h1><p>为已有深层页面补齐扩展、设置、MCP、变更和预览的总入口与关键恢复状态。所有内容均为本地示例。</p></div><div className="remaining-scope-source"><strong>{entry.fixtureId}</strong><small>{entry.stateId} · static-only</small></div></header>
    <div className="remaining-scope-layout"><nav className="remaining-scope-nav" aria-label="组级入口工作面导航">{groups.map(group => <section key={group}><strong>{group}</strong>{REMAINING_SCOPE_ENTRIES.filter(item => item.group === group).map(item => <button type="button" key={item.view} className={activeView === item.view ? 'active' : ''} aria-current={activeView === item.view ? 'page' : undefined} onClick={() => navigate(item.view)}><span>{item.fixtureId.replace('SANBAO.', '')}</span>{item.label}</button>)}</section>)}</nav><main className="remaining-scope-stage"><article className={`remaining-scope-card ${status}`}><header><div><span>{entry.fixtureId}</span><h2>{status === 'ready' ? '本地占位已恢复' : entry.title}</h2><p>{status === 'ready' ? '恢复只返回当前本地示例，不运行插件、配置、Git、文件或 HTML。' : entry.description}</p></div><em>{status === 'unavailable' ? '本地不可用' : status === 'ready' ? '本地已恢复' : '本地候选'}</em></header><ScopeBody view={activeView} query={query} setQuery={setQuery} selected={selected} setSelected={setSelected} transport={transport} setTransport={setTransport} json={json} setJson={setJson} status={status} setStatus={setStatus} navigate={navigate} /> <footer><button type="button" className="text-button" onClick={reset}>重置当前演示</button><span /><button type="button" className="secondary-button" onClick={onExit}>返回任务摘要</button></footer></article></main></div>
    <footer className="remaining-scope-boundary" role="note"><Icon name="grid" size={15} /><span>P04、P06、O08、A01、A02 仍需要原生可达性、叶状态、视觉与行为分别取证。此处不会替代已有已观察页面或执行任何实际安装、配置、Git、文件和预览动作。</span></footer>
  </section>;
}

function ScopeBody({ view, query, setQuery, selected, setSelected, transport, setTransport, json, setJson, status, setStatus, navigate }: { view: RemainingScopeView; query: string; setQuery: (value: string) => void; selected: string; setSelected: (value: string) => void; transport: string; setTransport: (value: string) => void; json: string; setJson: (value: string) => void; status: 'idle' | 'ready' | 'unavailable'; setStatus: (value: 'idle' | 'ready' | 'unavailable') => void; navigate: (view: RemainingScopeView) => void }) {
  const extensionItems = useMemo(() => ['视觉审阅', '知识检索', '发布检查'].filter(item => item.includes(query.trim()) || !query.trim()), [query]);
  const settingItems = useMemo(() => ['外观', '模型', '工作区', '安全', '网络'].filter(item => item.includes(query.trim()) || !query.trim()), [query]);
  if (view === 'market-directory') return <section className="scope-directory"><label><Icon name="search" size={15} /><input aria-label="搜索本地扩展候选" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索本地扩展" /></label>{extensionItems.length ? <div>{extensionItems.map(item => <button type="button" key={item} className={selected === item ? 'selected' : ''} onClick={() => setSelected(item)}><span><Icon name="grid" size={15} /></span><strong>{item}</strong><small>本地候选</small></button>)}</div> : <p className="scope-empty">没有匹配的本地扩展候选</p>}<footer><button type="button" className="secondary-button" onClick={() => setQuery('')}>清空本地搜索</button><button type="button" className="primary-button" disabled={!selected} onClick={() => navigate('market-installed')}>标记本地已安装</button></footer></section>;
  if (view === 'market-installed') return <section className="scope-result"><Icon name="check" size={23} /><h3>本地扩展状态已更新</h3><p>“视觉审阅”只在本工作面中标记为已安装，没有下载、启用或加载扩展代码。</p><button type="button" className="primary-button" onClick={() => navigate('market-directory')}>返回市场目录</button></section>;
  if (view === 'settings-overview') return <section className="scope-directory settings"><div>{['个人', '集成', '编码', '其他'].map(item => <button type="button" key={item} className={selected === item ? 'selected' : ''} onClick={() => setSelected(item)}><span><Icon name="settings" size={15} /></span><strong>{item}</strong><small>本地设置组</small></button>)}</div><footer><button type="button" className="secondary-button" onClick={() => navigate('settings-search')}>搜索设置</button><button type="button" className="primary-button" disabled={!selected} onClick={() => setStatus('ready')}>查看本地分组</button></footer>{status === 'ready' && <p role="status">已打开“{selected}”本地分组；没有读取或改写设置。</p>}</section>;
  if (view === 'settings-search') return <section className="scope-directory"><label><Icon name="search" size={15} /><input aria-label="搜索本地设置候选" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索设置" /></label>{settingItems.length ? <div>{settingItems.map(item => <button type="button" key={item} onClick={() => setSelected(item)} className={selected === item ? 'selected' : ''}><span><Icon name="settings" size={15} /></span><strong>{item}</strong><small>本地设置候选</small></button>)}</div> : <p className="scope-empty">没有匹配的本地设置候选</p>}<footer><button type="button" className="secondary-button" onClick={() => setQuery('')}>清空本地搜索</button><button type="button" className="primary-button" disabled={!selected} onClick={() => navigate('settings-overview')}>打开本地设置组</button></footer></section>;
  if (view === 'mcp-transport') return <section className="scope-mcp"><h3>选择本地传输类型</h3><div>{['STDIO', 'HTTP', 'SSE'].map(item => <button type="button" key={item} aria-pressed={transport === item} onClick={() => setTransport(item)}>{transport === item && <Icon name="check" size={13} />}{item}</button>)}</div><p>{transport} 只表示表单层级，不连接 MCP Server、进程、地址或账号。</p><button type="button" className="primary-button" onClick={() => navigate('mcp-json')}>编辑本地 JSON 草稿</button></section>;
  if (view === 'mcp-json') return <section className="scope-mcp"><textarea aria-label="本地 MCP JSON 草稿" value={json} onChange={event => setJson(event.target.value)} /><div><button type="button" className="secondary-button" onClick={() => navigate('mcp-transport')}>返回传输选择</button><button type="button" className="primary-button" onClick={() => navigate('mcp-unsaved')}>关闭本地草稿</button></div></section>;
  if (view === 'mcp-unsaved') return <section className="scope-confirm"><Icon name="close" size={23} /><h3>放弃未保存的本地修改？</h3><p>该操作只清除当前 JSON 文本，不改写任何真实 MCP 配置文件。</p><div><button type="button" className="secondary-button" onClick={() => navigate('mcp-json')}>继续编辑</button><button type="button" className="primary-button" onClick={() => navigate('mcp-transport')}>放弃本地草稿</button></div></section>;
  if (view === 'diff-summary') return <section className="scope-diff"><div><span><Icon name="file" size={15} /></span><div><strong>src/review-card.tsx</strong><small>+12 · −3 · 本地摘要</small></div></div><div><span><Icon name="file" size={15} /></span><div><strong>docs/review.md</strong><small>+4 · −0 · 本地摘要</small></div></div><button type="button" className="primary-button" onClick={() => navigate('diff-review')}>进入本地审阅</button></section>;
  if (view === 'diff-review') return <section className="scope-diff review"><pre><code>{'- 旧的说明\n+ 可回放的本地交互\n  原生行为待独立验证'}</code></pre><div><button type="button" className="secondary-button" onClick={() => setStatus('ready')}>标记本地退回</button><button type="button" className="primary-button" onClick={() => setStatus('ready')}>标记本地接受</button></div>{status === 'ready' && <p role="status">审阅结果仅存在于当前页面，不写入 Git 或文件。</p>}</section>;
  if (view === 'html-preview') return <section className="scope-preview"><div className="scope-preview-window"><header><span className="window-dots"><i /><i /><i /></span><strong>review-summary.html · 本地预览</strong></header><main><h3>页面验收摘要</h3><p>已补齐本地入口、交互与恢复路径。</p><button type="button">本地示例按钮</button></main></div><button type="button" className="secondary-button" onClick={() => navigate('html-unavailable')}>显示本地不可用状态</button></section>;
  return <section className="scope-confirm unavailable"><Icon name="close" size={23} /><h3>本地 HTML 预览暂不可用</h3><p>没有失败请求、文件读取或脚本执行。恢复只重新显示页面占位。</p><button type="button" className="primary-button" onClick={() => setStatus('ready')}>{status === 'ready' ? '已恢复本地占位' : '恢复本地预览占位'}</button></section>;
}
