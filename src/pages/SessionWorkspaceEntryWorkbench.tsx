import { useEffect, useState } from 'react';
import { Icon } from '../components/Controls';

export type SessionWorkspaceEntryView = 'terminal' | 'sidepanel';

type Props = {
  initialView: SessionWorkspaceEntryView;
  onExit: () => void;
};

const lines = [
  { prefix: '$', value: '准备本地任务工作面', tone: 'command' },
  { prefix: '✓', value: '会话上下文已载入到演示壳', tone: 'success' },
  { prefix: '·', value: '未连接 Shell、文件或运行环境', tone: 'muted' },
  { prefix: '›', value: '等待可验证的终端入口证据', tone: 'muted' },
] as const;

export function SessionWorkspaceEntryWorkbench({ initialView, onExit }: Props) {
  const [view, setView] = useState<SessionWorkspaceEntryView>(initialView);
  const [panel, setPanel] = useState<'活动' | '文件' | '预览'>('活动');

  useEffect(() => {
    setView(initialView);
    setPanel('活动');
  }, [initialView]);

  return <section className={`session-workspace-entry-workbench ${view}`} data-state-source="entry-observed" aria-label="会话工作台入口设计页面">
    <header className="session-workspace-entry-header">
      <div><span>SANBAO DESIGN WORKBENCH · ENTRY-OBSERVED</span><h1>{view === 'terminal' ? '会话终端工作台' : '会话侧面板工作台'}</h1><p>原产品只确认此入口可见。本页补齐桌面页面结构，用于审阅会话主区、工具区域和返回层级；不会执行命令、读取文件或连接运行时。</p></div>
      <div className="session-workspace-entry-source"><strong>{view === 'terminal' ? 'QDR.P14.terminal.entry' : 'QDR.P14.sidepanel.entry'}</strong><small>仅入口证据 · 待原生页面校准</small></div>
    </header>

    <nav className="session-workspace-entry-nav" aria-label="会话工作面视图">
      <button type="button" className={view === 'terminal' ? 'active' : ''} aria-current={view === 'terminal' ? 'page' : undefined} onClick={() => setView('terminal')}><Icon name="code" size={15} />终端</button>
      <button type="button" className={view === 'sidepanel' ? 'active' : ''} aria-current={view === 'sidepanel' ? 'page' : undefined} onClick={() => setView('sidepanel')}><Icon name="panel" size={15} />侧面板</button>
    </nav>

    {view === 'terminal' ? <main className="session-workspace-entry-terminal">
      <header><div><span>任务</span><strong>发布前页面核对</strong></div><span>本地演示 · 未运行</span></header>
      <section className="session-workspace-entry-terminal-body" aria-label="本地终端占位"><div className="session-workspace-entry-terminal-log">{lines.map(line => <p className={line.tone} key={line.value}><i>{line.prefix}</i>{line.value}</p>)}</div><div className="session-workspace-entry-terminal-input"><span>本地演示提示</span><span>不提供命令输入，也不会保留历史记录。</span></div></section>
      <footer><span><Icon name="bolt" size={14} />终端的真实启动、权限、环境和输出格式仍待独立采集。</span><button type="button" className="secondary-button" onClick={onExit}>返回任务主界面</button></footer>
    </main> : <main className="session-workspace-entry-sidepanel">
      <section className="session-workspace-entry-task"><header><span>任务会话</span><button type="button" aria-label="关闭本地侧面板" onClick={onExit}><Icon name="close" size={15} /></button></header><div><p className="eyebrow">本地任务摘要</p><h2>发布前页面核对</h2><p>确认全部页面都能从状态目录直达，并将未验证的来源、视觉、Figma 与 DSH 状态保留在交接信息中。</p><ol><li>检查状态入口</li><li>确认页面结构</li><li>记录后续校准项</li></ol></div></section>
      <aside className="session-workspace-entry-panel"><nav aria-label="本地侧面板标签">{(['活动', '文件', '预览'] as const).map(item => <button type="button" className={panel === item ? 'active' : ''} aria-pressed={panel === item} key={item} onClick={() => setPanel(item)}>{item}</button>)}</nav><div>{panel === '活动' ? <><span>本地活动</span><strong>页面结构等待评审</strong><p>这里仅显示当前原型的静态任务摘要，没有启动后台 Agent 或进程。</p></> : panel === '文件' ? <><span>本地文件占位</span><strong>没有连接工作区</strong><p>不会枚举、读取或修改用户目录中的文件。</p></> : <><span>本地预览占位</span><strong>尚未打开产物</strong><p>预览区不加载网页、HTML、图片或外部内容。</p></>}</div></aside>
      <footer><span><Icon name="bolt" size={14} />标签、关闭和内容区只在 React 内存中切换。</span><button type="button" className="secondary-button" onClick={onExit}>返回任务主界面</button></footer>
    </main>}
  </section>;
}
