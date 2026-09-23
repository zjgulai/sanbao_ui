import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Controls';

export type TaskSearchWorkspaceView = 'tasks' | 'search' | 'workspace' | 'actions';

export const TASK_SEARCH_WORKSPACE_ENTRIES: readonly { stateId: string; view: TaskSearchWorkspaceView; id: string; label: string; source: string }[] = [
  { stateId: 'QDR.P01.scope.unexpanded', view: 'tasks', id: 'SANBAO.P01.F02', label: '任务列表与选择', source: 'P01 静态候选' },
  { stateId: 'QDR.P02.scope.unexpanded', view: 'search', id: 'SANBAO.P02.F02', label: '工作区会话搜索', source: 'P02 静态候选' },
  { stateId: 'QDR.P13.scope.unexpanded', view: 'workspace', id: 'SANBAO.P13.F02', label: '工作区管理与远端占位', source: 'P13 静态候选' },
  { stateId: 'QDR.O04.scope.unexpanded', view: 'actions', id: 'SANBAO.O04.F01', label: '任务操作与批量回放', source: 'O04 静态候选' },
];

export type TaskSearchWorkspaceWorkbenchProps = {
  initialView: TaskSearchWorkspaceView;
  onNavigate: (view: TaskSearchWorkspaceView) => void;
  onExit: () => void;
  onReset: () => void;
};

type TaskItem = { id: string; title: string; workspace: string; detail: string; status: string; updated: string };
type ActionMode = 'overview' | 'rename' | 'archive' | 'archived' | 'grouped';
type WorkspacePanel = 'local' | 'remote' | 'archived';

const TASKS: readonly TaskItem[] = [
  { id: 'prototype', title: 'UI 原型规划', workspace: 'paper-plane', detail: '整理状态目录、可点击工作面和交接材料。', status: '进行中', updated: '刚刚' },
  { id: 'release', title: '发布前页面核对', workspace: 'paper-plane', detail: '核对验收入口、预览和待确认事项。', status: '待审阅', updated: '今天' },
  { id: 'archive', title: '设计资料归档', workspace: 'design-lab', detail: '准备可归档的本地资料清单。', status: '草稿', updated: '昨天' },
];

const entryFor = (view: TaskSearchWorkspaceView) => TASK_SEARCH_WORKSPACE_ENTRIES.find(entry => entry.view === view)!;

export function TaskSearchWorkspaceWorkbench({ initialView, onNavigate, onExit, onReset }: TaskSearchWorkspaceWorkbenchProps) {
  const [view, setView] = useState<TaskSearchWorkspaceView>(initialView);
  const [activeTaskId, setActiveTaskId] = useState('prototype');
  const [bulkTaskIds, setBulkTaskIds] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [actionMode, setActionMode] = useState<ActionMode>('overview');
  const [renameDraft, setRenameDraft] = useState('UI 原型规划');
  const [localTitle, setLocalTitle] = useState<string | null>(null);
  const [groupApplied, setGroupApplied] = useState(false);
  const [locallyArchived, setLocallyArchived] = useState(false);
  const [workspacePanel, setWorkspacePanel] = useState<WorkspacePanel>('local');
  const [workspaceName, setWorkspaceName] = useState('paper-plane');
  const [workspaceSaved, setWorkspaceSaved] = useState(false);
  const [remoteDraft, setRemoteDraft] = useState('team-space / project-sample');
  const [remoteChecked, setRemoteChecked] = useState(false);

  useEffect(() => { setView(initialView); }, [initialView]);

  const activeTask = TASKS.find(task => task.id === activeTaskId) ?? TASKS[0];
  const visibleTasks = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    if (!keyword) return TASKS;
    return TASKS.filter(task => `${task.title} ${task.workspace} ${task.detail}`.toLocaleLowerCase().includes(keyword));
  }, [query]);
  const taskTitle = activeTask.id === 'prototype' && localTitle ? localTitle : activeTask.title;
  const entry = entryFor(view);

  const navigate = (next: TaskSearchWorkspaceView) => {
    setView(next);
    onNavigate(next);
  };
  const reset = () => {
    setActiveTaskId('prototype');
    setBulkTaskIds([]);
    setQuery('');
    setActionMode('overview');
    setRenameDraft('UI 原型规划');
    setLocalTitle(null);
    setGroupApplied(false);
    setLocallyArchived(false);
    setWorkspacePanel('local');
    setWorkspaceName('paper-plane');
    setWorkspaceSaved(false);
    setRemoteDraft('team-space / project-sample');
    setRemoteChecked(false);
    setView(initialView);
    onReset();
  };
  const toggleBulk = (id: string) => setBulkTaskIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const selectTask = (id: string) => {
    setActiveTaskId(id);
    const selected = TASKS.find(task => task.id === id);
    if (selected) setRenameDraft(id === 'prototype' && localTitle ? localTitle : selected.title);
  };

  return <section className="design-workbench task-search-workspace-workbench" data-state-source="static-only" aria-label="Sanbao 任务、搜索与工作区设计工作面">
    <header className="task-search-workspace-header">
      <div><span>SANBAO DESIGN WORKBENCH</span><h1>任务、搜索与工作区</h1><p>保留尚未采集组级路径的本地交互设计。首页、搜索空态和新建工作区继续由既有已观察 fixture 承接，本页不替代它们。</p></div>
      <div className="task-search-workspace-source"><strong>{entry.id}</strong><small>{entry.source} · 待原生校准</small></div>
    </header>

    <nav className="task-search-workspace-nav" aria-label="任务与工作区设计状态">
      {TASK_SEARCH_WORKSPACE_ENTRIES.map(item => <button type="button" key={item.view} className={item.view === view ? 'active' : ''} aria-current={item.view === view ? 'page' : undefined} onClick={() => navigate(item.view)}><span>{item.id.replace('SANBAO.', '')}</span>{item.label}</button>)}
    </nav>

    <main className="task-search-workspace-stage">
      {view === 'tasks' && <TaskListPanel activeTaskId={activeTaskId} titleFor={task => task.id === 'prototype' && localTitle ? localTitle : task.title} bulkTaskIds={bulkTaskIds} selectTask={selectTask} toggleBulk={toggleBulk} openActions={() => { setActionMode('overview'); navigate('actions'); }} />}
      {view === 'search' && <SearchPanel query={query} setQuery={setQuery} tasks={visibleTasks} titleFor={task => task.id === 'prototype' && localTitle ? localTitle : task.title} selectTask={selectTask} openTask={() => navigate('tasks')} />}
      {view === 'workspace' && <WorkspacePanel panel={workspacePanel} setPanel={setWorkspacePanel} workspaceName={workspaceName} setWorkspaceName={setWorkspaceName} workspaceSaved={workspaceSaved} setWorkspaceSaved={setWorkspaceSaved} remoteDraft={remoteDraft} setRemoteDraft={setRemoteDraft} remoteChecked={remoteChecked} setRemoteChecked={setRemoteChecked} />}
      {view === 'actions' && <TaskActionPanel task={activeTask} taskTitle={taskTitle} mode={actionMode} setMode={setActionMode} renameDraft={renameDraft} setRenameDraft={setRenameDraft} applyRename={() => setLocalTitle(renameDraft.trim() || null)} groupApplied={groupApplied} setGroupApplied={setGroupApplied} locallyArchived={locallyArchived} setLocallyArchived={setLocallyArchived} openList={() => navigate('tasks')} />}
    </main>

    <footer className="task-search-workspace-boundary" role="note"><Icon name="bolt" size={15} /><span>Sanbao 本地设计工作面：不会创建、重命名、分组、归档或恢复真实任务和工作区；不会访问本机文件、远端工作区、账号、模型或网络。</span><div><button type="button" className="text-button" onClick={onExit}>退出工作面</button><button type="button" className="secondary-button" onClick={reset}>重置本地状态</button></div></footer>
  </section>;
}

function TaskListPanel({ activeTaskId, titleFor, bulkTaskIds, selectTask, toggleBulk, openActions }: { activeTaskId: string; titleFor: (task: TaskItem) => string; bulkTaskIds: string[]; selectTask: (id: string) => void; toggleBulk: (id: string) => void; openActions: () => void }) {
  const active = TASKS.find(task => task.id === activeTaskId) ?? TASKS[0];
  return <article className="task-search-workspace-card task-list-panel">
    <header><div><span className="task-search-workspace-kicker">SANBAO.P01.F02 · 本地列表</span><h2>任务列表与可恢复选择</h2><p>列表条目、状态和时间均为演示数据。选择与多选只存在于当前页面。</p></div><span className="task-search-workspace-status">{bulkTaskIds.length ? `已选 ${bulkTaskIds.length} 项` : '本地列表'}</span></header>
    <div className="task-list-layout"><section className="task-list-rows" aria-label="本地任务列表">{TASKS.map(task => <article key={task.id} className={task.id === activeTaskId ? 'active' : ''}><button type="button" className="task-list-select" aria-pressed={task.id === activeTaskId} onClick={() => selectTask(task.id)}><span className="task-list-dot" /><div><strong>{titleFor(task)}</strong><small>{task.workspace} · {task.updated}</small></div><em>{task.status}</em></button><button type="button" className={`task-list-bulk ${bulkTaskIds.includes(task.id) ? 'selected' : ''}`} aria-label={`选择 ${titleFor(task)} 用于本地批量操作`} aria-pressed={bulkTaskIds.includes(task.id)} onClick={() => toggleBulk(task.id)}><Icon name={bulkTaskIds.includes(task.id) ? 'check' : 'plus'} size={13} /></button></article>)}</section><aside className="task-list-detail"><span>当前本地选择</span><h3>{titleFor(active)}</h3><p>{active.detail}</p><dl><div><dt>工作区</dt><dd>{active.workspace}</dd></div><div><dt>状态</dt><dd>{active.status}</dd></div></dl><button type="button" className="secondary-button" onClick={openActions}><Icon name="more" size={14} />打开本地操作</button></aside></div>
    <footer><span>批量状态可回放：选择条目 → 进入操作 → 重置。</span><button type="button" className="primary-button" disabled={!bulkTaskIds.length} onClick={openActions}>批量进入本地操作 <Icon name="chevron" size={14} /></button></footer>
  </article>;
}

function SearchPanel({ query, setQuery, tasks, titleFor, selectTask, openTask }: { query: string; setQuery: (value: string) => void; tasks: readonly TaskItem[]; titleFor: (task: TaskItem) => string; selectTask: (id: string) => void; openTask: () => void }) {
  const hasQuery = !!query.trim();
  return <article className="task-search-workspace-card task-search-panel">
    <header><div><span className="task-search-workspace-kicker">SANBAO.P02.F02 · 本地搜索结果</span><h2>按工作区检索会话</h2><p>已观察的普通搜索空态独立保留。这个组级候选仅模拟输入、结果定位和无匹配恢复。</p></div><span className="task-search-workspace-status">仅本地匹配</span></header>
    <label className="task-search-input"><Icon name="search" size={18} /><input aria-label="搜索本地任务" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索本地任务、工作区或说明…" autoFocus /><kbd>ESC</kbd></label>
    <div className="task-search-result-list">{tasks.length ? tasks.map(task => <button type="button" key={task.id} onClick={() => { selectTask(task.id); openTask(); }}><span className="task-search-result-icon"><Icon name="chat" size={15} /></span><span><strong>{titleFor(task)}</strong><small>{task.workspace} · {task.detail}</small></span><em>{task.status}</em><Icon name="chevron" size={14} /></button>) : <div className="task-search-empty"><Icon name="search" size={24} /><strong>{hasQuery ? '没有匹配的本地任务' : '暂无本地搜索结果'}</strong><span>{hasQuery ? '调整关键词，或清空输入恢复三条本地演示记录。' : '输入关键词后将只在页面内过滤演示记录。'}</span></div>}</div>
    <footer><span>{hasQuery ? `“${query}” 的本地匹配：${tasks.length} 条` : '可试试：原型、发布、design-lab'}</span><button type="button" className="secondary-button" onClick={() => setQuery('')}>清空本地查询</button></footer>
  </article>;
}

function WorkspacePanel({ panel, setPanel, workspaceName, setWorkspaceName, workspaceSaved, setWorkspaceSaved, remoteDraft, setRemoteDraft, remoteChecked, setRemoteChecked }: { panel: WorkspacePanel; setPanel: (panel: WorkspacePanel) => void; workspaceName: string; setWorkspaceName: (value: string) => void; workspaceSaved: boolean; setWorkspaceSaved: (value: boolean) => void; remoteDraft: string; setRemoteDraft: (value: string) => void; remoteChecked: boolean; setRemoteChecked: (value: boolean) => void }) {
  return <article className="task-search-workspace-card workspace-manage-panel">
    <header><div><span className="task-search-workspace-kicker">SANBAO.P13.F02 · 本地工作区管理</span><h2>编辑、远端占位与归档恢复</h2><p>新建工作区已有观察 fixture。本页只补编辑、远端和归档候选，不打开选择器或连接任何位置。</p></div><span className="task-search-workspace-status">本地草稿</span></header>
    <nav className="workspace-manage-tabs" aria-label="本地工作区管理分区">{([{ key: 'local', label: '本地工作区' }, { key: 'remote', label: '远端工作区' }, { key: 'archived', label: '已归档' }] as const).map(item => <button type="button" key={item.key} className={panel === item.key ? 'active' : ''} aria-current={panel === item.key ? 'page' : undefined} onClick={() => setPanel(item.key)}>{item.label}</button>)}</nav>
    {panel === 'local' ? <section className="workspace-manage-body"><div className="workspace-folder-sim"><Icon name="folder" size={20} /><div><strong>本地示例路径</strong><span>/示例工作区/{workspaceName || 'paper-plane'}</span></div><em>未访问</em></div><label className="workspace-manage-field">工作区显示名称<input aria-label="本地工作区显示名称" value={workspaceName} maxLength={48} onChange={event => { setWorkspaceName(event.target.value); setWorkspaceSaved(false); }} /></label><p className="workspace-manage-note">保存只保留当前 React 状态；不写入工作区、索引或本机设置。</p><footer><span className={workspaceSaved ? 'workspace-save-state ready' : 'workspace-save-state'}>{workspaceSaved ? '本地草稿已更新' : '尚未保存本地草稿'}</span><button type="button" className="primary-button" disabled={!workspaceName.trim()} onClick={() => setWorkspaceSaved(true)}>保存本地草稿</button></footer></section> : panel === 'remote' ? <section className="workspace-manage-body"><div className="workspace-remote-sim"><Icon name="globe" size={19} /><div><strong>远端工作区占位</strong><span>{remoteChecked ? '本地格式检查完成，未发起连接。' : '等待输入一个仅供演示的远端名称。'}</span></div><em>{remoteChecked ? '本地可继续' : '未连接'}</em></div><label className="workspace-manage-field">远端工作区草稿<input aria-label="远端工作区草稿" value={remoteDraft} maxLength={80} onChange={event => { setRemoteDraft(event.target.value); setRemoteChecked(false); }} /></label><p className="workspace-manage-note">此字段不包含 URL、令牌或账号；检查操作不调用网络、认证或同步。</p><footer><button type="button" className="secondary-button" onClick={() => { setRemoteDraft(''); setRemoteChecked(false); }}>清空本地草稿</button><button type="button" className="primary-button" disabled={!remoteDraft.trim()} onClick={() => setRemoteChecked(true)}>检查本地格式</button></footer></section> : <section className="workspace-manage-body workspace-archive-body"><div className="workspace-archive-row"><span className="workspace-archive-mark">D</span><div><strong>design-lab · 本地示例</strong><p>归档条目只用于查看恢复入口，不表示真实目录已被归档。</p></div><button type="button" className="secondary-button">恢复本地示例</button></div><p className="workspace-manage-note">原生归档确认、文件存在性、远端关联与恢复后状态仍待单独取证。</p></section>}
  </article>;
}

function TaskActionPanel({ task, taskTitle, mode, setMode, renameDraft, setRenameDraft, applyRename, groupApplied, setGroupApplied, locallyArchived, setLocallyArchived, openList }: { task: TaskItem; taskTitle: string; mode: ActionMode; setMode: (mode: ActionMode) => void; renameDraft: string; setRenameDraft: (value: string) => void; applyRename: () => void; groupApplied: boolean; setGroupApplied: (value: boolean) => void; locallyArchived: boolean; setLocallyArchived: (value: boolean) => void; openList: () => void }) {
  const resetAction = () => setMode('overview');
  return <article className="task-search-workspace-card task-action-panel">
    <header><div><span className="task-search-workspace-kicker">SANBAO.O04.F01 · 本地任务操作</span><h2>{mode === 'rename' ? '编辑任务显示名称' : mode === 'archive' ? '归档本地任务确认' : mode === 'archived' ? '本地任务已归档' : mode === 'grouped' ? '本地分组已更新' : '重命名、归档与批量操作'}</h2><p>只回放操作与恢复路径，不触发真实保存、删除、归档、移动或会话更新。</p></div><span className={`task-search-workspace-status ${locallyArchived ? 'warning' : ''}`}>{locallyArchived ? '本地已归档' : task.status}</span></header>
    {mode === 'rename' ? <section className="task-action-body"><label className="task-action-field">本地显示名称<input aria-label="本地任务显示名称" value={renameDraft} maxLength={80} onChange={event => setRenameDraft(event.target.value)} /></label><p>提交仅更新此页的演示标题。真实重命名的菜单、快捷键、冲突和持久化方式尚未采集。</p><footer><button type="button" className="secondary-button" onClick={resetAction}>取消</button><button type="button" className="primary-button" disabled={!renameDraft.trim()} onClick={() => { applyRename(); setMode('overview'); }}>更新本地标题</button></footer></section> : mode === 'archive' ? <section className="task-action-body task-action-confirm"><span className="task-action-confirm-icon"><Icon name="close" size={18} /></span><div><strong>将“{taskTitle}”归档到本地演示区？</strong><p>继续只改变当前页面的提示，不删除或修改真实任务、文件、历史记录或远端数据。</p></div><footer><button type="button" className="secondary-button" onClick={resetAction}>返回</button><button type="button" className="task-action-danger" onClick={() => { setLocallyArchived(true); setMode('archived'); }}>确认本地归档</button></footer></section> : mode === 'archived' ? <section className="task-action-body task-action-result"><Icon name="check" size={22} /><div><strong>本地演示已标记为归档</strong><p>未执行真实归档。可以恢复该本地标记，或返回任务列表继续评审。</p></div><footer><button type="button" className="secondary-button" onClick={() => { setLocallyArchived(false); setMode('overview'); }}>恢复本地标记</button><button type="button" className="primary-button" onClick={openList}>返回任务列表</button></footer></section> : mode === 'grouped' ? <section className="task-action-body task-action-result"><Icon name="check" size={22} /><div><strong>已加入“本地评审”分组</strong><p>分组关系没有写入任何真实会话或目录，可返回操作面继续调整。</p></div><footer><button type="button" className="secondary-button" onClick={() => setGroupApplied(false)}>移除本地分组</button><button type="button" className="primary-button" onClick={resetAction}>继续本地操作</button></footer></section> : <section className="task-action-body"><div className="task-action-target"><span className="task-list-dot" /><div><strong>{taskTitle}</strong><p>{task.workspace} · 当前本地选择</p></div></div><div className="task-action-grid"><button type="button" onClick={() => setMode('rename')}><Icon name="file" size={17} /><span><strong>重命名</strong><small>编辑本地显示标题</small></span></button><button type="button" onClick={() => setMode('archive')}><Icon name="folder" size={17} /><span><strong>归档</strong><small>打开本地确认态</small></span></button><button type="button" className={groupApplied ? 'selected' : ''} onClick={() => groupApplied ? setGroupApplied(false) : setMode('grouped')}><Icon name="grid" size={17} /><span><strong>{groupApplied ? '移出分组' : '加入分组'}</strong><small>仅切换本地关系</small></span></button><button type="button" onClick={openList}><Icon name="panel" size={17} /><span><strong>批量列表</strong><small>返回选择与批量入口</small></span></button></div></section>}
  </article>;
}
