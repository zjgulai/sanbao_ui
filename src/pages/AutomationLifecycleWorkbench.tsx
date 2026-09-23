import { useEffect, useState } from 'react';
import { Icon } from '../components/Controls';

export const AUTOMATION_LIFECYCLE_VIEWS = [
  'schedule-edit',
  'pause-confirm',
  'pause-active',
  'run-history',
  'run-failed',
  'run-detail',
  'delete-confirm',
  'deleted',
] as const;

export type AutomationLifecycleView = typeof AUTOMATION_LIFECYCLE_VIEWS[number];

type AutomationLifecycleEntry = {
  view: AutomationLifecycleView;
  fixtureId: string;
  label: string;
  title: string;
  description: string;
};

export const AUTOMATION_LIFECYCLE_ENTRIES: readonly AutomationLifecycleEntry[] = [
  { view: 'schedule-edit', fixtureId: 'SANBAO.P03.F08', label: '编辑计划', title: '自动化计划编辑候选', description: '只回放名称、频率和时间的本地草稿，不保存真实调度配置。' },
  { view: 'pause-confirm', fixtureId: 'SANBAO.P03.F09', label: '暂停确认', title: '暂停自动化确认候选', description: '确认层仅改变本地演示状态，不暂停后台任务或通知服务。' },
  { view: 'pause-active', fixtureId: 'SANBAO.P03.F10', label: '已暂停', title: '自动化已暂停候选', description: '本地状态用于检查暂停提示、恢复入口和下一次计划的表达。' },
  { view: 'run-history', fixtureId: 'SANBAO.P03.F11', label: '运行记录', title: '自动化运行记录候选', description: '记录文本均为本地示例，不读取调度日志、模型输出或真实任务。' },
  { view: 'run-failed', fixtureId: 'SANBAO.P03.F12', label: '运行失败', title: '自动化失败候选', description: '只展示单次失败、重试提示和退出路径，不发起重试。' },
  { view: 'run-detail', fixtureId: 'SANBAO.P03.F13', label: '记录详情', title: '运行记录详情候选', description: '展开本地步骤摘要，不加载任务上下文、文件或执行日志。' },
  { view: 'delete-confirm', fixtureId: 'SANBAO.P03.F14', label: '删除确认', title: '删除自动化确认候选', description: '删除确认只作用于内存演示，不删除真实任务、计划或数据。' },
  { view: 'deleted', fixtureId: 'SANBAO.P03.F15', label: '删除后恢复', title: '自动化已从演示中移除', description: '可重新打开本地候选，检验删除后的空态与恢复路径。' },
];

export const AUTOMATION_LIFECYCLE_STATE_ID = 'QDR.P03.list.empty' as const;

export type AutomationLifecycleWorkbenchProps = {
  view: AutomationLifecycleView;
  onNavigateView: (view: AutomationLifecycleView) => void;
  onExit: () => void;
  onReset: () => void;
};

function entryFor(view: AutomationLifecycleView) {
  return AUTOMATION_LIFECYCLE_ENTRIES.find(entry => entry.view === view) ?? AUTOMATION_LIFECYCLE_ENTRIES[0];
}

export function AutomationLifecycleWorkbench({ view, onNavigateView, onExit, onReset }: AutomationLifecycleWorkbenchProps) {
  const [activeView, setActiveView] = useState<AutomationLifecycleView>(view);
  const [draftName, setDraftName] = useState('每日项目回顾');
  const [draftFrequency, setDraftFrequency] = useState('每个工作日');
  const [draftTime, setDraftTime] = useState('18:00');
  const [detailExpanded, setDetailExpanded] = useState(false);
  const [localStatus, setLocalStatus] = useState<'ready' | 'paused' | 'failed' | 'deleted'>('ready');
  const entry = entryFor(activeView);

  useEffect(() => {
    setActiveView(view);
    setDetailExpanded(false);
  }, [view]);

  const navigate = (next: AutomationLifecycleView) => {
    setActiveView(next);
    setDetailExpanded(false);
    onNavigateView(next);
  };

  const reset = () => {
    setDraftName('每日项目回顾');
    setDraftFrequency('每个工作日');
    setDraftTime('18:00');
    setDetailExpanded(false);
    setLocalStatus('ready');
    onReset();
  };

  return <section className="design-workbench automation-lifecycle-workbench" data-state-source="static-only" aria-label="Sanbao 自动化生命周期设计工作面">
    <header className="automation-lifecycle-header">
      <div><span>Sanbao 设计工作面 · 静态候选</span><h1>自动化剩余流程</h1><p>补充编辑、暂停、失败、运行详情、删除与恢复的本地交互合同。此处没有调度器、通知、模型或持久化连接。</p></div>
      <div className="automation-lifecycle-source"><strong>{entry.fixtureId}</strong><small>QDR.P03.list.empty · static-only</small></div>
    </header>

    <div className="automation-lifecycle-layout">
      <nav className="automation-lifecycle-nav" aria-label="自动化生命周期工作面导航">
        <section><strong>计划管理</strong>{AUTOMATION_LIFECYCLE_ENTRIES.slice(0, 3).map(item => <LifecycleNav key={item.view} item={item} active={activeView} onSelect={navigate} />)}</section>
        <section><strong>运行与错误</strong>{AUTOMATION_LIFECYCLE_ENTRIES.slice(3, 6).map(item => <LifecycleNav key={item.view} item={item} active={activeView} onSelect={navigate} />)}</section>
        <section><strong>删除与恢复</strong>{AUTOMATION_LIFECYCLE_ENTRIES.slice(6).map(item => <LifecycleNav key={item.view} item={item} active={activeView} onSelect={navigate} />)}</section>
      </nav>

      <main className="automation-lifecycle-stage">
        <article className={`automation-lifecycle-card ${localStatus}`}>
          <header><div><span>{entry.fixtureId}</span><h2>{entry.title}</h2><p>{entry.description}</p></div><em>{localStatus === 'paused' ? '本地已暂停' : localStatus === 'failed' ? '本地失败示例' : localStatus === 'deleted' ? '本地已移除' : '本地候选'}</em></header>
          <LifecycleBody view={activeView} draftName={draftName} draftFrequency={draftFrequency} draftTime={draftTime} setDraftName={setDraftName} setDraftFrequency={setDraftFrequency} setDraftTime={setDraftTime} detailExpanded={detailExpanded} setDetailExpanded={setDetailExpanded} localStatus={localStatus} setLocalStatus={setLocalStatus} navigate={navigate} />
          <footer><button type="button" className="text-button" onClick={reset}>重置当前演示</button><span /><button type="button" className="secondary-button" onClick={onExit}>返回自动化首页</button></footer>
        </article>
      </main>
    </div>
    <footer className="automation-lifecycle-boundary" role="note"><Icon name="clock" size={15} /><span>P03 原生仅保留空列表和默认新建表单证据。该工作面是 Sanbao 的 static-only 设计状态，不代表 Qoder 已观察编辑、暂停、失败、重试、记录详情、删除、视觉、Figma、DSH Host、iOS 或 DMG 验收。</span></footer>
  </section>;
}

function LifecycleNav({ item, active, onSelect }: { item: AutomationLifecycleEntry; active: AutomationLifecycleView; onSelect: (view: AutomationLifecycleView) => void }) {
  return <button type="button" className={item.view === active ? 'active' : ''} aria-current={item.view === active ? 'page' : undefined} onClick={() => onSelect(item.view)}><span>{item.fixtureId.replace('SANBAO.', '')}</span>{item.label}</button>;
}

function LifecycleBody({ view, draftName, draftFrequency, draftTime, setDraftName, setDraftFrequency, setDraftTime, detailExpanded, setDetailExpanded, localStatus, setLocalStatus, navigate }: {
  view: AutomationLifecycleView;
  draftName: string;
  draftFrequency: string;
  draftTime: string;
  setDraftName: (value: string) => void;
  setDraftFrequency: (value: string) => void;
  setDraftTime: (value: string) => void;
  detailExpanded: boolean;
  setDetailExpanded: (value: boolean) => void;
  localStatus: 'ready' | 'paused' | 'failed' | 'deleted';
  setLocalStatus: (value: 'ready' | 'paused' | 'failed' | 'deleted') => void;
  navigate: (view: AutomationLifecycleView) => void;
}) {
  if (view === 'schedule-edit') return <form className="automation-lifecycle-form" onSubmit={event => { event.preventDefault(); navigate('run-history'); }}><label>自动化名称<input aria-label="本地自动化名称" value={draftName} onChange={event => setDraftName(event.target.value)} maxLength={60} /></label><div><label>频率<select aria-label="本地计划频率" value={draftFrequency} onChange={event => setDraftFrequency(event.target.value)}><option>每个工作日</option><option>每天</option><option>每周</option></select></label><label>时间<input aria-label="本地计划时间" value={draftTime} onChange={event => setDraftTime(event.target.value)} /></label></div><p>保存只在工作面内回放“草稿已更新”，不会修改调度配置。</p><button type="submit" className="primary-button">保存本地草稿</button></form>;
  if (view === 'pause-confirm') return <section className="automation-lifecycle-confirm"><Icon name="clock" size={25} /><h3>暂停后不再展示下一次本地计划</h3><p>这是确认层级与返回路径示意，不会暂停外部自动化、通知或任务。</p><div><button type="button" className="secondary-button" onClick={() => navigate('schedule-edit')}>返回编辑</button><button type="button" className="primary-button" onClick={() => { setLocalStatus('paused'); navigate('pause-active'); }}>确认本地暂停</button></div></section>;
  if (view === 'pause-active') return <section className="automation-lifecycle-status"><Icon name="clock" size={24} /><h3>{localStatus === 'paused' ? '本地计划已暂停' : '暂停状态候选'}</h3><p>下次运行位于暂停状态下，不会触发补跑或真实恢复。</p><button type="button" className="primary-button" onClick={() => { setLocalStatus('ready'); navigate('run-history'); }}>恢复本地计划</button></section>;
  if (view === 'run-history') return <section className="automation-lifecycle-runs"><div className="automation-lifecycle-run"><span className="success"><Icon name="check" size={15} /></span><div><strong>{draftName}</strong><small>{draftFrequency} · {draftTime} · 本地完成摘要</small></div><button type="button" className="text-button" onClick={() => navigate('run-detail')}>查看详情</button></div><div className="automation-lifecycle-run"><span className="waiting"><Icon name="clock" size={15} /></span><div><strong>下一次本地计划</strong><small>{localStatus === 'paused' ? '当前处于本地暂停状态' : '等待中的示例记录'}</small></div><button type="button" className="text-button" onClick={() => navigate('run-failed')}>查看失败示例</button></div></section>;
  if (view === 'run-failed') return <section className="automation-lifecycle-error"><Icon name="close" size={24} /><h3>{localStatus === 'failed' ? '本地失败状态已记录' : '单次运行失败候选'}</h3><p>仅模拟一次记录的失败提示；不会重试模型、调度器、网络或任何后台服务。</p><div><button type="button" className="secondary-button" onClick={() => navigate('run-history')}>返回记录</button><button type="button" className="primary-button" onClick={() => { setLocalStatus('failed'); navigate('run-detail'); }}>查看本地失败详情</button></div></section>;
  if (view === 'run-detail') return <section className="automation-lifecycle-detail"><div><span className={localStatus === 'failed' ? 'failure' : 'success'}><Icon name={localStatus === 'failed' ? 'close' : 'check'} size={14} /></span><strong>{localStatus === 'failed' ? '本地失败记录' : '本地完成记录'}</strong><small>2026-09-23 18:00 · 示例时间</small></div><p>{localStatus === 'failed' ? '失败原因、日志和重试参数均未连接；此文本只保留详情布局。' : '此处仅保留结果摘要位置，不读取任务、文件、模型或执行输出。'}</p><button type="button" className="secondary-button" onClick={() => setDetailExpanded(!detailExpanded)}>{detailExpanded ? '收起本地步骤摘要' : '展开本地步骤摘要'}</button>{detailExpanded && <ol><li>读取本地计划占位</li><li>组织用户可见摘要</li><li>等待人工查看</li></ol>}</section>;
  if (view === 'delete-confirm') return <section className="automation-lifecycle-confirm destructive"><Icon name="close" size={25} /><h3>从本地演示中移除此自动化</h3><p>确认后只显示删除后的本地恢复入口，不删除任何真实自动化、文件或数据。</p><div><button type="button" className="secondary-button" onClick={() => navigate('run-history')}>取消</button><button type="button" className="danger-button" onClick={() => { setLocalStatus('deleted'); navigate('deleted'); }}>确认本地移除</button></div></section>;
  return <section className="automation-lifecycle-status deleted"><Icon name="check" size={24} /><h3>{localStatus === 'deleted' ? '本地演示条目已移除' : '删除后空态候选'}</h3><p>重新打开只恢复静态示例，不会恢复或重建任何真实计划。</p><button type="button" className="primary-button" onClick={() => { setLocalStatus('ready'); navigate('schedule-edit'); }}>重新打开本地候选</button></section>;
}
