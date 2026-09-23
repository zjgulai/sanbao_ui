import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Controls';

export type TaskMonitorView = 'fixed' | 'floating' | 'detail' | 'stopped' | 'recovered';

export const TASK_MONITOR_WORKBENCH_ENTRY = {
  stateId: 'QDR.P16.scope.unexpanded',
  id: 'SANBAO.P16.F01',
  label: '任务监控设计工作面',
  source: 'P16 静态候选',
} as const;

export type TaskMonitorWorkbenchProps = {
  view?: TaskMonitorView;
  onNavigateView?: (view: TaskMonitorView) => void;
  onExit?: () => void;
  onReset?: () => void;
};

type MonitorItem = {
  id: 'agent-design' | 'agent-verify' | 'process-preview' | 'process-index';
  group: 'agent' | 'process';
  title: string;
  detail: string;
  state: '运行中' | '等待输入' | '待检查' | '已暂停';
  progress: string;
};

const MONITOR_ITEMS: readonly MonitorItem[] = [
  { id: 'agent-design', group: 'agent', title: '设计检查子 Agent', detail: '收集工作面需要核对的展示边界。', state: '运行中', progress: '2 / 4 项' },
  { id: 'agent-verify', group: 'agent', title: '交互回归子 Agent', detail: '等待本地回放的输入说明。', state: '等待输入', progress: '等待确认' },
  { id: 'process-preview', group: 'process', title: '本地预览检查', detail: '用于展示后台进程的分组和详情层级。', state: '待检查', progress: '尚未执行' },
  { id: 'process-index', group: 'process', title: '索引整理流程', detail: '用于展示可暂停和恢复的过程条目。', state: '已暂停', progress: '1 / 3 项' },
];

const DEFAULT_VIEW: TaskMonitorView = 'fixed';
const DEFAULT_SELECTION: MonitorItem['id'] = 'agent-design';

const viewLabel: Record<TaskMonitorView, string> = {
  fixed: '固定面板',
  floating: '浮动面板',
  detail: '条目详情',
  stopped: '本地已停止',
  recovered: '本地已恢复',
};

const isKnownView = (value: TaskMonitorView): boolean => ['fixed', 'floating', 'detail', 'stopped', 'recovered'].includes(value);

export function TaskMonitorWorkbench({ view = DEFAULT_VIEW, onNavigateView, onExit, onReset }: TaskMonitorWorkbenchProps) {
  const normalizedView = isKnownView(view) ? view : DEFAULT_VIEW;
  const [activeView, setActiveView] = useState<TaskMonitorView>(normalizedView);
  const [selectedId, setSelectedId] = useState<MonitorItem['id']>(DEFAULT_SELECTION);
  const [stoppedId, setStoppedId] = useState<MonitorItem['id'] | null>(null);
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const selected = useMemo(() => MONITOR_ITEMS.find(item => item.id === selectedId) ?? MONITOR_ITEMS[0], [selectedId]);

  useEffect(() => {
    setActiveView(normalizedView);
    if (normalizedView === 'stopped') setStoppedId(current => current ?? selectedId);
    if (normalizedView === 'recovered') setStoppedId(null);
  }, [normalizedView, selectedId]);

  const navigate = (next: TaskMonitorView) => {
    setActiveView(next);
    onNavigateView?.(next);
  };

  const selectItem = (item: MonitorItem) => {
    setSelectedId(item.id);
    navigate('detail');
  };

  const stopLocal = () => {
    setStoppedId(selected.id);
    navigate('stopped');
  };

  const recoverLocal = () => {
    setStoppedId(null);
    navigate('recovered');
  };

  const reset = () => {
    setSelectedId(DEFAULT_SELECTION);
    setStoppedId(null);
    setPinnedOpen(true);
    navigate(DEFAULT_VIEW);
    onReset?.();
  };

  const shellClass = activeView === 'floating' ? 'floating' : 'fixed';
  return <section className={`design-workbench task-monitor-workbench ${shellClass}`} data-state-source="static-only" aria-label="Sanbao 任务监控设计工作面">
    <header className="task-monitor-header">
      <div>
        <span>Sanbao 设计工作面 · 原产品静态候选</span>
        <h1>任务监控与后台活动</h1>
        <p>固定／浮动布局、后台 Agent、后台进程和条目详情只为本地评审回放；这里不启动任务、子 Agent、终端进程、模型或网络请求。</p>
      </div>
      <div className="task-monitor-source"><strong>{TASK_MONITOR_WORKBENCH_ENTRY.id}</strong><small>QDR.P16 · 静态候选</small></div>
    </header>

    <nav className="task-monitor-layout-tabs" aria-label="任务监控工作面视图">
      <button type="button" className={activeView === 'fixed' ? 'active' : ''} aria-pressed={activeView === 'fixed'} onClick={() => navigate('fixed')}><Icon name="panel" size={14} /><span><strong>固定面板</strong><small>任务右侧</small></span></button>
      <button type="button" className={activeView === 'floating' ? 'active' : ''} aria-pressed={activeView === 'floating'} onClick={() => navigate('floating')}><Icon name="grid" size={14} /><span><strong>浮动面板</strong><small>自由查看</small></span></button>
      <button type="button" className={activeView === 'detail' || activeView === 'stopped' || activeView === 'recovered' ? 'active' : ''} aria-pressed={activeView === 'detail' || activeView === 'stopped' || activeView === 'recovered'} onClick={() => navigate('detail')}><Icon name="file" size={14} /><span><strong>详情反馈</strong><small>{viewLabel[activeView]}</small></span></button>
    </nav>

    <main className="task-monitor-stage">
      {activeView === 'detail' || activeView === 'stopped' || activeView === 'recovered'
        ? <MonitorDetail item={selected} view={activeView} stoppedId={stoppedId} onStop={stopLocal} onRecover={recoverLocal} onBack={() => navigate('fixed')} onReset={reset} />
        : <MonitorShell layout={activeView} open={pinnedOpen} onToggleOpen={() => setPinnedOpen(value => !value)} onSelect={selectItem} onReset={reset} onExit={onExit} />}
    </main>

    <footer className="task-monitor-boundary" role="note"><Icon name="bolt" size={15} /><span>P16、S09、S10 与 M01 的这组展开分支没有新增 Qoder 原生证据。既有任务回顾、用量和会话 fixture 不会由此工作面替换；视觉、Figma、DSH Host、iOS 与 DMG 仍需单独验收。</span><button type="button" className="text-button" onClick={onExit}>退出工作面</button></footer>
  </section>;
}

function MonitorShell({ layout, open, onToggleOpen, onSelect, onReset, onExit }: { layout: 'fixed' | 'floating'; open: boolean; onToggleOpen: () => void; onSelect: (item: MonitorItem) => void; onReset: () => void; onExit?: () => void }) {
  return <div className={`task-monitor-shell ${layout}`}>
    <section className="task-monitor-canvas" aria-label={layout === 'fixed' ? '固定任务工作区示例' : '浮动任务工作区示例'}>
      <header><div><span>任务 · 本地示例</span><strong>完成 Qoder 界面覆盖检查</strong></div><span className="task-monitor-canvas-state"><Icon name="clock" size={12} /> 本地进行中</span></header>
      <div className="task-monitor-canvas-lines"><span /><span /><span /><span /></div>
      <p>此处只保留固定与浮动布局的空间关系。没有真实任务、文件、消息、模型或系统进程被读取或修改。</p>
    </section>
    <aside className={`task-monitor-panel ${open ? 'open' : 'collapsed'}`} aria-label={layout === 'fixed' ? '固定任务监控面板' : '浮动任务监控面板'}>
      <header className="task-monitor-panel-header"><div><span>任务监控 · 本地演示</span><h2>{layout === 'fixed' ? '固定在任务右侧' : '可浮动查看'}</h2></div><button type="button" className="icon-button" aria-label={open ? '收起本地任务监控' : '展开本地任务监控'} aria-expanded={open} onClick={onToggleOpen}><Icon name={open ? 'down' : 'chevron'} size={15} /></button></header>
      {open && <>
        <TaskSummary />
        <MonitorGroup label="后台 Agent" description="模拟父子任务关联" icon="chat" items={MONITOR_ITEMS.filter(item => item.group === 'agent')} onSelect={onSelect} />
        <MonitorGroup label="后台进程" description="模拟长流程与检查项" icon="code" items={MONITOR_ITEMS.filter(item => item.group === 'process')} onSelect={onSelect} />
        <footer className="task-monitor-panel-footer"><button type="button" className="text-button" onClick={onReset}>重置演示</button><span /><button type="button" className="secondary-button" onClick={onExit}>退出</button></footer>
      </>}
    </aside>
  </div>;
}

function TaskSummary() {
  return <section className="task-monitor-summary" aria-label="任务概览">
    <div><span>任务目标</span><strong>确认页面与交互覆盖边界</strong></div>
    <div><span>计划</span><strong>3 / 5 本地检查项</strong></div>
    <div><span>记忆与便签</span><strong>仅保留本页演示数据</strong></div>
  </section>;
}

function MonitorGroup({ label, description, icon, items, onSelect }: { label: string; description: string; icon: string; items: readonly MonitorItem[]; onSelect: (item: MonitorItem) => void }) {
  return <section className="task-monitor-group" aria-label={label}>
    <header><span><Icon name={icon} size={14} />{label}</span><small>{description}</small></header>
    <div>{items.map(item => <button key={item.id} type="button" className="task-monitor-item" onClick={() => onSelect(item)}><span className={`task-monitor-item-dot ${item.state === '运行中' ? 'running' : item.state === '已暂停' ? 'paused' : ''}`} /><span><strong>{item.title}</strong><small>{item.detail}</small></span><em>{item.state}</em><Icon name="chevron" size={13} /></button>)}</div>
  </section>;
}

function MonitorDetail({ item, view, stoppedId, onStop, onRecover, onBack, onReset }: { item: MonitorItem; view: 'detail' | 'stopped' | 'recovered'; stoppedId: MonitorItem['id'] | null; onStop: () => void; onRecover: () => void; onBack: () => void; onReset: () => void }) {
  const stopped = view === 'stopped' && stoppedId === item.id;
  const recovered = view === 'recovered';
  return <article className={`task-monitor-detail ${stopped ? 'stopped' : recovered ? 'recovered' : ''}`}>
    <header><div><span>{stopped ? 'SANBAO.P16.F04 · 本地已停止' : recovered ? 'SANBAO.P16.F05 · 本地已恢复' : 'SANBAO.P16.F03 · 本地条目详情'}</span><h2>{stopped ? '已停止本地演示条目' : recovered ? '本地演示已恢复为可查看' : item.title}</h2></div><span className="task-monitor-detail-status">{stopped ? '本地已停止' : recovered ? '本地已恢复' : item.state}</span></header>
    <p>{stopped ? `“${item.title}”没有实际停止任何 Agent、进程或任务；此结果只用于验证停止后的视觉反馈和返回路径。` : recovered ? `“${item.title}”已经回到本地可查看状态；恢复不会重启命令、联网、访问模型或写入工作区。` : '当前面板将分组条目转为单条说明。下面数据是固定 fixture，不读取真实父子任务、运行时间、命令、日志或上下文。'}</p>
    <dl className="task-monitor-detail-grid"><div><dt>所属分组</dt><dd>{item.group === 'agent' ? '后台 Agent' : '后台进程'}</dd></div><div><dt>本地进度</dt><dd>{recovered ? '可重新查看' : item.progress}</dd></div><div><dt>关联任务</dt><dd>界面覆盖检查 · 示例</dd></div><div><dt>上下文</dt><dd>仅本地演示，未压缩</dd></div></dl>
    <div className="task-monitor-detail-note"><Icon name="bolt" size={16} /><div><strong>{stopped ? '停止边界已展示' : recovered ? '恢复边界已展示' : '条目详情仅作设计回放'}</strong><p>真实任务取消、后台进程恢复、侧聊继承、上下文压缩和工具过程仍需要独立原生证据。</p></div></div>
    <footer><button type="button" className="text-button" onClick={onReset}>重置演示</button><span /><button type="button" className="secondary-button" onClick={onBack}>{stopped || recovered ? '返回监控面板' : '返回固定面板'}</button>{stopped ? <button type="button" className="primary-button" onClick={onRecover}>恢复本地演示 <Icon name="chevron" size={14} /></button> : !recovered && <button type="button" className="task-monitor-stop" onClick={onStop}>停止本地演示</button>}</footer>
  </article>;
}
