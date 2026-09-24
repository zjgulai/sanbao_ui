import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { SiteTemplates } from './ComposerContextExtras';
import { getPresentationContentProfile, type PresentationContentProfile } from '../content/presentation-profile';

const paths: Record<string, ReactNode> = {
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.6 4.6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6 18 18M6 18 18 6" />,
  arrow: <path d="M12 20V4m-6 6 6-6 6 6" />,
  down: <path d="m7 10 5 5 5-5" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  folder: <path d="M3 7V5h7l2 2h9v13H3Z" />,
  chat: <path d="M20 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3Z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  home: <><path d="m3 11 9-8 9 8v10H3Z" /><path d="M9 21v-6h6v6" /></>,
  code: <><path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18" /></>,
  book: <><path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
  monitor: <><rect x="3" y="3" width="18" height="13" rx="2" /><path d="M12 16v5m-5 0h10" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  file: <><path d="M5 2h9l5 5v15H5Zm9 0v6h5" /><path d="M8 13h8m-8 4h6" /></>,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V3H3v13h5" /></>,
  more: <><circle cx="5" cy="12" r=".8" /><circle cx="12" cy="12" r=".8" /><circle cx="19" cy="12" r=".8" /></>,
  panel: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></>,
  bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7Z" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m10 2-1 3-3 1-3 1 1 4-1 4 3 2 3 1 1 4h4l1-4 3-1 3-2-1-4 1-4-3-1-3-1-1-3Z" /></>,
};

export function Icon({ name, size = 17 }: { name: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.file}</svg>;
}

export function IconButton({ name, label, onClick, className = '' }: { name: string; label: string; onClick: () => void; className?: string }) {
  return <button className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick}><Icon name={name} /></button>;
}

export function Modal({ title, children, onClose, className = '' }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const topDialog = () => Array.from(document.querySelectorAll<HTMLElement>('.modal[role="dialog"]')).at(-1);
    const frame = requestAnimationFrame(() => {
      if (topDialog() === ref.current && !ref.current?.contains(document.activeElement)) (ref.current?.querySelector<HTMLElement>('[data-autofocus], input:not(:disabled), textarea, select') ?? ref.current?.querySelector<HTMLElement>('button'))?.focus();
    });
    function key(event: KeyboardEvent) {
      if (event.isComposing || event.defaultPrevented || topDialog() !== ref.current) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); close.current(); return; }
      if (event.key !== 'Tab' || !ref.current) return;
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea, select, [tabindex="0"]'));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!ref.current.contains(document.activeElement)) { event.preventDefault(); first.focus(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', key);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', key);
      const restore = (target: HTMLElement | null) => {
        const top = topDialog();
        if (target && (!top || top.contains(target))) target.focus();
      };
      if (previous?.isConnected) restore(previous);
      else if (previous) {
        const label = previous.getAttribute('aria-label');
        const id = previous.id;
        requestAnimationFrame(() => {
          const replacement = id ? document.getElementById(id) : label ? document.querySelector<HTMLElement>(`[aria-label="${CSS.escape(label)}"]`) : null;
          restore(replacement);
        });
      }
    };
  }, []);
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={title} ref={ref}>
      <div className="modal-heading"><h2>{title}</h2><IconButton name="close" label={`关闭${title}`} onClick={onClose} /></div>{children}
    </div>
  </div>;
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <button type="button" role="switch" aria-label={label} aria-checked={checked} className={`toggle ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)}><span /></button>;
}

export type ComposerContextState = 'context' | 'skills' | 'goal' | 'plan' | 'sites' | 'files' | 'plugins';
type ContextMenu = 'context' | 'skills' | 'files' | 'plugins';
const CONTEXT_ITEMS = [
  { key: 'goal', label: '目标', icon: 'bolt' },
  { key: 'plan', label: '计划', icon: 'file', shortcut: '⇧Tab' },
  { key: 'sites', label: '站点', icon: 'globe' },
  { key: 'files', label: '工作区文件', icon: 'folder', submenu: true },
  { key: 'plugins', label: '插件', icon: 'grid', submenu: true },
  { key: 'skills', label: '技能', icon: 'bolt', submenu: true },
] as const;
const WORKSPACE_FILES = ['AGENTS.md', 'demo.html', 'README.md'];
const PLUGINS = [
  { name: 'qoder-canvas', help: 'CanvasTSX authoring guidance for Qoder Canvas previews' },
  { name: 'qoder-desktop-pet-skill', help: 'Qoder built-in Skill for installing compatible desktop pets through Petdex' },
  { name: 'qoder-find-extensions', help: 'Qoder built-in capability discovery and installation skill' },
  { name: 'qoder-qmind', help: 'QMind Service tools for the Qoder Agent' },
];

type ComposerProps = { running?: boolean; onSend: (text: string) => void; onStop?: () => void; onRoute: (group: string) => void; initialValue?: string; onDraftChange?: (value: string) => void; initialSkill?: string; onSkillChange?: (value: string) => void; compact?: boolean; workspaceName?: string; initialContextMenu?: ComposerContextState; onInputFocus?: () => void; contentProfile?: PresentationContentProfile };

export function Composer(props: ComposerProps) {
  const contentProfile = props.contentProfile ?? getPresentationContentProfile();
  return contentProfile.kind === 'product'
    ? <SanbaoProductComposer {...props} contentProfile={contentProfile} />
    : <QoderResearchComposer {...props} />;
}

function QoderResearchComposer({ running = false, onSend, onStop, onRoute, initialValue = '', onDraftChange, initialSkill = '', onSkillChange, compact = false, workspaceName = 'paper-plane', initialContextMenu, onInputFocus }: ComposerProps) {
  const [text, setText] = useState(initialValue);
  const [menu, setMenu] = useState<ContextMenu | null>(initialContextMenu === 'context' || initialContextMenu === 'skills' || initialContextMenu === 'files' || initialContextMenu === 'plugins' ? initialContextMenu : null);
  const [skillSearch, setSkillSearch] = useState('');
  const [pluginSearch, setPluginSearch] = useState('');
  const [skill, setSkill] = useState(initialSkill);
  const [mode, setMode] = useState<'goal' | 'plan' | null>(initialContextMenu === 'goal' || initialContextMenu === 'plan' ? initialContextMenu : null);
  const [site, setSite] = useState(initialContextMenu === 'sites');
  const [templatesOpen, setTemplatesOpen] = useState(initialContextMenu === 'sites');
  const [fileSearch, setFileSearch] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [notice, setNotice] = useState(initialContextMenu === 'goal' || initialContextMenu === 'plan' ? '本地模式示例；目标与计划暂按互斥展示，原产品互斥行为尚未验证。' : '');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const contextRoot = useRef<HTMLDivElement>(null);
  const updateText = (value: string) => { setText(value); onDraftChange?.(value); };
  const updateSkill = (value: string) => { setSkill(value); onSkillChange?.(value); };
  const closeMenu = () => { setMenu(null); opener.current?.focus(); };
  const focusInput = () => inputRef.current?.focus({ preventScroll: true });
  const closeTemplates = () => { setTemplatesOpen(false); focusInput(); };
  useEffect(() => {
    if (initialContextMenu !== 'goal' && initialContextMenu !== 'plan' && initialContextMenu !== 'sites') return;
    const frame = requestAnimationFrame(focusInput);
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const frame = requestAnimationFrame(() => (menuRef.current?.querySelector<HTMLElement>('input') ?? menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]'))?.focus());
    const outside = (event: PointerEvent) => {
      if (!contextRoot.current?.contains(event.target as Node)) setMenu(null);
    };
    document.addEventListener('pointerdown', outside);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointerdown', outside); };
  }, [menu]);
  const menuKeys = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeMenu(); return; }
    if (event.key === 'ArrowLeft' && menu !== 'context') {
      event.preventDefault(); event.stopPropagation();
      if (menu === 'files') closeMenu(); else setMenu('context');
      return;
    }
    if (event.key === 'ArrowRight' && menu === 'context' && event.target instanceof HTMLButtonElement) {
      const key = event.target.dataset.contextKey;
      if (key === 'files' || key === 'skills' || key === 'plugins') { event.preventDefault(); event.stopPropagation(); activateContext(key); }
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    if (event.target instanceof HTMLInputElement && ['Home', 'End'].includes(event.key)) return;
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? []);
    if (!items.length) return;
    event.preventDefault();
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : event.key === 'ArrowDown' ? (index + 1) % items.length : index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length;
    items[next].focus();
  };
  const skills = ['界面研究', '文档整理', '任务拆解'].filter(item => item.includes(skillSearch.trim()));
  const filteredFiles = WORKSPACE_FILES.filter(file => file.toLowerCase().includes(fileSearch.trim().toLowerCase()));
  const filteredPlugins = PLUGINS.filter(plugin => plugin.name.toLowerCase().includes(pluginSearch.trim().toLowerCase()));
  const pluginNotice = (action: string) => setNotice(`“${action}”操作尚未采集；当前仅为本地菜单演示，未选择、安装插件或打开外部页面。`);
  const navigateExtension = (id: string) => { setMenu(null); onRoute(id); };
  const activateContext = (key: string) => {
    if (key === 'skills') { setSkillSearch(''); setMenu('skills'); }
    else if (key === 'files') { setFileSearch(''); setMenu('files'); }
    else if (key === 'plugins') { setPluginSearch(''); setMenu('plugins'); }
    else if (key === 'goal' || key === 'plan') {
      setMode(key); setMenu(null); focusInput();
      setNotice('本地模式示例；目标与计划暂按互斥展示，原产品互斥行为尚未验证。');
    } else if (key === 'sites') { setSite(true); setTemplatesOpen(true); setMenu(null); focusInput(); }
    else { setMenu(null); onRoute('O02'); }
  };
  const selectFile = (file: string) => {
    setFiles(current => current.includes(file) ? current : [...current, file]);
    setMenu(null); focusInput(); setNotice('本地文件选择示例；未读取文件，原产品选文件后的行为尚未验证。');
  };
  const submit = () => {
    if (!text.trim() || running) return;
    onSend(text.trim()); updateText(''); updateSkill(''); setMode(null); setSite(false); setTemplatesOpen(false); setFiles([]); setNotice('');
  };
  return <div className={`composer composer-with-context ${compact ? 'compact' : ''}`} onKeyDown={event => {
    if (event.key === 'Escape' && !event.nativeEvent.isComposing && !menu && templatesOpen) { event.preventDefault(); event.stopPropagation(); closeTemplates(); }
  }}>
    {templatesOpen && <SiteTemplates onCollapse={closeTemplates} />}
    {skill && <div className="composer-selection"><span><Icon name="bolt" size={12} /> {skill} · 示例</span><button aria-label={`移除技能 ${skill}`} onClick={() => updateSkill('')}>×</button></div>}
    {(site || files.length > 0) && <div className="composer-context-chips">
      {site && <span className="composer-context-chip site"><button type="button" aria-label="展开站点模板" aria-expanded={templatesOpen} onClick={() => setTemplatesOpen(value => !value)}><Icon name="globe" size={12} />站点</button><button type="button" aria-label="移除站点" onClick={() => { setSite(false); setTemplatesOpen(false); focusInput(); }}>×</button></span>}
      {files.map(file => <span className="composer-context-chip file" key={file}><span><Icon name="file" size={12} />{file} · 示例</span><button type="button" aria-label={`移除文件 ${file}`} onClick={() => { setFiles(current => current.filter(item => item !== file)); focusInput(); }}>×</button></span>)}
    </div>}
    <textarea ref={inputRef} aria-label="任务输入" placeholder="描述你想完成的任务…" value={text} onFocus={onInputFocus} onChange={event => updateText(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); } }} />
    <div className="composer-toolbar"><div className="composer-tools"><div className="relative" ref={contextRoot}><button className="icon-button" aria-label="添加上下文" aria-haspopup="menu" aria-expanded={!!menu} ref={opener} onPointerDown={event => { if (menu) event.preventDefault(); }} onClick={() => { if (menu) closeMenu(); else setMenu('context'); }}><Icon name="plus" /></button>{menu && <div className={`small-menu context-menu ${menu === 'plugins' ? 'plugin-menu' : ''}`} ref={menuRef} onKeyDown={menuKeys} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setMenu(null); }} role="menu" aria-label={menu === 'skills' ? '技能选择' : menu === 'files' ? '工作区文件' : menu === 'plugins' ? '插件选择' : '上下文类型'}>
      {menu === 'context' ? CONTEXT_ITEMS.map(item => <button role="menuitem" key={item.key} data-context-key={item.key} aria-haspopup={'submenu' in item ? 'menu' : undefined} onClick={() => activateContext(item.key)}><span className="composer-context-item"><Icon name={item.icon} size={14} />{item.label}</span>{'shortcut' in item && <kbd>{item.shortcut}</kbd>}{'submenu' in item && <Icon name="chevron" size={12} />}</button>) : menu === 'skills' ? <>
        <button role="menuitem" className="context-back" onClick={() => setMenu('context')}>‹ 返回上下文</button>
        <label className="context-search"><Icon name="search" size={13} /><input aria-label="搜索技能" value={skillSearch} onChange={event => setSkillSearch(event.target.value)} placeholder="搜索技能" /></label>
        <p className="context-list-label">本地示例技能</p>
        {skills.length ? skills.map(label => <button role="menuitem" key={label} onClick={() => { updateSkill(label); closeMenu(); }}><span>{label}</span>{skill === label && <Icon name="check" size={12} />}</button>) : <p className="context-empty" role="status">没有匹配的技能</p>}
        <button type="button" role="menuitem" className="skill-management" onClick={() => navigateExtension('QDR.P04.installed.skills.empty')}>管理技能<Icon name="settings" size={13} /></button>
        <button type="button" role="menuitem" onClick={() => navigateExtension('QDR.P04.market.skills.default')}>探索更多技能<Icon name="chevron" size={12} /></button>
      </> : menu === 'plugins' ? <>
        <button role="menuitem" className="context-back" onClick={() => setMenu('context')}>‹ 返回上下文</button>
        <label className="context-search"><Icon name="search" size={13} /><input aria-label="搜索插件" value={pluginSearch} onChange={event => setPluginSearch(event.target.value)} placeholder="搜索插件" /></label>
        {filteredPlugins.length ? filteredPlugins.map(plugin => <button type="button" role="menuitem" aria-label={plugin.name} title={plugin.help} className="plugin-choice" key={plugin.name} onClick={() => pluginNotice(plugin.name)}><Icon name="grid" size={14} /><span className="plugin-copy"><strong>{plugin.name}</strong><small>{plugin.help}</small></span></button>) : <button type="button" role="menuitem" className="plugin-empty" disabled>未找到匹配的插件</button>}
        <button type="button" role="menuitem" className="plugin-management" onClick={() => navigateExtension('QDR.P04.installed.plugins.empty')}>管理插件<Icon name="settings" size={13} /></button>
        <button type="button" role="menuitem" onClick={() => navigateExtension('QDR.P04.market.plugins.default')}>探索更多插件<Icon name="chevron" size={12} /></button>
      </> : <>
        <button role="menuitem" className="context-back" onClick={() => setMenu('context')}>‹ 返回上下文</button>
        <label className="context-search"><Icon name="search" size={13} /><input aria-label="搜索当前项目文件" value={fileSearch} onChange={event => setFileSearch(event.target.value)} placeholder="搜索当前项目文件" /></label>
        <p className="context-list-label">{workspaceName} · 示例文件</p>
        {filteredFiles.length ? filteredFiles.map(file => <button role="menuitem" key={file} onClick={() => selectFile(file)}><span className="composer-context-item"><Icon name="file" size={13} />{file}</span>{files.includes(file) && <Icon name="check" size={12} />}</button>) : <p className="context-empty" role="status">没有匹配的文件</p>}
      </>}
    </div>}</div>{mode && <span className={`composer-mode-chip ${mode}`}><span>{mode === 'goal' ? '目标' : '计划'}</span><button type="button" aria-label={`移除${mode === 'goal' ? '目标' : '计划'}模式`} onClick={() => { setMode(null); setNotice(''); focusInput(); }}>×</button></span>}<button className="text-button" onClick={() => onRoute('O02')}>Auto <Icon name="down" size={12} /></button></div>
      {running ? <button className="send-button stop" aria-label="停止生成" onClick={onStop}><span /></button> : <button className="send-button" aria-label="发送任务" disabled={!text.trim()} onClick={submit}><Icon name="arrow" size={18} /></button>}
    </div>
    <div className="composer-context"><button onClick={() => onRoute('P13')}><Icon name="folder" size={13} /> {workspaceName} <Icon name="down" size={11} /></button><button onClick={() => onRoute('O02')}><Icon name="monitor" size={13} /> 本地模式</button></div>
    {notice && <p className="composer-local-note" role="status">{notice}</p>}
  </div>;
}

function SanbaoProductComposer({ running = false, onSend, onStop, initialValue = '', onDraftChange, compact = false, onInputFocus, contentProfile }: ComposerProps & { contentProfile: PresentationContentProfile }) {
  const copy = contentProfile.composer;
  const [text, setText] = useState(initialValue);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [mode, setMode] = useState<'goal' | 'plan' | null>(null);
  const [notice, setNotice] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const updateText = (value: string) => { setText(value); onDraftChange?.(value); };
  const chooseMode = (next: 'goal' | 'plan') => {
    setMode(next);
    setContextMenuOpen(false);
    setNotice(copy.goalPlanNotice);
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  };
  const submit = () => {
    if (!text.trim() || running) return;
    onSend(text.trim());
    updateText('');
    setMode(null);
    setNotice('');
  };
  return <div className={`composer composer-with-context ${compact ? 'compact' : ''}`}>
    {mode && <div className="composer-selection"><span><Icon name={mode === 'goal' ? 'bolt' : 'file'} size={12} /> {mode === 'goal' ? '目标' : '计划'} · 本地演示</span><button aria-label={`移除${mode === 'goal' ? '目标' : '计划'}上下文`} onClick={() => { setMode(null); setNotice(''); }}>×</button></div>}
    <textarea ref={inputRef} aria-label={copy.ariaLabel} placeholder={copy.placeholder} value={text} onFocus={onInputFocus} onChange={event => updateText(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); } }} />
    <div className="composer-toolbar">
      <div className="composer-tools">
        <div className="relative">
          <button className="icon-button" aria-label={copy.contextMenuLabel} aria-haspopup="menu" aria-expanded={contextMenuOpen} onClick={() => setContextMenuOpen(value => !value)}><Icon name="plus" /></button>
          {contextMenuOpen && <div className="small-menu context-menu" role="menu" aria-label={copy.contextMenuLabel}>
            <button role="menuitem" onClick={() => chooseMode('goal')}><span className="composer-context-item"><Icon name="bolt" size={14} />目标</span></button>
            <button role="menuitem" onClick={() => chooseMode('plan')}><span className="composer-context-item"><Icon name="file" size={14} />计划</span></button>
          </div>}
        </div>
      </div>
      {running && onStop ? <button className="send-button stop" aria-label="停止本地演示" onClick={onStop}><span /></button> : <button className="send-button" aria-label={copy.sendLabel} disabled={!text.trim() || running} onClick={submit}><Icon name="arrow" size={18} /></button>}
    </div>
    <div className="composer-context"><button type="button" onClick={() => setNotice(copy.localBoundary)}><Icon name="monitor" size={13} /> {copy.localModeLabel}</button></div>
    {notice && <p className="composer-local-note" role="status">{notice}</p>}
  </div>;
}
