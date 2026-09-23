import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Icon } from '../components/Controls';

export type EntrySystemView =
  | 'onboarding-intro'
  | 'onboarding-preview'
  | 'onboarding-login-prompt'
  | 'login-network'
  | 'access-domain'
  | 'domain-local-error'
  | 'domain-ready'
  | 'architecture-mismatch'
  | 'feedback-draft'
  | 'feedback-ready'
  | 'about'
  | 'system-task-exit'
  | 'system-unsaved-exit'
  | 'system-update-running'
  | 'system-cancelled';

type EntrySystemSection = 'onboarding' | 'account' | 'help' | 'system';
type EntrySystemEntry = { stateId: string; defaultView: EntrySystemView; id: string; label: string; source: string };

export const ENTRY_SYSTEM_WORKBENCH_ENTRIES: readonly EntrySystemEntry[] = [
  { stateId: 'QDR.P17.scope.unexpanded', defaultView: 'onboarding-intro', id: 'SANBAO.P17.F01', label: 'QQQ 与新手引导', source: 'P17 静态候选' },
  { stateId: 'QDR.O13.scope.unexpanded', defaultView: 'login-network', id: 'SANBAO.O13.F01', label: '登录、组织与原生提示', source: 'O13 静态候选' },
  { stateId: 'QDR.O14.scope.unexpanded', defaultView: 'system-task-exit', id: 'SANBAO.O14.F01', label: '退出与更新提示', source: 'O14 静态候选' },
] as const;

export const ENTRY_SYSTEM_STATE_BY_VIEW: Record<EntrySystemView, string> = {
  'onboarding-intro': 'QDR.P17.scope.unexpanded',
  'onboarding-preview': 'QDR.P17.scope.unexpanded',
  'onboarding-login-prompt': 'QDR.P17.scope.unexpanded',
  'login-network': 'QDR.O13.scope.unexpanded',
  'access-domain': 'QDR.O13.scope.unexpanded',
  'domain-local-error': 'QDR.O13.scope.unexpanded',
  'domain-ready': 'QDR.O13.scope.unexpanded',
  'architecture-mismatch': 'QDR.O13.scope.unexpanded',
  'feedback-draft': 'QDR.O13.scope.unexpanded',
  'feedback-ready': 'QDR.O13.scope.unexpanded',
  about: 'QDR.O13.scope.unexpanded',
  'system-task-exit': 'QDR.O14.scope.unexpanded',
  'system-unsaved-exit': 'QDR.O14.scope.unexpanded',
  'system-update-running': 'QDR.O14.scope.unexpanded',
  'system-cancelled': 'QDR.O14.scope.unexpanded',
};

export type EntrySystemWorkbenchProps = {
  view?: EntrySystemView;
  onNavigateView?: (view: EntrySystemView) => void;
  onExit?: () => void;
  onReset?: () => void;
};

const NAV_ITEMS: readonly { section: EntrySystemSection; label: string; detail: string; defaultView: EntrySystemView }[] = [
  { section: 'onboarding', label: '新手引导', detail: 'P17 · 预览与登录前提示', defaultView: 'onboarding-intro' },
  { section: 'account', label: '登录与组织', detail: 'O13 · 仅本地草稿', defaultView: 'login-network' },
  { section: 'help', label: '反馈与关于', detail: 'O13 · 不发送、不采集', defaultView: 'feedback-draft' },
  { section: 'system', label: '系统提示', detail: 'O14 · 不退出、不更新', defaultView: 'system-task-exit' },
] as const;

const sectionForView = (view: EntrySystemView): EntrySystemSection => {
  if (view.startsWith('onboarding-')) return 'onboarding';
  if (view === 'feedback-draft' || view === 'feedback-ready' || view === 'about') return 'help';
  if (view.startsWith('system-')) return 'system';
  return 'account';
};

const entryForView = (view: EntrySystemView) => ENTRY_SYSTEM_WORKBENCH_ENTRIES.find(entry => entry.stateId === ENTRY_SYSTEM_STATE_BY_VIEW[view])!;
const isLocalDomain = (value: string) => /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i.test(value.trim());

export function EntrySystemWorkbench({ view = 'onboarding-intro', onNavigateView, onExit, onReset }: EntrySystemWorkbenchProps) {
  const [currentView, setCurrentView] = useState<EntrySystemView>(view);
  const [domainDraft, setDomainDraft] = useState('team.sanbao.local');
  const [feedbackDraft, setFeedbackDraft] = useState('');

  useEffect(() => { setCurrentView(view); }, [view]);

  const navigate = (next: EntrySystemView) => {
    setCurrentView(next);
    onNavigateView?.(next);
  };
  const reset = () => {
    setDomainDraft('team.sanbao.local');
    setFeedbackDraft('');
    navigate('onboarding-intro');
    onReset?.();
  };
  const activeEntry = entryForView(currentView);
  const activeSection = sectionForView(currentView);

  return <section className="design-workbench entry-system-workbench" data-state-source="static-only" aria-label="Sanbao 登录、引导与系统提示设计工作面">
    <header className="entry-system-header">
      <div>
        <span>SANBAO DESIGN WORKBENCH</span>
        <h1>进入、组织与系统边界</h1>
        <p>以 Qoder 的静态组级线索组织新手引导、登录前提示、组织域名、反馈、关于和退出更新提醒。所有状态仅在当前原型内切换。</p>
      </div>
      <div className="entry-system-source"><strong>{activeEntry.id}</strong><small>{activeEntry.source} · 待原生校准</small></div>
    </header>

    <nav className="entry-system-nav" aria-label="入口与系统提示本地状态">
      {NAV_ITEMS.map(item => <button type="button" key={item.section} className={activeSection === item.section ? 'active' : ''} aria-current={activeSection === item.section ? 'page' : undefined} onClick={() => navigate(item.defaultView)}><strong>{item.label}</strong><small>{item.detail}</small></button>)}
    </nav>

    <main className="entry-system-stage">
      {currentView === 'onboarding-intro' && <OnboardingIntro onPreview={() => navigate('onboarding-preview')} onLoginPrompt={() => navigate('onboarding-login-prompt')} />}
      {currentView === 'onboarding-preview' && <OnboardingPreview onBack={() => navigate('onboarding-intro')} onLoginPrompt={() => navigate('onboarding-login-prompt')} />}
      {currentView === 'onboarding-login-prompt' && <OnboardingLoginPrompt onBack={() => navigate('onboarding-intro')} onNetwork={() => navigate('login-network')} />}
      {currentView === 'login-network' && <LoginNetwork onDomain={() => navigate('access-domain')} onMismatch={() => navigate('architecture-mismatch')} onOnboarding={() => navigate('onboarding-intro')} />}
      {currentView === 'access-domain' && <AccessDomain draft={domainDraft} onDraftChange={setDomainDraft} onSubmit={() => navigate(isLocalDomain(domainDraft) ? 'domain-ready' : 'domain-local-error')} onBack={() => navigate('login-network')} />}
      {currentView === 'domain-local-error' && <DomainLocalError draft={domainDraft} onReturn={() => navigate('access-domain')} />}
      {currentView === 'domain-ready' && <DomainReady draft={domainDraft} onEdit={() => navigate('access-domain')} onMismatch={() => navigate('architecture-mismatch')} />}
      {currentView === 'architecture-mismatch' && <ArchitectureMismatch onDomain={() => navigate('access-domain')} onNetwork={() => navigate('login-network')} />}
      {currentView === 'feedback-draft' && <FeedbackDraft draft={feedbackDraft} onDraftChange={setFeedbackDraft} onPreview={() => navigate('feedback-ready')} onAbout={() => navigate('about')} />}
      {currentView === 'feedback-ready' && <FeedbackReady draft={feedbackDraft} onEdit={() => navigate('feedback-draft')} onAbout={() => navigate('about')} />}
      {currentView === 'about' && <AboutPanel onFeedback={() => navigate('feedback-draft')} onSystem={() => navigate('system-task-exit')} />}
      {currentView === 'system-task-exit' && <SystemTaskExit onCancel={() => navigate('system-cancelled')} onUnsaved={() => navigate('system-unsaved-exit')} onUpdate={() => navigate('system-update-running')} />}
      {currentView === 'system-unsaved-exit' && <SystemUnsavedExit onCancel={() => navigate('system-cancelled')} onTask={() => navigate('system-task-exit')} />}
      {currentView === 'system-update-running' && <SystemUpdateRunning onCancel={() => navigate('system-cancelled')} onTask={() => navigate('system-task-exit')} />}
      {currentView === 'system-cancelled' && <SystemCancelled onTask={() => navigate('system-task-exit')} onOnboarding={() => navigate('onboarding-intro')} />}
    </main>

    <footer className="entry-system-boundary" role="note"><Icon name="bolt" size={15} /><span>Sanbao 本地设计工作面：不会实际登录、登出、保存账户或域名、访问网络、发送反馈、收集设备信息、关闭应用、停止任务或执行更新。</span><div><button type="button" className="text-button" onClick={onExit}>退出工作面</button><button type="button" className="secondary-button" onClick={reset}>重置本地状态</button></div></footer>
  </section>;
}

function Frame({ eyebrow, title, detail, status, children }: { eyebrow: string; title: string; detail: string; status: string; children: ReactNode }) {
  return <article className="entry-system-card"><header><div><span>{eyebrow}</span><h2>{title}</h2><p>{detail}</p></div><em>{status}</em></header>{children}</article>;
}

function ActionBar({ children }: { children: ReactNode }) { return <footer className="entry-system-actions">{children}</footer>; }

function OnboardingIntro({ onPreview, onLoginPrompt }: { onPreview: () => void; onLoginPrompt: () => void }) {
  return <Frame eyebrow="SANBAO.P17.F01 · 本地引导起点" title="先浏览工作面的基础结构" detail="P17 仅有 #/playground、OnboardingLoginFlowDialog 与预览场景的静态线索。步骤和文案为 Sanbao 设计，不是 Qoder 的已观察引导。" status="仅本地">
    <div className="entry-system-steps"><div className="done"><i>1</i><span><strong>浏览工作面</strong><small>查看任务、审核和成果入口的本地说明。</small></span><Icon name="check" size={15} /></div><div><i>2</i><span><strong>登录前确认</strong><small>定义何时需要组织或网络设置。</small></span></div><div><i>3</i><span><strong>开始本地演示</strong><small>不会创建真实任务或调用模型。</small></span></div></div>
    <div className="entry-system-preview-strip"><Icon name="grid" size={18} /><div><strong>本地预览场景</strong><p>用固定演示数据说明任务、计划和成果如何在桌面端串联。</p></div><button type="button" className="secondary-button" onClick={onPreview}>查看预览</button></div>
    <ActionBar><span>引导内容不保存到账户或设备。</span><button type="button" className="primary-button" onClick={onLoginPrompt}>进入登录前提示 <Icon name="chevron" size={14} /></button></ActionBar>
  </Frame>;
}

function OnboardingPreview({ onBack, onLoginPrompt }: { onBack: () => void; onLoginPrompt: () => void }) {
  return <Frame eyebrow="SANBAO.P17.F02 · 本地预览" title="任务与成果的演示顺序" detail="静态锚点提到 onboarding preview scene，但不能证明真实任务、计划或产物曾在引导中出现。本页只检查信息层级。" status="演示预览">
    <div className="entry-system-preview-grid"><section><Icon name="chat" size={17} /><strong>发起任务</strong><small>说明输入、上下文和确认的摆放方式。</small></section><section><Icon name="clock" size={17} /><strong>查看进度</strong><small>使用模拟步骤，未接入调度或 Runtime。</small></section><section><Icon name="file" size={17} /><strong>审阅成果</strong><small>仅指向本地预览，不读取文件或版本。</small></section></div>
    <ActionBar><button type="button" className="secondary-button" onClick={onBack}>返回引导</button><button type="button" className="primary-button" onClick={onLoginPrompt}>继续到登录前提示</button></ActionBar>
  </Frame>;
}

function OnboardingLoginPrompt({ onBack, onNetwork }: { onBack: () => void; onNetwork: () => void }) {
  return <Frame eyebrow="SANBAO.P17.F03 · 登录前提示" title="此演示尚未建立账户连接" detail="引导中可显示登录前的说明，但当前不会读取账户状态、发起 SSO、打开网页或写入认证信息。" status="未连接">
    <div className="entry-system-notice"><Icon name="monitor" size={19} /><div><strong>桌面工作面保持离线</strong><p>组织域名、网络代理、登录方式和权限条件应在获得真实界面证据后再定义。</p></div></div>
    <ActionBar><button type="button" className="secondary-button" onClick={onBack}>返回引导</button><button type="button" className="primary-button" onClick={onNetwork}>查看登录与网络说明</button></ActionBar>
  </Frame>;
}

function LoginNetwork({ onDomain, onMismatch, onOnboarding }: { onDomain: () => void; onMismatch: () => void; onOnboarding: () => void }) {
  return <Frame eyebrow="SANBAO.O13.F01 · 登录与网络边界" title="先明确连接条件，再显示登录入口" detail="LoginNetworkSettingsDialog 是静态候选。此处用不可连接状态表达登录前的网络说明，不提供账号、密码、Token、代理或真实重试。" status="未连接">
    <div className="entry-system-option-list"><button type="button" onClick={onDomain}><span className="entry-system-option-icon"><Icon name="globe" size={16} /></span><span><strong>组织访问域名</strong><small>打开一个只在当前页面内保存的显示草稿。</small></span><Icon name="chevron" size={14} /></button><button type="button" onClick={onMismatch}><span className="entry-system-option-icon warning"><Icon name="settings" size={16} /></span><span><strong>连接架构提示</strong><small>回放本地不一致提示，不诊断真实网络或 Host。</small></span><Icon name="chevron" size={14} /></button></div>
    <ActionBar><button type="button" className="secondary-button" onClick={onOnboarding}>回到新手引导</button><span>未调用登录服务。</span></ActionBar>
  </Frame>;
}

function AccessDomain({ draft, onDraftChange, onSubmit, onBack }: { draft: string; onDraftChange: (value: string) => void; onSubmit: () => void; onBack: () => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSubmit(); };
  return <Frame eyebrow="SANBAO.O13.F02 · 组织域名草稿" title="只检查本地显示格式" detail="AccessDomainDialog 为静态候选。这里不读取或改写现有域名，不解析 DNS，也不向任何组织服务发出请求。" status="本地草稿">
    <form className="entry-system-form" onSubmit={submit}><label><span>组织访问域名 · 仅本地显示</span><input aria-label="组织访问域名本地草稿" value={draft} maxLength={96} onChange={event => onDraftChange(event.target.value)} placeholder="team.example.com" autoFocus /></label><p><Icon name="bolt" size={14} />点击后只做页面内格式判断；有效格式也不会建立连接或保存设置。</p><ActionBar><button type="button" className="secondary-button" onClick={onBack}>返回登录说明</button><button type="submit" className="primary-button">运行本地格式检查</button></ActionBar></form>
  </Frame>;
}

function DomainLocalError({ draft, onReturn }: { draft: string; onReturn: () => void }) {
  return <Frame eyebrow="SANBAO.O13.F03 · 本地格式提示" title="域名草稿需要一个可读的后缀" detail="这是本地输入格式提示，不代表 DNS、账号、组织配置或网络连接出现错误。" status="本地提示">
    <div className="entry-system-alert"><Icon name="close" size={18} /><div><strong>{draft.trim() ? `“${draft.trim()}”暂不符合演示格式` : '尚未填写本地域名草稿'}</strong><p>可返回输入一个仅供展示的名称；页面不会验证真实域名。</p></div></div>
    <ActionBar><span>没有提交或保留此草稿。</span><button type="button" className="primary-button" onClick={onReturn}>返回修改</button></ActionBar>
  </Frame>;
}

function DomainReady({ draft, onEdit, onMismatch }: { draft: string; onEdit: () => void; onMismatch: () => void }) {
  return <Frame eyebrow="SANBAO.O13.F04 · 本地格式可继续" title="组织域名草稿可以进入下一步演示" detail="可继续只表示页面内字符串通过了简单格式判断。没有检查域名、账户、组织权限或网络可用性。" status="本地可继续">
    <div className="entry-system-ready"><Icon name="check" size={18} /><div><strong>{draft.trim()}</strong><p>该值只存在于当前 React 状态；切换、刷新或重置后均不代表已保存。</p></div></div>
    <ActionBar><button type="button" className="secondary-button" onClick={onEdit}>继续编辑</button><button type="button" className="primary-button" onClick={onMismatch}>查看架构提示</button></ActionBar>
  </Frame>;
}

function ArchitectureMismatch({ onDomain, onNetwork }: { onDomain: () => void; onNetwork: () => void }) {
  return <Frame eyebrow="SANBAO.O13.F05 · 本地架构提示" title="当前工作面尚未匹配可用的连接方式" detail="ArchitectureMismatchDialog 仅来自静态名称线索。提示内容是 Sanbao 设计，用来评审异常时的退出与修正路径。" status="需要核验">
    <div className="entry-system-alert architecture"><Icon name="settings" size={18} /><div><strong>尚未验证桌面壳与登录架构的协作方式</strong><p>DSH Host、远程登录、组织路由和错误文案仍需独立核验；此状态不会访问系统设置或网络。</p></div></div>
    <ActionBar><button type="button" className="secondary-button" onClick={onNetwork}>回到登录说明</button><button type="button" className="primary-button" onClick={onDomain}>修改本地域名草稿</button></ActionBar>
  </Frame>;
}

function FeedbackDraft({ draft, onDraftChange, onPreview, onAbout }: { draft: string; onDraftChange: (value: string) => void; onPreview: () => void; onAbout: () => void }) {
  return <Frame eyebrow="SANBAO.O13.F06 · 反馈草稿" title="先确认发送前可见的信息" detail="FeedbackDialog 是静态候选。本页只保留草稿与预览的本地交互，不会上传文本、日志、设备信息或联系信息。" status="仅本地">
    <label className="entry-system-form"><span>反馈草稿 · 不会发送</span><textarea aria-label="本地反馈草稿" value={draft} maxLength={360} onChange={event => onDraftChange(event.target.value)} placeholder="描述希望改进的页面或交互…" /><small>{draft.length}/360 · 仅本地内存</small></label>
    <ActionBar><button type="button" className="secondary-button" onClick={onAbout}>查看关于</button><button type="button" className="primary-button" disabled={!draft.trim()} onClick={onPreview}>生成本地发送前摘要</button></ActionBar>
  </Frame>;
}

function FeedbackReady({ draft, onEdit, onAbout }: { draft: string; onEdit: () => void; onAbout: () => void }) {
  return <Frame eyebrow="SANBAO.O13.F07 · 反馈发送前摘要" title="草稿保持在本地等待确认" detail="摘要用于检查发送前提示的位置和可恢复路径。它没有进入队列、网络请求、邮件、工单或任何持久化记录。" status="未发送">
    <div className="entry-system-feedback-summary"><span>本地摘要</span><p>{draft.trim() || '没有可预览的本地草稿。'}</p></div>
    <ActionBar><button type="button" className="secondary-button" onClick={onAbout}>查看关于</button><button type="button" className="primary-button" onClick={onEdit}>返回编辑</button></ActionBar>
  </Frame>;
}

function AboutPanel({ onFeedback, onSystem }: { onFeedback: () => void; onSystem: () => void }) {
  return <Frame eyebrow="SANBAO.O13.F08 · 关于工作面" title="原型版本与运行边界" detail="AboutDialog 为静态候选。这里显示交接时需要的本地版本说明，不读取应用版本、系统信息、安装位置或账户数据。" status="离线说明">
    <dl className="entry-system-about"><div><dt>原型入口</dt><dd>Sanbao 本地可运行 UI/UX fixture</dd></div><div><dt>数据范围</dt><dd>固定演示数据与当前内存草稿</dd></div><div><dt>连接状态</dt><dd>未接入 DSH Host、登录、模型或网络</dd></div><div><dt>验收状态</dt><dd>静态候选，待 Qoder 原生与视觉核验</dd></div></dl>
    <ActionBar><button type="button" className="secondary-button" onClick={onFeedback}>返回本地反馈</button><button type="button" className="primary-button" onClick={onSystem}>查看系统提示</button></ActionBar>
  </Frame>;
}

function SystemTaskExit({ onCancel, onUnsaved, onUpdate }: { onCancel: () => void; onUnsaved: () => void; onUpdate: () => void }) {
  return <Frame eyebrow="SANBAO.O14.F01 · 运行中退出提示" title="本地演示中仍有待完成的步骤" detail="“停止任务并退出 Qoder？”是静态候选。此处不会停止工作、关闭窗口、丢弃会话或请求系统退出。" status="系统候选">
    <div className="entry-system-system-prompt"><Icon name="clock" size={20} /><div><strong>页面核对仍在本地进行</strong><p>离开前应如何解释未完成步骤与恢复入口，需要原生条件和交互证据单独确认。</p></div></div>
    <ActionBar><button type="button" className="secondary-button" onClick={onUnsaved}>查看未保存提示</button><button type="button" className="secondary-button" onClick={onUpdate}>查看更新提示</button><button type="button" className="primary-button" onClick={onCancel}>继续本地演示</button></ActionBar>
  </Frame>;
}

function SystemUnsavedExit({ onCancel, onTask }: { onCancel: () => void; onTask: () => void }) {
  return <Frame eyebrow="SANBAO.O14.F02 · 未保存内容提示" title="当前仅模拟待保存的页面状态" detail="“保存文件并退出 Qoder？”是静态候选。原型不会打开、保存、修改或关闭真实文件，也不会退出应用。" status="系统候选">
    <div className="entry-system-system-prompt warning"><Icon name="file" size={20} /><div><strong>本地演示草稿尚未保存</strong><p>按钮只回放取消或返回路径；不提供保存操作，避免把原型误认为文件编辑器。</p></div></div>
    <ActionBar><button type="button" className="secondary-button" onClick={onTask}>返回运行中提示</button><button type="button" className="primary-button" onClick={onCancel}>取消退出</button></ActionBar>
  </Frame>;
}

function SystemUpdateRunning({ onCancel, onTask }: { onCancel: () => void; onTask: () => void }) {
  return <Frame eyebrow="SANBAO.O14.F03 · 更新前提示" title="更新不会在本地原型中执行" detail="“停止并更新”仅是静态文案线索。原型不查询更新、不下载内容、不修改应用、不重启窗口。" status="系统候选">
    <div className="entry-system-system-prompt warning"><Icon name="bolt" size={20} /><div><strong>更新前需要处理运行中的本地演示</strong><p>此处用于检查说明、取消和返回工作面是否清晰；不模拟下载进度或版本结果。</p></div></div>
    <ActionBar><button type="button" className="secondary-button" onClick={onTask}>返回运行中提示</button><button type="button" className="primary-button" onClick={onCancel}>暂不更新</button></ActionBar>
  </Frame>;
}

function SystemCancelled({ onTask, onOnboarding }: { onTask: () => void; onOnboarding: () => void }) {
  return <Frame eyebrow="SANBAO.O14.F04 · 已留在原型" title="未触发任何退出或更新动作" detail="取消后的恢复状态只说明用户可以继续浏览本地工作面。它不表示任务、文件、更新或窗口状态已由系统恢复。" status="本地恢复">
    <div className="entry-system-ready"><Icon name="check" size={18} /><div><strong>本地演示保持开启</strong><p>当前可返回系统提示继续评审，或重走新手引导。真实应用恢复行为仍待取证。</p></div></div>
    <ActionBar><button type="button" className="secondary-button" onClick={onOnboarding}>回到新手引导</button><button type="button" className="primary-button" onClick={onTask}>返回系统提示</button></ActionBar>
  </Frame>;
}
