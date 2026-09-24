import React, { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { states } from '../catalog';
import { BrandMark } from '../components/BrandMark';
import { Icon, Toggle } from '../components/Controls';

const PANELS = {
  'color-mode': { label: '主题模式', options: ['系统', '浅色', '深色'], initial: '浅色' },
  'terminal-theme': { label: '终端主题', options: ['跟随主题', '手动调整'], initial: '跟随主题' },
  language: { label: '语言', options: ['简体中文', 'English'], initial: '简体中文' },
  'font-style': { label: '字体风格', options: ['无衬线', '衬线'], initial: '无衬线' },
  'content-width': { label: '内容宽度', options: ['标准', '宽'], initial: '标准' },
  'file-icons': { label: '文件图标', options: ['SanBao', 'Material File Icons'], initial: 'SanBao' },
  'icon-appearance': { label: '图标外观', options: ['跟随 SanBao', '浅色', '深色'], initial: '跟随 SanBao' },
} as const;
export type AppearancePanel = keyof typeof PANELS;
type NavigationProps = { onBack: () => void; onPending: (id: string) => void };
type Props = NavigationProps & { initialPanel?: string };
const isPanel = (value?: string): value is AppearancePanel => !!value && Object.hasOwn(PANELS, value);
const THEMES = ['森林', '薄荷', '蜜蜂', '羊皮纸'];
const SETTINGS_GROUPS = [
  { label: '个人', keys: ['profile', 'general', 'mode', 'task-monitor', 'shortcuts', 'appearance', 'voice', 'models', 'pet', 'memory', 'import'] },
  { label: '集成', keys: ['extensions', 'hooks', 'computer-control', 'mobile'] },
  { label: '编码', keys: ['git', 'worktrees', 'workspace-index', 'connections', 'security'] },
  { label: '归档管理', keys: ['archived-tasks'] },
  { label: '其他', keys: ['experiments', 'network', 'playground'] },
];
const SETTINGS_ICONS: Record<string, string> = { profile: 'chat', general: 'settings', mode: 'code', 'task-monitor': 'monitor', shortcuts: 'grid', appearance: 'grid', voice: 'chat', models: 'bolt', pet: 'chat', memory: 'book', import: 'folder', extensions: 'grid', hooks: 'bolt', 'computer-control': 'monitor', mobile: 'monitor', git: 'code', worktrees: 'folder', 'workspace-index': 'search', connections: 'globe', security: 'settings', 'archived-tasks': 'folder', experiments: 'bolt', network: 'globe', playground: 'grid' };

export function SettingsSidebar({ onBack, onPending, activeSection = 'appearance' }: NavigationProps & { activeSection?: string }) {
  const [query, setQuery] = useState('');
  const groups = SETTINGS_GROUPS.map(group => ({ ...group, items: group.keys.map(key => {
    const id = `QDR.P06.settings.${key}.entry`;
    const state = states.find(item => item.id === id);
    return { id, key, title: state?.title.replace('（设置入口）', '') || key };
  }).filter(item => item.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())) })).filter(group => group.items.length);
  return <aside className="settings-sidebar" aria-label="设置导航">
    <div className="settings-sidebar-window"><span className="window-dots" aria-hidden="true"><i /><i /><i /></span></div>
    <button className="settings-sidebar-back" onClick={onBack}><span aria-hidden="true">‹</span> 返回应用</button>
    <label className="settings-sidebar-search"><Icon name="search" size={15} /><input aria-label="搜索设置" placeholder="搜索设置" value={query} onChange={event => setQuery(event.target.value)} />{query && <button aria-label="清空设置搜索" onClick={() => setQuery('')}><Icon name="close" size={12} /></button>}</label>
    <nav className="settings-sidebar-groups">{groups.map(group => <section key={group.label}><h2>{group.label}</h2>{group.items.map(item => <button key={item.id} className={item.key === activeSection ? 'active' : ''} aria-current={item.key === activeSection ? 'page' : undefined} onClick={() => {
      if (item.key !== activeSection) { onPending(item.id); return; }
      const heading = document.getElementById(`settings-${activeSection}-heading`);
      heading?.scrollIntoView({ block: 'start' });
      heading?.focus({ preventScroll: true });
    }}><Icon name={SETTINGS_ICONS[item.key]} size={15} /><span>{item.title}</span></button>)}</section>)}{!groups.length && <p className="settings-sidebar-empty">没有找到相关设置</p>}</nav>
  </aside>;
}

function AppearanceSelect({ panel, value, open, onOpen, onClose, onChange }: { panel: AppearancePanel; value: string; open: boolean; onOpen: () => void; onClose: () => void; onChange: (value: string) => void }) {
  const { label, options } = PANELS[panel];
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const openingIndex = useRef<number | null>(null);
  const listId = useId();
  const choose = (option: string) => { onChange(option); onClose(); trigger.current?.focus(); };
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      const scroller = root.current?.closest('.settings-appearance');
      const parentBounds = scroller?.getBoundingClientRect();
      const bounds = root.current?.getBoundingClientRect();
      const menuHeight = menu.current?.offsetHeight || 0;
      if (bounds && parentBounds && (bounds.top < parentBounds.top + 20 || bounds.bottom + menuHeight + 12 > parentBounds.bottom)) root.current?.scrollIntoView({ block: 'center' });
      const options = menu.current?.querySelectorAll<HTMLButtonElement>('[role="option"]');
      const target = openingIndex.current === null ? menu.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]') : options?.[openingIndex.current];
      target?.focus({ preventScroll: true });
      openingIndex.current = null;
    });
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) onClose(); };
    document.addEventListener('pointerdown', outside);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointerdown', outside); };
  }, [open, onClose]);
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); trigger.current?.focus(); return; }
    if (event.key === 'Tab') { onClose(); trigger.current?.focus(); return; }
    const items = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') || []);
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : event.key === 'ArrowDown' ? (current + 1) % items.length : (current - 1 + items.length) % items.length;
      items[next]?.focus();
    } else if ((event.key === 'Enter' || event.key === ' ') && current >= 0) {
      event.preventDefault();
      choose(options[current]);
    }
  };
  return <div ref={root} className="settings-appearance-select" data-panel={panel} onBlur={event => { if (open && !event.currentTarget.contains(event.relatedTarget as Node | null)) onClose(); }}>
    <button ref={trigger} className="settings-appearance-select-trigger" aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined} onClick={open ? onClose : onOpen} onKeyDown={event => { if (!event.nativeEvent.isComposing && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) { event.preventDefault(); openingIndex.current = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : null; onOpen(); } }}><span>{value}</span><Icon name="down" size={13} /></button>
    {open && <div ref={menu} id={listId} className="settings-appearance-menu" role="listbox" aria-label={label} onKeyDown={keys}>{options.map(option => <button type="button" key={option} role="option" aria-selected={value === option} tabIndex={value === option ? 0 : -1} onClick={() => choose(option)}><span>{option}</span>{value === option && <Icon name="check" size={14} />}</button>)}</div>}
  </div>;
}

function SettingRow({ label, description, children }: { label: string; description: string; children: ReactNode }) {
  return <div className="settings-appearance-row"><div className="settings-appearance-row-copy"><span>{label}</span><p>{description}</p></div><div className="settings-appearance-row-control">{children}</div></div>;
}

function BrandAppIcon({ tone }: { tone: 'light' | 'dark' }) {
  return <BrandMark variant="symbol" tone={tone} size={66} imageClassName="settings-appearance-brand-icon" alt="SanBao 应用图标" />;
}

export function SettingsAppearancePage({ initialPanel, onBack }: Props) {
  const [open, setOpen] = useState<AppearancePanel | null>(isPanel(initialPanel) ? initialPanel : null);
  const [values, setValues] = useState<Record<AppearancePanel, string>>(() => Object.fromEntries(Object.entries(PANELS).map(([key, panel]) => [key, panel.initial])) as Record<AppearancePanel, string>);
  const [theme, setTheme] = useState('森林');
  const [linksInBrowser, setLinksInBrowser] = useState(false);
  const [glass, setGlass] = useState(true);
  const [noise, setNoise] = useState(false);
  const [appIcon, setAppIcon] = useState('SanBao');
  const [notice, setNotice] = useState('本地外观预览，选择不会更改 SanBao 或系统设置。');
  const radioName = useId();
  useEffect(() => { setOpen(isPanel(initialPanel) ? initialPanel : null); }, [initialPanel]);
  const localChange = (label: string, value: string) => setNotice(`已在本地预览中选择${label}：${value}。不会更改 SanBao 或系统设置。`);
  const select = (panel: AppearancePanel) => <AppearanceSelect panel={panel} value={values[panel]} open={open === panel} onOpen={() => setOpen(panel)} onClose={() => setOpen(current => current === panel ? null : current)} onChange={value => { setValues(current => ({ ...current, [panel]: value })); localChange(PANELS[panel].label, value); }} />;
  return <div className="settings-appearance">
    <div className="settings-appearance-content">
      <button className="settings-appearance-mobile-back" onClick={onBack}>‹ 返回应用</button>
      <h1 id="settings-appearance-heading" tabIndex={-1}>外观</h1>
      <section aria-labelledby="settings-interface-heading">
        <h2 id="settings-interface-heading" className="settings-appearance-section-title">界面样式</h2>
        <div className="settings-appearance-interface-card">
        <div className="settings-appearance-section-heading"><div className="settings-appearance-theme-copy"><h3>主题模式</h3><p>控制转写时显示在屏幕右侧的界面样式。</p></div><div className="settings-appearance-theme-controls">{select('color-mode')}<button className="settings-appearance-random" aria-label="随机预览主题" title="随机预览主题" onClick={() => {
          const options = THEMES.filter(item => item !== theme);
          const next = options[Math.floor(Math.random() * options.length)];
          setTheme(next); localChange('主题', next);
        }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 6h3c4 0 6 12 10 12h3M16 14l4 4-4 4M4 18h3c1.3 0 2.4-1.4 3.5-3.4M13.5 9.4C14.6 7.4 15.7 6 17 6h3M16 2l4 4-4 4" /></svg></button></div></div>
        <div className="settings-appearance-themes" role="radiogroup" aria-label="主题">
          {THEMES.map((item, index) => <label key={item} className={`settings-appearance-theme theme-${index} ${theme === item ? 'selected' : ''}`}>
            <input type="radio" name={`${radioName}-theme`} value={item} checked={theme === item} onChange={() => { setTheme(item); localChange('主题', item); }} />
            <span className="settings-appearance-theme-preview" aria-hidden="true"><span className="mini-sidebar"><i /><i /><i /><i /></span><span className="mini-main"><i /><i /><i /><b /><em /></span></span>
            <span className="settings-appearance-theme-label">{item}<span className="settings-appearance-radio" aria-hidden="true" /></span>
          </label>)}
        </div>
        <div className="settings-appearance-rows">
          <SettingRow label="终端主题" description="让终端跟随 SanBao 的亮暗主题，或保留在终端中手动选择的亮暗色。">{select('terminal-theme')}</SettingRow>
          <SettingRow label="终端链接使用内置浏览器" description="关闭时使用系统默认浏览器打开 HTTP 和 HTTPS 链接。"><Toggle label="终端链接使用内置浏览器" checked={linksInBrowser} onChange={value => { setLinksInBrowser(value); localChange('终端链接使用内置浏览器', value ? '开启' : '关闭'); }} /></SettingRow>
          <SettingRow label="语言" description="控制转写时显示在屏幕右侧的界面样式。">{select('language')}</SettingRow>
          <SettingRow label="字体风格" description="控制转写时显示在屏幕右侧的界面样式。">{select('font-style')}</SettingRow>
          <SettingRow label="内容宽度" description="调整任务内容和输入区的最大宽度。">{select('content-width')}</SettingRow>
          <SettingRow label="文件图标" description="选择任务正文和行间文件引用使用的文件图标风格。">{select('file-icons')}</SettingRow>
          <SettingRow label="模糊与玻璃效果" description="控制弹窗遮罩模糊、玻璃浮层等视觉效果；关闭后界面会使用实色背景。"><Toggle label="模糊与玻璃效果" checked={glass} onChange={value => { setGlass(value); localChange('模糊与玻璃效果', value ? '开启' : '关闭'); }} /></SettingRow>
          <SettingRow label="工作台噪点" description="在森林主题的工作台外框上叠加细微纹理。"><Toggle label="工作台噪点" checked={noise} onChange={value => { setNoise(value); localChange('工作台噪点', value ? '开启' : '关闭'); }} /></SettingRow>
        </div>
        </div>
      </section>
      <section className="settings-appearance-app-section" aria-labelledby="settings-app-heading">
        <h2 id="settings-app-heading">应用图标</h2>
        <div className="settings-appearance-app-card">
          <div className="settings-appearance-app-heading"><div><h3>图标样式</h3><p>选择 SanBao 在程序坞中使用的图标。</p></div><div className="settings-appearance-icon-control"><span>图标外观</span>{select('icon-appearance')}</div></div>
          <div className="settings-appearance-app-options" role="radiogroup" aria-label="应用图标样式">{['SanBao'].map(item => <label key={item} className={`settings-appearance-app-option ${appIcon === item ? 'selected' : ''}`}>
            <input type="radio" name={`${radioName}-app-icon`} value={item} checked={appIcon === item} onChange={() => { setAppIcon(item); localChange('应用图标', item); }} />
            <span className="settings-appearance-app-previews"><span className="icon-light"><BrandAppIcon tone="light" /><small>浅色</small></span><span className="icon-dark"><BrandAppIcon tone="dark" /><small>深色</small></span></span>
            <span className="settings-appearance-app-label"><span className="settings-appearance-radio" aria-hidden="true" />{item}</span>
          </label>)}</div>
          <p className="settings-appearance-icon-note">图标使用 SanBao 品牌资产，仅用于本地布局预览。</p>
        </div>
      </section>
      <p className="settings-appearance-local-note" role="status">{notice}</p>
    </div>
  </div>;
}
