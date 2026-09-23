import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Controls';

export type WorkspaceMultipaneView = 'overview' | 'create' | 'confirm-close' | 'closed';

export const WORKSPACE_MULTIPANE_ENTRY = {
  stateId: 'QDR.P15.scope.unexpanded',
  id: 'SANBAO.P15.F01',
  label: '多窗格与侧聊工作面',
  source: 'P15 静态候选',
} as const;

export type WorkspaceMultipaneWorkbenchProps = {
  view?: WorkspaceMultipaneView;
  onNavigateView?: (view: WorkspaceMultipaneView) => void;
  onExit?: () => void;
  onReset?: () => void;
};

type SideChat = { id: string; title: string; summary: string; status: '进行中' | '已准备' };

const INITIAL_SIDE_CHATS: readonly SideChat[] = [
  { id: 'side-review', title: '页面验收问题', summary: '收集需要确认的视觉与交互点。', status: '进行中' },
  { id: 'side-copy', title: '发布说明文案', summary: '仅讨论产物说明的表达结构。', status: '已准备' },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function WorkspaceMultipaneWorkbench({ view = 'overview', onNavigateView, onExit, onReset }: WorkspaceMultipaneWorkbenchProps) {
  const [currentView, setCurrentView] = useState<WorkspaceMultipaneView>(view);
  const [sideChats, setSideChats] = useState<SideChat[]>(() => [...INITIAL_SIDE_CHATS]);
  const [activeChatId, setActiveChatId] = useState(INITIAL_SIDE_CHATS[0].id);
  const [pendingCloseId, setPendingCloseId] = useState<string | null>(null);
  const [lastClosedChat, setLastClosedChat] = useState<SideChat | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [leftWidth, setLeftWidth] = useState(266);
  const [rightWidth, setRightWidth] = useState(318);

  useEffect(() => { setCurrentView(view); }, [view]);

  const navigate = (next: WorkspaceMultipaneView) => {
    setCurrentView(next);
    onNavigateView?.(next);
  };

  const selectChat = (id: string) => {
    setActiveChatId(id);
    navigate('overview');
  };

  const beginClose = (id: string) => {
    setPendingCloseId(id);
    navigate('confirm-close');
  };

  const confirmClose = () => {
    const chat = sideChats.find(item => item.id === pendingCloseId);
    if (!chat) { navigate('overview'); return; }
    setSideChats(items => items.filter(item => item.id !== chat.id));
    setActiveChatId(current => current === chat.id ? '' : current);
    setLastClosedChat(chat);
    setPendingCloseId(null);
    navigate('closed');
  };

  const restoreClosed = () => {
    if (lastClosedChat && !sideChats.some(item => item.id === lastClosedChat.id)) {
      setSideChats(items => [...items, lastClosedChat]);
      setActiveChatId(lastClosedChat.id);
    }
    navigate('overview');
  };

  const createSideChat = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = draftTitle.trim() || '未命名侧聊';
    const chat: SideChat = {
      id: `side-local-${Date.now()}`,
      title,
      summary: '新建内容只存在于当前本地原型状态。',
      status: '已准备',
    };
    setSideChats(items => [...items, chat]);
    setActiveChatId(chat.id);
    setDraftTitle('');
    navigate('overview');
  };

  const reset = () => {
    setSideChats([...INITIAL_SIDE_CHATS]);
    setActiveChatId(INITIAL_SIDE_CHATS[0].id);
    setPendingCloseId(null);
    setLastClosedChat(null);
    setDraftTitle('');
    setLeftWidth(266);
    setRightWidth(318);
    navigate('overview');
    onReset?.();
  };

  const activeChat = sideChats.find(item => item.id === activeChatId) ?? null;
  const pendingChat = sideChats.find(item => item.id === pendingCloseId) ?? null;
  const paneStyle = { '--workspace-left-width': `${leftWidth}px`, '--workspace-right-width': `${rightWidth}px` } as React.CSSProperties;

  return <section className="design-workbench workspace-multipane-workbench" data-state-source="static-only" aria-label="Sanbao 多窗格与侧聊设计工作面">
    <header className="workspace-multipane-header">
      <div>
        <span>Sanbao 设计工作面</span>
        <h1>多窗格任务与侧聊</h1>
        <p>原产品静态候选：以 P15 的多窗格与侧聊线索组织本地可操作 fixture。不会读取任务、打开文件、调用模型、运行终端或请求网络。</p>
      </div>
      <div className="workspace-multipane-source"><strong>{WORKSPACE_MULTIPANE_ENTRY.id}</strong><small>{WORKSPACE_MULTIPANE_ENTRY.source} · 待原生校准</small></div>
    </header>

    <div className="workspace-multipane-controls" aria-label="本地工作面控制">
      <div className="workspace-multipane-presets"><span>窗格宽度</span><button type="button" onClick={() => { setLeftWidth(228); setRightWidth(250); }}>紧凑</button><button type="button" onClick={() => { setLeftWidth(266); setRightWidth(318); }}>默认</button><button type="button" onClick={() => { setLeftWidth(330); setRightWidth(390); }}>宽阅</button></div>
      <div className="workspace-multipane-ranges"><label>左栏 <output>{leftWidth}px</output><input aria-label="左侧侧聊栏宽度" type="range" min="210" max="360" value={leftWidth} onChange={event => setLeftWidth(clamp(Number(event.target.value), 210, 360))} /></label><label>右栏 <output>{rightWidth}px</output><input aria-label="右侧任务栏宽度" type="range" min="230" max="420" value={rightWidth} onChange={event => setRightWidth(clamp(Number(event.target.value), 230, 420))} /></label></div>
      <div className="workspace-multipane-global-actions"><button type="button" onClick={reset}>重置本地状态</button><button type="button" className="workspace-multipane-exit" onClick={onExit}>退出工作面</button></div>
    </div>

    <div className="workspace-multipane-layout" style={paneStyle}>
      <aside className="workspace-multipane-siderail" aria-label="侧聊列表">
        <header><div><span>侧聊</span><strong>{sideChats.length}</strong></div><button type="button" className="workspace-multipane-icon-button" aria-label="创建本地侧聊" onClick={() => navigate('create')}><Icon name="plus" size={15} /></button></header>
        <p>侧聊用于把当前任务中的局部讨论分开查看。列表内容为本地示例，不对应原生任务历史。</p>
        <div className="workspace-multipane-chat-list">{sideChats.length ? sideChats.map(chat => <article key={chat.id} className={chat.id === activeChatId ? 'active' : ''}><button type="button" className="workspace-multipane-chat-select" aria-pressed={chat.id === activeChatId} onClick={() => selectChat(chat.id)}><span><Icon name="chat" size={14} />{chat.status}</span><strong>{chat.title}</strong><small>{chat.summary}</small></button><button type="button" className="workspace-multipane-chat-close" aria-label={`关闭本地侧聊：${chat.title}`} onClick={() => beginClose(chat.id)}><Icon name="close" size={13} /></button></article>) : <div className="workspace-multipane-empty"><Icon name="chat" size={18} /><strong>暂无本地侧聊</strong><span>可创建一条侧聊，或恢复刚关闭的本地示例。</span></div>}</div>
        <footer><button type="button" onClick={() => navigate('create')}><Icon name="plus" size={14} />创建侧聊</button></footer>
      </aside>

      <main className="workspace-multipane-task" aria-label="任务主工作面">
        {currentView === 'create' ? <CreatePanel draftTitle={draftTitle} setDraftTitle={setDraftTitle} submit={createSideChat} cancel={() => navigate('overview')} /> : currentView === 'confirm-close' ? <CloseConfirmation chat={pendingChat} confirm={confirmClose} cancel={() => navigate('overview')} /> : currentView === 'closed' ? <ClosedPanel chat={lastClosedChat} restore={restoreClosed} create={() => navigate('create')} /> : <TaskPanel activeChat={activeChat} create={() => navigate('create')} />}
      </main>

      <aside className="workspace-multipane-task-panel" aria-label="任务概览与产物">
        <header><span>任务概览</span><button type="button" aria-label="任务面板本地占位操作"><Icon name="more" size={16} /></button></header>
        <section><span className="workspace-multipane-state"><i />本地演示中</span><h2>发布前页面核对</h2><p>主任务只展示可审阅的示例摘要。真正的任务事件、工具调用、会话持久化和权限链路仍属于后续 DSH 接缝验收。</p></section>
        <dl><div><dt>本地侧聊</dt><dd>{sideChats.length}</dd></div><div><dt>已关闭</dt><dd>{lastClosedChat ? 1 : 0}</dd></div><div><dt>产物</dt><dd>示例</dd></div></dl>
        <section className="workspace-multipane-output"><span>本地产物占位</span><strong><Icon name="file" size={15} />发布前核对.md</strong><small>不创建、读取或打开真实文件。</small></section>
      </aside>
    </div>

    <footer className="workspace-multipane-boundary" role="note"><Icon name="bolt" size={15} />本页是目录外 Sanbao 设计工作面。它只演示多窗格布局、侧聊创建、选择、关闭确认、恢复和宽度调整；不构成 Qoder 原生页面证据。</footer>
  </section>;
}

function TaskPanel({ activeChat, create }: { activeChat: SideChat | null; create: () => void }) {
  return <div className="workspace-multipane-task-content">
    <span className="workspace-multipane-eyebrow">主任务工作面 · 本地摘要</span>
    <h2>发布前页面核对</h2>
    <p>把桌面端的任务、产物审阅和侧聊关系放在同一工作区中。此处只用模拟信息验证信息层级和返回路径。</p>
    <div className="workspace-multipane-task-steps"><div><i>1</i><strong>核对页面入口</strong><span>保留待验收项与已完成项的视觉层级。</span></div><div><i>2</i><strong>整理发布说明</strong><span>将文本、预览和变更审阅拆分到相邻面板。</span></div><div><i>3</i><strong>进入成果验收</strong><span>复杂检查仍留在桌面端工作面。</span></div></div>
    {activeChat ? <section className="workspace-multipane-active-chat"><span>当前侧聊</span><h3><Icon name="chat" size={16} />{activeChat.title}</h3><p>{activeChat.summary}</p><small>{activeChat.status} · 仅本地状态</small></section> : <section className="workspace-multipane-active-chat empty"><span>当前侧聊</span><h3>未选中本地侧聊</h3><p>可从左栏选择现有对话，或者创建新的演示侧聊。</p><button type="button" onClick={create}>创建侧聊</button></section>}
  </div>;
}

function CreatePanel({ draftTitle, setDraftTitle, submit, cancel }: { draftTitle: string; setDraftTitle: (value: string) => void; submit: (event: React.FormEvent<HTMLFormElement>) => void; cancel: () => void }) {
  return <form className="workspace-multipane-create" onSubmit={submit}>
    <span className="workspace-multipane-eyebrow">SANBAO.P15.F02 · 创建侧聊</span>
    <h2>为当前任务新建一条本地侧聊</h2>
    <p>创建只会更新当前页面的演示数据，不会发出消息、连接新会话、读取上下文或保存任务记录。</p>
    <label>侧聊标题<input aria-label="本地侧聊标题" value={draftTitle} maxLength={36} placeholder="例如：补充验收问题" onChange={event => setDraftTitle(event.target.value)} autoFocus /></label>
    <div><button type="button" className="secondary-button" onClick={cancel}>返回主任务</button><button type="submit" className="primary-button">创建本地侧聊</button></div>
  </form>;
}

function CloseConfirmation({ chat, confirm, cancel }: { chat: SideChat | null; confirm: () => void; cancel: () => void }) {
  return <section className="workspace-multipane-confirm" role="region" aria-label="关闭本地侧聊确认">
    <span className="workspace-multipane-confirm-icon"><Icon name="close" size={19} /></span>
    <div><span className="workspace-multipane-eyebrow">SANBAO.P15.F03 · 关闭确认</span><h2>关闭这条本地侧聊？</h2><p>{chat ? `“${chat.title}”会从当前演示列表隐藏。关闭后仍可在下一步恢复此本地示例。` : '没有找到要关闭的本地侧聊，返回主任务即可继续。'}</p></div>
    <footer><button type="button" className="secondary-button" onClick={cancel}>取消</button><button type="button" className="workspace-multipane-danger" disabled={!chat} onClick={confirm}>确认关闭</button></footer>
  </section>;
}

function ClosedPanel({ chat, restore, create }: { chat: SideChat | null; restore: () => void; create: () => void }) {
  return <section className="workspace-multipane-closed">
    <span className="workspace-multipane-closed-icon"><Icon name="check" size={21} /></span>
    <div><span className="workspace-multipane-eyebrow">SANBAO.P15.F04 · 已关闭与恢复</span><h2>{chat ? '侧聊已从本地列表关闭' : '当前没有可恢复的本地侧聊'}</h2><p>{chat ? `“${chat.title}”现在只保留为本次演示的恢复项。不会删除真实会话、同步远端状态或影响 Qoder 原生任务。` : '可以返回主任务，或新建一条本地侧聊继续评审。'}</p></div>
    <footer>{chat && <button type="button" className="secondary-button" onClick={restore}>恢复本地侧聊</button>}<button type="button" className="primary-button" onClick={create}>创建另一条侧聊</button></footer>
  </section>;
}
