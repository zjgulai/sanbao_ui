import { useEffect, useState } from 'react';
import { Icon } from '../components/Controls';

export const TOOL_RESULT_VIEWS = [
  'web-search',
  'web-fetch',
  'bash-output',
  'task-output',
  'widget',
  'thinking',
  'result-details',
  'result-images',
] as const;

export type ToolResultView = typeof TOOL_RESULT_VIEWS[number];
type ToolResultGroup = 'M03' | 'M04' | 'M05';

type ToolResultEntry = {
  view: ToolResultView;
  stateId: 'QDR.M03.scope.unexpanded' | 'QDR.M04.scope.unexpanded' | 'QDR.M05.scope.unexpanded';
  group: ToolResultGroup;
  fixtureId: string;
  label: string;
  title: string;
  description: string;
};

export const TOOL_RESULT_ENTRIES: readonly ToolResultEntry[] = [
  { view: 'web-search', stateId: 'QDR.M03.scope.unexpanded', group: 'M03', fixtureId: 'SANBAO.M03.F01', label: 'WebSearch 结果', title: '网页检索结果候选', description: '只展示查询、结果摘要和展开边界，不发起检索或访问任何站点。' },
  { view: 'web-fetch', stateId: 'QDR.M03.scope.unexpanded', group: 'M03', fixtureId: 'SANBAO.M03.F02', label: 'WebFetch 结果', title: '网页抓取结果候选', description: '链接与内容块是本地示意，不加载 URL、请求网络或保存页面内容。' },
  { view: 'bash-output', stateId: 'QDR.M03.scope.unexpanded', group: 'M03', fixtureId: 'SANBAO.M03.F03', label: 'Bash 输出', title: '终端输出候选', description: '命令与日志仅用于表现输出层级、折叠和失败恢复，不启动终端。' },
  { view: 'task-output', stateId: 'QDR.M04.scope.unexpanded', group: 'M04', fixtureId: 'SANBAO.M04.F01', label: 'TaskOutput', title: '任务结果候选', description: '展示独立任务结果卡的位置与返回入口，不创建任务或产物。' },
  { view: 'widget', stateId: 'QDR.M04.scope.unexpanded', group: 'M04', fixtureId: 'SANBAO.M04.F02', label: 'Widget', title: '专用 Widget 候选', description: '展示专用控件的局部加载、不可用和恢复形态，不挂载扩展。' },
  { view: 'thinking', stateId: 'QDR.M04.scope.unexpanded', group: 'M04', fixtureId: 'SANBAO.M04.F03', label: 'Thinking', title: '工作状态摘要候选', description: '仅提供脱敏的阶段状态摘要，不显示模型内部推理或发起模型调用。' },
  { view: 'result-details', stateId: 'QDR.M05.scope.unexpanded', group: 'M05', fixtureId: 'SANBAO.M05.F01', label: '工具详情', title: '工具输入输出详情候选', description: '输入、输出与长内容展开只在本地示例中切换，不读取日志。' },
  { view: 'result-images', stateId: 'QDR.M05.scope.unexpanded', group: 'M05', fixtureId: 'SANBAO.M05.F02', label: '结果图片', title: '工具结果图片候选', description: '图块为原创占位，不加载图片文件、生成媒体或访问外部资源。' },
];

export const TOOL_RESULT_STATE_BY_VIEW: Readonly<Record<ToolResultView, ToolResultEntry['stateId']>> = Object.fromEntries(
  TOOL_RESULT_ENTRIES.map(entry => [entry.view, entry.stateId]),
) as Record<ToolResultView, ToolResultEntry['stateId']>;

export type ToolResultWorkbenchProps = {
  view: ToolResultView;
  onNavigateView: (view: ToolResultView) => void;
  onExit: () => void;
  onReset: () => void;
};

const GROUPS: readonly { id: ToolResultGroup; label: string; detail: string }[] = [
  { id: 'M03', label: '网络与终端', detail: 'WebSearch / WebFetch / Bash' },
  { id: 'M04', label: '专用结果', detail: 'TaskOutput / Widget / 状态摘要' },
  { id: 'M05', label: '详情与图片', detail: '输入输出 / 图片画廊' },
];

function entryFor(view: ToolResultView) {
  return TOOL_RESULT_ENTRIES.find(entry => entry.view === view) ?? TOOL_RESULT_ENTRIES[0];
}

export function ToolResultWorkbench({ view, onNavigateView, onExit, onReset }: ToolResultWorkbenchProps) {
  const [activeView, setActiveView] = useState<ToolResultView>(view);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<'idle' | 'unavailable' | 'recovered'>('idle');
  const [selectedImage, setSelectedImage] = useState(0);
  const entry = entryFor(activeView);

  useEffect(() => {
    setActiveView(view);
    setExpanded(false);
    setStatus('idle');
  }, [view]);

  const navigate = (next: ToolResultView) => {
    setActiveView(next);
    setExpanded(false);
    setStatus('idle');
    onNavigateView(next);
  };

  const reset = () => {
    setExpanded(false);
    setStatus('idle');
    setSelectedImage(0);
    onReset();
  };

  return <section className="design-workbench tool-result-workbench" data-state-source="static-only" aria-label="Sanbao 工具结果与详情设计工作面">
    <header className="tool-result-header">
      <div><span>Sanbao 设计工作面 · 静态候选</span><h1>工具结果与详情</h1><p>原型通过分组、展开、局部不可用和恢复路径验证信息层级。所有文本和图块均为本地示例，不执行工具或访问外部资源。</p></div>
      <div className="tool-result-source"><strong>{entry.fixtureId}</strong><small>{entry.stateId} · static-only</small></div>
    </header>

    <div className="tool-result-layout">
      <nav className="tool-result-nav" aria-label="工具结果工作面导航">
        {GROUPS.map(group => <section key={group.id}><div><strong>{group.label}</strong><small>{group.detail}</small></div>{TOOL_RESULT_ENTRIES.filter(item => item.group === group.id).map(item => <button key={item.view} type="button" className={item.view === activeView ? 'active' : ''} aria-current={item.view === activeView ? 'page' : undefined} onClick={() => navigate(item.view)}><span>{item.fixtureId.replace('SANBAO.', '')}</span>{item.label}</button>)}</section>)}
      </nav>

      <main className="tool-result-stage">
        <article className={`tool-result-card ${status === 'unavailable' ? 'unavailable' : status === 'recovered' ? 'recovered' : ''}`}>
          <header><div><span>{entry.fixtureId} · {entry.group}</span><h2>{status === 'unavailable' ? '本地结果暂不可用' : status === 'recovered' ? '本地占位已恢复' : entry.title}</h2><p>{status === 'unavailable' ? '此处只表达局部不可用，不触发重试、关闭终端或影响其他工作面。' : status === 'recovered' ? '恢复只重新显示当前原型占位；不会运行工具、加载文件或重新请求网络。' : entry.description}</p></div><em>{status === 'unavailable' ? '本地不可用' : status === 'recovered' ? '本地已恢复' : '本地候选'}</em></header>
          {status === 'idle' && <ToolBody view={activeView} expanded={expanded} setExpanded={setExpanded} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
          {status === 'unavailable' && <section className="tool-result-alert" role="status"><Icon name="close" size={18} /><div><strong>只影响当前结果卡</strong><p>可返回列表、查看其他本地结果类型，或恢复当前占位继续评审。</p></div></section>}
          {status === 'recovered' && <section className="tool-result-ready" role="status"><Icon name="check" size={18} /><div><strong>恢复路径已回放</strong><p>没有发起网络、终端、模型、插件、文件或系统操作。</p></div></section>}
          <footer><button type="button" className="text-button" onClick={reset}>重置当前演示</button><span /><button type="button" className="secondary-button" onClick={onExit}>返回任务摘要</button>{status === 'idle' ? <button type="button" className="secondary-button" onClick={() => setStatus('unavailable')}>模拟局部不可用</button> : <button type="button" className="primary-button" onClick={() => setStatus(status === 'unavailable' ? 'recovered' : 'idle')}>{status === 'unavailable' ? '恢复本地占位' : '重新查看本地结果'}</button>}</footer>
        </article>
      </main>
    </div>
    <footer className="tool-result-boundary" role="note"><Icon name="bolt" size={15} /><span>M03–M05 目前仅有静态 bundle 锚点。该工作面是 Sanbao 本地设计状态，不代表 Qoder 已观察工具结果、视觉、Figma、DSH Host、iOS 或 DMG 验收。</span></footer>
  </section>;
}

function ToolBody({ view, expanded, setExpanded, selectedImage, setSelectedImage }: { view: ToolResultView; expanded: boolean; setExpanded: (value: boolean) => void; selectedImage: number; setSelectedImage: (value: number) => void }) {
  if (view === 'web-search') return <><label className="tool-result-query"><Icon name="search" size={16} /><span>本地查询示例</span><input aria-label="本地网页检索示例" value="页面验收信息架构" readOnly /></label><ResultRows expanded={expanded} onExpanded={setExpanded} rows={['结果摘要 · 页面状态索引', '结果摘要 · 交互回归说明']} /></>;
  if (view === 'web-fetch') return <><div className="tool-result-url"><Icon name="globe" size={16} /><div><strong>https://example.invalid/review</strong><small>本地显示 URL，不尝试加载。</small></div></div><ResultRows expanded={expanded} onExpanded={setExpanded} rows={['页面标题占位', '正文结构摘要']} /></>;
  if (view === 'bash-output') return <><div className="tool-result-terminal"><header><span>本地命令占位</span><em>未执行</em></header><code>$ sanbao review --local-only{expanded ? '\n状态：本地摘要已准备\n没有读取项目文件或运行命令。' : '\n…'}</code></div><button type="button" className="secondary-button" onClick={() => setExpanded(!expanded)}>{expanded ? '收起本地输出' : '展开本地输出'}</button></>;
  if (view === 'task-output') return <div className="tool-result-timeline"><div className="done"><i>1</i><span><strong>任务范围已记录</strong><small>本地状态</small></span><Icon name="check" size={14} /></div><div><i>2</i><span><strong>结果摘要待查看</strong><small>未创建真实产物</small></span><Icon name="clock" size={14} /></div><div><i>3</i><span><strong>人工验收入口</strong><small>保留为原型路径</small></span></div></div>;
  if (view === 'widget') return <div className="tool-result-widget"><div><span className="tool-result-widget-mark"><Icon name="panel" size={19} /></span><div><strong>专用工作 Widget</strong><p>一个独立卡片可在此处展示专用结果或操作，但此处没有挂载任何插件。</p></div></div><button type="button" className="secondary-button" onClick={() => setExpanded(!expanded)}>{expanded ? '收起本地 Widget 内容' : '展开本地 Widget 内容'}</button>{expanded && <p className="tool-result-inline">本地 Widget 内容已展开，仅作为版式和关闭路径示意。</p>}</div>;
  if (view === 'thinking') return <div className="tool-result-thinking"><span><Icon name="clock" size={17} />工作状态摘要</span><strong>正在整理页面验收项</strong><p>仅展示用户可见的阶段状态和下一步边界；不包含模型内部推理、隐藏分析或真实模型请求。</p><button type="button" className="secondary-button" onClick={() => setExpanded(!expanded)}>{expanded ? '收起阶段摘要' : '查看阶段摘要'}</button>{expanded && <ul><li>收集页面入口</li><li>核对本地恢复路径</li><li>等待独立视觉校准</li></ul>}</div>;
  if (view === 'result-details') return <><ResultRows expanded={expanded} onExpanded={setExpanded} rows={['本地工具输入', '本地工具输出', '本地错误说明']} /><p className="tool-result-inline">展开项不含真实日志、路径、命令、网络响应或用户数据。</p></>;
  return <div className="tool-result-images"><div className="tool-result-image-grid">{['页面检查', '结果摘要', '恢复说明'].map((label, index) => <button type="button" key={label} className={selectedImage === index ? 'selected' : ''} aria-pressed={selectedImage === index} onClick={() => setSelectedImage(index)}><span>IMG</span><strong>{label}</strong><small>原创本地占位</small></button>)}</div><section><strong>{['页面检查', '结果摘要', '恢复说明'][selectedImage]}</strong><p>只演示选择与详情位置，不加载图片、读取本地文件或生成媒体。</p></section></div>;
}

function ResultRows({ rows, expanded, onExpanded }: { rows: readonly string[]; expanded: boolean; onExpanded: (value: boolean) => void }) {
  return <div className="tool-result-rows" role="list">{rows.map((row, index) => <button type="button" key={row} role="listitem" className={expanded && index === 0 ? 'expanded' : ''} onClick={() => onExpanded(!expanded)}><span><Icon name={index === 2 ? 'close' : 'file'} size={15} /></span><div><strong>{row}</strong><small>{expanded && index === 0 ? '本地详情已展开，内容为示例文本。' : '点击切换本地详情。'}</small></div><Icon name="chevron" size={14} /></button>)}</div>;
}
