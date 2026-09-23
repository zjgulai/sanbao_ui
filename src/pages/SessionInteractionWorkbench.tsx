import { useEffect, useState } from 'react';
import { Icon } from '../components/Controls';

export const SESSION_INTERACTION_VIEWS = [
  'reply-composing', 'reply-streaming',
  'clarification-choices', 'clarification-custom', 'clarification-submitted',
  'stop-confirm', 'reply-stopped', 'reply-follow-up',
  'background-running', 'context-budget',
  'reply-actions', 'reply-feedback',
  'file-writing', 'edit-expanded',
] as const;

export type SessionInteractionView = typeof SESSION_INTERACTION_VIEWS[number];
type SessionInteractionStateId = 'QDR.S01.scope.unexpanded' | 'QDR.S02.scope.unexpanded' | 'QDR.S08.scope.unexpanded' | 'QDR.S09.scope.unexpanded' | 'QDR.S10.scope.unexpanded' | 'QDR.M01.scope.unexpanded' | 'QDR.M02.scope.unexpanded';
type SessionInteractionEntry = { view: SessionInteractionView; stateId: SessionInteractionStateId; fixtureId: string; group: string; label: string; title: string; description: string };

export const SESSION_INTERACTION_ENTRIES: readonly SessionInteractionEntry[] = [
  { view: 'reply-composing', stateId: 'QDR.S01.scope.unexpanded', fixtureId: 'SANBAO.S01.F01', group: '回复', label: '发起回复', title: '本地回复起始候选', description: '只回放输入、开始和退出路径，不发送模型请求。' },
  { view: 'reply-streaming', stateId: 'QDR.S01.scope.unexpanded', fixtureId: 'SANBAO.S01.F02', group: '回复', label: '回复进行中', title: '本地流式回复候选', description: '文本分段只是视觉占位，不代表模型正在生成。' },
  { view: 'clarification-choices', stateId: 'QDR.S02.scope.unexpanded', fixtureId: 'SANBAO.S02.F01', group: '澄清', label: '选择问题', title: '澄清问题候选', description: '候选项仅在当前工作面记录，不提交到任务或模型。' },
  { view: 'clarification-custom', stateId: 'QDR.S02.scope.unexpanded', fixtureId: 'SANBAO.S02.F02', group: '澄清', label: '自定义回答', title: '自定义澄清候选', description: '输入仅保留在 React 内存中，不写入会话历史。' },
  { view: 'clarification-submitted', stateId: 'QDR.S02.scope.unexpanded', fixtureId: 'SANBAO.S02.F03', group: '澄清', label: '已提交', title: '澄清已在本地记录', description: '提交结果只用于验证反馈与返回路径。' },
  { view: 'stop-confirm', stateId: 'QDR.S08.scope.unexpanded', fixtureId: 'SANBAO.S08.F01', group: '停止与继续', label: '停止确认', title: '停止回复确认候选', description: '确认不终止真实任务或模型调用。' },
  { view: 'reply-stopped', stateId: 'QDR.S08.scope.unexpanded', fixtureId: 'SANBAO.S08.F02', group: '停止与继续', label: '已停止', title: '回复已停止候选', description: '保留中断后的说明与恢复输入入口。' },
  { view: 'reply-follow-up', stateId: 'QDR.S08.scope.unexpanded', fixtureId: 'SANBAO.S08.F03', group: '停止与继续', label: '继续回复', title: '后续输入候选', description: '继续输入只改变本地状态，不重新触发模型。' },
  { view: 'background-running', stateId: 'QDR.S09.scope.unexpanded', fixtureId: 'SANBAO.S09.F01', group: '后台与上下文', label: '后台进度', title: '后台进度候选', description: '进度与暂停均为展示状态，不管理 Agent 或进程。' },
  { view: 'context-budget', stateId: 'QDR.S10.scope.unexpanded', fixtureId: 'SANBAO.S10.F01', group: '后台与上下文', label: '上下文用量', title: '上下文摘要候选', description: '数字为虚构设计数据，不读取令牌、用量或任务上下文。' },
  { view: 'reply-actions', stateId: 'QDR.M01.scope.unexpanded', fixtureId: 'SANBAO.M01.F01', group: '回复与编辑', label: '回复操作', title: '回复操作候选', description: '复制、引用和反馈只显示本地回执，不访问剪贴板。' },
  { view: 'reply-feedback', stateId: 'QDR.M01.scope.unexpanded', fixtureId: 'SANBAO.M01.F02', group: '回复与编辑', label: '回复反馈', title: '回复反馈候选', description: '反馈草稿不发送、不保存，也不关联真实会话。' },
  { view: 'file-writing', stateId: 'QDR.M02.scope.unexpanded', fixtureId: 'SANBAO.M02.F01', group: '回复与编辑', label: '文件写入', title: '文件写入候选', description: '路径和进度只是版式示例，不读取或写入文件。' },
  { view: 'edit-expanded', stateId: 'QDR.M02.scope.unexpanded', fixtureId: 'SANBAO.M02.F02', group: '回复与编辑', label: '编辑详情', title: '编辑详情候选', description: '展开区域只展示结构摘要，不加载 Diff 或工作区内容。' },
];

export const SESSION_INTERACTION_STATE_BY_VIEW: Readonly<Record<SessionInteractionView, SessionInteractionStateId>> = Object.fromEntries(SESSION_INTERACTION_ENTRIES.map(entry => [entry.view, entry.stateId])) as Record<SessionInteractionView, SessionInteractionStateId>;

export type SessionInteractionWorkbenchProps = { view: SessionInteractionView; onNavigateView: (view: SessionInteractionView) => void; onExit: () => void; onReset: () => void };

function entryFor(view: SessionInteractionView) { return SESSION_INTERACTION_ENTRIES.find(entry => entry.view === view) ?? SESSION_INTERACTION_ENTRIES[0]; }

export function SessionInteractionWorkbench({ view, onNavigateView, onExit, onReset }: SessionInteractionWorkbenchProps) {
  const [activeView, setActiveView] = useState<SessionInteractionView>(view);
  const [draft, setDraft] = useState('请汇总当前页面的验收状态。');
  const [choice, setChoice] = useState('保持当前范围');
  const [custom, setCustom] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [actionStatus, setActionStatus] = useState('');
  const entry = entryFor(activeView);

  useEffect(() => { setActiveView(view); setExpanded(false); setActionStatus(''); }, [view]);
  const navigate = (next: SessionInteractionView) => { setActiveView(next); setExpanded(false); setActionStatus(''); onNavigateView(next); };
  const reset = () => { setDraft('请汇总当前页面的验收状态。'); setChoice('保持当前范围'); setCustom(''); setExpanded(false); setPaused(false); setActionStatus(''); onReset(); };

  const groups = ['回复', '澄清', '停止与继续', '后台与上下文', '回复与编辑'];
  return <section className="design-workbench session-interaction-workbench" data-state-source="static-only" aria-label="Sanbao 会话交互设计工作面">
    <header className="session-interaction-header"><div><span>Sanbao 设计工作面 · 静态候选</span><h1>会话主线与回复交互</h1><p>将回复、澄清、停止、后台、上下文、消息操作和文件编辑拆成可回放状态。所有文字均为本地示例。</p></div><div className="session-interaction-source"><strong>{entry.fixtureId}</strong><small>{entry.stateId} · static-only</small></div></header>
    <div className="session-interaction-layout"><nav className="session-interaction-nav" aria-label="会话交互工作面导航">{groups.map(group => <section key={group}><strong>{group}</strong>{SESSION_INTERACTION_ENTRIES.filter(item => item.group === group).map(item => <button type="button" key={item.view} className={item.view === activeView ? 'active' : ''} aria-current={item.view === activeView ? 'page' : undefined} onClick={() => navigate(item.view)}><span>{item.fixtureId.replace('SANBAO.', '')}</span>{item.label}</button>)}</section>)}</nav><main className="session-interaction-stage"><article className="session-interaction-card"><header><div><span>{entry.fixtureId}</span><h2>{entry.title}</h2><p>{entry.description}</p></div><em>本地候选</em></header><SessionBody view={activeView} draft={draft} setDraft={setDraft} choice={choice} setChoice={setChoice} custom={custom} setCustom={setCustom} expanded={expanded} setExpanded={setExpanded} paused={paused} setPaused={setPaused} actionStatus={actionStatus} setActionStatus={setActionStatus} navigate={navigate} /><footer><button type="button" className="text-button" onClick={reset}>重置当前演示</button><span /><button type="button" className="secondary-button" onClick={onExit}>返回任务摘要</button></footer></article></main></div>
    <footer className="session-interaction-boundary" role="note"><Icon name="chat" size={15} /><span>S01/S02/S08/S09/S10/M01/M02 的工作面来自静态候选。已观察的会话页面仍使用原 fixture；本批不代表 Qoder 原生交互、视觉、Figma、DSH Host、iOS 或 DMG 验收。</span></footer>
  </section>;
}

function SessionBody({ view, draft, setDraft, choice, setChoice, custom, setCustom, expanded, setExpanded, paused, setPaused, actionStatus, setActionStatus, navigate }: { view: SessionInteractionView; draft: string; setDraft: (value: string) => void; choice: string; setChoice: (value: string) => void; custom: string; setCustom: (value: string) => void; expanded: boolean; setExpanded: (value: boolean) => void; paused: boolean; setPaused: (value: boolean) => void; actionStatus: string; setActionStatus: (value: string) => void; navigate: (view: SessionInteractionView) => void }) {
  if (view === 'reply-composing') return <section className="session-composer"><textarea aria-label="本地回复草稿" value={draft} onChange={event => setDraft(event.target.value)} /><div><small>草稿仅存在于此工作面</small><button type="button" className="primary-button" disabled={!draft.trim()} onClick={() => navigate('reply-streaming')}>开始本地回复</button></div></section>;
  if (view === 'reply-streaming') return <section className="session-stream"><div><span>正在整理本地摘要</span><i /><i /><i /></div><p>先对照页面入口，再验证状态退出与恢复路径。此处的段落不来自模型输出。</p><button type="button" className="primary-button" onClick={() => navigate('reply-actions')}>查看本地完成回复</button></section>;
  if (view === 'clarification-choices') return <section className="session-clarification"><h3>希望本次评审先收口哪部分？</h3>{['保持当前范围', '先处理可恢复错误', '转为移动端流程'].map(item => <button type="button" key={item} className={choice === item ? 'selected' : ''} aria-pressed={choice === item} onClick={() => setChoice(item)}>{item}<Icon name="check" size={14} /></button>)}<footer><button type="button" className="secondary-button" onClick={() => navigate('clarification-custom')}>补充自定义回答</button><button type="button" className="primary-button" onClick={() => navigate('clarification-submitted')}>提交本地选择</button></footer></section>;
  if (view === 'clarification-custom') return <section className="session-composer"><label>补充说明<textarea aria-label="本地澄清补充" value={custom} onChange={event => setCustom(event.target.value)} placeholder="输入仅用于本地演示…" /></label><div><button type="button" className="secondary-button" onClick={() => navigate('clarification-choices')}>返回选项</button><button type="button" className="primary-button" disabled={!custom.trim()} onClick={() => navigate('clarification-submitted')}>提交本地补充</button></div></section>;
  if (view === 'clarification-submitted') return <section className="session-result"><Icon name="check" size={23} /><h3>澄清已在本地记录</h3><p>{custom.trim() || choice}。不会写入任务、触发模型或影响真实计划。</p><button type="button" className="primary-button" onClick={() => navigate('reply-composing')}>返回本地回复</button></section>;
  if (view === 'stop-confirm') return <section className="session-confirm"><Icon name="close" size={24} /><h3>停止当前本地回复演示？</h3><p>停止只改变当前界面的回放状态，不终止真实任务或调用。</p><div><button type="button" className="secondary-button" onClick={() => navigate('reply-streaming')}>继续查看</button><button type="button" className="primary-button" onClick={() => navigate('reply-stopped')}>确认本地停止</button></div></section>;
  if (view === 'reply-stopped') return <section className="session-result stopped"><Icon name="clock" size={23} /><h3>回复已在本地演示中停止</h3><p>已有内容停留在摘要占位，可继续补充新说明。</p><button type="button" className="primary-button" onClick={() => navigate('reply-follow-up')}>继续输入</button></section>;
  if (view === 'reply-follow-up') return <section className="session-composer"><textarea aria-label="本地后续输入" value={draft} onChange={event => setDraft(event.target.value)} /><div><button type="button" className="secondary-button" onClick={() => navigate('reply-stopped')}>返回停止状态</button><button type="button" className="primary-button" onClick={() => navigate('reply-actions')}>记录本地后续输入</button></div></section>;
  if (view === 'background-running') return <section className="session-background"><div><span className={paused ? 'paused' : ''}><Icon name="clock" size={18} /></span><div><strong>{paused ? '本地后台演示已暂停' : '正在整理 3 个本地检查项'}</strong><p>入口结构 · 恢复路径 · 交付说明</p></div></div><div className="session-progress"><i style={{ width: paused ? '42%' : '68%' }} /></div><button type="button" className="secondary-button" onClick={() => setPaused(!paused)}>{paused ? '恢复本地进度' : '暂停本地进度'}</button></section>;
  if (view === 'context-budget') return <section className="session-context"><div><span>本地上下文摘要</span><strong>12.4k / 32k</strong></div><div className="session-progress"><i style={{ width: '39%' }} /></div><p>数字是界面占位，不读取 Token、模型用量、会话内容或账号数据。</p><button type="button" className="secondary-button" onClick={() => setExpanded(!expanded)}>{expanded ? '收起本地摘要' : '展开本地摘要'}</button>{expanded && <ul><li>当前任务说明</li><li>本地交互合同</li><li>待独立校准项</li></ul>}</section>;
  if (view === 'reply-actions') return <section className="session-actions"><blockquote>页面覆盖已推进到本地交互回放；视觉校准等待独立输入。</blockquote><div><button type="button" onClick={() => setActionStatus('复制动作已在本地记录')}>复制</button><button type="button" onClick={() => setActionStatus('引用动作已在本地记录')}>引用</button><button type="button" onClick={() => navigate('reply-feedback')}>反馈</button></div>{actionStatus && <p role="status">{actionStatus}；未访问系统剪贴板。</p>}</section>;
  if (view === 'reply-feedback') return <section className="session-feedback"><h3>这个本地回复是否有帮助？</h3><div><button type="button" aria-pressed={actionStatus === '有帮助'} onClick={() => setActionStatus('有帮助')}>有帮助</button><button type="button" aria-pressed={actionStatus === '需调整'} onClick={() => setActionStatus('需调整')}>需调整</button></div>{actionStatus && <p>反馈“{actionStatus}”只保留在当前页面。</p>}<button type="button" className="secondary-button" onClick={() => navigate('reply-actions')}>返回回复操作</button></section>;
  if (view === 'file-writing') return <section className="session-file"><div><span>文件写入占位</span><strong>docs/review-summary.md</strong><small>0 / 3 本地片段</small></div><div className="session-progress"><i style={{ width: expanded ? '100%' : '55%' }} /></div><button type="button" className="primary-button" onClick={() => setExpanded(true)}>{expanded ? '本地片段已显示' : '显示本地写入完成'}</button>{expanded && <p>没有创建路径、读取文件或写入磁盘。</p>}</section>;
  return <section className="session-edit"><div><span>编辑工具本地摘要</span><strong>1 个可查看片段</strong></div><button type="button" className="secondary-button" onClick={() => setExpanded(!expanded)}>{expanded ? '收起本地编辑详情' : '展开本地编辑详情'}</button>{expanded && <pre><code>{'- 页面入口\n+ 本地交互闭环\n  视觉校准待独立验证'}</code></pre>}<p>该摘要不是 Diff，不加载仓库、文件或 Git 状态。</p></section>;
}
