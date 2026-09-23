import { useEffect, useState, type ReactNode } from 'react';
import { Icon } from '../components/Controls';

export type AgentRuntimeView =
  | 'agent-list'
  | 'agent-create'
  | 'agent-selected'
  | 'squad-list'
  | 'squad-create'
  | 'squad-selected'
  | 'runtime-profiles'
  | 'runtime-create'
  | 'runtime-connecting'
  | 'runtime-unavailable'
  | 'handoff-connection'
  | 'handoff-unavailable';

type WorkbenchArea = 'agents' | 'squads' | 'runtime' | 'handoff';

export const AGENT_RUNTIME_WORKBENCH_ENTRIES = [
  {
    stateId: 'QDR.P10.scope.unexpanded',
    id: 'SANBAO.P10.F01',
    area: 'agents',
    defaultView: 'agent-list',
    label: 'Agent 配置',
    source: 'Qoder P10 · 静态候选',
  },
  {
    stateId: 'QDR.P10.scope.unexpanded',
    id: 'SANBAO.P10.F02',
    area: 'squads',
    defaultView: 'squad-list',
    label: 'Squad 配置',
    source: 'Qoder P10 · 静态候选',
  },
  {
    stateId: 'QDR.P11.scope.unexpanded',
    id: 'SANBAO.P11.F01',
    area: 'runtime',
    defaultView: 'runtime-profiles',
    label: 'Runtime 配置',
    source: 'Qoder P11 · 静态候选',
  },
  {
    stateId: 'QDR.O06.scope.unexpanded',
    id: 'SANBAO.O06.F01',
    area: 'handoff',
    defaultView: 'handoff-connection',
    label: '远端交接候选',
    source: 'Qoder O06 · 静态候选',
  },
] as const satisfies readonly {
  stateId: 'QDR.P10.scope.unexpanded' | 'QDR.P11.scope.unexpanded' | 'QDR.O06.scope.unexpanded';
  id: string;
  area: WorkbenchArea;
  defaultView: AgentRuntimeView;
  label: string;
  source: string;
}[];

export type AgentRuntimeWorkbenchProps = {
  view?: AgentRuntimeView;
  onNavigateView?: (view: AgentRuntimeView) => void;
  onExit?: () => void;
  onReset?: () => void;
};

const DEFAULT_VIEW_BY_AREA: Record<WorkbenchArea, AgentRuntimeView> = {
  agents: 'agent-list',
  squads: 'squad-list',
  runtime: 'runtime-profiles',
  handoff: 'handoff-connection',
};

const AREA_BY_VIEW: Record<AgentRuntimeView, WorkbenchArea> = {
  'agent-list': 'agents',
  'agent-create': 'agents',
  'agent-selected': 'agents',
  'squad-list': 'squads',
  'squad-create': 'squads',
  'squad-selected': 'squads',
  'runtime-profiles': 'runtime',
  'runtime-create': 'runtime',
  'runtime-connecting': 'runtime',
  'runtime-unavailable': 'runtime',
  'handoff-connection': 'handoff',
  'handoff-unavailable': 'handoff',
};

const COPY: Record<WorkbenchArea, { id: string; title: string; description: string; source: string }> = {
  agents: {
    id: 'SANBAO.P10.F01',
    title: 'Agent 配置与选择',
    description: '创建、选择与成员职责都只保留在本地 fixture 中，不会调用模型、读取技能或创建实际 Agent。',
    source: 'Qoder P10 · 静态候选',
  },
  squads: {
    id: 'SANBAO.P10.F02',
    title: 'Squad 成员与角色',
    description: 'Squad 只是可回放的团队编排草稿，不会分派任务、访问会话或启动后台协作。',
    source: 'Qoder P10 · 静态候选',
  },
  runtime: {
    id: 'SANBAO.P11.F01',
    title: 'Runtime 配置与未就绪恢复',
    description: '环境、连接中和不可用状态仅表达配置边界，不读取设备、容器、端点、密钥或网络。',
    source: 'Qoder P11 · 静态候选',
  },
  handoff: {
    id: 'SANBAO.O06.F01',
    title: '远端交接候选与失败态',
    description: '远端候选仅用于演示认证前的连接失败与返回路径，不填写、保存或传输任何认证信息。',
    source: 'Qoder O06 · 静态候选',
  },
};

const AGENT_CARDS = [
  { name: '页面核对 Agent', role: '整理页面状态、交互入口与待验证项', status: '本地草稿' },
  { name: '发布说明 Agent', role: '准备可审阅的交接说明', status: '未连接 Runtime' },
];

const SQUAD_CARDS = [
  { name: '发布前核对 Squad', members: '页面核对 Agent · 发布说明 Agent', status: '本地编排' },
  { name: '交互回放 Squad', members: '等待选择本地成员', status: '未配置' },
];

export function AgentRuntimeWorkbench({ view = 'agent-list', onNavigateView, onExit, onReset }: AgentRuntimeWorkbenchProps) {
  const [currentView, setCurrentView] = useState<AgentRuntimeView>(view);
  const [draftName, setDraftName] = useState('');
  const [selectedMember, setSelectedMember] = useState('页面核对 Agent');
  const [squadMembers, setSquadMembers] = useState<readonly string[]>(['页面核对 Agent']);
  const [runtimeName, setRuntimeName] = useState('本地评审环境');
  const [handoffName, setHandoffName] = useState('远端候选 · 演示');

  useEffect(() => {
    setCurrentView(view);
  }, [view]);

  const navigate = (next: AgentRuntimeView) => {
    setCurrentView(next);
    onNavigateView?.(next);
  };

  const reset = () => {
    setDraftName('');
    setSelectedMember('页面核对 Agent');
    setSquadMembers(['页面核对 Agent']);
    setRuntimeName('本地评审环境');
    setHandoffName('远端候选 · 演示');
    navigate('agent-list');
    onReset?.();
  };

  const area = AREA_BY_VIEW[currentView];
  const copy = COPY[area];

  return <section className="design-workbench agent-runtime-workbench" data-state-source="static-only" aria-label="Sanbao Agent、Squad 与 Runtime 设计工作面">
    <header className="agent-runtime-header">
      <div>
        <span>Sanbao 设计工作面 · 原产品静态候选</span>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </div>
      <div className="agent-runtime-source"><strong>{copy.id}</strong><small>{copy.source}</small></div>
    </header>

    <nav className="agent-runtime-nav" aria-label="Agent、Squad 与 Runtime 工作面">
      {AGENT_RUNTIME_WORKBENCH_ENTRIES.map(entry => <button key={entry.area} type="button" className={entry.area === area ? 'active' : ''} aria-current={entry.area === area ? 'page' : undefined} onClick={() => navigate(DEFAULT_VIEW_BY_AREA[entry.area])}>
        <span>{entry.id.replace('SANBAO.', '')}</span>{entry.label}
      </button>)}
    </nav>

    <main className="agent-runtime-stage">
      {currentView === 'agent-list' && <AgentList onCreate={() => navigate('agent-create')} onSelect={name => { setSelectedMember(name); navigate('agent-selected'); }} />}
      {currentView === 'agent-create' && <AgentCreate draftName={draftName} onDraftName={setDraftName} onCancel={() => navigate('agent-list')} onCreate={() => { setSelectedMember(draftName.trim() || '新建本地 Agent'); navigate('agent-selected'); }} />}
      {currentView === 'agent-selected' && <AgentSelected name={selectedMember} onBack={() => navigate('agent-list')} onCreate={() => navigate('agent-create')} />}
      {currentView === 'squad-list' && <SquadList onCreate={() => navigate('squad-create')} onSelect={() => navigate('squad-selected')} />}
      {currentView === 'squad-create' && <SquadCreate members={squadMembers} onToggle={name => setSquadMembers(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name])} onCancel={() => navigate('squad-list')} onCreate={() => navigate('squad-selected')} />}
      {currentView === 'squad-selected' && <SquadSelected members={squadMembers} onBack={() => navigate('squad-list')} onEdit={() => navigate('squad-create')} />}
      {currentView === 'runtime-profiles' && <RuntimeProfiles onCreate={() => navigate('runtime-create')} onRemote={() => navigate('handoff-connection')} />}
      {currentView === 'runtime-create' && <RuntimeCreate name={runtimeName} onName={setRuntimeName} onCancel={() => navigate('runtime-profiles')} onConnect={() => navigate('runtime-connecting')} />}
      {currentView === 'runtime-connecting' && <RuntimeConnecting onCancel={() => navigate('runtime-create')} onUnavailable={() => navigate('runtime-unavailable')} />}
      {currentView === 'runtime-unavailable' && <RuntimeUnavailable name={runtimeName} onRetry={() => navigate('runtime-connecting')} onReconfigure={() => navigate('runtime-create')} onBack={() => navigate('runtime-profiles')} />}
      {currentView === 'handoff-connection' && <HandoffConnection name={handoffName} onName={setHandoffName} onCancel={() => navigate('runtime-profiles')} onUnavailable={() => navigate('handoff-unavailable')} />}
      {currentView === 'handoff-unavailable' && <HandoffUnavailable onRetry={() => navigate('handoff-connection')} onBack={() => navigate('runtime-profiles')} />}
    </main>

    <footer className="agent-runtime-boundary" role="note"><Icon name="bolt" size={15} /><span>这是目录外 Sanbao 设计型状态机。它不调用网络、模型、文件、设备、终端、系统 API 或认证流程；Qoder 原生页面、视觉、Figma、DSH Host、iOS 与 DMG 继续独立待验。</span><button type="button" className="text-button" onClick={onExit}>退出工作面</button><button type="button" className="text-button" onClick={reset}>重置演示</button></footer>
  </section>;
}

function Frame({ eyebrow, title, status, children }: { eyebrow: string; title: string; status: string; children: ReactNode }) {
  return <article className="agent-runtime-frame">
    <header><div><span>{eyebrow}</span><h2>{title}</h2></div><span className={`agent-runtime-status ${status}`}>{status === 'ready' ? '本地已选择' : status === 'blocked' ? '本地不可用' : status === 'working' ? '本地连接中' : '本地草稿'}</span></header>
    {children}
  </article>;
}

function ActionBar({ children }: { children: ReactNode }) {
  return <footer className="agent-runtime-actions">{children}</footer>;
}

function AgentList({ onCreate, onSelect }: { onCreate: () => void; onSelect: (name: string) => void }) {
  return <Frame eyebrow="SANBAO.P10.F01 · Agent 列表" title="本地 Agent 候选" status="draft"><p className="agent-runtime-intro">列表只表达选择和创建入口；这里没有实际角色、模型、工具、记忆或执行连接。</p><div className="agent-runtime-cards">{AGENT_CARDS.map(card => <button type="button" key={card.name} className="agent-runtime-card" onClick={() => onSelect(card.name)}><span className="agent-runtime-card-icon"><Icon name="bolt" size={15} /></span><span><strong>{card.name}</strong><small>{card.role}</small></span><em>{card.status}</em><Icon name="chevron" size={14} /></button>)}</div><ActionBar><span>新增内容只保留在当前页面。</span><button type="button" className="primary-button" onClick={onCreate}>创建本地 Agent <Icon name="plus" size={14} /></button></ActionBar></Frame>;
}

function AgentCreate({ draftName, onDraftName, onCancel, onCreate }: { draftName: string; onDraftName: (value: string) => void; onCancel: () => void; onCreate: () => void }) {
  return <Frame eyebrow="SANBAO.P10.F02 · 新建 Agent" title="准备本地角色草稿" status="draft"><p className="agent-runtime-intro">名称和职责不写入配置，也不会创建 Agent。保留该表单只用于评审新增与取消的交互边界。</p><label className="agent-runtime-field"><span>本地 Agent 名称</span><input aria-label="本地 Agent 名称" value={draftName} onChange={event => onDraftName(event.target.value)} placeholder="例如：验收摘要 Agent" /></label><div className="agent-runtime-detail"><Icon name="settings" size={16} /><div><strong>执行能力尚未配置</strong><p>模型、工具、技能与 Runtime 连接保持空白，避免把设计状态误认为可运行配置。</p></div></div><ActionBar><button type="button" className="secondary-button" onClick={onCancel}>放弃本地草稿</button><button type="button" className="primary-button" onClick={onCreate}>创建本地候选</button></ActionBar></Frame>;
}

function AgentSelected({ name, onBack, onCreate }: { name: string; onBack: () => void; onCreate: () => void }) {
  return <Frame eyebrow="SANBAO.P10.F03 · 已选择 Agent" title={name} status="ready"><p className="agent-runtime-intro">选择结果只保存于当前 React 组件。它不启动 Agent、读取其历史，也不创建或修改任务。</p><dl className="agent-runtime-summary"><div><dt>角色</dt><dd>页面与交互核对</dd></div><div><dt>成员状态</dt><dd>本地候选</dd></div><div><dt>Runtime</dt><dd>尚未连接</dd></div></dl><div className="agent-runtime-detail"><Icon name="clock" size={16} /><div><strong>等待配置执行环境</strong><p>从这里进入 Runtime 配置时，仍只会回放本地未就绪与恢复状态。</p></div></div><ActionBar><button type="button" className="secondary-button" onClick={onBack}>返回列表</button><button type="button" className="primary-button" onClick={onCreate}>新建本地 Agent</button></ActionBar></Frame>;
}

function SquadList({ onCreate, onSelect }: { onCreate: () => void; onSelect: () => void }) {
  return <Frame eyebrow="SANBAO.P10.F04 · Squad 列表" title="本地 Squad 候选" status="draft"><p className="agent-runtime-intro">成员关系是本地演示数据，不建立协作群组、调度队列、父子关系或后台任务。</p><div className="agent-runtime-cards">{SQUAD_CARDS.map(card => <button type="button" key={card.name} className="agent-runtime-card" onClick={onSelect}><span className="agent-runtime-card-icon squad"><Icon name="grid" size={15} /></span><span><strong>{card.name}</strong><small>{card.members}</small></span><em>{card.status}</em><Icon name="chevron" size={14} /></button>)}</div><ActionBar><span>仅评审团队结构与选择路径。</span><button type="button" className="primary-button" onClick={onCreate}>创建本地 Squad <Icon name="plus" size={14} /></button></ActionBar></Frame>;
}

function SquadCreate({ members, onToggle, onCancel, onCreate }: { members: readonly string[]; onToggle: (name: string) => void; onCancel: () => void; onCreate: () => void }) {
  return <Frame eyebrow="SANBAO.P10.F05 · 新建 Squad" title="选择本地成员与角色" status="draft"><p className="agent-runtime-intro">选择不分派真实 Agent，不访问现有身份、工作区、网络或会话。至少保留一个本地成员才能进入结果态。</p><div className="agent-runtime-member-list">{AGENT_CARDS.map(card => <label key={card.name}><input type="checkbox" checked={members.includes(card.name)} onChange={() => onToggle(card.name)} /><span><strong>{card.name}</strong><small>{card.role}</small></span><em>{members.includes(card.name) ? '已加入本地草稿' : '未选择'}</em></label>)}</div><ActionBar><button type="button" className="secondary-button" onClick={onCancel}>放弃本地编排</button><button type="button" className="primary-button" onClick={onCreate} disabled={!members.length}>查看本地 Squad</button></ActionBar></Frame>;
}

function SquadSelected({ members, onBack, onEdit }: { members: readonly string[]; onBack: () => void; onEdit: () => void }) {
  return <Frame eyebrow="SANBAO.P10.F06 · 已选择 Squad" title="发布前核对 Squad" status="ready"><p className="agent-runtime-intro">成员和角色仅在本地状态机中可见。未选择的成员不会被删除，已选择的成员也未被创建或激活。</p><div className="agent-runtime-member-result">{members.length ? members.map(member => <div key={member}><Icon name="check" size={15} /><span><strong>{member}</strong><small>{member === '页面核对 Agent' ? '负责整理页面与状态' : '负责准备发布说明'}</small></span></div>) : <div><Icon name="close" size={15} /><span><strong>尚未选择成员</strong><small>返回编辑本地草稿即可重新选择。</small></span></div>}</div><ActionBar><button type="button" className="secondary-button" onClick={onBack}>返回列表</button><button type="button" className="primary-button" onClick={onEdit}>继续编辑本地成员</button></ActionBar></Frame>;
}

function RuntimeProfiles({ onCreate, onRemote }: { onCreate: () => void; onRemote: () => void }) {
  return <Frame eyebrow="SANBAO.P11.F01 · Runtime 列表" title="尚未连接执行环境" status="blocked"><p className="agent-runtime-intro">当前没有真实 Runtime、容器、终端、设备或模型连接。页面只保留创建候选、远端交接和返回路径。</p><div className="agent-runtime-empty"><Icon name="monitor" size={21} /><div><strong>没有可验证的 Runtime Profile</strong><p>原生环境列表、默认值、可用条件和错误文案均待独立取证。</p></div></div><ActionBar><button type="button" className="secondary-button" onClick={onRemote}>查看远端候选</button><button type="button" className="primary-button" onClick={onCreate}>创建本地环境候选 <Icon name="plus" size={14} /></button></ActionBar></Frame>;
}

function RuntimeCreate({ name, onName, onCancel, onConnect }: { name: string; onName: (value: string) => void; onCancel: () => void; onConnect: () => void }) {
  return <Frame eyebrow="SANBAO.P11.F02 · 创建 Runtime" title="准备本地环境候选" status="draft"><p className="agent-runtime-intro">本页不读取实际工作区、容器或设备。字段只作为当前页面的显示草稿，刷新或重置后会丢失。</p><label className="agent-runtime-field"><span>环境名称</span><input aria-label="本地 Runtime 环境名称" value={name} onChange={event => onName(event.target.value)} /></label><div className="agent-runtime-choice-row" aria-label="本地环境候选类型"><span>候选类型</span><button type="button" className="active">本地演示</button><button type="button">远端演示</button></div><ActionBar><button type="button" className="secondary-button" onClick={onCancel}>取消本地草稿</button><button type="button" className="primary-button" onClick={onConnect} disabled={!name.trim()}>检测本地候选</button></ActionBar></Frame>;
}

function RuntimeConnecting({ onCancel, onUnavailable }: { onCancel: () => void; onUnavailable: () => void }) {
  return <Frame eyebrow="SANBAO.P11.F03 · 本地连接中" title="正在检查本地候选" status="working"><p className="agent-runtime-intro">“连接中”没有发起网络请求、终端命令或容器检查。请显式选择本地不可用或回到字段编辑。</p><div className="agent-runtime-progress"><i /><div><strong>等待本地演示结果</strong><p>不会轮询服务或消耗任何资源。</p></div></div><ActionBar><button type="button" className="secondary-button" onClick={onCancel}>返回修改</button><button type="button" className="primary-button" onClick={onUnavailable}>模拟本地不可用</button></ActionBar></Frame>;
}

function RuntimeUnavailable({ name, onRetry, onReconfigure, onBack }: { name: string; onRetry: () => void; onReconfigure: () => void; onBack: () => void }) {
  return <Frame eyebrow="SANBAO.P11.F04 · Runtime 未就绪" title="本地候选暂不可用" status="blocked"><p className="agent-runtime-intro">{name || '本地环境候选'} 未通过本地演示检查。此提示不来自网络、容器、设备或供应商，也不代表真实连接失败。</p><div className="agent-runtime-alert"><Icon name="close" size={17} /><div><strong>未找到可验证的执行环境</strong><p>可返回重新填写本地显示草稿，或只重放连接中与不可用的状态转换。</p></div></div><ActionBar><button type="button" className="text-button" onClick={onBack}>返回 Runtime 列表</button><span /><button type="button" className="secondary-button" onClick={onReconfigure}>修改候选</button><button type="button" className="primary-button" onClick={onRetry}>重放本地检查</button></ActionBar></Frame>;
}

function HandoffConnection({ name, onName, onCancel, onUnavailable }: { name: string; onName: (value: string) => void; onCancel: () => void; onUnavailable: () => void }) {
  return <Frame eyebrow="SANBAO.O06.F01 · 远端交接候选" title="连接前的本地确认" status="draft"><p className="agent-runtime-intro">远端连接、认证与交接只来自静态候选。本页不提供 Host、用户名、密码、Token、SSH Key 或任何实际连接操作。</p><label className="agent-runtime-field"><span>候选名称</span><input aria-label="远端交接候选名称" value={name} onChange={event => onName(event.target.value)} /></label><div className="agent-runtime-detail"><Icon name="settings" size={16} /><div><strong>认证信息保持未填写</strong><p>只有在真实连接流程获得单独授权与证据后，才可以定义所需字段和校验行为。</p></div></div><ActionBar><button type="button" className="secondary-button" onClick={onCancel}>返回 Runtime</button><button type="button" className="primary-button" onClick={onUnavailable} disabled={!name.trim()}>模拟连接不可用</button></ActionBar></Frame>;
}

function HandoffUnavailable({ onRetry, onBack }: { onRetry: () => void; onBack: () => void }) {
  return <Frame eyebrow="SANBAO.O06.F02 · 候选不可用" title="尚未建立远端交接" status="blocked"><p className="agent-runtime-intro">本地失败态只说明未就绪时需要可恢复的退出路径，不代表 SSH、认证或任务交接已实际触发。</p><div className="agent-runtime-alert"><Icon name="close" size={17} /><div><strong>候选连接目前不可用</strong><p>没有重试外部主机，也没有保留任何认证或环境数据。</p></div></div><ActionBar><button type="button" className="secondary-button" onClick={onBack}>返回 Runtime</button><button type="button" className="primary-button" onClick={onRetry}>回到本地候选</button></ActionBar></Frame>;
}
