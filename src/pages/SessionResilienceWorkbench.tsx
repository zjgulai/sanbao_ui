import { useEffect, useState } from 'react';
import { Icon } from '../components/Controls';

export const SESSION_RESILIENCE_VIEWS = [
  'workspace-missing',
  'history-missing',
  'quota-exhausted',
  'model-throttled',
  'license-unavailable',
  'network-offline',
  'preview-unavailable',
  'tool-detail-unavailable',
] as const;

export type SessionResilienceView = typeof SESSION_RESILIENCE_VIEWS[number];
type ResilienceGroup = 'S11' | 'S12' | 'S13';

type ResilienceEntry = {
  view: SessionResilienceView;
  stateId: 'QDR.S11.scope.unexpanded' | 'QDR.S12.scope.unexpanded' | 'QDR.S13.scope.unexpanded';
  group: ResilienceGroup;
  fixtureId: string;
  label: string;
  title: string;
  description: string;
  impact: string;
  action: string;
};

export const SESSION_RESILIENCE_ENTRIES: readonly ResilienceEntry[] = [
  { view: 'workspace-missing', stateId: 'QDR.S11.scope.unexpanded', group: 'S11', fixtureId: 'SANBAO.S11.F01', label: '工作区不可用', title: '当前工作区暂不可用', description: '任务无法继续使用原本的本地范围。这里仅展示可审阅的中断说明。', impact: '本地任务摘要仍可查看，文件、目录和远端工作区均未被读取。', action: '返回任务摘要' },
  { view: 'history-missing', stateId: 'QDR.S11.scope.unexpanded', group: 'S11', fixtureId: 'SANBAO.S11.F02', label: '执行历史缺失', title: '没有找到可继续的执行历史', description: '不能从此演示卡继续某个既有步骤，避免将缺失的上下文误当作成功恢复。', impact: '只展示恢复说明；不会读取会话、历史文件或本机缓存。', action: '查看恢复建议' },
  { view: 'quota-exhausted', stateId: 'QDR.S12.scope.unexpanded', group: 'S12', fixtureId: 'SANBAO.S12.F01', label: '配额耗尽', title: '当前配额暂不可用', description: '保留草稿与任务说明，等待可用条件恢复后再决定是否继续。', impact: '没有读取账号、余额、计费或订阅信息。', action: '查看本地恢复方式' },
  { view: 'model-throttled', stateId: 'QDR.S12.scope.unexpanded', group: 'S12', fixtureId: 'SANBAO.S12.F02', label: '模型限制', title: '模型请求暂受频率限制', description: '任务没有被重新发送。界面把等待、取消和恢复路径留在同一处。', impact: '没有选择模型、发起重试或访问任何服务端。', action: '查看本地恢复方式' },
  { view: 'license-unavailable', stateId: 'QDR.S12.scope.unexpanded', group: 'S12', fixtureId: 'SANBAO.S12.F03', label: '许可证不可用', title: '尚无可用的任务许可证', description: '在确认可用权限前，不把任务继续、切换模型或生成产物写成已经完成。', impact: '没有读取账户、许可证、组织或设备身份。', action: '查看本地恢复方式' },
  { view: 'network-offline', stateId: 'QDR.S12.scope.unexpanded', group: 'S12', fixtureId: 'SANBAO.S12.F04', label: '网络不可用', title: '当前无法访问任务所需网络', description: '草稿保留在当前原型内，可先返回任务摘要，不执行任何连接检测。', impact: '没有访问网络、代理、DNS、账号或远端资源。', action: '查看本地恢复方式' },
  { view: 'preview-unavailable', stateId: 'QDR.S13.scope.unexpanded', group: 'S13', fixtureId: 'SANBAO.S13.F01', label: '预览未打开', title: '文件预览暂未打开', description: '错误范围限定在这块产物预览中；其他任务摘要和本地导航仍可以查看。', impact: '不会读取文件、尝试打开系统应用或请求预览服务。', action: '恢复本地预览占位' },
  { view: 'tool-detail-unavailable', stateId: 'QDR.S13.scope.unexpanded', group: 'S13', fixtureId: 'SANBAO.S13.F02', label: '工具详情未显示', title: '工具详情暂未显示', description: '局部详情不可用不应阻塞任务摘要、产物目录与返回路径。', impact: '不会运行工具、重试命令、读取日志或连接运行环境。', action: '恢复本地详情占位' },
];

export const SESSION_RESILIENCE_STATE_BY_VIEW: Readonly<Record<SessionResilienceView, ResilienceEntry['stateId']>> = Object.fromEntries(
  SESSION_RESILIENCE_ENTRIES.map(entry => [entry.view, entry.stateId]),
) as Record<SessionResilienceView, ResilienceEntry['stateId']>;

export type SessionResilienceWorkbenchProps = {
  view: SessionResilienceView;
  onNavigateView: (view: SessionResilienceView) => void;
  onExit: () => void;
  onReset: () => void;
};

const GROUPS: readonly { id: ResilienceGroup; label: string; description: string }[] = [
  { id: 'S11', label: '任务上下文', description: '工作区或历史不可用' },
  { id: 'S12', label: '服务条件', description: '配额、模型、许可证与网络' },
  { id: 'S13', label: '局部展示', description: '预览或工具详情不可用' },
];

function findEntry(view: SessionResilienceView) {
  return SESSION_RESILIENCE_ENTRIES.find(entry => entry.view === view) ?? SESSION_RESILIENCE_ENTRIES[0];
}

export function SessionResilienceWorkbench({ view, onNavigateView, onExit, onReset }: SessionResilienceWorkbenchProps) {
  const [activeView, setActiveView] = useState<SessionResilienceView>(view);
  const [adviceVisible, setAdviceVisible] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const entry = findEntry(activeView);

  useEffect(() => {
    setActiveView(view);
    setAdviceVisible(false);
    setRecovered(false);
  }, [view]);

  const navigate = (next: SessionResilienceView) => {
    setActiveView(next);
    setAdviceVisible(false);
    setRecovered(false);
    onNavigateView(next);
  };

  const reset = () => {
    setAdviceVisible(false);
    setRecovered(false);
    onReset();
  };

  const showAdvice = () => {
    if (entry.group === 'S13') setRecovered(true);
    else setAdviceVisible(true);
  };

  return <section className="design-workbench session-resilience-workbench" data-state-source="static-only" aria-label="Sanbao 失败与局部恢复设计工作面">
    <header className="session-resilience-header">
      <div>
        <span>Sanbao 设计工作面 · 静态候选</span>
        <h1>失败与局部恢复</h1>
        <p>将不可继续、局部不可用和回退路径整理为可操作的本地状态机。不会检测网络、读取账户、打开文件、运行工具或重试模型。</p>
      </div>
      <div className="session-resilience-source"><strong>{entry.fixtureId}</strong><small>{entry.stateId} · static-only</small></div>
    </header>

    <div className="session-resilience-layout">
      <nav className="session-resilience-nav" aria-label="失败与恢复状态导航">
        {GROUPS.map(group => <section key={group.id}>
          <div><strong>{group.label}</strong><small>{group.description}</small></div>
          {SESSION_RESILIENCE_ENTRIES.filter(item => item.group === group.id).map(item => <button key={item.view} type="button" className={item.view === activeView ? 'active' : ''} aria-current={item.view === activeView ? 'page' : undefined} onClick={() => navigate(item.view)}><span>{item.fixtureId.replace('SANBAO.', '')}</span>{item.label}</button>)}
        </section>)}
      </nav>

      <main className="session-resilience-stage">
        <article className={`session-resilience-card ${recovered ? 'recovered' : ''}`}>
          <header>
            <div><span>{entry.fixtureId} · {entry.group}</span><h2>{recovered ? '本地占位已恢复' : entry.title}</h2><p>{recovered ? '恢复只重新显示当前原型的局部占位；没有重新打开预览、执行工具或请求外部服务。' : entry.description}</p></div>
            <em>{recovered ? '本地已恢复' : entry.group === 'S12' ? '等待条件' : '局部不可用'}</em>
          </header>

          {!recovered && <>
            <section className="session-resilience-impact"><Icon name={entry.group === 'S12' ? 'clock' : 'close'} size={18} /><div><strong>影响范围</strong><p>{entry.impact}</p></div></section>
            {adviceVisible && <section className="session-resilience-advice" role="status"><Icon name="check" size={17} /><div><strong>本地恢复说明已展开</strong><p>可返回任务摘要、保留演示草稿，并在真实依赖完成独立验证后再执行实际恢复。这里没有发起重试。</p></div></section>}
          </>}

          <footer>
            <button type="button" className="text-button" onClick={reset}>重置当前演示</button>
            <span />
            <button type="button" className="secondary-button" onClick={onExit}>返回任务摘要</button>
            {!recovered && <button type="button" className="primary-button" onClick={showAdvice}>{entry.action}</button>}
            {recovered && <button type="button" className="primary-button" onClick={() => navigate(activeView)}>再次查看不可用状态</button>}
          </footer>
        </article>
      </main>
    </div>

    <footer className="session-resilience-boundary" role="note"><Icon name="bolt" size={15} /><span>来源是 S11–S13 的静态候选。此工作面补的是 Sanbao 的可评审设计状态，不代表 Qoder 原生错误、视觉、Figma、DSH Host、iOS 或 DMG 已验收。</span></footer>
  </section>;
}
