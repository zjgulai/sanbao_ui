import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Controls';

export type ComposerWorkbenchView = 'suggestions' | 'context' | 'input' | 'permission' | 'git';
export type ComposerWorkbenchStateId =
  | 'QDR.O01.scope.unexpanded'
  | 'QDR.O02.scope.unexpanded'
  | 'QDR.O03.scope.unexpanded'
  | 'QDR.O05.scope.unexpanded'
  | 'QDR.O07.scope.unexpanded';

export const COMPOSER_WORKBENCH_ENTRIES = [
  { stateId: 'QDR.O01.scope.unexpanded', view: 'suggestions', id: 'SANBAO.O01.F01', label: '上下文建议' },
  { stateId: 'QDR.O02.scope.unexpanded', view: 'context', id: 'SANBAO.O02.F01', label: '输入上下文' },
  { stateId: 'QDR.O03.scope.unexpanded', view: 'input', id: 'SANBAO.O03.F01', label: '输入调整与语音' },
  { stateId: 'QDR.O05.scope.unexpanded', view: 'permission', id: 'SANBAO.O05.F01', label: '访问权限确认' },
  { stateId: 'QDR.O07.scope.unexpanded', view: 'git', id: 'SANBAO.O07.F01', label: '分支与发布确认' },
] as const satisfies readonly { stateId: ComposerWorkbenchStateId; view: ComposerWorkbenchView; id: string; label: string }[];

export const COMPOSER_WORKBENCH_STATE_BY_VIEW: Record<ComposerWorkbenchView, ComposerWorkbenchStateId> = {
  suggestions: 'QDR.O01.scope.unexpanded',
  context: 'QDR.O02.scope.unexpanded',
  input: 'QDR.O03.scope.unexpanded',
  permission: 'QDR.O05.scope.unexpanded',
  git: 'QDR.O07.scope.unexpanded',
};

export type ComposerDesignWorkbenchProps = {
  view?: ComposerWorkbenchView;
  onNavigateView: (view: ComposerWorkbenchView) => void;
  onExit: () => void;
  onReset: () => void;
};

const copyByView: Record<ComposerWorkbenchView, { title: string; description: string; source: string }> = {
  suggestions: {
    title: '上下文建议与来源回放',
    description: '保留建议、详情、来源与空搜索的页面内路径；不读取会话、项目或任何真实上下文。',
    source: 'Qoder O01 · 静态候选；已观察菜单 fixture 独立保留',
  },
  context: {
    title: '输入区上下文选择',
    description: '目标、权限、站点、文件、插件、技能和模型仅作为本地标签选择，不打开或连接对应资源。',
    source: 'Qoder O02 · 静态候选；已观察上下文／技能菜单独立保留',
  },
  input: {
    title: '输入尺寸、规格与语音不可用',
    description: '调整、规格切换和语音错误只表达 UI 状态。组件不会请求麦克风、录音或启动模型。',
    source: 'Qoder O03 · 静态候选',
  },
  permission: {
    title: '目录访问范围确认',
    description: '文件夹与全部文件范围仅用于展示确认和恢复边界，不会读取目录、改变权限或访问本机文件。',
    source: 'Qoder O05 · 静态候选',
  },
  git: {
    title: '分支与发布确认',
    description: '分支选择、名称校验和发布确认全部在内存中回放，不调用 Git、远端、终端或网络。',
    source: 'Qoder O07 · 静态候选',
  },
};

const SUGGESTIONS = [
  { id: 'scope', title: '梳理页面范围', detail: '把当前页面、待验证入口和可见交互整理为本地评审清单。', source: '本地设计数据 · 不读取项目' },
  { id: 'review', title: '生成验收问题', detail: '为本地 fixture 生成可回放的检查问题，不提交给模型。', source: '本地设计数据 · 不调用模型' },
  { id: 'handoff', title: '准备交接说明', detail: '将当前演示状态整理为交接草稿，不写入任务或文档。', source: '本地设计数据 · 不写入文件' },
] as const;

const CONTEXT_OPTIONS = [
  { id: 'goal', title: '目标', detail: '本地任务目标标签' },
  { id: 'permission', title: '权限', detail: '只显示范围说明' },
  { id: 'sites', title: '站点', detail: '不打开外部页面' },
  { id: 'files', title: '文件', detail: '不读取或附加文件' },
  { id: 'plugins', title: '插件', detail: '不加载或安装插件' },
  { id: 'skills', title: '技能', detail: '只展示本地候选' },
  { id: 'model', title: '模型', detail: '不选择供应商或发送请求' },
] as const;

type ContextOptionId = typeof CONTEXT_OPTIONS[number]['id'];
type InputSize = 'compact' | 'default' | 'expanded';
type VoiceState = 'unavailable' | 'recovered';
type PermissionStage = 'overview' | 'confirm' | 'local-result';
type GitStage = 'selector' | 'create' | 'invalid' | 'confirm' | 'local-result';

const defaultSuggestion = SUGGESTIONS[0].id;
const defaultContext = CONTEXT_OPTIONS[0].id;

export function ComposerDesignWorkbench({ view = 'suggestions', onNavigateView, onExit, onReset }: ComposerDesignWorkbenchProps) {
  const [activeView, setActiveView] = useState<ComposerWorkbenchView>(view);
  const [suggestionQuery, setSuggestionQuery] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>(defaultSuggestion);
  const [showSource, setShowSource] = useState(false);
  const [contextChoice, setContextChoice] = useState<ContextOptionId>(defaultContext);
  const [contextChip, setContextChip] = useState<ContextOptionId | null>(null);
  const [inputSize, setInputSize] = useState<InputSize>('default');
  const [specMode, setSpecMode] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('unavailable');
  const [permissionScope, setPermissionScope] = useState<'folder' | 'descendants'>('folder');
  const [permissionStage, setPermissionStage] = useState<PermissionStage>('overview');
  const [gitStage, setGitStage] = useState<GitStage>('selector');
  const [branchName, setBranchName] = useState('review/composer-fixture');
  const [selectedBranch, setSelectedBranch] = useState('main');

  useEffect(() => { setActiveView(view); }, [view]);

  const selectedSuggestionItem = SUGGESTIONS.find(item => item.id === selectedSuggestion) ?? SUGGESTIONS[0];
  const selectedContextItem = CONTEXT_OPTIONS.find(item => item.id === contextChoice) ?? CONTEXT_OPTIONS[0];
  const contextChipItem = CONTEXT_OPTIONS.find(item => item.id === contextChip) ?? null;
  const suggestionResults = useMemo(() => {
    const query = suggestionQuery.trim().toLowerCase();
    return query ? SUGGESTIONS.filter(item => `${item.title} ${item.detail}`.toLowerCase().includes(query)) : SUGGESTIONS;
  }, [suggestionQuery]);
  const normalizedBranch = branchName.trim();
  const isValidBranch = /^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*$/i.test(normalizedBranch);

  const navigate = (next: ComposerWorkbenchView) => {
    setActiveView(next);
    onNavigateView(next);
  };

  const reset = () => {
    setSuggestionQuery('');
    setSelectedSuggestion(defaultSuggestion);
    setShowSource(false);
    setContextChoice(defaultContext);
    setContextChip(null);
    setInputSize('default');
    setSpecMode(false);
    setVoiceState('unavailable');
    setPermissionScope('folder');
    setPermissionStage('overview');
    setGitStage('selector');
    setBranchName('review/composer-fixture');
    setSelectedBranch('main');
    onReset();
  };

  const entry = COMPOSER_WORKBENCH_ENTRIES.find(item => item.view === activeView)!;
  const copy = copyByView[activeView];

  return <section className="design-workbench composer-design-workbench" data-state-source="static-only" aria-label="Sanbao 输入区设计工作面">
    <header className="composer-design-header">
      <div><span>SANBAO DESIGN WORKBENCH · STATIC-ONLY</span><h1>{copy.title}</h1><p>{copy.description}</p></div>
      <div className="composer-design-source"><strong>{entry.id}</strong><small>{copy.source}</small></div>
    </header>

    <nav className="composer-design-nav" aria-label="输入区设计状态">
      {COMPOSER_WORKBENCH_ENTRIES.map(item => <button type="button" key={item.view} className={item.view === activeView ? 'active' : ''} aria-current={item.view === activeView ? 'page' : undefined} onClick={() => navigate(item.view)}><span>{item.id.replace('SANBAO.', '')}</span>{item.label}</button>)}
    </nav>

    <main className="composer-design-stage">
      {activeView === 'suggestions' && <SuggestionsPane query={suggestionQuery} onQueryChange={setSuggestionQuery} results={suggestionResults} selected={selectedSuggestionItem.id} onSelect={id => { setSelectedSuggestion(id); setShowSource(false); }} showSource={showSource} onToggleSource={() => setShowSource(value => !value)} onReset={() => { setSuggestionQuery(''); setSelectedSuggestion(defaultSuggestion); setShowSource(false); }} />}
      {activeView === 'context' && <ContextPane selected={contextChoice} chip={contextChipItem} onSelect={setContextChoice} onApply={() => setContextChip(contextChoice)} onClear={() => setContextChip(null)} onReset={() => { setContextChoice(defaultContext); setContextChip(null); }} />}
      {activeView === 'input' && <InputPane size={inputSize} specMode={specMode} voiceState={voiceState} onSizeChange={setInputSize} onSpecChange={setSpecMode} onVoiceChange={setVoiceState} onReset={() => { setInputSize('default'); setSpecMode(false); setVoiceState('unavailable'); }} />}
      {activeView === 'permission' && <PermissionPane scope={permissionScope} stage={permissionStage} onScopeChange={setPermissionScope} onStageChange={setPermissionStage} onReset={() => { setPermissionScope('folder'); setPermissionStage('overview'); }} />}
      {activeView === 'git' && <GitPane stage={gitStage} selectedBranch={selectedBranch} branchName={branchName} validBranch={isValidBranch} onBranchSelect={setSelectedBranch} onNameChange={setBranchName} onStageChange={setGitStage} onReset={() => { setGitStage('selector'); setBranchName('review/composer-fixture'); setSelectedBranch('main'); }} />}
    </main>

    <footer className="composer-design-boundary" role="note"><Icon name="bolt" size={15} /><span>这是独立 Sanbao 设计工作面：所有选择、错误、确认和恢复只保存于当前 React 内存。它不会访问模型、会话、文件、权限、录音设备、Git、远端或网络；O01/O02 的已观察菜单 fixture 没有被替换。</span><button type="button" className="text-button" onClick={reset}>重置工作面</button><button type="button" className="text-button" onClick={onExit}>退出</button></footer>
  </section>;
}

function Frame({ eyebrow, title, status, children }: { eyebrow: string; title: string; status: string; children: React.ReactNode }) {
  return <article className="composer-design-frame"><header><div><span>{eyebrow}</span><h2>{title}</h2></div><em>{status}</em></header>{children}</article>;
}

function Actions({ children }: { children: React.ReactNode }) {
  return <footer className="composer-design-actions">{children}</footer>;
}

function SuggestionsPane({ query, onQueryChange, results, selected, onSelect, showSource, onToggleSource, onReset }: { query: string; onQueryChange: (value: string) => void; results: readonly typeof SUGGESTIONS[number][]; selected: string; onSelect: (id: string) => void; showSource: boolean; onToggleSource: () => void; onReset: () => void }) {
  const item = SUGGESTIONS.find(candidate => candidate.id === selected) ?? SUGGESTIONS[0];
  return <Frame eyebrow="SANBAO.O01.F01 · 建议、详情与来源" title="本地上下文建议" status="本地菜单"><p className="composer-design-intro">搜索只过滤三条固定演示数据。选中后可以查看详情和来源说明，空结果可清空恢复。</p><label className="composer-design-search"><Icon name="search" size={16} /><input aria-label="筛选本地上下文建议" value={query} onChange={event => onQueryChange(event.target.value)} placeholder="筛选本地建议…" /><button type="button" onClick={() => onQueryChange('')} disabled={!query}>清空</button></label><div className="composer-design-suggestion-layout"><div className="composer-design-suggestion-list" role="list">{results.length ? results.map(candidate => <button type="button" role="listitem" key={candidate.id} className={candidate.id === selected ? 'active' : ''} onClick={() => onSelect(candidate.id)}><Icon name="bolt" size={15} /><span><strong>{candidate.title}</strong><small>{candidate.detail}</small></span><Icon name="chevron" size={13} /></button>) : <div className="composer-design-empty"><Icon name="search" size={20} /><strong>没有匹配的本地建议</strong><span>调整筛选条件，或清空输入恢复固定演示数据。</span></div>}</div><aside className="composer-design-detail"><span>当前本地选择</span><h3>{item.title}</h3><p>{item.detail}</p>{showSource ? <div className="composer-design-source-card"><strong>来源说明</strong><p>{item.source}</p><small>静态候选不等于真实上下文、菜单默认值或模型行为证据。</small></div> : <button type="button" className="secondary-button" onClick={onToggleSource}>查看本地来源说明</button>}{showSource && <button type="button" className="text-button" onClick={onToggleSource}>返回详情</button>}</aside></div><Actions><button type="button" className="text-button" onClick={onReset}>重置建议</button><span /><button type="button" className="primary-button" onClick={onToggleSource}>{showSource ? '继续查看详情' : '查看来源'}</button></Actions></Frame>;
}

function ContextPane({ selected, chip, onSelect, onApply, onClear, onReset }: { selected: ContextOptionId; chip: typeof CONTEXT_OPTIONS[number] | null; onSelect: (value: ContextOptionId) => void; onApply: () => void; onClear: () => void; onReset: () => void }) {
  const item = CONTEXT_OPTIONS.find(option => option.id === selected) ?? CONTEXT_OPTIONS[0];
  return <Frame eyebrow="SANBAO.O02.F01 · 本地菜单与已选标签" title="选择输入区上下文" status={chip ? '已选本地标签' : '尚未选择'}><p className="composer-design-intro">这些类别对应静态锚点范围，页面不会打开站点、文件、插件、技能、权限或模型选择器。</p><div className="composer-design-context-grid">{CONTEXT_OPTIONS.map(option => <button type="button" key={option.id} className={option.id === selected ? 'active' : ''} aria-pressed={option.id === selected} onClick={() => onSelect(option.id)}><Icon name={option.id === 'files' ? 'folder' : option.id === 'sites' ? 'globe' : option.id === 'model' ? 'bolt' : option.id === 'plugins' ? 'grid' : option.id === 'skills' ? 'book' : 'settings'} size={16} /><span><strong>{option.title}</strong><small>{option.detail}</small></span></button>)}</div><section className="composer-design-selection"><span>当前菜单项</span><strong>{item.title}</strong><p>{item.detail}</p>{chip ? <div className="composer-design-chip"><Icon name="check" size={13} /><span>{chip.title} · 本地标签</span><button type="button" aria-label={`移除 ${chip.title} 本地标签`} onClick={onClear}><Icon name="close" size={12} /></button></div> : <p className="composer-design-selection-hint">选择一个类别后，将其作为本地已选 chip 回放。</p>}</section><Actions><button type="button" className="text-button" onClick={onReset}>清空本地选择</button><span /><button type="button" className="secondary-button" onClick={onClear} disabled={!chip}>移除标签</button><button type="button" className="primary-button" onClick={onApply}>添加本地标签</button></Actions></Frame>;
}

function InputPane({ size, specMode, voiceState, onSizeChange, onSpecChange, onVoiceChange, onReset }: { size: InputSize; specMode: boolean; voiceState: VoiceState; onSizeChange: (value: InputSize) => void; onSpecChange: (value: boolean) => void; onVoiceChange: (value: VoiceState) => void; onReset: () => void }) {
  return <Frame eyebrow="SANBAO.O03.F01 · 尺寸、规格与语音错误" title="调整本地输入面" status={voiceState === 'unavailable' ? '语音不可用' : '本地已恢复'}><p className="composer-design-intro">拖动和语音锚点尚未取得原生状态。以下按钮只回放尺寸、规格和不可用提示的设计流程。</p><div className="composer-design-control-row"><div><strong>输入高度</strong><small>仅修改当前卡片的视觉高度</small></div><div className="composer-design-segmented" role="group" aria-label="本地输入尺寸">{([{ key: 'compact', label: '紧凑' }, { key: 'default', label: '默认' }, { key: 'expanded', label: '展开' }] as const).map(option => <button type="button" key={option.key} className={size === option.key ? 'active' : ''} aria-pressed={size === option.key} onClick={() => onSizeChange(option.key)}>{option.label}</button>)}</div></div><section className={`composer-design-input-sim ${size} ${specMode ? 'spec' : ''}`}><div className="composer-design-input-sim-header"><span>{specMode ? '规格模式 · 本地演示' : '普通输入 · 本地演示'}</span><button type="button" role="switch" aria-checked={specMode} onClick={() => onSpecChange(!specMode)}>规格模式<i /></button></div><p>{specMode ? '请填写本地规格、验收条件与恢复路径。' : '描述想在本地原型中回放的任务。'}</p><footer><span><Icon name="file" size={13} /> 不会读取或附加文件</span><button type="button" aria-label="本地语音状态" onClick={() => onVoiceChange(voiceState === 'unavailable' ? 'recovered' : 'unavailable')}><Icon name="monitor" size={13} />语音</button></footer></section><section className={`composer-design-voice ${voiceState}`}><Icon name={voiceState === 'unavailable' ? 'close' : 'check'} size={18} /><div><strong>{voiceState === 'unavailable' ? '语音输入当前不可用' : '本地恢复提示已显示'}</strong><p>{voiceState === 'unavailable' ? '未请求麦克风或录音权限。可回放“重新检查”后的本地恢复提示。' : '该状态不代表设备、浏览器或原产品的真实语音功能已恢复。'}</p></div><button type="button" className="secondary-button" onClick={() => onVoiceChange(voiceState === 'unavailable' ? 'recovered' : 'unavailable')}>{voiceState === 'unavailable' ? '重新检查本地状态' : '返回不可用提示'}</button></section><Actions><button type="button" className="text-button" onClick={onReset}>重置输入面</button><span /><button type="button" className="primary-button" onClick={() => onSpecChange(!specMode)}>{specMode ? '退出规格模式' : '启用规格模式'}</button></Actions></Frame>;
}

function PermissionPane({ scope, stage, onScopeChange, onStageChange, onReset }: { scope: 'folder' | 'descendants'; stage: PermissionStage; onScopeChange: (value: 'folder' | 'descendants') => void; onStageChange: (value: PermissionStage) => void; onReset: () => void }) {
  const scopeLabel = scope === 'folder' ? '仅此演示文件夹' : '此演示文件夹及其子目录';
  if (stage === 'local-result') return <Frame eyebrow="SANBAO.O05.F03 · 本地确认结果" title="本地范围已记录" status="演示完成"><div className="composer-design-result"><Icon name="check" size={23} /><div><strong>{scopeLabel}</strong><p>结果只存在于当前 React 组件，不会读取路径、改变系统权限或影响任何真实文件。</p></div></div><Actions><button type="button" className="text-button" onClick={onReset}>重置本地权限</button><span /><button type="button" className="secondary-button" onClick={() => onStageChange('overview')}>调整本地范围</button></Actions></Frame>;
  if (stage === 'confirm') return <Frame eyebrow="SANBAO.O05.F02 · 本地范围确认" title="确认演示范围" status="等待本地确认"><div className="composer-design-confirm"><Icon name="folder" size={22} /><div><strong>{scopeLabel}</strong><p>继续只会显示本地结果。它不会获取目录内容、申请系统权限或将范围传给模型。</p></div></div><Actions><button type="button" className="text-button" onClick={onReset}>放弃并重置</button><span /><button type="button" className="secondary-button" onClick={() => onStageChange('overview')}>返回范围选择</button><button type="button" className="primary-button" onClick={() => onStageChange('local-result')}>确认本地演示</button></Actions></Frame>;
  return <Frame eyebrow="SANBAO.O05.F01 · 访问范围候选" title="选择本地演示范围" status="未申请权限"><p className="composer-design-intro">范围选择只用于评审确认卡。实际目录、子目录、授权语义和系统交互尚未采集。</p><div className="composer-design-scope-options">{([{ key: 'folder', title: '当前文件夹', detail: '仅展示一个虚构的文件夹范围。' }, { key: 'descendants', title: '包含子目录', detail: '只展示“全部文件和子目录”的说明。' }] as const).map(option => <button type="button" key={option.key} className={scope === option.key ? 'active' : ''} aria-pressed={scope === option.key} onClick={() => onScopeChange(option.key)}><Icon name="folder" size={17} /><span><strong>{option.title}</strong><small>{option.detail}</small></span><Icon name={scope === option.key ? 'check' : 'chevron'} size={14} /></button>)}</div><Actions><button type="button" className="text-button" onClick={onReset}>重置范围</button><span /><button type="button" className="primary-button" onClick={() => onStageChange('confirm')}>继续本地确认</button></Actions></Frame>;
}

function GitPane({ stage, selectedBranch, branchName, validBranch, onBranchSelect, onNameChange, onStageChange, onReset }: { stage: GitStage; selectedBranch: string; branchName: string; validBranch: boolean; onBranchSelect: (value: string) => void; onNameChange: (value: string) => void; onStageChange: (value: GitStage) => void; onReset: () => void }) {
  if (stage === 'local-result') return <Frame eyebrow="SANBAO.O07.F05 · 本地发布结果" title="本地发布确认已回放" status="未实际发布"><div className="composer-design-result"><Icon name="check" size={23} /><div><strong>“{selectedBranch}”已完成本地展示</strong><p>没有创建分支、提交、推送、发布或访问远端。可返回分支列表继续评审。</p></div></div><Actions><button type="button" className="text-button" onClick={onReset}>重置分支演示</button><span /><button type="button" className="secondary-button" onClick={() => onStageChange('selector')}>返回本地分支</button></Actions></Frame>;
  if (stage === 'confirm') return <Frame eyebrow="SANBAO.O07.F04 · 本地发布确认" title="确认演示发布" status="等待本地确认"><div className="composer-design-confirm"><Icon name="bolt" size={22} /><div><strong>将“{selectedBranch}”标记为本地发布？</strong><p>继续只进入本地结果；不会执行 Git 命令、生成变更、连接仓库或发起发布。</p></div></div><Actions><button type="button" className="text-button" onClick={onReset}>放弃并重置</button><span /><button type="button" className="secondary-button" onClick={() => onStageChange('selector')}>返回分支</button><button type="button" className="primary-button" onClick={() => onStageChange('local-result')}>确认本地发布</button></Actions></Frame>;
  if (stage === 'create' || stage === 'invalid') return <Frame eyebrow={stage === 'invalid' ? 'SANBAO.O07.F03 · 本地名称错误' : 'SANBAO.O07.F02 · 新建分支草稿'} title="输入本地分支名称" status={stage === 'invalid' ? '本地格式错误' : '本地草稿'}><label className="composer-design-field"><span>本地分支名称</span><input aria-label="本地分支名称" value={branchName} onChange={event => { onNameChange(event.target.value); if (stage === 'invalid') onStageChange('create'); }} placeholder="review/composer-fixture" /></label>{stage === 'invalid' ? <p className="composer-design-error" role="alert"><Icon name="close" size={14} />仅接受由字母、数字、连字符和斜线组成的本地展示名称。</p> : <p className="composer-design-note">名称只用于 UI 校验。不会检查真实 Git 分支、目录、远端冲突或发布权限。</p>}<Actions><button type="button" className="text-button" onClick={onReset}>放弃本地草稿</button><span /><button type="button" className="secondary-button" onClick={() => onStageChange('selector')}>返回分支</button><button type="button" className="primary-button" onClick={() => { if (!validBranch) { onStageChange('invalid'); return; } onBranchSelect(branchName.trim()); onStageChange('confirm'); }}>继续本地确认</button></Actions></Frame>;
  return <Frame eyebrow="SANBAO.O07.F01 · 分支与发布候选" title="选择本地分支路径" status="未连接 Git"><p className="composer-design-intro">分支列表来自固定演示数据。创建和发布路径保留确认、取消和重置，却不读取仓库或运行命令。</p><div className="composer-design-branch-list">{['main', 'review/interaction-pass', 'feature/prototype-shell'].map(branch => <button type="button" key={branch} className={branch === selectedBranch ? 'active' : ''} aria-pressed={branch === selectedBranch} onClick={() => onBranchSelect(branch)}><Icon name="code" size={16} /><span>{branch}<small>{branch === 'main' ? '本地默认候选' : '本地演示分支'}</small></span><Icon name={branch === selectedBranch ? 'check' : 'chevron'} size={14} /></button>)}</div><Actions><button type="button" className="text-button" onClick={onReset}>重置分支</button><span /><button type="button" className="secondary-button" onClick={() => onStageChange('create')}>新建本地草稿</button><button type="button" className="primary-button" onClick={() => onStageChange('confirm')}>进入本地发布确认</button></Actions></Frame>;
}
