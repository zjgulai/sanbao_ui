import React, { useMemo, useState } from 'react';
import { getDeliveryDimensions, getUncollectedReason, groups, states, type PrototypeState } from '../catalog';
import { Icon, IconButton } from './Controls';

type PresentationMode = 'catalog' | 'product' | 'research';

const getPresentationMode = (): PresentationMode => {
  const mode = new URLSearchParams(window.location.search).get('mode');
  return mode === 'product' || mode === 'research' ? mode : 'catalog';
};
const isResearchMode = () => getPresentationMode() === 'research';
const isDirectoryMode = () => getPresentationMode() !== 'product';
const isPublicPagesArtifact = () => document.documentElement.dataset.artifact === 'pages';
const modeHref = (mode: 'product' | 'research') => {
  const url = new URL(window.location.href);
  url.searchParams.set('mode', mode);
  return `${url.pathname}${url.search}${url.hash}`;
};
const isReferenceCaptureMode = () => {
  const query = new URLSearchParams(window.location.search);
  return query.get('mode') === 'research' && query.get('capture') === 'reference';
};

export function ReviewBar({ state, implemented, drawerOpen, toggleDrawer, reset, navigate }: { state?: PrototypeState; implemented: Set<string>; drawerOpen: boolean; toggleDrawer: () => void; reset: () => void; navigate: (id: string) => void }) {
  const index = states.findIndex(item => item.id === state?.id);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const nativeImage = state?.observationIds.includes('QB21-01') ? 'openai-compatible' : state?.observationIds.includes('QB21-02') ? 'openai-api-menu' : state?.observationIds.includes('QB21-03') ? 'anthropic-compatible' : null;
  const delivery = state ? getDeliveryDimensions(state, implemented) : [];
  const presentationMode = getPresentationMode();
  const researchMode = presentationMode === 'research';
  const catalogMode = presentationMode === 'catalog';
  const publicPagesArtifact = isPublicPagesArtifact();
  const localFixture = !!state?.observationIds.some(id => implemented.has(id));
  if (!isDirectoryMode() || isReferenceCaptureMode()) return null;
  return <><header className="review-bar"><button className={`review-toggle ${drawerOpen ? 'selected' : ''}`} onClick={toggleDrawer}><Icon name="panel" size={14} /> 状态目录</button><span className="review-brand">SANBAO <i>/</i> {researchMode ? 'Qoder UI 研究' : '完整原型目录'}</span><span className="review-state">{researchMode ? state?.id ?? '未知状态' : state?.title ?? '未知页面'}</span><span className="review-badge">{localFixture ? researchMode ? '本地模拟' : '可浏览页面' : '设计工作面'}</span><div className="review-actions">{researchMode && <button onClick={() => setEvidenceOpen(!evidenceOpen)}>{publicPagesArtifact ? '证据范围' : '证据'}</button>}{catalogMode && <><a className="review-link" href={modeHref('product')}>产品演示</a><a className="review-link" href={modeHref('research')}>研究审计</a></>}<button disabled={index <= 0} onClick={() => navigate(states[index - 1].id)}>← 上一项</button><button disabled={index < 0 || index === states.length - 1} onClick={() => navigate(states[index + 1].id)}>下一项 →</button><button onClick={reset}>重置</button></div></header>
    {researchMode && publicPagesArtifact && evidenceOpen && <aside className="evidence-strip public-evidence-notice"><div><strong>公开原型未附带研究证据文件</strong><p>为保护研究材料与用户数据边界，GitHub Pages 只发布可浏览的 UI 原型；证据文档和截图仅在受控本地研究环境中保留。</p></div><IconButton name="close" label="关闭证据范围说明" onClick={() => setEvidenceOpen(false)} /></aside>}
    {!publicPagesArtifact && evidenceOpen && <aside className="evidence-strip"><div><strong>{state?.title ?? '无法识别 URL 中的状态'}</strong><p>{state?.evidence ?? '请通过状态目录选择已登记的条目。'}</p>{state && <><dl className="delivery-grid" aria-label="交付验证状态">{delivery.map(item => <div key={item.key}><dt>{item.label}</dt><dd title={item.detail}>{item.status}</dd></div>)}</dl><p className="delivery-gap"><strong>当前缺口：</strong>{getUncollectedReason(state, implemented)}</p></>}<p>原型交互、视觉保真、DSH 壳内兼容与 Figma 对齐分别验收；本页面只运行本地模拟。</p><nav aria-label="研究证据文档">{nativeImage && <><a href={`research/batch21-evidence/${nativeImage}.png`} target="_blank" rel="noreferrer">对应原生截图（目视待验）</a> · </>}{state?.page === 'settings' && state.variant.startsWith('models') && <><a href="research/batch21-capture.json" target="_blank" rel="noreferrer">兼容供应商表单取证（视觉待验）</a> · </>}{state?.observationIds.some(id => id.startsWith('QB20-')) && <><a href="research/batch20-capture.md" target="_blank" rel="noreferrer">模型设置与未保存配置取证</a> · </>}{(state?.observationIds.some(id => id.startsWith('QB19-')) || state?.observationIds.includes('QB18-05')) && <><a href="research/batch19-capture.md" target="_blank" rel="noreferrer">语音设备、快捷键与草稿取证</a> · </>}{state?.observationIds.some(id => id.startsWith('QB18-') || ['QB15-01', 'QB16-01', 'QB17-01'].includes(id)) && <><a href="research/batch18-capture.md" target="_blank" rel="noreferrer">快捷键交互、语音与设置下半补证</a> · </>}{state?.observationIds.includes('QB17-01') && <><a href="research/batch17-capture.md" target="_blank" rel="noreferrer">本批快捷键默认页取证</a> · </>}{state?.observationIds.includes('QB16-01') && <><a href="research/batch16-capture.md" target="_blank" rel="noreferrer">本批任务监控首屏与字段取证</a> · </>}{(state?.observationIds.some(id => id.startsWith('QB15-')) || ['QDR.OBS03.sites.empty', 'QDR.OBS02.repo-wiki.default', 'QDR.OBS02.repo-wiki.generated.empty'].includes(state?.id ?? '')) && <><a href="research/batch15-capture.md" target="_blank" rel="noreferrer">本批常规、模式与空态切换取证</a> · </>}{(state?.observationIds.some(id => id.startsWith('QB14-')) || ['QDR.OBS02.knowledge.create.open', 'QDR.OBS02.repo-wiki.setup', 'QDR.OBS03.sites.empty', 'QDR.O02.sites.templates.open'].includes(state?.id ?? '')) && <><a href="research/batch14-capture.md" target="_blank" rel="noreferrer">本批知识库、知识卡片与站点路径取证</a> · </>}{(state?.observationIds.some(id => id.startsWith('QB13-')) || state?.observationIds.includes('QB6-01') || state?.observationIds.includes('QD0-04')) && <><a href="research/batch13-capture.md" target="_blank" rel="noreferrer">本批输入区跳转与市场详情取证</a> · </>}{state?.observationIds.some(id => id.startsWith('QB12-')) && <><a href="research/batch12-capture.md" target="_blank" rel="noreferrer">本批 MCP 字段与退出取证</a> · </>}{state?.observationIds.some(id => id.startsWith('QB11-')) && <><a href="research/batch11-capture.md" target="_blank" rel="noreferrer">本批自定义 MCP 取证</a> · </>}{state?.observationIds.some(id => id.startsWith('QB10-')) && <><a href="research/batch10-capture.md" target="_blank" rel="noreferrer">本批技能筛选与连接器取证</a> · </>}{state?.observationIds.some(id => id.startsWith('QB9-')) && <><a href="research/batch09-capture.md" target="_blank" rel="noreferrer">本批市场详情取证</a> · </>}{state?.observationIds.some(id => id.startsWith('QB8-')) && <><a href="research/batch08-capture.md" target="_blank" rel="noreferrer">本批扩展管理与市场取证</a> · </>}{state?.observationIds.some(id => id.startsWith('QB7-')) && <><a href="research/batch07-capture.md" target="_blank" rel="noreferrer">本批设置与余分支取证</a> · </>}{state?.observationIds.some(id => id.startsWith('QB6-')) && <><a href="research/batch06-capture.md" target="_blank" rel="noreferrer">本批插件与 Repo Wiki 取证</a> · </>}{(state?.observationIds.some(id => id.startsWith('QB5-')) || state?.observationIds.includes('QB3-17')) && <><a href="research/batch05-capture.md" target="_blank" rel="noreferrer">本批上下文与知识站点取证</a> · </>}{state?.groupIds.includes('OBS04') && <><a href="research/batch04-capture.md" target="_blank" rel="noreferrer">菜单路径补核</a> · </>}{state?.observationIds.some(id => id.startsWith('QB3-')) && <><a href="research/batch03-capture.md" target="_blank" rel="noreferrer">本批外观取证</a> · </>}<a href="research/qoder-observed-states.md" target="_blank" rel="noreferrer">原产品观察记录</a> · <a href="research/qoder-coverage-register.csv" download>覆盖登记 CSV</a> · <a href="research/sanbao-baseline-review.md" target="_blank" rel="noreferrer">Sanbao 基线核查</a> · <a href="research/sanbao-prototype-design.md" target="_blank" rel="noreferrer">已批准设计方案</a></nav></div><IconButton name="close" label="关闭证据" onClick={() => setEvidenceOpen(false)} /></aside>}
  </>;
}

export function StateDirectory({ selected, navigate, implemented, close }: { selected?: string; navigate: (id: string) => void; implemented: Set<string>; close: () => void }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [group, setGroup] = useState('all');
  const researchMode = getPresentationMode() === 'research';
  const filtered = useMemo(() => states.filter(state => {
    const available = state.observationIds.some(id => implemented.has(id));
    return `${state.id} ${state.title} ${state.observationIds.join(' ')} ${state.groupIds.join(' ')}`.toLowerCase().includes(search.toLowerCase()) && (group === 'all' || state.groupIds.includes(group)) && (filter === 'all' || filter === 'implemented' && available || filter === 'pending' && !available || filter === 'observed' && state.sourceKind === 'observed' || filter === 'entry' && state.sourceKind === 'entry-observed' || filter === 'static' && state.sourceKind === 'static-only');
  }), [search, filter, group, implemented]);
  if (!isDirectoryMode() || isReferenceCaptureMode()) return null;
  return <aside className="state-directory" aria-label={researchMode ? '原型状态目录' : '完整原型目录'}>
    <div className="directory-heading"><div><h2>{researchMode ? '原型状态目录' : '完整原型目录'}</h2><p>{researchMode ? '证据与实现，分别记录' : '浏览页面与本地交互状态'}</p></div><IconButton name="close" label="收起状态目录" onClick={close} /></div>
    <label className="directory-search"><Icon name="search" size={15} /><input aria-label={researchMode ? '搜索状态目录' : '搜索完整原型目录'} value={search} placeholder={researchMode ? '搜索名称、状态 ID、观察 ID' : '搜索页面名称'} onChange={event => setSearch(event.target.value)} /></label>
    <div className="directory-filters">
      <select aria-label={researchMode ? '证据和实现筛选' : '页面状态筛选'} value={filter} onChange={event => setFilter(event.target.value)}>
        <option value="all">{researchMode ? '所有状态' : '所有页面'}</option>
        <option value="implemented">{researchMode ? '已观察 fixture' : '可浏览页面'}</option>
        <option value="pending">设计工作面</option>
        {researchMode && <><option value="observed">原产品已观察</option><option value="entry">原产品仅入口</option><option value="static">原产品静态候选</option></>}
      </select>
      <select aria-label={researchMode ? '按候选组筛选' : '按页面分组筛选'} value={group} onChange={event => setGroup(event.target.value)}><option value="all">{researchMode ? '全部候选组' : '全部页面分组'}</option>{groups.map(item => <option key={item.id} value={item.id}>{researchMode ? `${item.id} ${item.label}` : item.label}</option>)}</select>
    </div>
    <div className="directory-count">{filtered.length} / {states.length} {researchMode ? '项 · ' : '个页面 · '}{groups.length} 组 <span>{researchMode ? '不是完成率' : '本地原型导航'}</span></div>
    <nav className="directory-list">{filtered.map(state => {
      const localFixture = state.observationIds.some(id => implemented.has(id));
      return <button key={state.id} className={`state-item ${selected === state.id ? 'active' : ''}`} onClick={() => navigate(state.id)}>
        <span className="state-line"><strong>{state.title}</strong><i className={localFixture ? 'implemented-dot' : 'pending-dot'} /></span>
        {researchMode ? <><code>{state.id}</code><span className="state-meta">{state.observationIds.join(' · ') || '原产品待核验'} <span>{localFixture ? '本地模拟' : '设计工作面'}</span></span><span className="state-dimensions" aria-label="五维交付状态">{getDeliveryDimensions(state, implemented).map(item => <span key={item.key} title={item.detail}>{item.label}·{item.status}</span>)}</span></> : <span className="state-meta"><span>{localFixture ? '可浏览本地页面' : 'SanBao 设计工作面'}</span></span>}
      </button>;
    })}</nav>
    <footer className="directory-footer">{researchMode ? '虚构数据 · 无模型请求 · 无真实文件操作' : '本地原型 · 无模型请求 · 无真实文件操作'}</footer>
  </aside>;
}

export function ResearchDetail({ state, onHome }: { state?: PrototypeState; onHome: () => void }) {
  return isResearchMode() ? <ResearchAuditDetail state={state} onHome={onHome} /> : <ProductDesignWorkbench state={state} onHome={onHome} />;
}

function ProductDesignWorkbench({ state, onHome }: { state?: PrototypeState; onHome: () => void }) {
  const [active, setActive] = useState(false);
  const [draft, setDraft] = useState('');
  const [paneOpen, setPaneOpen] = useState(false);
  if (!state) return <section className="research-detail" aria-label="SanBao 本地工作面"><span className="eyebrow">SANBAO LOCAL WORKBENCH</span><h1>本地工作面</h1><p className="research-lead">此链接没有可展示的本地工作面。</p><button className="primary-button" onClick={onHome}>返回首页</button></section>;
  const title = state.title.replace(/qoder/gi, 'SanBao');
  const reset = () => { setActive(false); setDraft(''); setPaneOpen(false); };
  return <section className="design-workbench design-task" aria-label={`${title} 本地设计工作面`}><header className="design-header"><div><span className="eyebrow">SANBAO LOCAL DESIGN WORKBENCH</span><h1>{title}</h1><p>这是 SanBao 的本地设计工作面，用于演示可恢复的界面交互；不会写入系统、调用模型或访问外部服务。</p></div></header><div className="design-body"><div className="design-task-layout"><article className="design-task-card"><span className="design-kicker">本地演示</span><h2>{active ? '本地交互已启用' : '准备可恢复的交互状态'}</h2><p>输入内容只保留在当前浏览器会话中，可随时重置。</p><label className="design-field">本地演示输入<input aria-label="本地演示输入" value={draft} onChange={event => setDraft(event.target.value)} placeholder="输入演示内容" /></label><button className="secondary-button" onClick={() => setActive(!active)}>{active ? '暂停本地演示' : '启用本地演示'}</button></article><aside className="design-side-pane"><strong>{paneOpen ? '辅助工作面已打开' : '辅助工作面待命'}</strong><p>{paneOpen ? '这里展示当前浏览器中的局部演示状态，不包含真实操作或外部连接。' : '按需打开辅助工作面，查看本地演示状态。'}</p><button className="text-button" onClick={() => setPaneOpen(!paneOpen)}>{paneOpen ? '收起辅助工作面' : '打开辅助工作面'}</button>{paneOpen && <p className="design-inline-detail">{draft || '尚未输入本地演示内容。'}</p>}</aside></div><footer className="design-actions"><button className="primary-button" onClick={() => setActive(true)}>{active ? '本地演示已启用' : '运行本地演示'}</button><button className="secondary-button" onClick={reset}>重置本地设计</button><button className="text-button" onClick={onHome}>返回首页</button></footer></div></section>;
}

function ResearchAuditDetail({ state, onHome }: { state?: PrototypeState; onHome: () => void }) {
  const [tab, setTab] = useState<'workbench' | 'handoff'>('workbench');
  const [active, setActive] = useState(false);
  const [draft, setDraft] = useState('');
  const [paneOpen, setPaneOpen] = useState(false);
  if (!state) return <section className="research-detail"><span className="eyebrow">STATE NOT FOUND</span><h1>未知状态</h1><p className="research-lead">此 URL 的状态 ID 不在当前目录中。</p><button className="primary-button" onClick={onHome}>返回首页</button></section>;
  const groupsText = state.groupIds.join(' · ');
  const sourceLabel = state.sourceKind === 'entry-observed' ? '原产品仅确认入口' : '原产品静态候选';
  const taskLike = state.groupIds.some(id => /^[SMA]/.test(id));
  const settingsLike = state.groupIds.includes('P06') || state.page === 'settings';
  const collectionLike = state.groupIds.some(id => /^(P0[3-5]|P0[7-9]|P1[0-2]|P16|P17|OBS0[2-3])$/.test(id));
  const template = settingsLike ? 'settings' : taskLike ? 'task' : collectionLike ? 'collection' : 'workspace';
  const resetDesign = () => { setTab('workbench'); setActive(false); setDraft(''); setPaneOpen(false); };
  const primaryLabel = active ? '已完成本地演示' : template === 'settings' ? '保存本地设计' : template === 'task' ? '运行本地演示' : template === 'collection' ? '创建本地条目' : '打开本地工作面';
  return <section className={`design-workbench design-${template}`} data-state-source={state.sourceKind} aria-label={`${state.title} 设计工作面`}><header className="design-header"><div><span className="eyebrow">SANBAO DESIGN WORKBENCH</span><h1>{state.title}</h1><p>{sourceLabel}。此页面用于完成 Sanbao 交互设计，等待原生 Qoder 页面与视觉校准。</p></div><span className="design-source-badge">{sourceLabel}</span></header><div className="design-tabs" role="tablist" aria-label="设计工作面分区"><button role="tab" aria-selected={tab === 'workbench'} onClick={() => setTab('workbench')}>工作面</button><button role="tab" aria-selected={tab === 'handoff'} onClick={() => setTab('handoff')}>交接信息</button></div>{tab === 'workbench' ? <div className="design-body">{template === 'settings' ? <div className="design-settings-layout"><article><span className="design-kicker">本地配置</span><h2>为此设置准备可恢复的交互</h2><label className="design-field">本地显示名称<input aria-label="设计草稿" value={draft} onChange={event => setDraft(event.target.value)} placeholder="输入演示值，不会写入系统" /></label><button className={`toggle ${active ? 'on' : ''}`} aria-label="切换本地设计" aria-pressed={active} onClick={() => setActive(!active)}><span /></button><small>开关只更新当前浏览器中的演示状态。</small></article><aside><strong>恢复规则</strong><p>重置会清空演示值。真实保存、设备权限、网络或系统作用范围仍待验证。</p><button className="text-button" onClick={() => setPaneOpen(!paneOpen)}>{paneOpen ? '收起详情' : '展开详情'}</button>{paneOpen && <p className="design-inline-detail">此区域保留给原生字段、默认值和错误状态的后续校准。</p>}</aside></div> : template === 'task' ? <div className="design-task-layout"><article className="design-task-card"><span className="design-kicker">任务生命周期设计</span><h2>{active ? '本地演示已进入可恢复状态' : '准备一个可恢复的任务状态'}</h2><ol><li className={active ? 'done' : ''}>建立任务上下文</li><li className={active ? 'done' : ''}>展示等待、完成或恢复结果</li><li>通过关闭或重置回到稳定入口</li></ol><button className="secondary-button" onClick={() => setPaneOpen(!paneOpen)}>{paneOpen ? '关闭辅助面板' : '打开辅助面板'}</button></article>{paneOpen && <aside className="design-side-pane"><strong>本地辅助面板</strong><p>用于评审工具、队列、产物或失败恢复的布局。它没有调用模型、终端或外部服务。</p></aside>}</div> : template === 'collection' ? <div className="design-collection-layout"><header><div><span className="design-kicker">列表与结果设计</span><h2>统一处理空态、草稿、结果与返回</h2></div><label className="design-field compact">筛选本地条目<input aria-label="设计草稿" value={draft} onChange={event => setDraft(event.target.value)} placeholder="仅过滤演示内容" /></label></header><div className="design-list"><button className={active ? 'selected' : ''} onClick={() => setActive(!active)}><span className="workspace-mark">S</span><span><strong>{draft || '待命的本地条目'}</strong><small>选择后可查看详情或撤销本地选择</small></span><Icon name="chevron" size={14} /></button><button onClick={() => setPaneOpen(!paneOpen)}><span className="workspace-mark">＋</span><span><strong>建立设计型结果</strong><small>用于评审创建、处理中、成功、失败和取消</small></span><Icon name="chevron" size={14} /></button></div>{paneOpen && <div className="design-result-card">本地结果已展开。关闭、浏览器后退和“重置”可返回稳定入口。</div>}</div> : <div className="design-workspace-layout"><article><span className="design-kicker">桌面工作面设计</span><h2>任务、搜索和工作区的共用结构</h2><p>当前页面提供列表区、内容区和辅助面板的可评审布局。</p><div className="design-workspace-grid"><button className={active ? 'selected' : ''} onClick={() => setActive(!active)}>任务与列表</button><button className={paneOpen ? 'selected' : ''} onClick={() => setPaneOpen(!paneOpen)}>辅助工作面</button><button onClick={() => setDraft('本地草稿已创建')}>创建本地草稿</button></div></article><aside>{paneOpen ? <><strong>辅助工作面已打开</strong><p>这里会承载终端、浏览器、Diff、侧聊或细节信息；实际 Qoder 结构仍待取证。</p></> : <><strong>等待选择</strong><p>选择一个区域后显示本地演示状态。</p></>}</aside></div>}<footer className="design-actions"><button className="primary-button" onClick={() => setActive(true)}>{primaryLabel}</button><button className="secondary-button" onClick={resetDesign}>重置本地设计</button><button className="text-button" onClick={onHome}>返回首页</button></footer></div> : <div className="design-handoff"><dl><dt>状态编号</dt><dd><code>{state.id}</code></dd><dt>候选组</dt><dd>{groupsText}</dd><dt>原生触发</dt><dd>{state.trigger}</dd><dt>原生退出或恢复</dt><dd>{state.exit}</dd><dt>当前设计边界</dt><dd>{state.notes}</dd><dt>五维交付状态</dt><dd className="detail-dimensions">{getDeliveryDimensions(state, new Set<string>()).map(item => <span key={item.key} title={item.detail}>{item.label}·{item.status}</span>)}</dd><dt>下一步</dt><dd>{getUncollectedReason(state, new Set<string>())}</dd></dl><button className="secondary-button" onClick={() => setTab('workbench')}>返回工作面</button></div>}</section>;
}
