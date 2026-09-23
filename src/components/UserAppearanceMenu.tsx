import React, { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Controls';

const CHOICES = {
  language: { label: '语言', options: ['简体中文', 'English'], initial: '简体中文' },
  'color-mode': { label: '明暗模式', options: ['系统', '浅色', '深色'], initial: '浅色' },
  theme: { label: '主题', options: ['森林', '薄荷', '蜜蜂', '羊皮纸'], initial: '森林' },
  'font-style': { label: '字体风格', options: ['无衬线', '衬线'], initial: '无衬线' },
  'text-size': { label: '文字大小', options: ['小', '中', '大'], initial: '小' },
  'ui-scale': { label: '界面缩放', options: ['中', '大'], initial: '中' },
  'content-width': { label: '内容宽度', options: ['标准', '宽'], initial: '标准' },
} as const;
type ChoicePanel = keyof typeof CHOICES;
type MenuLevel = 'user' | 'appearance' | 'options';
export type UserAppearancePanel = 'user' | 'appearance' | ChoicePanel;
export type UserAppearanceMenuProps = {
  open: boolean;
  initialPanel?: UserAppearancePanel;
  onClose: () => void;
  onSettings: () => void;
  onPending: (id: string) => void;
  onNotice?: (message: string) => void;
  anchorRef?: RefObject<HTMLElement>;
};
const ROOT_ITEMS = [
  { key: 'settings', label: '设置', icon: 'settings', shortcut: '⌘ ,' },
  { key: 'pet', label: '显示宠物', icon: 'chat' },
  { key: 'appearance', label: '外观', icon: 'grid' },
  { key: 'changelog', label: '更新日志', icon: 'book' },
  { key: 'mobile', label: '获取移动端', icon: 'monitor' },
  { key: 'about', label: '关于 Qoder', icon: 'chat' },
  { key: 'logout', label: '退出登录', icon: 'arrow', separator: true },
];
const isChoice = (panel: UserAppearancePanel): panel is ChoicePanel => panel !== 'user' && panel !== 'appearance';
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
const firstFocus = (panel: UserAppearancePanel) => ({ level: isChoice(panel) ? 'options' as const : panel, key: isChoice(panel) ? CHOICES[panel].initial : panel === 'appearance' ? 'language' : 'settings' });

export function UserAppearanceMenu({ open, initialPanel = 'user', onClose, onSettings, onPending, onNotice, anchorRef }: UserAppearanceMenuProps) {
  const [panel, setPanel] = useState<UserAppearancePanel>(initialPanel);
  const [values, setValues] = useState<Record<ChoicePanel, string>>(() => Object.fromEntries(Object.entries(CHOICES).map(([key, value]) => [key, value.initial])) as Record<ChoicePanel, string>);
  const [notice, setNotice] = useState('');
  const [focusVersion, setFocusVersion] = useState(0);
  const [layout, setLayout] = useState({ compact: window.innerWidth < 660, user: { left: 10, top: 10 }, appearance: { left: 227, top: 10 }, options: { left: 437, top: 10 } });
  const host = useRef<HTMLSpanElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const menus = useRef<Record<MenuLevel, HTMLDivElement | null>>({ user: null, appearance: null, options: null });
  const callbacks = useRef({ onClose, onSettings, onPending, onNotice });
  callbacks.current = { onClose, onSettings, onPending, onNotice };
  const opener = useRef<HTMLElement | null>(document.activeElement instanceof HTMLElement ? document.activeElement : null);
  const firstPanel = useRef(initialPanel);
  const hasOpened = useRef(false);
  const pendingFocus = useRef<{ level: MenuLevel; key: string } | null>(firstFocus(initialPanel));
  const id = useId();
  const activeLevel: MenuLevel = isChoice(panel) ? 'options' : panel;
  const requestFocus = (level: MenuLevel, key: string) => { pendingFocus.current = { level, key }; setFocusVersion(value => value + 1); };
  const focusTrigger = () => { const target = anchorRef?.current || opener.current; if (target?.isConnected) target.focus({ preventScroll: true }); };
  const dismiss = () => { focusTrigger(); callbacks.current.onClose(); };
  const inform = (message: string) => { if (callbacks.current.onNotice) callbacks.current.onNotice(message); else setNotice(message); };
  const buttons = (level: MenuLevel) => Array.from(menus.current[level]?.querySelectorAll<HTMLButtonElement>(':scope > button') || []);

  useLayoutEffect(() => {
    if (!open) { pendingFocus.current = null; return; }
    const next = hasOpened.current ? 'user' : firstPanel.current;
    hasOpened.current = true;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPanel(next);
    setNotice('');
    pendingFocus.current = firstFocus(next);
    setFocusVersion(value => value + 1);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!layer.current?.contains(event.target as Node) && !anchorRef?.current?.contains(event.target as Node)) callbacks.current.onClose();
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open, anchorRef]);
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const anchor = anchorRef?.current?.getBoundingClientRect() || host.current?.getBoundingClientRect();
      if (!anchor) return;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const compact = viewportWidth < 660;
      const width = { user: 213, appearance: 206, options: 180 };
      const height = (level: MenuLevel) => menus.current[level]?.offsetHeight || 0;
      if (compact) {
        const left = clamp(anchor.left, 10, viewportWidth - Math.min(width[activeLevel], viewportWidth - 20) - 10);
        const top = clamp(anchor.top - height(activeLevel) - 8, 10, viewportHeight - height(activeLevel) - 10);
        setLayout({ compact, user: { left, top }, appearance: { left, top }, options: { left, top } });
        return;
      }
      const totalWidth = width.user + (panel !== 'user' ? width.appearance + 4 : 0) + (isChoice(panel) ? width.options + 4 : 0);
      const left = clamp(anchor.left, 10, viewportWidth - totalWidth - 10);
      const top = clamp(anchor.top - height('user') - 8, 10, viewportHeight - height('user') - 10);
      const appearanceOffset = buttons('user').find(button => button.dataset.menuKey === 'appearance')?.offsetTop || 68;
      const appearanceTop = clamp(top + appearanceOffset - 4, 10, viewportHeight - height('appearance') - 10);
      const optionOffset = buttons('appearance').find(button => button.dataset.menuKey === panel)?.offsetTop || 4;
      const optionsTop = clamp(appearanceTop + optionOffset - 4, 10, viewportHeight - height('options') - 10);
      setLayout({ compact, user: { left, top }, appearance: { left: left + width.user + 4, top: appearanceTop }, options: { left: left + width.user + width.appearance + 8, top: optionsTop } });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open, panel, anchorRef, activeLevel, layout.compact]);
  useLayoutEffect(() => {
    if (!open) return;
    const next = pendingFocus.current;
    if (!next || layout.compact && next.level !== activeLevel) return;
    const target = buttons(next.level).find(button => button.dataset.menuKey === next.key);
    if (!target) return;
    pendingFocus.current = null;
    target.focus({ preventScroll: true });
  }, [open, panel, focusVersion, layout.compact, activeLevel]);

  const openAppearance = (focus = false) => {
    setPanel('appearance');
    if (focus || layout.compact) requestFocus('appearance', 'language');
  };
  const openChoice = (key: ChoicePanel, focus = false) => {
    setPanel(key);
    if (focus || layout.compact) requestFocus('options', values[key]);
  };
  const returnToUser = (level: MenuLevel) => {
    if (level !== 'user') { setPanel('user'); requestFocus('user', 'appearance'); }
  };
  const choose = (choice: ChoicePanel, value: string) => {
    setValues(current => ({ ...current, [choice]: value }));
    inform(`本地菜单已选择${CHOICES[choice].label}：${value}。未更改 Qoder，原产品选择后的效果尚未验证。`);
  };
  const rootAction = (key: string) => {
    if (key === 'settings') callbacks.current.onSettings();
    else if (key === 'appearance') openAppearance(true);
    else if (key === 'pet') {
      if (callbacks.current.onNotice) { inform('显示宠物的原动作尚未实现；这里只打开相关的桌面宠物设置研究页。'); callbacks.current.onPending('QDR.P06.settings.pet.entry'); }
      else inform('显示宠物的原动作尚未实现；原型没有启动桌面宠物。');
    } else if (key === 'mobile') {
      if (callbacks.current.onNotice) { inform('获取移动端的打开行为尚未实现；这里只展示相关的移动端设置研究记录。'); callbacks.current.onPending('QDR.P06.settings.mobile.entry'); }
      else inform('获取移动端的打开行为尚未实现；原型没有下载或打开外部页面。');
    }
    else inform(key === 'logout' ? '退出登录入口尚未实现；原型没有退出任何账号。' : key === 'about' ? '关于 Qoder 的内容尚待采集；当前仅展示已观察到的菜单入口。' : '更新日志内容尚待采集；原型没有打开外部页面。');
  };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>, level: MenuLevel) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape' || event.key === 'Tab') { event.preventDefault(); event.stopPropagation(); dismiss(); return; }
    const items = buttons(level);
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const key = items[current]?.dataset.menuKey;
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault(); event.stopPropagation();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : event.key === 'ArrowDown' ? (current + 1) % items.length : current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length;
      const target = items[next];
      if (!target) return;
      if (level === 'user' && target.dataset.menuKey !== 'appearance') setPanel('user');
      else if (level === 'appearance') setPanel('appearance');
      requestFocus(level, target.dataset.menuKey!);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault(); event.stopPropagation(); returnToUser(level);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault(); event.stopPropagation();
      if (level === 'user' && key === 'appearance') openAppearance(true);
      if (level === 'appearance' && key && Object.hasOwn(CHOICES, key)) openChoice(key as ChoicePanel, true);
    } else if ((event.key === 'Enter' || event.key === ' ') && current >= 0) {
      event.preventDefault(); event.stopPropagation(); items[current].click();
    }
  };
  const menuStyle = (level: MenuLevel): CSSProperties => ({ ...layout[level], display: layout.compact && level !== activeLevel ? 'none' : undefined });
  const focusHover = (button: HTMLButtonElement) => button.focus({ preventScroll: true });

  return <><span ref={host} className="user-appearance-menu-anchor" aria-hidden="true" />{open && createPortal(<div ref={layer} className="user-appearance-menu-layer" data-local-preview="true">
    <div ref={node => { menus.current.user = node; }} className="user-appearance-menu user-appearance-root" style={menuStyle('user')} role="menu" aria-label="用户菜单" onKeyDown={event => keyDown(event, 'user')}>
      {ROOT_ITEMS.map(item => <React.Fragment key={item.key}>{item.separator && <div role="separator" className="user-appearance-separator" />}<button type="button" role="menuitem" data-menu-key={item.key} tabIndex={-1} className={item.key === 'appearance' && panel !== 'user' ? 'branch-open' : ''} aria-haspopup={item.key === 'appearance' ? 'menu' : undefined} aria-expanded={item.key === 'appearance' ? panel !== 'user' : undefined} aria-controls={item.key === 'appearance' && panel !== 'user' ? `${id}-appearance` : undefined} onMouseEnter={event => { focusHover(event.currentTarget); if (item.key === 'appearance') openAppearance(); else setPanel('user'); }} onClick={() => rootAction(item.key)}><Icon name={item.icon} size={15} /><span className="user-appearance-item-label">{item.label}</span>{item.shortcut && <kbd>{item.shortcut}</kbd>}{item.key === 'appearance' && <Icon name="chevron" size={12} />}</button></React.Fragment>)}
    </div>
    {panel !== 'user' && <div ref={node => { menus.current.appearance = node; }} id={`${id}-appearance`} className="user-appearance-menu user-appearance-parent" style={menuStyle('appearance')} role="menu" aria-label="快捷外观" onKeyDown={event => keyDown(event, 'appearance')}>
      {(Object.entries(CHOICES) as [ChoicePanel, typeof CHOICES[ChoicePanel]][]).map(([key, choice]) => <button type="button" key={key} role="menuitem" data-menu-key={key} tabIndex={-1} className={panel === key ? 'branch-open' : ''} aria-haspopup="menu" aria-expanded={panel === key} aria-controls={panel === key ? `${id}-options` : undefined} onMouseEnter={event => { focusHover(event.currentTarget); openChoice(key); }} onClick={() => openChoice(key, true)}><span className="user-appearance-item-label">{choice.label}</span><Icon name="chevron" size={12} /></button>)}
    </div>}
    {isChoice(panel) && <div ref={node => { menus.current.options = node; }} id={`${id}-options`} className="user-appearance-menu user-appearance-options" style={menuStyle('options')} role="menu" aria-label={`${CHOICES[panel].label}选项`} onKeyDown={event => keyDown(event, 'options')}>
      {CHOICES[panel].options.map(option => <button type="button" key={option} role="menuitemradio" aria-checked={values[panel] === option} data-menu-key={option} tabIndex={-1} onMouseEnter={event => focusHover(event.currentTarget)} onClick={() => choose(panel, option)}><span className="user-appearance-check" aria-hidden="true">{values[panel] === option && <Icon name="check" size={13} />}</span><span className="user-appearance-item-label">{option}</span></button>)}
    </div>}
    {notice && <p className="user-appearance-local-notice" role="status">{notice}</p>}
  </div>, document.body)}</>;
}
