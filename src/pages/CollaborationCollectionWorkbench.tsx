import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Controls';

export type CollaborationWorkbenchSection = 'projects' | 'issues' | 'discussions' | 'my-work';
export type CollaborationWorkbenchView = 'list' | 'detail' | 'project-draft' | 'discussion-status' | 'issue-run' | 'feedback';

export type CollaborationCollectionWorkbenchProps = {
  section?: CollaborationWorkbenchSection;
  view?: CollaborationWorkbenchView;
  onNavigateSection?: (section: CollaborationWorkbenchSection) => void;
  onNavigateView?: (view: CollaborationWorkbenchView) => void;
  onExit?: () => void;
  onReset?: () => void;
};

export const COLLABORATION_WORKBENCH_ENTRIES = [
  { stateId: 'QDR.P07.scope.unexpanded', id: 'SANBAO.P07.F01', section: 'projects', defaultView: 'list', label: '项目与 Issue 工作面' },
  { stateId: 'QDR.P08.scope.unexpanded', id: 'SANBAO.P08.F01', section: 'discussions', defaultView: 'list', label: '讨论与参与者工作面' },
  { stateId: 'QDR.P09.scope.unexpanded', id: 'SANBAO.P09.F01', section: 'my-work', defaultView: 'list', label: '我的工作与动态工作面' },
  { stateId: 'QDR.O12.scope.unexpanded', id: 'SANBAO.O12.F01', section: 'issues', defaultView: 'issue-run', label: 'Issue 本地执行记录' },
] as const;

type CollectionItem = {
  id: string;
  title: string;
  summary: string;
  status: string;
  meta: string;
  filter: string;
  detail: string;
};

type SectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
  empty: string;
  action: string;
  source: string;
};

const COPY: Record<CollaborationWorkbenchSection, SectionCopy> = {
  projects: {
    eyebrow: 'SANBAO.P07.F01 · 项目与 Issue',
    title: '项目工作面',
    description: '用项目分组查看当前演示任务，确认列表、状态筛选和详情回退之间的信息层级。',
    empty: '当前筛选下没有本地项目',
    action: '新建本地项目草稿',
    source: 'QDR.P07 · 原产品静态候选',
  },
  issues: {
    eyebrow: 'SANBAO.P07.F02 · Issue',
    title: 'Issue 工作面',
    description: 'Issue 的状态、负责人和运行记录都只来自本地示例，用于验证任务定位与返回路径。',
    empty: '当前筛选下没有本地 Issue',
    action: '查看本地执行记录',
    source: 'QDR.P07 / QDR.O12 · 原产品静态候选',
  },
  discussions: {
    eyebrow: 'SANBAO.P08.F01 · 讨论与参与者',
    title: '讨论工作面',
    description: '用可选择的讨论条目和本地状态调整回放参与者、讨论进度与回退操作。',
    empty: '当前筛选下没有本地讨论',
    action: '调整本地讨论状态',
    source: 'QDR.P08 · 原产品静态候选',
  },
  'my-work': {
    eyebrow: 'SANBAO.P09.F01 · 我的工作',
    title: '我的工作',
    description: '把待处理、澄清和动态放在一个本地收件箱中，验证筛选与处置反馈的交互边界。',
    empty: '当前筛选下没有本地工作项',
    action: '记录本地处置',
    source: 'QDR.P09 · 原产品静态候选',
  },
};

const FILTERS: Record<CollaborationWorkbenchSection, readonly { id: string; label: string }[]> = {
  projects: [{ id: 'all', label: '全部' }, { id: 'active', label: '进行中' }, { id: 'backlog', label: '待排期' }, { id: 'review', label: '待审阅' }, { id: 'done', label: '已完成' }],
  issues: [{ id: 'all', label: '全部' }, { id: 'active', label: '进行中' }, { id: 'backlog', label: '待处理' }, { id: 'review', label: '待审阅' }, { id: 'done', label: '已关闭' }],
  discussions: [{ id: 'all', label: '全部' }, { id: 'open', label: '开放' }, { id: 'waiting', label: '等待' }, { id: 'resolved', label: '已解决' }],
  'my-work': [{ id: 'all', label: '全部' }, { id: 'needs', label: '待处理' }, { id: 'clarification', label: '澄清' }, { id: 'updates', label: '动态' }],
};

const ITEMS: Record<CollaborationWorkbenchSection, readonly CollectionItem[]> = {
  projects: [
    { id: 'project-release', title: '发布前页面核对', summary: '汇总需要确认的工作面与验收入口。', status: '待审阅', meta: '3 个本地工作项 · 今天', filter: 'review', detail: '此项目只展示本地评审用的事项关系，不读取工作区、代码仓库或外部项目管理服务。' },
    { id: 'project-mobile', title: '移动协作流程', summary: '整理桌面端与轻量协作端的连接点。', status: '进行中', meta: '5 个本地工作项 · 本周', filter: 'active', detail: '用于审阅发起、进度、审批和成果预览的层级；没有建立实际移动端任务。' },
    { id: 'project-archive', title: '资料整理计划', summary: '等候下一轮可确认的资料边界。', status: '待排期', meta: '1 个本地工作项 · 未排期', filter: 'backlog', detail: '本地占位项目用于展示空闲队列，不创建远端项目或修改现有计划。' },
    { id: 'project-token', title: '视觉 Token 盘点', summary: '已完成静态候选的归类与来源标注。', status: '已完成', meta: '4 个本地工作项 · 已归档', filter: 'done', detail: '完成状态只表示本页的模拟数据，不代表 Qoder 视觉或 Figma 校准已经完成。' },
  ],
  issues: [
    { id: 'issue-navigation', title: '核对静态入口的导航关系', summary: '确认项目、Issue、讨论与我的工作之间的本地跳转。', status: '待审阅', meta: 'P07 · 本地运行记录可见', filter: 'review', detail: '执行记录是静态候选 O12 的 Sanbao 设计回放，不对应真实工具调用、模型响应或任务日志。' },
    { id: 'issue-layout', title: '补齐宽屏集合列表', summary: '为项目与 Issue 保留列表、详情和返回路径。', status: '进行中', meta: 'P07 · 本地演示', filter: 'active', detail: '这里只维护当前组件的内存状态，不会写入文件、保存浏览器数据或提交任务。' },
    { id: 'issue-participants', title: '讨论参与者信息待确认', summary: '等待原生页面可以稳定取证后再校准细节。', status: '待处理', meta: 'P08 · 原生待核验', filter: 'backlog', detail: '待处理仅说明设计输入不足；不会尝试创建讨论、邀请成员或访问账号。' },
    { id: 'issue-history', title: '整理历史状态标识', summary: '旧的本地 fixture 记录已经完成本轮归类。', status: '已关闭', meta: '本地归档', filter: 'done', detail: '关闭是本地展示状态，不删除真实数据，也不影响其他原型页面。' },
  ],
  discussions: [
    { id: 'discussion-release', title: '发布流程需要确认', summary: '将预览入口和验收说明整理为一个待答复话题。', status: '开放', meta: '3 位本地参与者 · 2 条消息', filter: 'open', detail: '讨论内容与参与者名单都是演示数据；此页不发送消息、不邀请成员、也不读取账号。' },
    { id: 'discussion-scope', title: '范围边界补充', summary: '等待确认下一批可执行的本地工作面。', status: '等待', meta: '2 位本地参与者 · 等待输入', filter: 'waiting', detail: '等待状态仅展示用户输入前的视觉层级，不会向任何人发送通知或请求授权。' },
    { id: 'discussion-mobile', title: '移动端五流程映射', summary: '本地设计说明已经归类，等待桌面依赖收口。', status: '已解决', meta: '4 位本地参与者 · 已归档', filter: 'resolved', detail: '已解决只是本地回放结果，原生 Qoder 讨论页和 iOS 流程仍要独立验收。' },
  ],
  'my-work': [
    { id: 'work-review', title: '审阅：多窗格侧聊工作面', summary: '检查创建、关闭确认与恢复动作的状态连续性。', status: '待处理', meta: '今天 · 设计评审', filter: 'needs', detail: '此处的处置动作仅产生日志式反馈，不会变更任务、审批或真实会话。' },
    { id: 'work-clarification', title: '澄清：原生视觉参考条件', summary: '等待稳定中性页面后再补两个参考状态。', status: '需要澄清', meta: '本周 · 取证边界', filter: 'clarification', detail: '澄清卡不请求模型、不提交新消息，也不操作 Qoder 中正在进行的用户会话。' },
    { id: 'work-update', title: '动态：目录回归已通过', summary: '记录本地目录路由的最近一次检查结果。', status: '动态', meta: '刚刚 · 本地回放', filter: 'updates', detail: '动态说明来自原型内存数据，不能替代原生截图、Figma 或 DSH Host 的验收记录。' },
  ],
};

const DEFAULT_SELECTED: Record<CollaborationWorkbenchSection, string> = {
  projects: 'project-release',
  issues: 'issue-navigation',
  discussions: 'discussion-release',
  'my-work': 'work-review',
};

const normalizeView = (section: CollaborationWorkbenchSection, view: CollaborationWorkbenchView): CollaborationWorkbenchView => {
  if (view === 'issue-run' && section !== 'issues') return 'list';
  if (view === 'project-draft' && section !== 'projects') return 'list';
  if (view === 'discussion-status' && section !== 'discussions') return 'list';
  return view;
};

export function CollaborationCollectionWorkbench({ section = 'projects', view = 'list', onNavigateSection, onNavigateView, onExit, onReset }: CollaborationCollectionWorkbenchProps) {
  const [currentSection, setCurrentSection] = useState<CollaborationWorkbenchSection>(section);
  const [currentView, setCurrentView] = useState<CollaborationWorkbenchView>(() => normalizeView(section, view));
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED[section]);
  const [projectName, setProjectName] = useState('');
  const [discussionStatus, setDiscussionStatus] = useState('开放');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setCurrentSection(section);
    setCurrentView(normalizeView(section, view));
    setFilter('all');
    setQuery('');
    setSelectedId(DEFAULT_SELECTED[section]);
    setFeedback('');
  }, [section]);

  useEffect(() => {
    setCurrentView(normalizeView(section, view));
  }, [section, view]);

  const copy = COPY[currentSection];
  const allItems = ITEMS[currentSection];
  const visibleItems = useMemo(() => allItems.filter(item => (
    (filter === 'all' || item.filter === filter) &&
    (!query.trim() || `${item.title} ${item.summary} ${item.meta}`.toLocaleLowerCase('zh-CN').includes(query.trim().toLocaleLowerCase('zh-CN')))
  )), [allItems, filter, query]);
  const selected = allItems.find(item => item.id === selectedId) ?? null;

  const navigateView = (next: CollaborationWorkbenchView) => {
    const normalized = normalizeView(currentSection, next);
    setCurrentView(normalized);
    onNavigateView?.(normalized);
  };

  const chooseSection = (next: CollaborationWorkbenchSection) => {
    setCurrentSection(next);
    setCurrentView('list');
    setFilter('all');
    setQuery('');
    setSelectedId(DEFAULT_SELECTED[next]);
    setFeedback('');
    onNavigateSection?.(next);
    onNavigateView?.('list');
  };

  const chooseItem = (id: string) => {
    setSelectedId(id);
    navigateView('detail');
  };

  const reset = () => {
    setFilter('all');
    setQuery('');
    setSelectedId(DEFAULT_SELECTED[currentSection]);
    setProjectName('');
    setDiscussionStatus('开放');
    setFeedback('');
    navigateView('list');
    onReset?.();
  };

  const primaryAction = () => {
    if (currentSection === 'projects') { navigateView('project-draft'); return; }
    if (currentSection === 'issues') { navigateView('issue-run'); return; }
    if (currentSection === 'discussions') { navigateView('discussion-status'); return; }
    setFeedback(`已记录“${selected?.title ?? '当前工作项'}”的本地处置；没有更新真实任务。`);
    navigateView('feedback');
  };

  const statusClass = (value: string) => value.includes('进行') || value === '开放' ? 'active' : value.includes('审阅') || value.includes('处理') || value.includes('澄清') || value === '等待' ? 'waiting' : 'done';

  return <section className="design-workbench collaboration-collection-workbench" data-state-source="static-only" aria-label="Sanbao 项目、Issue、讨论与我的工作设计工作面">
    <header className="collaboration-collection-header">
      <div>
        <span>Sanbao 设计工作面 · 原产品静态候选</span>
        <h1>{copy.title}</h1>
        <p>{copy.description} 不会连接项目服务、读取文件、发送消息、调用模型或修改系统设置。</p>
      </div>
      <div className="collaboration-collection-source"><strong>{copy.eyebrow.split(' · ')[0]}</strong><small>{copy.source}</small></div>
    </header>

    <nav className="collaboration-collection-nav" aria-label="协作集合工作面">
      {(['projects', 'issues', 'discussions', 'my-work'] as const).map(key => <button key={key} type="button" className={key === currentSection ? 'active' : ''} aria-current={key === currentSection ? 'page' : undefined} onClick={() => chooseSection(key)}><Icon name={key === 'discussions' ? 'chat' : key === 'my-work' ? 'clock' : key === 'issues' ? 'file' : 'folder'} size={14} />{COPY[key].title}</button>)}
    </nav>

    <div className="collaboration-collection-toolbar">
      <div className="collaboration-collection-filters" aria-label={`${copy.title}状态筛选`}>
        {FILTERS[currentSection].map(option => <button type="button" key={option.id} className={option.id === filter ? 'active' : ''} aria-pressed={option.id === filter} onClick={() => { setFilter(option.id); setFeedback(''); }}>{option.label}</button>)}
      </div>
      <label className="collaboration-collection-search"><Icon name="search" size={14} /><input aria-label={`搜索${copy.title}`} value={query} onChange={event => { setQuery(event.target.value); setFeedback(''); }} placeholder={`搜索${copy.title}`} /></label>
    </div>

    <main className="collaboration-collection-stage">
      {currentView === 'project-draft' ? <ProjectDraft name={projectName} onName={setProjectName} onCancel={() => navigateView('list')} onCreate={() => { setFeedback(`项目草稿“${projectName.trim() || '未命名项目'}”已保留在本地演示中；没有创建远端项目。`); navigateView('feedback'); }} />
        : currentView === 'issue-run' ? <IssueRunTranscript item={selected ?? ITEMS.issues[0]} onBack={() => navigateView('detail')} onClose={() => navigateView('list')} />
          : currentView === 'discussion-status' ? <DiscussionStatus item={selected ?? ITEMS.discussions[0]} status={discussionStatus} onStatus={setDiscussionStatus} onCancel={() => navigateView('detail')} onSave={() => { setFeedback(`讨论状态已在本地切换为“${discussionStatus}”；没有通知参与者或写入服务。`); navigateView('feedback'); }} />
            : currentView === 'feedback' ? <FeedbackPanel message={feedback || '本地操作已完成；没有触发外部副作用。'} onBack={() => navigateView(selected ? 'detail' : 'list')} />
              : currentView === 'detail' && selected ? <DetailPanel section={currentSection} item={selected} statusClass={statusClass(selected.status)} onBack={() => navigateView('list')} onAction={primaryAction} action={copy.action} />
                : <ListPanel items={visibleItems} empty={copy.empty} query={query} onChoose={chooseItem} statusClass={statusClass} onAction={primaryAction} action={copy.action} />}
    </main>

    <footer className="collaboration-collection-boundary" role="note"><span><Icon name="bolt" size={15} />这是目录外 Sanbao 设计型 fixture：P07–P09、O12 只有静态候选线索。列表、筛选、选择、草稿、状态调整和记录都在页面内存中完成，原生 Qoder、视觉、Figma、DSH Host、iOS 与 DMG 仍待独立验收。</span><div><button type="button" className="text-button" onClick={reset}>重置本地状态</button>{onExit && <button type="button" className="text-button" onClick={onExit}>退出工作面</button>}</div></footer>
  </section>;
}

function ListPanel({ items, empty, query, onChoose, statusClass, onAction, action }: { items: readonly CollectionItem[]; empty: string; query: string; onChoose: (id: string) => void; statusClass: (value: string) => string; onAction: () => void; action: string }) {
  return <section className="collaboration-collection-list-panel">
    <header><div><span>本地列表</span><strong>{items.length} 项</strong></div><button type="button" className="primary-button" onClick={onAction}><Icon name="plus" size={14} />{action}</button></header>
    {items.length ? <div className="collaboration-collection-list" role="list">{items.map(item => <button type="button" key={item.id} role="listitem" onClick={() => onChoose(item.id)}><span className={`collaboration-collection-status ${statusClass(item.status)}`}>{item.status}</span><span className="collaboration-collection-item-copy"><strong>{item.title}</strong><small>{item.summary}</small></span><span className="collaboration-collection-item-meta">{item.meta}<Icon name="chevron" size={14} /></span></button>)}</div> : <div className="collaboration-collection-empty"><Icon name="search" size={24} /><h2>{empty}</h2><p>{query ? `“${query}”没有匹配本地演示数据。可清空搜索或切换筛选。` : '可切换状态筛选，或使用本地操作入口继续评审。'}</p><button type="button" className="secondary-button" onClick={onAction}>{action}</button></div>}
  </section>;
}

function DetailPanel({ section, item, statusClass, onBack, onAction, action }: { section: CollaborationWorkbenchSection; item: CollectionItem; statusClass: string; onBack: () => void; onAction: () => void; action: string }) {
  const heading = section === 'issues' ? 'Issue 详情' : section === 'projects' ? '项目详情' : section === 'discussions' ? '讨论详情' : '工作项详情';
  return <article className="collaboration-collection-detail">
    <button type="button" className="collaboration-collection-back" onClick={onBack}>‹ 返回列表</button>
    <span className={`collaboration-collection-status ${statusClass}`}>{item.status}</span>
    <span className="collaboration-collection-kicker">{heading} · 本地示例</span>
    <h2>{item.title}</h2>
    <p>{item.summary}</p>
    <dl><div><dt>本地定位</dt><dd>{item.meta}</dd></div><div><dt>当前边界</dt><dd>{item.detail}</dd></div></dl>
    <footer><button type="button" className="secondary-button" onClick={onBack}>回到列表</button><button type="button" className="primary-button" onClick={onAction}>{action}<Icon name="chevron" size={14} /></button></footer>
  </article>;
}

function ProjectDraft({ name, onName, onCancel, onCreate }: { name: string; onName: (value: string) => void; onCancel: () => void; onCreate: () => void }) {
  return <form className="collaboration-collection-form" onSubmit={event => { event.preventDefault(); onCreate(); }}>
    <span className="collaboration-collection-kicker">SANBAO.P07.F03 · 本地项目草稿</span>
    <h2>新建项目的评审草稿</h2>
    <p>这个步骤只用于演示项目表单的输入、取消和操作反馈；不会创建项目、选择工作区或保存用户数据。</p>
    <label>项目名称<input aria-label="本地项目草稿名称" value={name} maxLength={60} placeholder="例如：发布说明整理" onChange={event => onName(event.target.value)} autoFocus /></label>
    <div className="collaboration-collection-form-note"><Icon name="folder" size={16} /><span>范围：当前本地原型会话 · 不关联真实仓库或远端服务</span></div>
    <footer><button type="button" className="secondary-button" onClick={onCancel}>取消</button><button type="submit" className="primary-button">保留本地草稿</button></footer>
  </form>;
}

function DiscussionStatus({ item, status, onStatus, onCancel, onSave }: { item: CollectionItem; status: string; onStatus: (value: string) => void; onCancel: () => void; onSave: () => void }) {
  return <section className="collaboration-collection-form">
    <span className="collaboration-collection-kicker">SANBAO.P08.F02 · 本地讨论状态</span>
    <h2>调整“{item.title}”</h2>
    <p>参与者与状态名称仅用于评审；没有读取组织成员、发送提醒或保存到讨论服务。</p>
    <fieldset><legend>本地讨论状态</legend><div className="collaboration-collection-options">{['开放', '等待', '已解决'].map(option => <label key={option}><input type="radio" name="local-discussion-status" value={option} checked={status === option} onChange={() => onStatus(option)} />{option}</label>)}</div></fieldset>
    <div className="collaboration-collection-participants"><span>本地参与者</span><strong>产品 · 设计 · 研发</strong><small>仅作静态样例，不代表真实成员或权限。</small></div>
    <footer><button type="button" className="secondary-button" onClick={onCancel}>取消</button><button type="button" className="primary-button" onClick={onSave}>更新本地状态</button></footer>
  </section>;
}

function IssueRunTranscript({ item, onBack, onClose }: { item: CollectionItem; onBack: () => void; onClose: () => void }) {
  return <section className="collaboration-collection-transcript">
    <header><div><span className="collaboration-collection-kicker">SANBAO.O12.F01 · Issue 本地执行记录</span><h2>{item.title}</h2><p>O12 只发现了 IssueRunTranscriptDialog 静态名称。下方是 Sanbao 的本地设计回放，不是真实执行日志。</p></div><span className="collaboration-collection-transcript-badge">本地回放</span></header>
    <ol><li className="done"><Icon name="check" size={13} /><div><strong>整理 Issue 描述</strong><small>只读取此页的静态演示文本</small></div></li><li className="done"><Icon name="check" size={13} /><div><strong>生成待审阅摘要</strong><small>没有调用模型或创建产物</small></div></li><li><Icon name="clock" size={13} /><div><strong>等待人工确认</strong><small>未自动重发、提交或修改任务</small></div></li></ol>
    <div className="collaboration-collection-transcript-note"><Icon name="file" size={16} /><span>运行记录保留在当前 React 内存中，刷新、重置或离开页面后不作为历史数据保存。</span></div>
    <footer><button type="button" className="secondary-button" onClick={onBack}>返回 Issue 详情</button><button type="button" className="primary-button" onClick={onClose}>关闭本地记录</button></footer>
  </section>;
}

function FeedbackPanel({ message, onBack }: { message: string; onBack: () => void }) {
  return <section className="collaboration-collection-feedback-panel"><span><Icon name="check" size={20} /></span><div><small>本地操作反馈</small><h2>演示状态已更新</h2><p>{message}</p></div><footer><button type="button" className="primary-button" onClick={onBack}>返回上一层</button></footer></section>;
}
