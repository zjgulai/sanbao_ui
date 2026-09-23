import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Controls';

export const SETTINGS_EXTENSION_WORKBENCH_VIEWS = [
  'plugin-directory',
  'plugin-page',
  'plugin-settings',
  'plugin-document',
  'plugin-unavailable',
  'extension-install',
  'extension-cancelled',
] as const;

export type SettingsExtensionWorkbenchView = typeof SETTINGS_EXTENSION_WORKBENCH_VIEWS[number];

export type SettingsExtensionWorkbenchEntry = {
  view: SettingsExtensionWorkbenchView;
  title: string;
  sourceId: 'QDR.P05.scope.unexpanded' | 'QDR.O09.scope.unexpanded';
  fixtureId: string;
};

export const SETTINGS_EXTENSION_WORKBENCH_ENTRIES: readonly SettingsExtensionWorkbenchEntry[] = [
  { view: 'plugin-directory', title: '插件贡献目录', sourceId: 'QDR.P05.scope.unexpanded', fixtureId: 'SANBAO.P05.F01' },
  { view: 'plugin-page', title: '插件贡献页面', sourceId: 'QDR.P05.scope.unexpanded', fixtureId: 'SANBAO.P05.F02' },
  { view: 'plugin-settings', title: '插件设置候选', sourceId: 'QDR.P05.scope.unexpanded', fixtureId: 'SANBAO.P05.F03' },
  { view: 'plugin-document', title: '插件文本页候选', sourceId: 'QDR.P05.scope.unexpanded', fixtureId: 'SANBAO.P05.F04' },
  { view: 'plugin-unavailable', title: '插件不可用候选', sourceId: 'QDR.P05.scope.unexpanded', fixtureId: 'SANBAO.P05.F05' },
  { view: 'extension-install', title: '扩展深链安装确认', sourceId: 'QDR.O09.scope.unexpanded', fixtureId: 'SANBAO.O09.F01' },
  { view: 'extension-cancelled', title: '扩展安装取消恢复', sourceId: 'QDR.O09.scope.unexpanded', fixtureId: 'SANBAO.O09.F02' },
];

export const SETTINGS_EXTENSION_WORKBENCH_QDR_BY_VIEW: Readonly<Record<SettingsExtensionWorkbenchView, string>> = Object.fromEntries(
  SETTINGS_EXTENSION_WORKBENCH_ENTRIES.map(entry => [entry.view, entry.sourceId]),
) as Record<SettingsExtensionWorkbenchView, string>;

export type SettingsExtensionWorkbenchProps = {
  view?: SettingsExtensionWorkbenchView;
  onNavigateView: (view: SettingsExtensionWorkbenchView) => void;
  onExit: () => void;
  onReset: () => void;
};

const CONTRIBUTIONS = [
  { id: 'review', title: '发布前检查', summary: '展示待核对清单、说明和本地结果摘要。', icon: 'panel' },
  { id: 'summary', title: '协作摘要', summary: '展示插件可提供的协作页面组织方式。', icon: 'grid' },
  { id: 'document', title: '文字文档', summary: '展示由插件贡献的独立说明页候选。', icon: 'file' },
] as const;

type ContributionId = typeof CONTRIBUTIONS[number]['id'];

function entryFor(view: SettingsExtensionWorkbenchView) {
  return SETTINGS_EXTENSION_WORKBENCH_ENTRIES.find(entry => entry.view === view) ?? SETTINGS_EXTENSION_WORKBENCH_ENTRIES[0];
}

function Result({ title, detail, error = false }: { title: string; detail: string; error?: boolean }) {
  return <div className={`plugin-entry-result ${error ? 'error' : ''}`} role="status"><Icon name={error ? 'close' : 'check'} size={16} /><div><strong>{title}</strong><p>{detail}</p></div></div>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <article className="plugin-entry-card">{children}</article>;
}

export function SettingsExtensionWorkbench({ view = 'plugin-directory', onNavigateView, onExit, onReset }: SettingsExtensionWorkbenchProps) {
  const [currentView, setCurrentView] = useState<SettingsExtensionWorkbenchView>(view);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<ContributionId>('review');
  const [showContribution, setShowContribution] = useState(false);
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => { setCurrentView(view); }, [view]);

  const navigate = (next: SettingsExtensionWorkbenchView) => {
    setCurrentView(next);
    setNotice('');
    onNavigateView(next);
  };

  const reset = () => {
    setQuery('');
    setSelectedId('review');
    setShowContribution(false);
    setNote('');
    setNotice('已恢复本地插件与安装候选的初始状态。');
    setCurrentView('plugin-directory');
    onNavigateView('plugin-directory');
    onReset();
  };

  const items = useMemo(() => CONTRIBUTIONS.filter(item => `${item.title}${item.summary}`.includes(query.trim())), [query]);
  const selected = CONTRIBUTIONS.find(item => item.id === selectedId) ?? CONTRIBUTIONS[0];
  const entry = entryFor(currentView);

  return <section className="design-workbench plugin-entry-workbench" data-state-source="static-only" aria-label="插件贡献与扩展安装 Sanbao 设计工作面">
    <header className="plugin-entry-header">
      <div><p className="plugin-entry-kicker">SANBAO DESIGN WORKBENCH · STATIC-ONLY</p><h1>插件贡献与安装候选</h1><p>只覆盖尚无专用组件的 P05 应用插件页面与 O09 扩展安装确认。所有页面用本地演示数据回放。</p></div>
      <div className="plugin-entry-source"><strong>{entry.fixtureId}</strong><span>{entry.sourceId}</span><small>static-only · 不代表原生可达</small></div>
    </header>

    <div className="plugin-entry-layout">
      <nav className="plugin-entry-nav" aria-label="插件贡献与安装候选导航">
        <span>应用插件贡献</span>
        {SETTINGS_EXTENSION_WORKBENCH_ENTRIES.slice(0, 5).map(item => <button type="button" key={item.view} className={currentView === item.view ? 'active' : ''} aria-current={currentView === item.view ? 'page' : undefined} onClick={() => navigate(item.view)}>{item.title}</button>)}
        <span>外部安装候选</span>
        {SETTINGS_EXTENSION_WORKBENCH_ENTRIES.slice(5).map(item => <button type="button" key={item.view} className={currentView === item.view ? 'active' : ''} aria-current={currentView === item.view ? 'page' : undefined} onClick={() => navigate(item.view)}>{item.title}</button>)}
      </nav>

      <div className="plugin-entry-stage">
        {currentView === 'plugin-directory' && <Card>
          <div className="plugin-entry-card-heading"><div><p className="plugin-entry-kicker">SANBAO.P05.F01</p><h2>插件贡献目录</h2><p>插件是否实际存在、何时加载与其原生页面结构均待取证。本地目录用于评审搜索、选择、详情和恢复。</p></div><span>本地目录</span></div>
          <label className="plugin-entry-search"><Icon name="search" size={16} /><input aria-label="搜索本地插件贡献候选" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索候选页面" />{query && <button type="button" aria-label="清空本地候选搜索" onClick={() => setQuery('')}><Icon name="close" size={14} /></button>}</label>
          <div className="plugin-entry-directory"><div className="plugin-entry-list">{items.length ? items.map(item => <button type="button" key={item.id} className={selected.id === item.id ? 'selected' : ''} onClick={() => setSelectedId(item.id)}><span><Icon name={item.icon} size={16} /></span><div><strong>{item.title}</strong><small>{item.summary}</small></div><Icon name="chevron" size={15} /></button>) : <div className="plugin-entry-empty"><Icon name="search" size={22} /><strong>没有匹配的本地候选</strong><small>清空搜索即可恢复目录。</small></div>}</div><aside className="plugin-entry-detail"><p className="plugin-entry-kicker">本地详情</p><h3>{selected.title}</h3><p>{selected.summary}</p><dl><div><dt>状态</dt><dd>仅设计候选</dd></div><div><dt>来源</dt><dd>static-only</dd></div></dl><button type="button" className="primary-button" onClick={() => navigate(selected.id === 'document' ? 'plugin-document' : 'plugin-page')}>打开本地页面</button></aside></div>
        </Card>}

        {currentView === 'plugin-page' && <Card>
          <div className="plugin-entry-card-heading"><div><p className="plugin-entry-kicker">SANBAO.P05.F02</p><h2>发布前检查</h2><p>这是插件贡献页面的本地内容结构示意。它不从插件载入、不读取项目，也不触发检查命令。</p></div><span>本地摘要</span></div>
          <div className="plugin-entry-summary"><section><h3>待检查项目</h3><ol><li>界面状态是否可直达</li><li>本地交互是否有恢复路径</li><li>交付边界是否清楚标示</li></ol></section><aside><h3>本地结果</h3><p>当前没有真实检查结果。该卡只表达插件页面可能提供结果摘要的位置。</p><button type="button" className="secondary-button" onClick={() => setNotice('本地检查说明已显示，未执行任何命令或读取项目。')}>显示本地说明</button></aside></div>
          <footer><button type="button" className="secondary-button" onClick={() => navigate('plugin-directory')}>返回目录</button><button type="button" className="primary-button" onClick={() => navigate('plugin-settings')}>查看插件设置</button></footer>
          {notice && <Result title="本地检查说明" detail={notice} />}
        </Card>}

        {currentView === 'plugin-settings' && <Card>
          <div className="plugin-entry-card-heading"><div><p className="plugin-entry-kicker">SANBAO.P05.F03</p><h2>插件设置候选</h2><p>开关与说明草稿仅改变当前 React 组件，不创建配置、插件权限或后台任务。</p></div><span>{showContribution ? '本地入口显示' : '本地入口隐藏'}</span></div>
          <div className="plugin-entry-control"><div><h3>显示本地贡献入口</h3><p>不改变侧栏、菜单或真实插件提供的路由。</p></div><button type="button" className={`plugin-entry-toggle ${showContribution ? 'on' : ''}`} role="switch" aria-checked={showContribution} aria-label="显示本地贡献入口" onClick={() => setShowContribution(value => !value)}><span /></button></div>
          <label className="plugin-entry-field"><span>本地说明草稿</span><textarea value={note} onChange={event => setNote(event.target.value)} placeholder="例如：仅在设计评审环境中展示本地贡献入口…" rows={4} /></label>
          <footer><button type="button" className="secondary-button" onClick={() => { setShowContribution(false); setNote(''); setNotice('已放弃本地插件设置草稿。'); }}>放弃本地草稿</button><button type="button" className="primary-button" onClick={() => note.trim() ? setNotice('本地插件设置预览已生成，未写入任何配置。') : setNotice('请填写本地说明草稿后再查看结果。')}>查看本地结果</button></footer>
          {notice && <Result title={note.trim() ? '本地插件设置结果' : '本地表单未通过'} detail={notice} error={!note.trim()} />}
        </Card>}

        {currentView === 'plugin-document' && <Card>
          <div className="plugin-entry-card-heading"><div><p className="plugin-entry-kicker">SANBAO.P05.F04</p><h2>插件文本页候选</h2><p>文档型页面由静态候选推得。正文是原创示例，不加载插件文本、文件或外部页面。</p></div><span>本地文档</span></div>
          <article className="plugin-entry-document"><h3>贡献页面说明</h3><p>插件可以在产品中增加一个独立页面，用于聚焦展示某类工作信息、检查过程或说明内容。</p><h4>本地评审范围</h4><ul><li>页面入口可以被定位与返回。</li><li>详情与设置可被单独进入。</li><li>不可用时保留明确的恢复路径。</li></ul><p>实际插件加载、渲染、权限、持久化和错误文案仍需在原生条件下分别取证。</p></article>
          <footer><button type="button" className="secondary-button" onClick={() => navigate('plugin-directory')}>返回目录</button><button type="button" className="primary-button" onClick={() => navigate('plugin-unavailable')}>查看不可用候选</button></footer>
        </Card>}

        {currentView === 'plugin-unavailable' && <Card>
          <div className="plugin-entry-card-heading"><div><p className="plugin-entry-kicker">SANBAO.P05.F05</p><h2>插件贡献暂不可用</h2><p>仅演示当条件页无法加载时的提示、返回与恢复入口，不将本地状态解释为真实插件故障。</p></div><span>本地不可用</span></div>
          <div className="plugin-entry-warning"><Icon name="close" size={18} /><div><strong>当前没有可验证的插件贡献</strong><p>没有重试插件加载、读取扩展目录或变更应用状态。</p></div></div>
          <footer><button type="button" className="secondary-button" onClick={() => navigate('plugin-directory')}>返回目录</button><button type="button" className="primary-button" onClick={() => navigate('plugin-page')}>恢复本地示例</button></footer>
        </Card>}

        {currentView === 'extension-install' && <Card>
          <div className="plugin-entry-card-heading"><div><p className="plugin-entry-kicker">SANBAO.O09.F01</p><h2>扩展深链安装确认候选</h2><p>深链触发条件、来源、版本、权限和安装后行为均未取证。本页只用于确认、取消与恢复的本地演示。</p></div><span>未安装</span></div>
          <div className="plugin-entry-warning"><Icon name="grid" size={18} /><div><strong>“PPT”扩展候选</strong><p>不会下载、安装、上传、启用或卸载扩展；也不访问任何扩展市场或网络服务。</p></div></div>
          <footer><button type="button" className="secondary-button" onClick={() => navigate('extension-cancelled')}>取消安装</button><button type="button" className="primary-button" onClick={() => setNotice('确认只回放本地结果，未发生下载、安装或启用。')}>确认本地演示</button></footer>
          {notice && <Result title="本地安装确认结果" detail={notice} />}
        </Card>}

        {currentView === 'extension-cancelled' && <Card>
          <div className="plugin-entry-card-heading"><div><p className="plugin-entry-kicker">SANBAO.O09.F02</p><h2>安装已取消</h2><p>取消只影响本地页面状态；没有中断真实下载、变更扩展或清理系统文件。</p></div><span>本地已取消</span></div>
          <Result title="已返回安全的本地状态" detail="可重新打开安装候选，或回到插件贡献目录继续浏览。" />
          <footer><button type="button" className="secondary-button" onClick={() => navigate('plugin-directory')}>返回插件目录</button><button type="button" className="primary-button" onClick={() => navigate('extension-install')}>重新打开确认</button></footer>
        </Card>}

        <footer className="plugin-entry-footer"><span>所有状态均为 static-only：只改 React 内存，不加载插件代码、不安装扩展、不读写凭据、不发网络请求。</span><button type="button" className="text-button" onClick={onExit}>退出工作面</button><button type="button" className="secondary-button" onClick={reset}>重置本地演示</button></footer>
      </div>
    </div>
  </section>;
}
