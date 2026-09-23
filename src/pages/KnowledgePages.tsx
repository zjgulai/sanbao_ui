import React, { useEffect, useId, useRef, useState } from 'react';
import { Icon, Modal } from '../components/Controls';

type NoticeProps = { onNotice: (text: string) => void };
export type KnowledgePageProps = NoticeProps & { onNavigate: (id: string) => void; initialCreate?: boolean; initialVariant?: string; workspaceName?: string };

const KNOWLEDGE_EMPTY = 'QDR.OBS02.knowledge.empty';
const KNOWLEDGE_CREATE = 'QDR.OBS02.knowledge.create.open';
const KNOWLEDGE_CREATE_WORKSPACE = 'QDR.OBS02.knowledge.create.workspace';
const KNOWLEDGE_CREATE_READY = 'QDR.OBS02.knowledge.create.ready';
const KNOWLEDGE_WORKSPACE = 'QDR.OBS02.knowledge.workspace-filter.open';
const REPO_WIKI = 'QDR.OBS02.repo-wiki.default';
const REPO_WIKI_GENERATED = 'QDR.OBS02.repo-wiki.generated.empty';
const REPO_WIKI_LIST = 'QDR.OBS02.repo-wiki.list';
const REPO_WIKI_SETUP = 'QDR.OBS02.repo-wiki.setup';
const REPO_WIKI_SEARCH = 'QDR.OBS02.repo-wiki.search.empty';
const REPO_WIKI_CARDS = 'QDR.OBS02.repo-wiki.knowledge-cards';
const REPO_WIKI_CARDS_WIDE = 'QDR.OBS02.repo-wiki.knowledge-cards.wide';
const WIKI_EMPTY_QUERY = 'sanbao-fixture-no-match';
const SITES_EMPTY = 'QDR.OBS03.sites.empty';
const SITES_SHARED = 'QDR.OBS03.sites.shared.empty';
const SITES_LOADING = 'QDR.OBS03.sites.loading';
const CREATE_TRIGGER_ID = 'knowledge-create-trigger';

function CollectionArt({ site = false }: { site?: boolean }) {
  return <svg className="collection-banner-art" viewBox="0 0 220 122" role="img" aria-label={site ? '原创浏览器装饰示意' : '原创书本装饰示意'}>
    <ellipse cx="124" cy="103" rx="73" ry="8" fill="#d7dfd3" opacity=".3" />
    {site ? <g transform="translate(41 16) rotate(-7 72 44)">
      <rect x="19" y="13" width="134" height="79" rx="8" fill="#f5f7f0" stroke="#dce3d7" />
      <rect width="134" height="79" rx="8" fill="#fff" stroke="#d2ddca" />
      <path d="M0 19h134" stroke="#e1e7dc" /><circle cx="11" cy="10" r="2" fill="#c6d2bd" /><circle cx="19" cy="10" r="2" fill="#d6dfce" /><circle cx="27" cy="10" r="2" fill="#e2e9dc" />
      <rect x="12" y="31" width="49" height="34" rx="4" fill="#e8eee2" /><path d="m24 54 10-11 8 7 8-8" fill="none" stroke="#bacbb0" strokeWidth="2" />
      <path d="M74 36h43M74 46h32M74 56h38" stroke="#d4decf" strokeWidth="4" strokeLinecap="round" />
    </g> : <g transform="translate(33 23) rotate(-8 77 37)">
      <path d="M13 19 76 6l74 13v69L77 75 13 88Z" fill="#edf2e8" stroke="#d4dfcb" />
      <path d="M7 8c27-7 49-7 70 5 23-12 48-12 76-5v66c-28-7-53-6-76 6-21-12-43-13-70-6Z" fill="#fbfcf8" stroke="#ccd8c2" strokeWidth="1.4" />
      <path d="M77 14v66" stroke="#d6dfcf" /><path d="m22 27 38 2m-38 12 38 2m-38 12 29 2m47-28 41-2m-41 16 41-2m-41 16 30-2" stroke="#dde6d7" strokeWidth="3" strokeLinecap="round" />
      <path d="m122 7 12 1v27l-6-5-6 4Z" fill="#c9d7bd" />
    </g>}
    <path d="m183 20 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#d9e2d2" />
  </svg>;
}

function ViewButtons({ onNotice, value = 'card', onChange }: NoticeProps & { value?: 'card' | 'list'; onChange?: (value: 'card' | 'list') => void }) {
  return <div className="collection-view-buttons" aria-label="显示方式">
    <button type="button" className={value === 'card' ? 'selected' : ''} aria-label="卡片视图" aria-pressed={value === 'card'} onClick={() => onChange ? onChange('card') : onNotice('当前展示已观察到的卡片空态；视图切换效果尚未采集。')}><Icon name="grid" size={15} /></button>
    <button type="button" className={value === 'list' ? 'selected' : ''} aria-label="列表视图" aria-pressed={value === 'list'} onClick={() => onChange ? onChange('list') : onNotice('列表视图尚未采集；仍保留当前卡片空态。')}><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M7 5h10M7 10h10M7 15h10M3 5h1M3 10h1M3 15h1" /></svg></button>
  </div>;
}

function RefreshButton({ onNotice, label, disabled = false }: NoticeProps & { label: string; disabled?: boolean }) {
  return <button type="button" className="collection-icon-button" aria-label={`刷新${label}`} title="刷新" disabled={disabled} onClick={() => onNotice(`${label}刷新结果尚未采集，未请求服务。`)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6 7a7 7 0 0 1 12-1l2 6M4 12l2 6a7 7 0 0 0 12-1" /></svg></button>;
}

function RepoWikiSetup({ workspaceName, variant, onBack, onNavigate, onNotice }: NoticeProps & { workspaceName: string; variant: string; onBack: () => void; onNavigate: (id: string) => void }) {
  const cards = variant.startsWith('repo-wiki-knowledge-cards');
  const wide = variant === 'repo-wiki-knowledge-cards-wide';
  const pending = (label: string) => onNotice(`${label}的操作结果尚未采集；未更改配置或生成${cards ? '知识卡片' : ' Repo Wiki'}。`);
  return <section className={`knowledge-page repo-wiki-setup${wide ? ' repo-wiki-reading-wide' : ''}`} aria-label={cards ? '知识卡片配置' : 'Repo Wiki 配置'}>
    <header className="repo-wiki-setup-header"><div className="repo-wiki-breadcrumb"><button type="button" onClick={onBack}>Repo Wiki</button><span>/</span><h1>{workspaceName}</h1></div><div className="collection-header-actions"><button type="button" className="collection-feedback" onClick={() => onNotice('问题反馈入口尚未采集，未发送反馈。')}><Icon name="chat" size={14} />问题反馈</button><button type="button" className="collection-icon-button" aria-label={wide ? '打开侧边栏' : '隐藏侧边栏'} onClick={() => cards ? onNavigate(wide ? REPO_WIKI_CARDS : REPO_WIKI_CARDS_WIDE) : pending('隐藏侧边栏')}><Icon name="panel" size={16} /></button></div></header>
    <div className="repo-wiki-setup-body">
      <aside className="repo-wiki-directory" aria-label={cards ? '知识卡片目录' : 'Wiki 目录'}><div className="repo-wiki-directory-toolbar"><label className="repo-wiki-disabled-search"><Icon name="search" size={14} /><input aria-label={cards ? '搜索知识卡片' : '搜索 Wiki 页面'} placeholder={cards ? '搜索知识卡片' : '搜索 Wiki 页面'} disabled /></label><div className="repo-wiki-directory-tabs"><button type="button" className={!cards ? 'selected' : ''} aria-label="Repo Wiki 页面" aria-pressed={!cards} onClick={() => cards ? onNavigate(REPO_WIKI_SETUP) : pending('Repo Wiki 页面标签')}><Icon name="book" size={17} /></button><button type="button" className={cards ? 'selected' : ''} aria-label="知识卡片" aria-pressed={cards} onClick={() => { if (!cards) onNavigate(REPO_WIKI_CARDS); }}><Icon name="grid" size={17} /></button></div></div><div className="repo-wiki-directory-empty"><Icon name={cards ? 'grid' : 'book'} size={26} /><h2>{cards ? '还没有知识卡片' : '尚未生成 Repo Wiki'}</h2><p>{cards ? '在右侧完成配置并生成知识卡片' : '在右侧完成配置并生成 Repo Wiki'}</p></div></aside>
      {!wide && <div className="repo-wiki-configuration">{!cards && <p className="repo-wiki-hint">Repo Wiki（供你阅读）和知识卡片（供智能体使用）会基于当前代码库一同生成并持续更新</p>}<div className="repo-wiki-configuration-content"><div className="repo-wiki-configuration-icon"><Icon name={cards ? 'grid' : 'book'} size={33} /></div><h2>{cards ? '生成知识卡片' : '生成 Repo Wiki'}</h2><div className="repo-wiki-config-rows">
        <div className="repo-wiki-config-row"><span>语言</span><div className="repo-wiki-languages" aria-label="Repo Wiki 语言"><button type="button" aria-pressed="false" onClick={() => pending('语言切换')}>English</button><button type="button" className="selected" aria-pressed="true" onClick={() => pending('语言切换')}>简体中文</button></div></div>
        <div className="repo-wiki-config-row"><div><span>自动更新</span><p>增量更新基于提交差异比对实现，仅支持 Git 仓库</p></div><button type="button" role="switch" className="toggle" aria-label="自动更新" aria-checked="false" disabled><span /></button></div>
        <div className="repo-wiki-config-row"><div><span>自动导出</span><p>{cards ? '开启后，生成的知识卡片将自动导出到项目的 .qoder/repowiki/knowledge 目录' : '开启后，生成的 Repo Wiki 将自动导出到项目的 .qoder/repowiki 目录'}</p></div><button type="button" role="switch" className="toggle" aria-label="自动导出" aria-checked="false" onClick={() => pending('自动导出')}><span /></button></div>
        <div className="repo-wiki-config-row"><div><span>智能体引用</span><p>自动作为智能体上下文使用</p></div><button type="button" role="switch" className="toggle on" aria-label="智能体引用" aria-checked="true" onClick={() => pending('智能体引用')}><span /></button></div>
      </div><button type="button" className="primary-button repo-wiki-generate" onClick={() => pending(cards ? '生成知识卡片' : '生成 Repo Wiki')}><Icon name="bolt" size={14} />{cards ? '生成' : '生成 Repo Wiki'}</button></div></div>}
    </div>
  </section>;
}

export function KnowledgePage({ onNavigate, onNotice, initialCreate = false, initialVariant, workspaceName = 'paper-plane' }: KnowledgePageProps) {
  const variant = initialVariant ?? (initialCreate ? 'create' : 'empty');
  const createOpen = ['create', 'create-workspace', 'create-ready'].includes(variant);
  const isWiki = variant.startsWith('repo-wiki');
  const [search, setSearch] = useState('');
  const [wikiSearch, setWikiSearch] = useState(variant === 'repo-wiki-search-empty' ? WIKI_EMPTY_QUERY : '');
  const [workspaceFilter, setWorkspaceFilter] = useState('all');
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(variant === 'workspace-filter');
  const [knowledgeView, setKnowledgeView] = useState<'card' | 'list'>('card');
  const [wikiFilter, setWikiFilter] = useState<'all' | 'generated' | 'ungenerated'>(variant === 'repo-wiki-generated' ? 'generated' : 'all');
  const [wikiView, setWikiView] = useState<'card' | 'list'>(variant === 'repo-wiki-list' ? 'list' : 'card');
  const requestedWikiFilter = useRef<'all' | 'generated' | 'ungenerated' | null>(null);
  const [name, setName] = useState(variant === 'create-ready' ? 'sanbao-fixture-kb' : '');
  const [scope, setScope] = useState<'user' | 'workspace'>(variant === 'create-workspace' || variant === 'create-ready' ? 'workspace' : 'user');
  const [selectedWorkspace, setSelectedWorkspace] = useState(variant === 'create-ready');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [formNotice, setFormNotice] = useState('');
  const nameId = useId();
  const scopeId = useId();
  const workspaceRoot = useRef<HTMLDivElement>(null);
  const workspaceTrigger = useRef<HTMLButtonElement>(null);
  const workspaceMenu = useRef<HTMLDivElement>(null);
  const pickerRoot = useRef<HTMLDivElement>(null), pickerTrigger = useRef<HTMLButtonElement>(null), pickerItem = useRef<HTMLButtonElement>(null);
  const previousCreateVariant = useRef(variant), internalCreateVariant = useRef<string | null>(null);
  const previousWikiVariant = useRef(variant), internalWikiVariant = useRef<string | null>(null);
  const wasCreateOpen = useRef(createOpen);
  const createEnabled = !!name.trim() && (scope === 'user' || selectedWorkspace);
  const routeCreate = (nextScope: 'user' | 'workspace', nextName: string, nextSelected: boolean) => {
    const next = nextScope === 'user' ? 'create' : nextName.trim() && nextSelected ? 'create-ready' : 'create-workspace';
    if (next === variant) return;
    internalCreateVariant.current = next;
    onNavigate(next === 'create' ? KNOWLEDGE_CREATE : next === 'create-ready' ? KNOWLEDGE_CREATE_READY : KNOWLEDGE_CREATE_WORKSPACE);
  };
  useEffect(() => {
    if (previousCreateVariant.current === variant) return;
    previousCreateVariant.current = variant;
    if (internalCreateVariant.current === variant) { internalCreateVariant.current = null; return; }
    internalCreateVariant.current = null;
    if (!createOpen) return;
    setName(variant === 'create-ready' ? 'sanbao-fixture-kb' : '');
    setScope(variant === 'create' ? 'user' : 'workspace');
    setSelectedWorkspace(variant === 'create-ready'); setPickerOpen(false); setFormNotice('');
  }, [variant]);
  useEffect(() => {
    if (createOpen) { wasCreateOpen.current = true; return; }
    setName(''); setScope('user'); setSelectedWorkspace(false); setPickerOpen(false); setFormNotice('');
    if (!wasCreateOpen.current) return;
    wasCreateOpen.current = false;
    const frame = requestAnimationFrame(() => {
      if (!document.querySelector('.modal[role="dialog"]')) document.getElementById(CREATE_TRIGGER_ID)?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [createOpen]);
  useEffect(() => {
    if (!pickerOpen) return;
    const frame = requestAnimationFrame(() => {
      const modal = pickerTrigger.current?.closest('.modal[role="dialog"]');
      if (Array.from(document.querySelectorAll('.modal[role="dialog"]')).at(-1) === modal && !pickerRoot.current?.querySelector('[role="menu"]')?.contains(document.activeElement)) pickerItem.current?.focus();
    });
    const outside = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || pickerRoot.current?.contains(event.target)) return;
      if (event.target.closest('.modal[role="dialog"]') === pickerTrigger.current?.closest('.modal[role="dialog"]')) setPickerOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointerdown', outside); };
  }, [pickerOpen]);
  const closePicker = () => { setPickerOpen(false); pickerTrigger.current?.focus({ preventScroll: true }); };
  const changeScope = (next: 'user' | 'workspace') => {
    // Cross-scope retention is a local form rule; it is not a native persistence claim.
    setScope(next); setPickerOpen(false);
    setFormNotice('范围与已选工作区仅保留在当前本地表单，未关联工作区。');
    routeCreate(next, name, selectedWorkspace);
  };
  const pickerKeys = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closePicker(); }
    else if (event.key === 'Tab') { closePicker(); }
    else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) { event.preventDefault(); pickerItem.current?.focus(); }
  };
  useEffect(() => {
    setWorkspaceMenuOpen(variant === 'workspace-filter');
    if (internalWikiVariant.current !== variant) {
      if (variant === 'repo-wiki-search-empty') setWikiSearch(WIKI_EMPTY_QUERY);
      else if (previousWikiVariant.current === 'repo-wiki-search-empty' && variant === 'repo-wiki') setWikiSearch('');
    }
    previousWikiVariant.current = variant; internalWikiVariant.current = null;
    if (variant.startsWith('repo-wiki') && variant !== 'repo-wiki-setup') {
      setWikiFilter(requestedWikiFilter.current ?? (variant === 'repo-wiki-generated' ? 'generated' : 'all'));
      requestedWikiFilter.current = null;
      setWikiView(variant === 'repo-wiki-list' ? 'list' : 'card');
    }
  }, [variant]);
  useEffect(() => {
    if (!workspaceMenuOpen) return;
    const frame = requestAnimationFrame(() => {
      if (!document.querySelector('.modal[role="dialog"]') && !workspaceMenu.current?.contains(document.activeElement)) workspaceMenu.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
    });
    const outside = (event: PointerEvent) => {
      if (!workspaceRoot.current?.contains(event.target as Node)) setWorkspaceMenuOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointerdown', outside); };
  }, [workspaceMenuOpen]);
  const closeWorkspaceMenu = () => { setWorkspaceMenuOpen(false); workspaceTrigger.current?.focus(); };
  const workspaceKeys = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeWorkspaceMenu(); return; }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const items = Array.from(workspaceMenu.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
    if (!items.length) return;
    event.preventDefault();
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    items[event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : event.key === 'ArrowDown' ? (index + 1) % items.length : (index - 1 + items.length) % items.length].focus();
  };
  const showWiki = (next: string) => { setWorkspaceMenuOpen(false); onNavigate(next); };
  const updateWikiSearch = (value: string) => {
    setWikiSearch(value);
    if (wikiFilter !== 'all' || wikiView !== 'card') {
      if (value) onNotice('该搜索草稿与当前筛选视图的组合尚未采集；保留当前视图。');
      return;
    }
    if (variant !== 'repo-wiki' && variant !== 'repo-wiki-search-empty') return;
    const nextVariant = value === WIKI_EMPTY_QUERY ? 'repo-wiki-search-empty' : 'repo-wiki';
    if (variant === nextVariant) return;
    internalWikiVariant.current = nextVariant;
    showWiki(nextVariant === 'repo-wiki-search-empty' ? REPO_WIKI_SEARCH : REPO_WIKI);
  };
  const resetWiki = () => { setWikiFilter('all'); setWikiView('card'); showWiki(REPO_WIKI); };
  const filterWiki = (filter: 'all' | 'generated' | 'ungenerated') => {
    if (wikiSearch) { onNotice('该搜索草稿与生成状态的组合尚未采集；保留当前视图。'); return; }
    if (filter === 'ungenerated' && wikiView === 'list') { onNotice('未生成筛选的列表视图尚未采集；保留当前视图。'); return; }
    // Returning to all uses the known card baseline; cross-filter retention is not asserted.
    setWikiFilter(filter); setWikiView('card');
    if (filter === 'generated') showWiki(REPO_WIKI_GENERATED);
    else if (variant !== 'repo-wiki') { requestedWikiFilter.current = filter; showWiki(REPO_WIKI); }
  };
  const changeWikiView = (view: 'card' | 'list') => {
    if (wikiSearch || wikiFilter === 'ungenerated' && view === 'list') { onNotice('该筛选下的视图切换尚未采集；保留当前视图。'); return; }
    if (wikiFilter === 'generated' || wikiFilter === 'ungenerated') { setWikiView(view); return; }
    showWiki(view === 'list' ? REPO_WIKI_LIST : REPO_WIKI);
  };
  const closeCreate = () => onNavigate(KNOWLEDGE_EMPTY);
  if (variant === 'repo-wiki-setup' || variant.startsWith('repo-wiki-knowledge-cards')) return <RepoWikiSetup workspaceName={workspaceName} variant={variant} onBack={resetWiki} onNavigate={onNavigate} onNotice={onNotice} />;
  return <section className="knowledge-page" aria-label="知识中心">
    <header className="collection-header">
      <nav className="collection-tabs" aria-label="知识中心分类"><button type="button" className={!isWiki ? 'selected' : ''} aria-current={!isWiki ? 'page' : undefined} onClick={() => onNavigate(KNOWLEDGE_EMPTY)}>知识库</button><button type="button" className={isWiki ? 'selected' : ''} aria-current={isWiki ? 'page' : undefined} onClick={resetWiki}>Repo Wiki</button></nav>
      <div className="collection-header-actions"><button type="button" className="collection-feedback" onClick={() => onNotice('问题反馈入口尚未采集，未发送反馈。')}><Icon name="chat" size={14} />问题反馈</button><RefreshButton label={isWiki ? 'Repo Wiki' : '知识库'} onNotice={onNotice} /><form className="collection-search" role="search" onSubmit={event => { event.preventDefault(); if (!(isWiki && variant === 'repo-wiki-search-empty' && wikiSearch === WIKI_EMPTY_QUERY)) onNotice('搜索结果尚未采集；仅保留本地搜索草稿。'); }}><Icon name="search" size={14} /><input aria-label={isWiki ? '搜索 Repo Wiki 项目' : '搜索知识库'} placeholder={isWiki ? '搜索 Repo Wiki 项目' : '搜索知识库'} value={isWiki ? wikiSearch : search} onChange={event => isWiki ? updateWikiSearch(event.target.value) : setSearch(event.target.value)} /></form></div>
    </header>
    <div className="collection-content">
      <div className="collection-banner"><h1>{isWiki ? <>将代码转化为 Repo Wiki<br /><span>涵盖技术栈与架构</span></> : <>构建 AI-Native 知识库<br /><span>AI 智能体随时调用</span></>}</h1><CollectionArt /></div>
      {isWiki ? <>
        <div className="collection-toolbar"><nav className="repo-wiki-status-tabs" aria-label="Repo Wiki 生成状态"><button type="button" className={wikiFilter === 'all' ? 'selected' : ''} aria-pressed={wikiFilter === 'all'} onClick={() => filterWiki('all')}>全部</button><button type="button" className={wikiFilter === 'generated' ? 'selected' : ''} aria-pressed={wikiFilter === 'generated'} onClick={() => filterWiki('generated')}>已生成</button><button type="button" className={wikiFilter === 'ungenerated' ? 'selected' : ''} aria-pressed={wikiFilter === 'ungenerated'} onClick={() => filterWiki('ungenerated')}>未生成</button></nav><ViewButtons value={wikiView} onChange={changeWikiView} onNotice={onNotice} /></div>
        {wikiFilter === 'generated' || variant === 'repo-wiki-search-empty' && wikiSearch === WIKI_EMPTY_QUERY ? <div className="knowledge-empty repo-wiki-empty"><div className="knowledge-empty-icon"><Icon name="book" size={30} /></div><h2>没有匹配的 Repo Wiki 项目</h2><p>尝试调整搜索词或生成状态。</p></div> : <article className={`repo-wiki-project ${wikiView}`} aria-label={`${workspaceName} Repo Wiki 项目`}><div className="repo-wiki-project-title"><Icon name="folder" size={20} /><a href={`?state=${REPO_WIKI_SETUP}`} onClick={event => { event.preventDefault(); showWiki(REPO_WIKI_SETUP); }}>{workspaceName}</a></div><div className="repo-wiki-project-stats"><span aria-label="项目指标一 0"><Icon name="book" size={14} />0</span><span aria-label="项目指标二 0"><Icon name="grid" size={14} />0</span></div><span className="repo-wiki-status">未生成</span><button type="button" className="repo-wiki-project-generate" onClick={() => onNotice('“去生成”按钮路径尚未采集；请使用项目名称进入已观察的配置页，未执行生成。')}>去生成<Icon name="chevron" size={12} /></button></article>}
      </> : <>
        <div className="collection-toolbar"><div className="collection-workspace-root" ref={workspaceRoot}><button type="button" id="knowledge-workspace-trigger" className="collection-workspace-filter" ref={workspaceTrigger} aria-haspopup="menu" aria-expanded={workspaceMenuOpen} onClick={() => { if (workspaceMenuOpen) closeWorkspaceMenu(); else { setWorkspaceMenuOpen(true); if (variant !== 'workspace-filter') onNavigate(KNOWLEDGE_WORKSPACE); } }}>{workspaceFilter === 'all' ? '全部工作区' : workspaceName}<Icon name="down" size={12} /></button>{workspaceMenuOpen && <div className="collection-workspace-menu" ref={workspaceMenu} data-focus-return="knowledge-workspace-trigger" role="menu" aria-label="知识库工作区筛选" onKeyDown={workspaceKeys} onBlur={event => { if (!workspaceRoot.current?.contains(event.relatedTarget)) setWorkspaceMenuOpen(false); }}>{[{ value: 'all', label: '全部工作区' }, { value: 'workspace', label: workspaceName }].map(option => <button type="button" role="menuitemradio" aria-checked={workspaceFilter === option.value} key={option.value} onClick={() => { setWorkspaceFilter(option.value); closeWorkspaceMenu(); }}><span>{option.label}</span>{workspaceFilter === option.value && <Icon name="check" size={13} />}</button>)}</div>}</div><ViewButtons value={knowledgeView} onChange={setKnowledgeView} onNotice={onNotice} /></div>
        <div className="knowledge-empty"><div className="knowledge-empty-icon"><Icon name="book" size={30} /></div><h2>还没有知识库</h2><p>创建知识库，集中整理文件和 Repo Wiki 内容，供 AI 检索和使用</p><button id={CREATE_TRIGGER_ID} type="button" className="primary-button" onClick={() => onNavigate(KNOWLEDGE_CREATE)}><Icon name="plus" size={14} />创建知识库</button></div>
      </>}
      {(isWiki ? wikiSearch : search) && <p className="collection-local-note" role="status">{isWiki && variant === 'repo-wiki-search-empty' ? '专用查询快照；未请求 Repo Wiki 服务。' : '本地搜索草稿；实际搜索结果尚未采集。'}</p>}
    </div>
    {createOpen && <Modal title="创建知识库" className="knowledge-create-modal" onClose={closeCreate}>
      <form onSubmit={event => { event.preventDefault(); if (!createEnabled) return; setFormNotice('创建结果未采集，未写入服务'); }}>
        <div className="knowledge-create-body">
          <div className="knowledge-name-label"><label htmlFor={nameId}>名称</label><span aria-live="polite">{name.length}/50</span></div>
          <input id={nameId} className="knowledge-name-input" placeholder="例如：工程手册" value={name} maxLength={50} onChange={event => { setName(event.target.value); setFormNotice(''); routeCreate(scope, event.target.value, selectedWorkspace); }} autoComplete="off" />
          <fieldset className="knowledge-scope-fieldset"><legend>生效范围</legend><div className="knowledge-scope-options"><label><input type="radio" name={scopeId} value="user" checked={scope === 'user'} onChange={() => changeScope('user')} />用户</label><label><input type="radio" name={scopeId} value="workspace" checked={scope === 'workspace'} onChange={() => changeScope('workspace')} />工作区</label></div></fieldset>
          {scope === 'workspace' && <div className="knowledge-workspace-picker" ref={pickerRoot} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPickerOpen(false); }}>
            <label htmlFor="knowledge-form-workspace-trigger">选择工作区</label>
            <button ref={pickerTrigger} id="knowledge-form-workspace-trigger" type="button" aria-label="选择工作区" aria-haspopup="menu" aria-expanded={pickerOpen} className="knowledge-workspace-select" onClick={() => pickerOpen ? closePicker() : setPickerOpen(true)} onKeyDown={event => { if (!event.nativeEvent.isComposing && ['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); setPickerOpen(true); } }}><span className={selectedWorkspace ? 'knowledge-workspace-chip' : 'knowledge-workspace-placeholder'}>{selectedWorkspace ? workspaceName : '选择工作区'}</span><Icon name="down" size={12} /></button>
            {pickerOpen && <div className="knowledge-form-workspaces" role="menu" aria-label="可用工作区" data-focus-return="knowledge-form-workspace-trigger" onKeyDown={pickerKeys}><button ref={pickerItem} type="button" role="menuitemcheckbox" aria-checked={selectedWorkspace} onClick={() => { const next = !selectedWorkspace; setSelectedWorkspace(next); setFormNotice(''); routeCreate(scope, name, next); }}><span className={`knowledge-picker-check ${selectedWorkspace ? 'checked' : ''}`}>{selectedWorkspace && <Icon name="check" size={10} />}</span>{workspaceName}</button><p>虚构工作区 · 原生菜单仅 AX 取证</p></div>}
          </div>}
          <p className="knowledge-scope-description">{scope === 'user' ? '当前用户的所有现有及未来工作区均可使用此知识库' : '至少选择一个可以使用此知识库的工作区。'}</p>
          {formNotice && <p className="knowledge-form-notice" role="status">{formNotice}</p>}
        </div>
        <footer className="knowledge-create-footer"><button type="button" className="secondary-button" onClick={closeCreate}>取消</button><button type="submit" className="primary-button" disabled={!createEnabled}>创建知识库</button></footer>
      </form>
    </Modal>}
  </section>;
}

function SitesEmptyArt() {
  return <svg className="sites-empty-art" viewBox="0 0 170 138" role="img" aria-label="站点空态原创占位插图">
    <ellipse cx="87" cy="121" rx="55" ry="7" fill="#e4e9df" opacity=".6" />
    <g transform="rotate(-9 85 65)"><path d="M47 12h83v92h-5l-5 5-5-5-5 5-5-5-5 5-5-5-5 5-5-5-5 5-5-5-5 5-5-5-5 5-5-5h-8Z" fill="#f9faf5" stroke="#d2dbc9" /><path d="M59 27h59M59 87h42" stroke="#d9e1d1" strokeWidth="3" strokeLinecap="round" /><rect x="60" y="40" width="55" height="35" rx="4" fill="#e7eddf" /><path d="m69 65 11-12 8 7 10-14 9 19" fill="none" stroke="#a9bd97" strokeWidth="2" strokeLinejoin="round" /><circle cx="101" cy="50" r="3" fill="#c2d1b3" /></g>
    <path d="m33 59 3 9 9 3-9 3-3 9-3-9-9-3 9-3Zm110-37 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#cfdbc5" />
  </svg>;
}

export function SitesPage({ onNotice, initialVariant = 'empty', onNavigate }: NoticeProps & { initialVariant?: string; onNavigate?: (id: string) => void }) {
  const shared = initialVariant === 'shared';
  const [view, setView] = useState<'card' | 'list'>('card');
  const [loading, setLoading] = useState(initialVariant === 'loading');
  useEffect(() => {
    setLoading(initialVariant === 'loading');
    if (initialVariant !== 'loading') return;
    // Local fixture duration only. Do not navigate when it ends: a search overlay may be open.
    const timer = window.setTimeout(() => setLoading(false), 1400);
    return () => window.clearTimeout(timer);
  }, [initialVariant]);
  const navigate = (id: string) => onNavigate ? onNavigate(id) : onNotice('站点场景导航尚未接入。');
  return <section className="sites-page" aria-label="站点">
    <header className="collection-header sites-header"><div className="collection-header-actions"><RefreshButton label="站点" onNotice={onNotice} disabled={loading} /><button type="button" className="collection-add-site" disabled={loading} onClick={() => navigate('QDR.O02.sites.templates.open')}><Icon name="plus" size={14} />添加站点</button></div></header>
    <div className="collection-content">
      <div className="collection-banner"><h1>探索 Sites<br /><span>让你的想法，成为真实的网站</span></h1><CollectionArt site /></div>
      <div className="collection-toolbar"><nav className="collection-tabs" aria-label="站点分类"><button type="button" className={!shared ? 'selected' : ''} aria-current={!shared ? 'page' : undefined} onClick={() => navigate(shared ? SITES_LOADING : SITES_EMPTY)}>我的站点</button><button type="button" className={shared ? 'selected' : ''} aria-current={shared ? 'page' : undefined} onClick={() => navigate(SITES_SHARED)}>共享给我的</button></nav><ViewButtons value={view} onChange={next => { if (shared || loading) onNotice('该站点状态的视图切换尚未采集；保留当前视图。'); else setView(next); }} onNotice={onNotice} /></div>
      {loading ? <div className="sites-loading" role="status" aria-label="加载中…"><div className="sites-skeleton-grid" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <div className="sites-skeleton-card" key={index}><div /><span /><span /></div>)}</div><p className="collection-local-note">本地计时演示，未请求站点服务；计时结束后恢复我的站点空态。</p></div> : <div className="sites-empty"><SitesEmptyArt /><span className="sites-art-label">原创示意插图</span>{shared ? <p className="sites-shared-empty">暂时没有分享给你的站点。</p> : <><h2>还没有站点</h2><p>在本地工作区让 Agent 生成网站，再确认发布。</p></>}</div>}
    </div>
  </section>;
}
