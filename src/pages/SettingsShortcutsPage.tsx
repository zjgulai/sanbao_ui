import React, { useEffect, useRef, useState } from 'react';
import { Icon, Modal } from '../components/Controls';

type Shortcut = { label: string; description: string; keys: string[] };
const SHORTCUT_GROUPS: { title: string; shortcuts: Shortcut[] }[] = [
  { title: '导航', shortcuts: [
    { label: '设置', description: '打开 Qoder 设置。', keys: ['⌘', ','] },
    { label: '返回', description: '在工作台导航历史中返回上一页。', keys: ['⌘', '['] },
    { label: '前进', description: '在工作台导航历史中前进到下一页。', keys: ['⌘', ']'] },
    { label: '切换工作模式', description: '在编程模式和通用模式之间切换。', keys: ['⌃', 'Tab'] },
    { label: '切换任务', description: '搜索并切换到另一个任务。', keys: ['⌘', 'G'] },
    { label: '打开或关闭左侧栏', description: '切换工作台左侧导航栏的展开状态。', keys: ['⌘', 'B'] },
  ] },
  { title: '任务', shortcuts: [
    { label: '新任务', description: '从当前工作台打开新的 Chat 输入页。', keys: ['⌘', 'N'] },
    { label: '搜索当前任务', description: '在当前可见的 ChatSession 中打开任务搜索。', keys: ['⌘', 'F'] },
    { label: '打开或关闭右侧栏', description: '切换当前任务或新任务的右侧工作区栏。', keys: ['⌘', '⇧', 'B'] },
  ] },
  { title: '语音', shortcuts: [
    { label: '开始或停止语音输入', description: '在当前聚焦的消息输入框中切换语音输入。', keys: ['⌘', '⇧', 'V'] },
    { label: '实时语音快捷键', description: '在当前聚焦的 Chat 输入框中开始实时语音，或结束正在进行的实时语音。', keys: ['⌘', '⇧', 'L'] },
    { label: '静音或恢复实时语音播报', description: '不切换当前焦点，静音或恢复正在进行的实时语音播报。', keys: ['⌘', '⇧', 'S'] },
    { label: '启用或禁用实时语音麦克风', description: '不切换当前焦点，启用或禁用正在进行的实时语音麦克风。', keys: ['⌘', '⇧', 'M'] },
  ] },
  { title: '系统', shortcuts: [
    { label: '新建窗口', description: '在桌面端打开一个新的 Qoder 窗口。', keys: ['⌘', '⇧', 'N'] },
    { label: '问题反馈', description: '打开问题反馈窗口并自动附带当前截图。', keys: ['⌘', '⌥', 'F'] },
  ] },
];

const EMPTY_QUERY = 'sanbao-fixture-no-match-20260921';
const queryForVariant = (variant: string) => variant === 'shortcuts.search.voice' ? '语音' : variant === 'shortcuts.search.empty' ? EMPTY_QUERY : '';

function SendShortcutSelect({ open, onOpen, onClose, onNotice }: { open: boolean; onOpen: () => void; onClose: () => void; onNotice: (message: string) => void }) {
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), list = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose), closing = useRef(false);
  closeRef.current = onClose;
  const close = (restore = true) => {
    if (closing.current) return;
    closing.current = true; closeRef.current();
    if (restore) trigger.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    closing.current = false;
    const frame = requestAnimationFrame(() => {
      if (!document.querySelector('.modal[role="dialog"]') && !list.current?.contains(document.activeElement)) list.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
    });
    const outside = (event: PointerEvent) => {
      const target = event.target as Element;
      if (target.closest('.product-window') && !target.closest('.modal-backdrop') && !root.current?.contains(target)) close(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  return <div ref={root} className="settings-shortcuts-send" onBlur={event => {
    const target = event.relatedTarget as Element | null;
    if (open && target?.closest('.product-window') && !target.closest('.modal-backdrop') && !event.currentTarget.contains(target)) close(false);
  }}>
    <button ref={trigger} id="settings-shortcuts-send-trigger" type="button" role="combobox" aria-label="发送消息" aria-expanded={open} aria-haspopup="listbox" aria-controls={open ? 'settings-shortcuts-send-options' : undefined} className="settings-basic-select" onClick={() => open ? close() : onOpen()} onKeyDown={event => { if (event.nativeEvent.isComposing) return; if (open && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; } if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); onOpen(); } }}><span>Enter</span><Icon name="down" size={12} /></button>
    {open && <div ref={list} id="settings-shortcuts-send-options" role="listbox" aria-label="发送消息快捷键" data-focus-return="settings-shortcuts-send-trigger" className="settings-shortcuts-send-menu" onKeyDown={event => {
      if (event.nativeEvent.isComposing) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
      if (event.key === 'Tab') { close(); return; }
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const options = Array.from(list.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') || []), index = options.indexOf(document.activeElement as HTMLButtonElement);
        options[event.key === 'Home' ? 0 : event.key === 'End' ? 1 : (index + 1) % 2]?.focus();
      }
    }}>{['Enter', '⌘ Enter'].map((option, index) => <button type="button" role="option" aria-selected={index === 0} tabIndex={index === 0 ? 0 : -1} key={option} onClick={() => onNotice('发送消息快捷键的选值结果尚未采集；保留 Enter，未保存设置。')}><span>{option}</span>{index === 0 && <Icon name="check" size={13} />}</button>)}</div>}
  </div>;
}

export function SettingsShortcutsPage({ variant = 'shortcuts', onNavigate, onNotice }: { variant?: string; onNavigate: (variant: string) => void; onNotice: (message: string) => void }) {
  const [query, setQuery] = useState(() => queryForVariant(variant));
  const previousVariant = useRef(variant), localTransition = useRef<{ variant: string; query: string } | null>(null);
  const editTrigger = useRef<HTMLButtonElement>(null);
  const menuOpen = variant === 'shortcuts.send-menu.open', editOpen = variant === 'shortcuts.edit.settings';
  const navigate = (next: string, nextQuery = query) => { localTransition.current = { variant: next, query: nextQuery }; onNavigate(next); };
  useEffect(() => {
    const previous = previousVariant.current;
    if (localTransition.current?.variant === variant) { setQuery(localTransition.current.query); localTransition.current = null; }
    else setQuery(queryForVariant(variant));
    previousVariant.current = variant;
    if (previous !== 'shortcuts.edit.settings' || editOpen) return;
    const frame = requestAnimationFrame(() => {
      if (!document.querySelector('.modal[role="dialog"]') && (!document.activeElement || document.activeElement === document.body)) editTrigger.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [variant]);
  const searchNotice = () => onNotice('快捷键搜索结果尚未采集；文字仅作为本地草稿保留，仍展示全部 16 项。');
  const updateQuery = (value: string) => {
    setQuery(value);
    const next = value === '语音' ? 'shortcuts.search.voice' : value === EMPTY_QUERY ? 'shortcuts.search.empty' : 'shortcuts';
    if (next !== variant) navigate(next, value);
    if (value && next === 'shortcuts') searchNotice();
    else onNotice('');
  };
  const empty = query === EMPTY_QUERY, voice = query === '语音';
  const recordingNotice = () => onNotice('新组合键录制、保存和冲突规则尚未采集；当前快捷键仍为 ⌘ ,，未修改设备设置。');
  return <section className="settings-basic settings-shortcuts" aria-label="快捷键设置">
    <div className="settings-basic-content">
      <h1 id="settings-shortcuts-heading" tabIndex={-1}>快捷键</h1>
      <p className="settings-basic-subtitle">搜索、查看并修改 Qoder 内置命令的快捷键。修改后会立即保存在当前设备。</p>
      <section className="settings-basic-section" aria-label="应用快捷键"><h2>应用快捷键</h2><div className="settings-basic-card">
        <div className="settings-basic-row settings-shortcuts-search-row">
          <div className="settings-basic-row-copy"><h3><label htmlFor="settings-shortcuts-query">搜索快捷键</label></h3><p>共 16 个快捷键，0 个已自定义。</p></div>
          <div className="settings-shortcuts-search"><Icon name="search" size={14} /><input id="settings-shortcuts-query" aria-label="搜索快捷键" placeholder="搜索命令、说明或组合键" value={query} onChange={event => updateQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing) { event.preventDefault(); if (query && !voice && !empty) searchNotice(); } }} /></div>
        </div>
      </div></section>
      {empty ? <section className="settings-basic-section" aria-label="没有匹配的快捷键"><h2>没有匹配的快捷键</h2><div className="settings-basic-card"><div className="settings-basic-row"><div className="settings-basic-row-copy"><h3>没有匹配的快捷键</h3><p>没有找到包含“{EMPTY_QUERY}”的命令、说明或组合键。</p></div><button type="button" className="settings-basic-action" onClick={() => { updateQuery(''); document.getElementById('settings-shortcuts-query')?.focus(); }}>清空搜索</button></div></div></section> : <>
      {!voice && <section className="settings-basic-section" aria-label="输入"><h2>输入</h2><div className="settings-basic-card">
        <div className="settings-basic-row settings-shortcuts-command">
          <div className="settings-basic-row-copy"><h3>发送消息</h3><p>聊天输入框使用 ⌘ Enter 换行，也可用 Shift Enter。运行中支持插话时，⌘ Enter 仍用于插话。</p></div>
          <div className="settings-basic-row-control"><SendShortcutSelect open={menuOpen} onOpen={() => navigate('shortcuts.send-menu.open')} onClose={() => navigate('shortcuts')} onNotice={onNotice} /></div>
        </div>
      </div></section>}
      {SHORTCUT_GROUPS.filter(group => !voice || group.title === '语音').map(group => <section className="settings-basic-section" aria-label={group.title} key={group.title}><h2>{group.title}</h2><div className="settings-basic-card">
        {group.shortcuts.map(shortcut => <div className="settings-basic-row settings-shortcuts-command" key={shortcut.label}>
          <div className="settings-basic-row-copy"><h3>{shortcut.label}</h3><p>{shortcut.description}</p></div>
          <div className="settings-basic-row-control"><span className="settings-shortcuts-keys">{shortcut.keys.map((key, index) => <kbd key={index}>{key}</kbd>)}</span><button ref={shortcut.label === '设置' ? editTrigger : undefined} type="button" className="settings-shortcuts-edit" aria-label={`修改${shortcut.label}快捷键`} title="修改快捷键" onClick={() => shortcut.label === '设置' ? navigate('shortcuts.edit.settings') : onNotice(`“${shortcut.label}”的快捷键编辑尚未采集；未打开编辑器、注册或保存快捷键。`)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 4 5 5M4 15 15 4a3.5 3.5 0 0 1 5 5L9 20l-6 1Z" /></svg></button></div>
        </div>)}
      </div></section>)}</>}
    </div>
    {editOpen && <Modal title="修改“设置”快捷键" className="settings-shortcuts-modal" onClose={() => navigate('shortcuts')}>
      <p className="settings-shortcuts-edit-description">按下包含 ⌘/Ctrl、⌃ 或 Option/Alt 的新组合键。Escape 可取消修改。</p>
      <div className="settings-shortcuts-current"><span>当前快捷键</span><span className="settings-shortcuts-keys"><kbd>⌘</kbd><kbd>,</kbd></span></div>
      <button type="button" className="settings-shortcuts-record" data-autofocus aria-label="按下新快捷键" onClick={recordingNotice} onKeyDown={event => {
        if (event.nativeEvent.isComposing || ['Tab', 'Escape'].includes(event.key) || ((event.metaKey || event.ctrlKey) && ['g', 'k'].includes(event.key.toLowerCase()))) return;
        if ((event.metaKey || event.ctrlKey || event.altKey) && !['Meta', 'Control', 'Alt', 'Shift'].includes(event.key)) { event.preventDefault(); event.stopPropagation(); recordingNotice(); }
      }}>按下新快捷键</button>
      <p className="settings-shortcuts-record-help">录制区已聚焦，直接按下新的组合键。</p>
      <div className="settings-shortcuts-modal-footer"><button type="button" onClick={() => navigate('shortcuts')}>取消</button><button type="button" disabled>保存快捷键</button></div>
    </Modal>}
  </section>;
}
