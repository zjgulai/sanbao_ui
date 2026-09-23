import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Controls';

export type ExecutionLifecycleSource = 'queue' | 'steps' | 'follow-up';
export type QueueLifecycleView = 'queue-pending' | 'queue-retrying' | 'queue-ready' | 'queue-cancelled';
export type StepsLifecycleView = 'steps-running' | 'steps-blocked' | 'steps-resumed' | 'steps-cancelled';
export type FollowUpLifecycleView = 'follow-up-composer' | 'follow-up-queued' | 'follow-up-delivered' | 'follow-up-cancelled';
export type ExecutionLifecycleView = QueueLifecycleView | StepsLifecycleView | FollowUpLifecycleView;

type LifecycleViewBySource = {
  queue: QueueLifecycleView;
  steps: StepsLifecycleView;
  'follow-up': FollowUpLifecycleView;
};

export type ExecutionLifecycleProps<S extends ExecutionLifecycleSource = ExecutionLifecycleSource> = {
  source: S;
  view: LifecycleViewBySource[S];
  onNavigateView: (view: LifecycleViewBySource[S]) => void;
  onNavigateSource?: (source: ExecutionLifecycleSource) => void;
  onExit: () => void;
  onReset: () => void;
};

export const EXECUTION_LIFECYCLE_ENTRIES: readonly {
  stateId: 'QDR.S05.scope.unexpanded' | 'QDR.S06.scope.unexpanded' | 'QDR.S07.scope.unexpanded';
  id: 'SANBAO.S05.F01' | 'SANBAO.S06.F01' | 'SANBAO.S07.F01';
  source: ExecutionLifecycleSource;
  defaultView: ExecutionLifecycleView;
  label: string;
}[] = [
  { stateId: 'QDR.S05.scope.unexpanded', id: 'SANBAO.S05.F01', source: 'queue', defaultView: 'queue-pending', label: '模型队列与重试' },
  { stateId: 'QDR.S06.scope.unexpanded', id: 'SANBAO.S06.F01', source: 'steps', defaultView: 'steps-running', label: '执行步骤与阻塞' },
  { stateId: 'QDR.S07.scope.unexpanded', id: 'SANBAO.S07.F01', source: 'follow-up', defaultView: 'follow-up-composer', label: '运行中追加输入' },
];

const viewsBySource: { readonly [S in ExecutionLifecycleSource]: readonly LifecycleViewBySource[S][] } = {
  queue: ['queue-pending', 'queue-retrying', 'queue-ready', 'queue-cancelled'],
  steps: ['steps-running', 'steps-blocked', 'steps-resumed', 'steps-cancelled'],
  'follow-up': ['follow-up-composer', 'follow-up-queued', 'follow-up-delivered', 'follow-up-cancelled'],
};

const defaultViewBySource: { readonly [S in ExecutionLifecycleSource]: LifecycleViewBySource[S] } = {
  queue: 'queue-pending',
  steps: 'steps-running',
  'follow-up': 'follow-up-composer',
};

const copyBySource: Record<ExecutionLifecycleSource, { id: string; title: string; description: string; source: string }> = {
  queue: { id: 'SANBAO.S05.F01', title: '模型队列与恢复', description: '队列、重试和就绪状态只在本地 fixture 中切换。不会选择模型、发送消息、读取额度或访问外部服务。', source: 'QDR.S05 · 原产品静态候选' },
  steps: { id: 'SANBAO.S06.F01', title: '执行步骤与阻塞', description: '执行进度、阻塞与恢复只用于评审流程，不会运行工具、修改文件或触发后台任务。', source: 'QDR.S06 · 原产品静态候选' },
  'follow-up': { id: 'SANBAO.S07.F01', title: '运行中追加输入', description: '追加输入、排队和送达只停留在本地状态机，不会向模型、会话或系统写入任何内容。', source: 'QDR.S07 · 原产品静态候选' },
};

const isViewForSource = (source: ExecutionLifecycleSource, view: ExecutionLifecycleView): boolean => (
  (viewsBySource[source] as readonly ExecutionLifecycleView[]).includes(view)
);

export function ExecutionLifecycleWorkbench<S extends ExecutionLifecycleSource>({ source, view, onNavigateView, onNavigateSource, onExit, onReset }: ExecutionLifecycleProps<S>) {
  const normalized = isViewForSource(source, view) ? view : defaultViewBySource[source];
  const [activeView, setActiveView] = useState<ExecutionLifecycleView>(normalized);
  const [followUpText, setFollowUpText] = useState('请补充“验收入口”的说明，并将变更保留在待审阅状态。');

  useEffect(() => {
    setActiveView(normalized);
  }, [normalized, source]);

  const navigate = (next: ExecutionLifecycleView) => {
    if (!isViewForSource(source, next)) return;
    setActiveView(next);
    onNavigateView(next as LifecycleViewBySource[S]);
  };

  const reset = () => {
    setFollowUpText('请补充“验收入口”的说明，并将变更保留在待审阅状态。');
    navigate(defaultViewBySource[source]);
    onReset();
  };

  const cancel = () => {
    const cancelledView: Record<ExecutionLifecycleSource, ExecutionLifecycleView> = {
      queue: 'queue-cancelled',
      steps: 'steps-cancelled',
      'follow-up': 'follow-up-cancelled',
    };
    navigate(cancelledView[source]);
  };

  const copy = copyBySource[source];
  return <section className="design-workbench execution-lifecycle-workbench" data-state-source="static-only" aria-label="Sanbao 执行生命周期设计工作面">
    <header className="execution-lifecycle-header">
      <div>
        <span>Sanbao 设计工作面 · 原产品静态候选</span>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </div>
      <div className="execution-lifecycle-source"><strong>{copy.id}</strong><small>{copy.source}</small></div>
    </header>

    <nav className="execution-lifecycle-nav" aria-label="执行生命周期工作面">
      {EXECUTION_LIFECYCLE_ENTRIES.map(entry => <button key={entry.source} type="button" className={entry.source === source ? 'active' : ''} aria-current={entry.source === source ? 'page' : undefined} onClick={() => { if (entry.source !== source) onNavigateSource?.(entry.source); }}><span>{entry.id.replace('SANBAO.', '')}</span>{entry.label}</button>)}
    </nav>

    <main className="execution-lifecycle-stage">
      {source === 'queue' && <QueueLifecycle view={activeView} onNavigate={navigate} onCancel={cancel} onReset={reset} />}
      {source === 'steps' && <StepsLifecycle view={activeView} onNavigate={navigate} onCancel={cancel} onReset={reset} />}
      {source === 'follow-up' && <FollowUpLifecycle view={activeView} text={followUpText} onTextChange={setFollowUpText} onNavigate={navigate} onCancel={cancel} onReset={reset} />}
    </main>

    <footer className="execution-lifecycle-boundary" role="note"><Icon name="bolt" size={15} /><span>这是目录外 Sanbao 设计型状态机。它保留默认、取消、恢复与重置边界，原生 Qoder 行为、视觉、Figma、DSH Host、iOS 和 DMG 仍须独立验收。</span><button type="button" className="text-button" onClick={onExit}>退出工作面</button></footer>
  </section>;
}

type LifecyclePaneProps = {
  view: ExecutionLifecycleView;
  onNavigate: (view: ExecutionLifecycleView) => void;
  onCancel: () => void;
  onReset: () => void;
};

function LifecycleFrame({ eyebrow, title, status, children }: { eyebrow: string; title: string; status: string; children: React.ReactNode }) {
  const parts = React.Children.toArray(children);
  const actions = parts.pop();
  return <article className="execution-lifecycle-frame">
    <header><div><span>{eyebrow}</span><h2>{title}</h2></div><span className={`execution-lifecycle-status ${status}`}>{status === 'ready' ? '本地就绪' : status === 'blocked' ? '等待处理' : status === 'cancelled' ? '已本地取消' : '本地进行中'}</span></header>
    {parts}
    <footer>{actions}</footer>
  </article>;
}

function QueueLifecycle({ view, onNavigate, onCancel, onReset }: LifecyclePaneProps) {
  if (view === 'queue-cancelled') return <LifecycleFrame eyebrow="SANBAO.S05.F04 · 本地已取消" title="模型队列已从演示中移除" status="cancelled"><p className="execution-lifecycle-intro">取消结果不会终止真实模型、删除消息或改变桌面任务。可恢复到队列默认态，或重置整个演示。</p><div className="execution-lifecycle-empty"><Icon name="clock" size={19} /><div><strong>当前没有待处理的本地模型请求</strong><p>草稿和真实会话均未被访问。</p></div></div><QueueActions secondary="恢复队列" onSecondary={() => onNavigate('queue-pending')} onReset={onReset} /></LifecycleFrame>;
  if (view === 'queue-ready') return <LifecycleFrame eyebrow="SANBAO.S05.F03 · 本地就绪" title="下一步已准备就绪" status="ready"><p className="execution-lifecycle-intro">演示状态表示重试流程可以返回到任务工作面。它没有选择真实模型、读取账号余额或提交执行请求。</p><div className="execution-lifecycle-ready"><Icon name="check" size={18} /><div><strong>本地队列已准备完成</strong><p>后续执行仍须由获得验证的桌面任务接缝决定。</p></div></div><QueueActions secondary="返回队列" onSecondary={() => onNavigate('queue-pending')} onReset={onReset} /></LifecycleFrame>;
  if (view === 'queue-retrying') return <LifecycleFrame eyebrow="SANBAO.S05.F02 · 本地重试" title="正在等待可用执行槽" status="working"><p className="execution-lifecycle-intro">重试只改变本地状态。它展示可取消的等待边界，却不会发起请求、轮询服务或占用运行槽。</p><QueueRows rows={[['页面核对', '当前请求', '重试中'], ['草稿摘要', '前序请求', '已保留']]} active="页面核对" /><QueueActions secondary="取消本地重试" onSecondary={onCancel} primary="标记本地就绪" onPrimary={() => onNavigate('queue-ready')} onReset={onReset} /></LifecycleFrame>;
  return <LifecycleFrame eyebrow="SANBAO.S05.F01 · 本地队列" title="模型请求正在等待" status="working"><p className="execution-lifecycle-intro">默认态保留队列位置、可恢复草稿和重试入口。这里的“模型”仅是 UI 标签，不会访问供应商或发送任何内容。</p><QueueRows rows={[['页面核对', '第 2 位', '等待可用槽'], ['发布说明草稿', '第 1 位', '待审阅']]} active="页面核对" /><QueueActions secondary="取消本地队列" onSecondary={onCancel} primary="开始本地重试" onPrimary={() => onNavigate('queue-retrying')} onReset={onReset} /></LifecycleFrame>;
}

function QueueRows({ rows, active }: { rows: readonly [string, string, string][]; active: string }) {
  return <div className="execution-lifecycle-list" role="list">{rows.map(([name, position, state]) => <div key={name} className={name === active ? 'active' : ''} role="listitem"><span className="execution-lifecycle-dot" /><div><strong>{name}</strong><small>{position}</small></div><em>{state}</em></div>)}</div>;
}

function QueueActions({ secondary, onSecondary, primary, onPrimary, onReset }: { secondary: string; onSecondary: () => void; primary?: string; onPrimary?: () => void; onReset: () => void }) {
  return <><button type="button" className="text-button" onClick={onReset}>重置演示</button><span /><button type="button" className="secondary-button" onClick={onSecondary}>{secondary}</button>{primary && onPrimary && <button type="button" className="primary-button" onClick={onPrimary}>{primary}<Icon name="chevron" size={14} /></button>}</>;
}

function StepsLifecycle({ view, onNavigate, onCancel, onReset }: LifecyclePaneProps) {
  if (view === 'steps-cancelled') return <LifecycleFrame eyebrow="SANBAO.S06.F04 · 本地已取消" title="执行步骤已经暂停" status="cancelled"><p className="execution-lifecycle-intro">本地暂停不会停止工具、撤销文件变更或取消真实后台作业。它只保留恢复或重置的评审路径。</p><StepList state="cancelled" /><QueueActions secondary="恢复执行步骤" onSecondary={() => onNavigate('steps-running')} onReset={onReset} /></LifecycleFrame>;
  if (view === 'steps-resumed') return <LifecycleFrame eyebrow="SANBAO.S06.F03 · 本地已恢复" title="阻塞项已回到待继续状态" status="ready"><p className="execution-lifecycle-intro">恢复态仅表示界面允许继续演示。真实权限、工具回执、运行时错误和产物变更均未触发。</p><StepList state="resumed" /><QueueActions secondary="返回阻塞说明" onSecondary={() => onNavigate('steps-blocked')} primary="继续本地执行" onPrimary={() => onNavigate('steps-running')} onReset={onReset} /></LifecycleFrame>;
  if (view === 'steps-blocked') return <LifecycleFrame eyebrow="SANBAO.S06.F02 · 本地阻塞" title="需要补充信息才能继续" status="blocked"><p className="execution-lifecycle-intro">此阻塞卡只说明边界：范围扩大前暂停后续步骤。它不会请求授权、打开浏览器、创建文件或运行外部工具。</p><StepList state="blocked" /><div className="execution-lifecycle-callout"><Icon name="chat" size={16} /><div><strong>等待范围确认</strong><p>请确认是否把“验收入口”加入本轮页面说明。此处不保存真实回复。</p></div></div><QueueActions secondary="取消本地执行" onSecondary={onCancel} primary="模拟信息已补充" onPrimary={() => onNavigate('steps-resumed')} onReset={onReset} /></LifecycleFrame>;
  return <LifecycleFrame eyebrow="SANBAO.S06.F01 · 本地执行" title="正在执行页面核对步骤" status="working"><p className="execution-lifecycle-intro">默认态以可见步骤表达进度与下一处阻塞点。每个步骤均为本地展示，不调用工具或读写项目内容。</p><StepList state="running" /><QueueActions secondary="模拟步骤阻塞" onSecondary={() => onNavigate('steps-blocked')} primary="取消本地执行" onPrimary={onCancel} onReset={onReset} /></LifecycleFrame>;
}

function StepList({ state }: { state: 'running' | 'blocked' | 'resumed' | 'cancelled' }) {
  const current = state === 'blocked' ? '等待范围确认' : state === 'cancelled' ? '已在本地暂停' : state === 'resumed' ? '可以继续核对' : '整理页面与说明';
  return <ol className="execution-lifecycle-steps"><li className="done"><Icon name="check" size={12} /><div><strong>确认任务边界</strong><small>本地演示已完成</small></div></li><li className={state === 'running' ? 'current' : 'done'}><Icon name={state === 'running' ? 'clock' : 'check'} size={12} /><div><strong>整理页面与说明</strong><small>{state === 'running' ? '本地进行中' : '保留为演示记录'}</small></div></li><li className={state === 'blocked' ? 'blocked' : state === 'cancelled' ? 'cancelled' : state === 'resumed' ? 'current' : ''}><Icon name={state === 'blocked' || state === 'cancelled' ? 'close' : 'clock'} size={12} /><div><strong>{current}</strong><small>{state === 'blocked' ? '等待本地回放' : state === 'cancelled' ? '未执行下一步' : state === 'resumed' ? '尚未运行工具' : '下一步演示入口'}</small></div></li></ol>;
}

function FollowUpLifecycle({ view, text, onTextChange, onNavigate, onCancel, onReset }: LifecyclePaneProps & { text: string; onTextChange: (value: string) => void }) {
  if (view === 'follow-up-cancelled') return <LifecycleFrame eyebrow="SANBAO.S07.F04 · 本地已取消" title="追加输入未进入演示队列" status="cancelled"><p className="execution-lifecycle-intro">这不会撤销、清空或更改真实会话内容。可回到输入默认态继续查看本地草稿。</p><div className="execution-lifecycle-empty"><Icon name="chat" size={19} /><div><strong>本地追加输入已保留为草稿</strong><p>没有发送给模型或写入任务历史。</p></div></div><QueueActions secondary="恢复本地草稿" onSecondary={() => onNavigate('follow-up-composer')} onReset={onReset} /></LifecycleFrame>;
  if (view === 'follow-up-delivered') return <LifecycleFrame eyebrow="SANBAO.S07.F03 · 本地已送达" title="追加输入已交给本地状态机" status="ready"><p className="execution-lifecycle-intro">送达表示 UI 回放完成，不表示模型已经收到内容、任务发生变更或生成了输出。</p><div className="execution-lifecycle-ready"><Icon name="check" size={18} /><div><strong>已记录为本地 follow-up</strong><p>可以返回输入面查看下一条补充内容。</p></div></div><QueueActions secondary="继续追加输入" onSecondary={() => onNavigate('follow-up-composer')} onReset={onReset} /></LifecycleFrame>;
  if (view === 'follow-up-queued') return <LifecycleFrame eyebrow="SANBAO.S07.F02 · 本地待发送" title="追加输入正在等待写入" status="working"><p className="execution-lifecycle-intro">队列状态只用于确认追加、撤回和回到输入框的交互。它不会执行发送、联网或调用模型。</p><div className="execution-lifecycle-message"><span>追加内容</span><p>{text.trim() || '尚未输入补充内容'}</p></div><QueueActions secondary="撤回到输入框" onSecondary={() => onNavigate('follow-up-composer')} primary="标记本地送达" onPrimary={() => onNavigate('follow-up-delivered')} onReset={onReset} /></LifecycleFrame>;
  const canQueue = text.trim().length > 0;
  return <LifecycleFrame eyebrow="SANBAO.S07.F01 · 本地追加输入" title="任务运行中仍可补充说明" status="working"><p className="execution-lifecycle-intro">默认态保留输入、追加到队列、取消和恢复边界。输入不会持久化或写入任何外部会话。</p><label className="execution-lifecycle-composer"><span>补充说明 · 仅本地演示</span><textarea aria-label="本地追加输入" value={text} onChange={event => onTextChange(event.target.value)} placeholder="补充希望继续执行的内容…" /></label><QueueActions secondary="取消本地追加" onSecondary={onCancel} primary={canQueue ? '追加到本地队列' : undefined} onPrimary={canQueue ? () => onNavigate('follow-up-queued') : undefined} onReset={onReset} /></LifecycleFrame>;
}
