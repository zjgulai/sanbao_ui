import React, { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from '../components/Controls';
import { CustomMcpDialog } from './CustomMcpDialog';

type ExtensionKind = 'plugins' | 'skills' | 'connectors' | 'agents';
type PageActions = { onNavigate: (id: string) => void; onNotice: (message: string) => void };
const TYPES: { kind: ExtensionKind; label: string }[] = [{ kind: 'plugins', label: '插件' }, { kind: 'skills', label: '技能' }, { kind: 'connectors', label: '连接器' }, { kind: 'agents', label: '智能体' }];
const installedId = (kind: ExtensionKind, add = false) => `QDR.P04.installed.${kind}.${add ? 'add.open' : 'empty'}`;
const marketId = (kind: 'plugins' | 'skills' | 'connectors') => `QDR.P04.market.${kind}.default`;
const PPT_DETAIL = 'QDR.P04.market.plugins.ppt.detail';
const ADD_TRIGGER = 'installed-extension-add-trigger';
const isAddVariant = (variant: string) => variant === 'extensions-plugin-add' || variant === 'extensions-skill-add';
const kindFromVariant = (variant: string): ExtensionKind => variant.includes('skill') ? 'skills' : variant.includes('connector') ? 'connectors' : variant.includes('agent') ? 'agents' : 'plugins';

function RefreshIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6 7a7 7 0 0 1 12-1l2 6M4 12l2 6a7 7 0 0 0 12-1" /></svg>;
}

export function InstalledExtensionsPage({ initialVariant = 'extensions-plugins', onNavigate, onNotice }: PageActions & { initialVariant?: string }) {
  const kind = kindFromVariant(initialVariant), noun = kind === 'skills' ? 'Skill' : 'Plugin';
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(isAddVariant(initialVariant));
  const addRoot = useRef<HTMLDivElement>(null), menu = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false), openRef = useRef(menuOpen), openingIndex = useRef(0);
  const mcpOpen = initialVariant.startsWith('extensions-connectors-mcp-');
  const mcpReturnFocus = useRef(false);
  openRef.current = menuOpen;
  const menuId = useId();
  const pending = (action: string) => onNotice(`“${action}”的操作结果尚未采集；未创建、上传、安装扩展或请求服务。`);
  useEffect(() => { setMenuOpen(isAddVariant(initialVariant)); }, [initialVariant]);
  useEffect(() => {
    if (mcpOpen || !mcpReturnFocus.current) return;
    mcpReturnFocus.current = false;
    const frame = requestAnimationFrame(() => {
      if (!document.querySelector('.modal[role="dialog"]') && (!document.activeElement || document.activeElement === document.body)) trigger.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [mcpOpen]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (document.querySelector('.modal[role="dialog"]')) return;
      if (menuOpen && !menu.current?.contains(document.activeElement)) menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')[openingIndex.current]?.focus();
      if (!menuOpen && returnFocus.current) { returnFocus.current = false; trigger.current?.focus({ preventScroll: true }); }
    });
    return () => cancelAnimationFrame(frame);
  }, [menuOpen]);
  const closeMenu = (restore = false) => {
    if (!openRef.current) return;
    openRef.current = false;
    returnFocus.current = restore;
    setMenuOpen(false);
    onNavigate(installedId(kind));
  };
  useEffect(() => {
    if (!menuOpen) return;
    const outside = (event: PointerEvent) => {
      if (document.querySelector('.modal[role="dialog"]') || addRoot.current?.contains(event.target as Node)) return;
      // Review controls operate on the current scene; they must not change its URL first.
      if (event.target instanceof Element && !event.target.closest('.product-window')) return;
      // Other navigation controls already choose their destination on click.
      if ((event.target as Element).closest('[data-extension-navigation]')) return;
      closeMenu();
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [menuOpen, kind, onNavigate]);
  const openMenu = (index = 0) => {
    if (openRef.current) { menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')[index]?.focus(); return; }
    openingIndex.current = index; openRef.current = true; returnFocus.current = false;
    setMenuOpen(true); onNavigate(installedId(kind, true));
  };
  const menuKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeMenu(true); return; }
    if (event.key === 'Tab') { trigger.current?.focus(); closeMenu(); return; }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const items = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    items[event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : event.key === 'ArrowDown' ? (index + 1) % items.length : (index - 1 + items.length) % items.length]?.focus();
  };
  const openMarket = () => kind === 'plugins' || kind === 'skills' ? onNavigate(marketId(kind)) : pending(`${TYPES.find(type => type.kind === kind)?.label}市场`);
  return <section className="installed-extensions" aria-label="扩展管理">
    <button type="button" className="extensions-refresh" aria-label="刷新已安装扩展" title="刷新" onClick={() => pending('刷新已安装扩展')}><RefreshIcon /></button>
    <div className="installed-extensions-content">
      <header className="installed-extensions-heading"><div><h1 id="settings-extensions-heading" tabIndex={-1}>扩展管理</h1><p>管理本机已安装的插件、技能、连接器和智能体。</p></div><button type="button" className="extensions-secondary" data-extension-navigation onClick={openMarket}><Icon name="grid" size={13} />市场</button></header>
      <div className="installed-extensions-toolbar">
        <nav className="extensions-type-tabs" aria-label="已安装扩展类型">{TYPES.map(type => <button type="button" key={type.kind} data-extension-navigation aria-label={`${type.label}，0 项`} aria-current={kind === type.kind ? 'page' : undefined} className={kind === type.kind ? 'selected' : ''} onClick={() => { if (kind !== type.kind || menuOpen) onNavigate(installedId(type.kind)); }}>{type.label}<span aria-hidden="true">0</span></button>)}</nav>
        <div className="installed-extensions-tools"><form className="extensions-search" role="search" onSubmit={event => { event.preventDefault(); onNotice('已安装项搜索结果尚未采集；仅保留本地搜索草稿。'); }}><Icon name="search" size={13} /><input aria-label="搜索已安装项" placeholder="搜索已安装项" value={query} onChange={event => setQuery(event.target.value)} /></form>
          {kind !== 'agents' && <div className="extensions-add-root" ref={addRoot} onBlur={event => { if (event.relatedTarget instanceof Element && (!event.relatedTarget.closest('.product-window') || event.relatedTarget.closest('[data-extension-navigation]'))) return; if (menuOpen && !addRoot.current?.contains(event.relatedTarget) && !document.querySelector('.modal[role="dialog"]')) closeMenu(); }}>
            <button id={ADD_TRIGGER} ref={trigger} type="button" className="extensions-secondary" aria-label={`添加${TYPES.find(type => type.kind === kind)?.label}`} aria-haspopup={kind === 'connectors' ? undefined : 'menu'} aria-expanded={kind === 'connectors' ? undefined : menuOpen} aria-controls={menuOpen ? menuId : undefined} onClick={() => kind === 'connectors' ? onNavigate('QDR.O08.mcp.form.empty') : menuOpen ? closeMenu(true) : openMenu()} onKeyDown={event => { if (!event.nativeEvent.isComposing && kind !== 'connectors' && ['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); openMenu(event.key === 'ArrowUp' ? 1 : 0); } }}><Icon name="plus" size={13} />添加</button>
            {menuOpen && <div id={menuId} ref={menu} className="extensions-add-menu" role="menu" aria-label={`添加${noun}`} data-focus-return={ADD_TRIGGER} onKeyDown={menuKeys}>
              <button type="button" role="menuitem" aria-label="通过 Qoder 创建" onClick={() => pending(`通过 Qoder 创建 ${noun}`)}><Icon name="bolt" size={17} /><span><strong>通过 Qoder 创建</strong><small>在新任务中创建个性化 {noun}，并保存在本地使用。</small></span></button>
              <button type="button" role="menuitem" aria-label={`上传 ${noun}`} onClick={() => pending(`上传 ${noun}`)}><Icon name="folder" size={17} /><span><strong>上传 {noun}</strong><small>{kind === 'skills' ? '导入 ZIP 或 SKILL.md，仅安装到本机。' : '导入 Plugin ZIP，仅安装到本机。'}</small></span></button>
            </div>}
          </div>}
        </div>
      </div>
      <section className="installed-extensions-section" aria-labelledby="installed-extension-list-heading"><h2 id="installed-extension-list-heading">{kind === 'agents' ? '已安装的智能体' : '已安装项'}</h2><div className="installed-extensions-empty"><span className="installed-extensions-empty-icon"><Icon name={kind === 'agents' ? 'chat' : 'grid'} size={27} /></span><h3>{kind === 'agents' ? '暂无已安装的智能体' : '暂无已安装扩展'}</h3><p>{kind === 'agents' ? '用户级配置和已启用插件提供的智能体会显示在这里。' : '从市场安装或本地上传的扩展会显示在这里。'}</p></div></section>
      {query && <p className="extensions-local-note" role="status">搜索结果尚未采集；仅保留本地草稿，不改变已观察的空态。</p>}
    </div>
    {mcpOpen && <CustomMcpDialog initialVariant={initialVariant} onNavigate={onNavigate} onNotice={onNotice} onClose={() => { mcpReturnFocus.current = true; onNavigate(installedId('connectors')); }} />}
  </section>;
}

const SKILLS = [
  ['深入研究', '围绕研究主题梳理资料与结论。'], ['技术图表生成', '将技术思路整理为图表。'], ['智能小Q-数据分析', '分析数据并组织可读报告。'], ['前端设计', '构思界面布局与前端呈现。'],
  ['内容研究撰写', '整理内容主题与写作材料。'], ['市场研究报告', '规划市场调研与报告结构。'], ['Notion 信息图', '组织笔记与信息图内容。'], ['图像增强器', '图像优化相关的创作辅助。'],
  ['周报撰写', '整理每周进展与计划。'], ['创建计划', '将目标拆解为工作计划。'], ['宝玉文章插图', '为文章构思配图与视觉表达。'], ['Cloudflare 部署', 'Cloudflare 部署相关工作指引。'],
  ['响应式设计', '规划不同屏幕的界面布局。'], ['主题工厂', '组织配色与视觉主题。'], ['Manim 视频编排', '编排数学动画与视频内容。'], ['渲染部署', '应用构建与部署工作指引。'],
  ['Vercel 部署', 'Vercel 部署相关工作指引。'], ['Netlify 部署', 'Netlify 部署相关工作指引。'], ['通义 PPT', '组织演示文稿与展示内容。'], ['MaxCompute SQL 智能生成与编写', 'MaxCompute SQL 编写辅助。'],
  ['图像 OCR', '图像文字处理相关指引。'], ['综合的全栈开发', '组织全栈开发工作。'], ['UI 设计师技能', '界面设计与细节整理。'], ['钉钉 dws 技能', '钉钉工作内容相关指引。'],
];
const PLUGINS = [
  ['PPT', '演示文稿与汇报内容。'], ['Superpowers', '开发工作流相关辅助。'], ['Context7', '技术文档与上下文相关指引。'], ['Qoder Cloud Agents', '云端智能体工作相关入口。'],
  ['Chrome DevTools', '浏览器开发工具相关指引。'], ['Design Review', '设计评审与界面检查。'], ['架构可视化', '以图形整理系统架构。'], ['产品设计', '梳理产品需求与体验。'],
  ['UI/UX Pro Max Skill', '界面与用户体验设计指引。'], ['redis-development', 'Redis 开发相关工作。'], ['Postman', '接口工作与协作指引。'], ['产品管理', '产品规划与需求组织。'],
  ['Frontend Design', '前端页面与交互设计。'], ['Code Simplifier', '代码阅读与简化指引。'], ['钉钉', '钉钉协作相关入口。'], ['Playwright', '浏览器自动化相关指引。'],
  ['Vercel', 'Vercel 项目相关工作。'], ['MongoDB', 'MongoDB 数据工作指引。'], ['Apollo GraphQL', 'GraphQL 接口相关工作。'], ['AlibabaCloud Core', '阿里云相关工作指引。'],
  ['DuckDB', '分析查询相关工作。'], ['秒悟', '知识与内容工作入口。'], ['Netlify', 'Netlify 项目相关工作。'], ['Atlassian', '团队协作相关工作指引。'],
];
const COMMON_CATEGORIES = ['全部', '精选', '办公效率', '内容创作'];
const TAIL_CATEGORIES = ['代码开发', '代码评审', '安全与测试', '数据库与分析', '运维部署', '开发者工具', '设计', '产品管理', '知识研究', '工作流'];
const ICONS = ['book', 'grid', 'globe', 'code', 'file', 'monitor'];

function MarketArtwork() {
  return <svg viewBox="0 0 196 100" role="img" aria-label="原创市场装饰示意"><ellipse cx="113" cy="85" rx="65" ry="7" fill="#dce4d1" opacity=".4" /><g transform="translate(46 10) rotate(-8 56 34)"><rect x="17" y="13" width="111" height="68" rx="8" fill="#ecf1e4" stroke="#d5dec9" /><rect width="111" height="68" rx="8" fill="#fbfcf8" stroke="#d8e1cd" /><rect x="12" y="12" width="27" height="27" rx="7" fill="#d9e5c9" /><path d="M20 26h11m-5-5v10M49 18h43M49 28h31M13 51h76" stroke="#c3d3b0" strokeWidth="3" strokeLinecap="round" /></g><path d="m23 32 3 8 8 3-8 3-3 8-3-8-8-3 8-3Zm148-19 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#cadbb9" /></svg>;
}

const FEATURED_SKILLS = ['创建计划', '代码分析', '前端开发专家', '调试助手', '项目开发', '任务代码审查', '测试用例生成器', '后端开发', 'Qoder Cloud Agents', '夸克网盘官方 Skill'].map(name => [name, `围绕${name}整理任务与工作内容。`]);
const LATEST_SKILLS = ['夸克｜图片转 Excel', '夸克｜图文解析识别', 'DB操作', 'SKILL 审查', 'Git 合并', 'AGENTS.MD 生成器', 'Redis操作', 'MQ操作', 'SKILL创建', 'GitLab操作', '灵魂拷问', 'BUG诊断', 'BUG修复', '技能派', '数据库迁移', '夸克扫描王-OCR文字识别/文件扫描/转Office', '夸克｜证件照生成', 'A股情报调查员', '千问工单支持', '网站拨测', '网站挂马分析', 'Web日志安全分析', 'TLS/SSL证书诊断', 'Wireshark 抓包深度分析'].map(name => [name, `围绕${name}组织资料与操作指引。`]);
const CONNECTORS = [
  ['今日投资金融数据', '金融市场、上市公司与投资研究数据。'], ['GitHub', '通过 MCP 获取仓库、Issue、Pull Request 与研发上下文。'], ['PolarDB', '数据库查询、事务与结构检查。'], ['云效 DevOps', '仓库、工作项、流水线与交付管理。'],
  ['Qoder Cloud Agents', '云端智能体、会话与运行环境。'], ['微软 Excel', '云端工作簿查看与编辑。'], ['Context7', '检索匹配版本的技术文档与示例。'], ['Notion', '文档、知识库与协作空间。'],
  ['Postman', 'API 集合、环境与规范管理。'], ['Hugging Face', '模型、数据集、Spaces 与论文检索。'], ['GitLab', '项目、Issue 与合并请求上下文。'], ['Supabase', '项目、数据库和应用开发资源。'],
  ['Todoist', '任务与项目管理。'], ['Linear', '研发工作项、项目与交付跟踪。'], ['HeyGen', '数字人、配音与视频创作。'], ['Cloudflare', '官方文档与已授权的资源操作。'],
  ['Grafana', '指标、日志与仪表盘分析。'], ['北大法宝·法律智能检索', '法律法规、案例与专业资料检索。'], ['Neon', '数据库、开发分支与项目管理。'], ['微软Outlook邮箱', '邮件、日历与联系人管理。'],
  ['Atlassian', 'Jira、Confluence 与团队协作。'], ['华宇元典法律数据', '法律法规、案例与企业信息。'], ['Sourcegraph', '跨仓库代码、提交与差异检索。'], ['Netlify', '项目、部署与站点维护。'],
];
const EMPTY_SEARCH = 'sanbao-fixture-no-match-20260921';
const queryForVariant = (variant: string) => variant === 'skills-search-match' ? '深入研究' : variant === 'skills-search-empty' ? EMPTY_SEARCH : '';

export function ExtensionMarketPage({ initialVariant, onNavigate, onNotice }: PageActions & { initialVariant: string }) {
  const kind = initialVariant.startsWith('skills') ? 'skills' : initialVariant === 'connectors' ? 'connectors' : 'plugins';
  const isSkill = kind === 'skills', isConnector = kind === 'connectors', noun = isSkill ? '技能' : isConnector ? '连接器' : '插件';
  const [search, setSearch] = useState(() => ({ variant: initialVariant, query: queryForVariant(initialVariant) }));
  // Reset together with the route render so a new list never displays the previous list's draft.
  if (search.variant !== initialVariant) setSearch({ variant: initialVariant, query: queryForVariant(initialVariant) });
  const query = search.variant === initialVariant ? search.query : queryForVariant(initialVariant);
  const setQuery = (value: string) => setSearch({ variant: initialVariant, query: value });
  const input = useRef<HTMLInputElement>(null);
  const featured = initialVariant === 'skills-featured', latest = initialVariant === 'skills-latest';
  const pending = (action: string) => onNotice(`“${action}”的结果尚未采集；保持本次市场快照，未打开详情、安装扩展或请求服务。`);
  const categories = [...COMMON_CATEGORIES, ...(isSkill || isConnector ? ['市场营销', '金融财务', '法律'] : []), ...TAIL_CATEGORIES.filter(category => !isConnector || category !== '代码评审'), ...(isSkill ? ['Agent 自进化', '其他'] : isConnector ? ['通讯'] : [])];
  const items = isConnector ? CONNECTORS : !isSkill ? PLUGINS : featured ? FEATURED_SKILLS : latest ? LATEST_SKILLS : initialVariant === 'skills-search-match' ? SKILLS.slice(0, 1) : initialVariant === 'skills-search-empty' ? [] : SKILLS;
  const unknownQuery = query !== queryForVariant(initialVariant);
  const canSearch = isSkill && !featured && !latest;
  const updateQuery = (value: string) => {
    setQuery(value);
    if (!canSearch) return;
    const next = value === '深入研究' ? 'skills.search.match' : value === EMPTY_SEARCH ? 'skills.search.empty' : value === '' ? 'skills.default' : undefined;
    if (next && value !== queryForVariant(initialVariant)) onNavigate(`QDR.P04.market.${next}`);
  };
  const clearQuery = () => { updateQuery(''); input.current?.focus(); };
  const chooseCategory = (category: string) => {
    if (isSkill && !query && !latest && (category === '全部' || category === '精选')) {
      const next = category === '精选' ? 'QDR.P04.market.skills.featured' : marketId('skills');
      if (featured !== (category === '精选')) onNavigate(next);
    } else pending(`${category}类别`);
  };
  const chooseSort = (sort: 'popular' | 'latest') => {
    if (isSkill && !query && !featured) {
      if (latest !== (sort === 'latest')) onNavigate(sort === 'latest' ? 'QDR.P04.market.skills.latest' : marketId('skills'));
    } else pending(`${sort === 'latest' ? '最新' : '热门'}排序`);
  };
  const detailId = (name: string) => isSkill && name === '深入研究' ? 'QDR.P04.market.skills.deep-research.detail' : isConnector && name === 'GitHub' ? 'QDR.P04.market.connectors.github.detail' : !isSkill && !isConnector ? ({ PPT: PPT_DETAIL, Superpowers: 'QDR.P04.market.plugins.superpowers.detail', Context7: 'QDR.P04.market.plugins.context7.detail' } as Record<string, string>)[name] : undefined;
  return <section className={`extension-market${isConnector ? ' extension-market-connectors' : ''}`} aria-label="扩展市场">
    <header className="extension-market-toolbar"><nav className="extensions-type-tabs" aria-label="市场扩展类型">{TYPES.slice(0, 3).map(type => <button type="button" key={type.kind} aria-current={kind === type.kind ? 'page' : undefined} className={kind === type.kind ? 'selected' : ''} onClick={() => kind !== type.kind && onNavigate(marketId(type.kind as 'plugins' | 'skills' | 'connectors'))}>{type.label}</button>)}</nav><div className="extension-market-tools">
      <button type="button" className="extension-market-refresh" aria-label="刷新市场" onClick={() => pending('刷新市场')}><RefreshIcon /></button>
      <form className="extensions-search" role="search" onSubmit={event => { event.preventDefault(); if (unknownQuery) onNotice('市场搜索结果尚未采集；仅保留本地搜索草稿，当前名称快照不变。'); }}><Icon name="search" size={13} /><input ref={input} aria-label="搜索名称、说明、标签" placeholder="搜索名称、说明或标签" value={query} onChange={event => updateQuery(event.target.value)} />{query && <button type="button" className="extension-market-clear" aria-label="清空搜索" onClick={clearQuery}><Icon name="close" size={12} /></button>}</form>
      <button type="button" className="extensions-secondary" onClick={() => { if (isSkill || isConnector) onNotice(`${noun}市场返回已安装${noun}是本地导航；原产品此返回路径尚未验证。`); onNavigate(installedId(kind)); }}>已安装</button>
      <button type="button" className="extensions-primary" onClick={() => pending(`添加${noun}`)}><Icon name="plus" size={13} />添加{noun}</button>
    </div></header>
    <div className="extension-market-content">
      <div className="extension-market-hero"><div><h1>发现 <span>{isSkill ? 'Skills' : isConnector ? 'Connectors' : 'Plugins'}</span></h1><p>聚焦 {isSkill ? '效率提升、内容创作、官方精选。' : isConnector ? '内容创作、知识研究。' : '编码、数据分析、设计。'}</p></div><button type="button" className="extension-market-recommendation" aria-label="查看市场推荐" onClick={() => pending('市场推荐')}><MarketArtwork /><small>原创推荐示意</small></button></div>
      <div className="extension-market-categories"><nav className="extension-market-category-scroll" aria-label="市场类别">{categories.map(category => <button type="button" key={category} className={category === (featured ? '精选' : '全部') ? 'selected' : ''} aria-pressed={category === (featured ? '精选' : '全部')} onClick={() => chooseCategory(category)}>{category}</button>)}</nav><button type="button" className="extension-market-more" aria-label="更多类别" onClick={() => pending('更多类别')}><Icon name="more" size={16} /></button><div className="extension-market-sort" role="group" aria-label="市场排序"><button type="button" className={!latest ? 'selected' : ''} aria-pressed={!latest} onClick={() => chooseSort('popular')}>热门</button><button type="button" className={latest ? 'selected' : ''} aria-pressed={latest} onClick={() => chooseSort('latest')}>最新</button></div></div>
      {unknownQuery && <p className="extensions-local-note" role="status">搜索结果尚未采集；保留本地草稿与下方 {items.length} 项名称快照。</p>}
      {initialVariant === 'skills-search-empty' ? <div className="extension-market-empty"><span><Icon name="search" size={25} /></span><h2>没有匹配的扩展</h2><p>换个关键词，或切换 Skill、Plugin 与 Connector 查看。</p></div> : <div className="extension-market-list" aria-label={`${noun}名称快照`}>{items.map(([name, summary], index) => <article className="extension-market-item" key={name}>
        <button type="button" className="extension-market-details" aria-label={detailId(name) ? `查看 ${name} 详情` : `查看 ${name}`} onClick={() => { const id = detailId(name); if (id) onNavigate(id); else pending(`${name}详情`); }}><span className={`extension-market-item-icon palette-${index % 6}`}><Icon name={ICONS[index % ICONS.length]} size={23} /></span><span className="extension-market-item-copy"><strong>{name}</strong><span title={`本地摘要：${summary}`}>{summary}</span></span></button>
        <button type="button" className="extension-market-install" aria-label={`安装 ${name}`} title="本地演示入口，未安装" onClick={() => pending(`安装 ${name}`)}>安装</button>
      </article>)}</div>}
      <p className="extensions-local-note extension-market-source-note">名称来自本次 {items.length} 项可读快照，并非市场总量。说明为本地摘要，图标与装饰为原创示意；安装按钮的悬停与键盘显示为本地设计，点击不执行安装。</p>
    </div>
  </section>;
}

export function ExtensionDetailPage({ onNavigate, onNotice }: PageActions) {
  const pending = (action: string) => onNotice(`“${action}”的结果尚未采集；未安装插件、连接或授权 office，也未制作演示文稿。`);
  const back = () => {
    onNotice('返回插件市场是本地导航；原产品面包屑返回路径尚未可靠验证。');
    onNavigate(marketId('plugins'));
  };
  return <section className="extension-detail" aria-label="PPT 插件详情" tabIndex={0}>
    <nav className="extension-detail-breadcrumb" aria-label="插件详情导航"><button type="button" onClick={back}>插件</button><Icon name="chevron" size={11} /><span aria-current="page">PPT</span></nav>
    <div className="extension-detail-content">
      <header className="extension-detail-header">
        <span className="extension-detail-icon" role="img" aria-label="原创 PPT 插件图标占位"><Icon name="monitor" size={23} /></span>
        <div className="extension-detail-identity"><div className="extension-detail-title"><h1>PPT</h1><span>v0.1.1</span></div><div className="extension-detail-meta"><span>@Qoder</span><span title="本次采集快照，非实时指标">31665 次安装</span><span>Content Creation</span></div></div>
        <button type="button" className="extensions-primary extension-detail-install" aria-label="安装 PPT" onClick={() => pending('安装 PPT')}>安装</button>
      </header>
      <p className="extension-detail-intro">演示文稿的创建与编辑，涵盖内容组织、幻灯片排版与文件产出。</p>

      <section className="extension-detail-section" aria-labelledby="extension-detail-skills-heading"><h2 id="extension-detail-skills-heading">技能 <span>1</span></h2><div className="extension-detail-skill-row"><span className="extension-detail-small-icon" aria-hidden="true"><Icon name="file" size={18} /></span><div><h3>office</h3><p title="本地摘要：围绕 PPT/PPTX 的创建、读取、检查与编辑，整理演示文稿的内容和版式。">围绕 PPT/PPTX 的创建、读取、检查与编辑，整理演示文稿的内容和版式。</p></div></div></section>
      <section className="extension-detail-section" aria-labelledby="extension-detail-connectors-heading"><h2 id="extension-detail-connectors-heading">连接器 <span>1</span></h2><div className="extension-detail-connector-row"><button type="button" className="extension-detail-connector" aria-label="office 连接器" onClick={() => pending('office 连接器')}><Icon name="grid" size={15} />office</button></div></section>

      <section className="extension-detail-section extension-detail-description" aria-labelledby="extension-detail-description-heading"><h2 id="extension-detail-description-heading">套件说明</h2>
        <article className="extension-detail-document" aria-label="套件说明正文">
          <h3>PPT</h3><p className="extension-detail-tagline">和 AI 一起，把 PPT 做好。</p>
          <p>产品介绍将初稿准备、预览、手工编辑和对话修改放在同一工作流程中，并提到可编辑的 <code>.pptx</code> 文件产出。</p>
          <p className="extension-detail-source-note">本页长说明为本地改写，图标为原创占位，安装次数为采集快照。以下仅展示产品说明结构；原型不会制作、读取或编辑 PPT 文件。</p>
          <h4>你可以用它做什么</h4>
          <ul><li><strong>组织演示初稿：</strong>围绕主题、材料和目标梳理页面结构。</li><li><strong>预览与调整：</strong>检查页面内容与排版，再逐步调整呈现。</li><li><strong>修改指定内容：</strong>聚焦某一页或某一部分，描述需要保留和改变的内容。</li><li><strong>更新已有文件：</strong>以现有演示文稿为起点，整理需要更新的信息。</li></ul>
          <h4>开始使用</h4>
          <ol><li>产品介绍从安装 PPT 插件开始。</li><li>在对话中选择插件并描述需求，也可附上相关文件。</li><li>预览生成的页面，通过手工编辑或对话继续修改。</li><li>确认后保存为可继续编辑的 <code>.pptx</code> 文件。</li></ol>
          <h4>试着这样说</h4>
          <p className="extension-detail-example-note">以下为静态示例，不会提交给模型。</p>
          <blockquote><strong>工作汇报：</strong>把这些项目进展整理为一份工作汇报，突出本期成果与下一阶段计划。</blockquote>
          <blockquote><strong>调整一页：</strong>调整这一页的布局，让结论更突出，同时保留关键数据。</blockquote>
          <blockquote><strong>修改已有 PPT：</strong>根据补充材料更新已有 PPT，并保持原有内容的整体顺序。</blockquote>
          <p className="extension-detail-tail">补充受众、使用场合、演示时长和表达重点，有助于说明你的需求。</p>
        </article>
      </section>
    </div>
  </section>;
}
