import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon, Modal, Toggle } from '../components/Controls';

const MENUS = {
  'input-device': { label: '输入设备', value: '自动', options: ['自动', 'Default - MacBook Pro麦克风 (Built-in)', 'MacBook Pro麦克风 (Built-in)'] },
  tone: { label: '播报音色', value: 'Amy', options: ['Amy', 'Siqi Liu （刘思齐）', 'Evan', 'Anna Su', 'Anna', 'Lily', 'Lufeng'] },
  speed: { label: '播报速度', value: '正常', options: ['慢速', '正常', '快速'] },
  duration: { label: '录音纪要最长时长', value: '5 分钟', options: ['5 分钟', '7 分钟', '10 分钟'] },
} as const;
type VoicePanel = keyof typeof MENUS;
export type VoiceVariant = 'voice' | 'voice.shortcut.edit' | 'voice.word.draft' | `voice.${VoicePanel}.open`;
type Props = { variant?: string; onNavigate: (variant: VoiceVariant) => void; onNotice: (message: string) => void };
const WORD_FIXTURE = 'sanbao-fixture';
const wordForVariant = (variant: string) => variant === 'voice.word.draft' ? WORD_FIXTURE : '';

function VoiceRow({ label, description, children, className = '' }: { label: string; description: string; children?: ReactNode; className?: string }) {
  return <div className={`settings-basic-row ${className}`}><div className="settings-basic-row-copy"><h3>{label}</h3><p>{description}</p></div>{children && <div className="settings-basic-row-control">{children}</div>}</div>;
}

function VoiceSelect({ panel, open, onOpen, onClose, onNotice }: { panel: VoicePanel; open: boolean; onOpen: () => void; onClose: () => void; onNotice: Props['onNotice'] }) {
  const data = MENUS[panel];
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), menu = useRef<HTMLDivElement>(null);
  const closing = useRef(onClose);
  closing.current = onClose;
  const firstFocus = useRef<'first' | 'last' | null>(null);
  const [upward, setUpward] = useState(false);
  const triggerId = `voice-${panel}-trigger`, menuId = `voice-${panel}-options`;
  const close = (restore = true) => { closing.current(); if (restore) trigger.current?.focus({ preventScroll: true }); };
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      if (!root.current || !menu.current) return;
      const scroller = root.current.closest('.settings-voice');
      const bounds = scroller?.getBoundingClientRect();
      const anchor = root.current.getBoundingClientRect();
      if (bounds && (anchor.top < bounds.top + 12 || anchor.bottom > bounds.bottom - 12)) root.current.scrollIntoView({ block: 'center' });
      const current = root.current.getBoundingClientRect();
      setUpward(panel === 'duration' || panel !== 'input-device' && !!bounds && current.bottom + menu.current.offsetHeight + 8 > bounds.bottom && current.top - menu.current.offsetHeight - 8 >= bounds.top);
      if (!menu.current.contains(document.activeElement) && !document.querySelector('.modal[role="dialog"]')) {
        const options = Array.from(menu.current.querySelectorAll<HTMLButtonElement>('[role="option"]'));
        const target = firstFocus.current === 'first' ? options[0] : firstFocus.current === 'last' ? options.at(-1) : menu.current.querySelector<HTMLButtonElement>('[aria-selected="true"]');
        target?.focus({ preventScroll: true });
      }
      firstFocus.current = null;
    });
    const outside = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('.product-window') || event.target.closest('.modal-backdrop, [role="dialog"]')) return;
      if (!root.current?.contains(event.target as Node)) closing.current();
    };
    document.addEventListener('pointerdown', outside);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointerdown', outside); };
  }, [open, panel]);
  const choose = () => onNotice(panel === 'input-device' ? '输入设备选值结果尚未采集；菜单仅为本机取证快照，保留自动，未枚举设备、授权或调用麦克风。' : `“${data.label}”的选值效果尚未采集；保留${data.value}，未保存偏好、播放声音或连接语音服务。`);
  const keys = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
    if (event.key === 'Tab') { close(); return; }
    const options = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') || []);
    const index = options.indexOf(document.activeElement as HTMLButtonElement);
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : event.key === 'ArrowDown' ? (index + 1) % options.length : (index - 1 + options.length) % options.length;
      options[next]?.focus();
    }
  };
  return <div className="settings-voice-select" ref={root}>
    <button type="button" ref={trigger} id={triggerId} role="combobox" aria-label={data.label} aria-expanded={open} aria-haspopup="listbox" aria-controls={open ? menuId : undefined} className="settings-basic-select" onClick={() => open ? close() : onOpen()} onKeyDown={event => {
      if (event.nativeEvent.isComposing) return;
      if (open && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault(); firstFocus.current = event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : null; onOpen();
    }}><span>{data.value}</span><Icon name="down" size={12} /></button>
    {open && <div ref={menu} id={menuId} className={`settings-voice-options${upward ? ' settings-voice-options-up' : ''}${panel === 'input-device' ? ' settings-voice-device-options' : ''}`} role="listbox" aria-label={data.label} data-focus-return={triggerId} onKeyDown={keys}>
      {data.options.map(option => <button type="button" key={option} role="option" aria-selected={option === data.value} tabIndex={option === data.value ? 0 : -1} onClick={choose}><span>{option}</span>{option === data.value && <Icon name="check" size={13} />}</button>)}
    </div>}
  </div>;
}

export function SettingsVoicePage({ variant = 'voice', onNavigate, onNotice }: Props) {
  const [word, setWord] = useState(() => wordForVariant(variant));
  const localTransition = useRef<{ variant: VoiceVariant; word: string } | null>(null), previousVariant = useRef(variant);
  const editTrigger = useRef<HTMLButtonElement>(null);
  const editing = variant === 'voice.shortcut.edit';
  const navigate = (next: VoiceVariant, nextWord = word) => { localTransition.current = { variant: next, word: nextWord }; onNavigate(next); };
  const closeOverlay = () => navigate(word === WORD_FIXTURE ? 'voice.word.draft' : 'voice');
  useEffect(() => {
    const previous = previousVariant.current;
    if (localTransition.current?.variant === variant) { setWord(localTransition.current.word); localTransition.current = null; }
    else setWord(wordForVariant(variant));
    previousVariant.current = variant;
    if (previous !== 'voice.shortcut.edit' || editing) return;
    const frame = requestAnimationFrame(() => {
      if (!document.querySelector('.modal[role="dialog"]') && (!document.activeElement || document.activeElement === document.body)) editTrigger.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [variant]);
  const updateWord = (value: string) => {
    setWord(value);
    const next = value === WORD_FIXTURE ? 'voice.word.draft' : 'voice';
    if (next !== variant) navigate(next, value);
    if (value && value !== WORD_FIXTURE) onNotice('该词汇的原生草稿状态尚未采集；仅保留本地文字，未添加或保存词汇。');
    else onNotice('');
  };
  const unknown = (label: string) => onNotice(`“${label}”的操作尚未采集；仅展示稳定默认值，未修改设置、请求麦克风、录音或连接语音服务。`);
  const select = (panel: VoicePanel) => <VoiceSelect panel={panel} open={variant === `voice.${panel}.open`} onOpen={() => navigate(`voice.${panel}.open`)} onClose={closeOverlay} onNotice={onNotice} />;
  const toggle = (label: string, checked: boolean) => <Toggle label={label} checked={checked} onChange={() => unknown(label)} />;
  const addWord = () => { if (word.trim()) onNotice('常用词添加结果尚未采集；仅保留本地草稿，未保存词汇或调用语音服务。'); };
  const recordingNotice = () => onNotice('实时语音快捷键的录制、保存和冲突规则尚未采集；当前仍为 ⌘ ⇧ L，未注册快捷键或启动语音。');
  return <section className="settings-basic settings-voice" aria-label="语音设置">
    <div className="settings-basic-content">
      <h1 id="settings-voice-heading" tabIndex={-1}>语音</h1>
      <p className="settings-basic-subtitle">集中配置语音输入与实时语音；低风险偏好会立即保存。</p>
      <section className="settings-basic-section" aria-label="通用"><h2>通用</h2><div className="settings-basic-card">
        <VoiceRow label="输入设备" description="选择用于语音输入的麦克风；自动会跟随系统当前设备。">{select('input-device')}</VoiceRow>
      </div></section>
      <section className="settings-basic-section" aria-label="语音输入"><h2>语音输入</h2><div className="settings-basic-card">
        <VoiceRow label="语音输入" description="开启后可在当前 Chat 输入框中使用麦克风、快捷键和 DJI Mic 进行语音输入。">{toggle('语音输入', true)}</VoiceRow>
        <VoiceRow label="语音识别润色" description="自动修正口语停顿、重复和标点，让转写结果更适合直接发送。">{toggle('语音识别润色', true)}</VoiceRow>
        <VoiceRow label="声纹识别" description="根据本次录音开头的声音特征降低周围人声干扰；下一次录音时生效。">{toggle('语音输入：声纹识别', true)}</VoiceRow>
        <VoiceRow label="自动发送" description="使用 DJI Mic Mini 2 Qoder 合作套装时，单击开始录音，再次单击结束录音并自动发送。">{toggle('自动发送', true)}</VoiceRow>
        <div className="settings-basic-row settings-voice-vocabulary"><div className="settings-basic-row-copy"><h3><label htmlFor="voice-word-draft">常用词纠正</label></h3><p>添加专有名词或术语，提升识别准确率。</p></div>
          <form onSubmit={event => { event.preventDefault(); addWord(); }}><input id="voice-word-draft" aria-label="添加词汇" placeholder="添加词汇" value={word} onChange={event => updateWord(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); if (!event.nativeEvent.isComposing) addWord(); } }} /><button type="submit" disabled={!word.trim()}>添加</button></form>
        </div>
        <VoiceRow label="暂无语音输入历史" description="在 Chat 输入框完成语音输入后，记录会显示在这里。" className="settings-voice-history" />
      </div></section>
      <section className="settings-basic-section" aria-label="实时语音"><h2>实时语音</h2><div className="settings-basic-card">
        <VoiceRow label="实时语音快捷键" description="在当前聚焦的 Chat 输入框中开始实时语音，或结束正在进行的实时语音。"><span className="settings-voice-keys">{['⌘', '⇧', 'L'].map(key => <kbd key={key}>{key}</kbd>)}</span><button ref={editTrigger} id="voice-shortcut-edit-trigger" type="button" className="settings-voice-edit" aria-label="修改实时语音快捷键" title="修改快捷键" onClick={() => navigate('voice.shortcut.edit')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 4 5 5M4 15 15 4a3.5 3.5 0 0 1 5 5L9 20l-6 1Z" /></svg></button></VoiceRow>
        <VoiceRow label="播报音色" description="新实时语音连接使用所选音色。">{select('tone')}</VoiceRow>
        <VoiceRow label="播报速度" description="新实时语音连接使用所选速度。">{select('speed')}</VoiceRow>
        <VoiceRow label="声纹识别" description="新实时语音任务优先识别已保存的声纹；关闭不会删除已有声纹。">{toggle('实时语音：声纹识别', false)}</VoiceRow>
        <VoiceRow label="屏幕上下文" description="当你提到屏幕内容时，允许实时语音将检查请求交给 Backend Agent。">{toggle('屏幕上下文', true)}</VoiceRow>
      </div></section>
      <section className="settings-basic-section" aria-label="录音纪要"><h2>录音纪要</h2><div className="settings-basic-card">
        <VoiceRow label="录音纪要最长时长" description="到达上限后自动停止并保存录音和转写。">{select('duration')}</VoiceRow>
      </div></section>
    </div>
    {editing && <Modal title="修改“实时语音快捷键”快捷键" className="settings-shortcuts-modal settings-voice-shortcut-modal" onClose={closeOverlay}>
      <p className="settings-shortcuts-edit-description">按下包含 ⌘/Ctrl、⌃ 或 Option/Alt 的新组合键。Escape 可取消修改。</p>
      <div className="settings-shortcuts-current"><span>当前快捷键</span><span className="settings-voice-keys"><kbd>⌘</kbd><kbd>⇧</kbd><kbd>L</kbd></span></div>
      <button type="button" className="settings-shortcuts-record" data-autofocus aria-label="按下新快捷键" onClick={recordingNotice} onKeyDown={event => {
        if (event.nativeEvent.isComposing || ['Tab', 'Escape'].includes(event.key) || ((event.metaKey || event.ctrlKey) && ['g', 'k'].includes(event.key.toLowerCase()))) return;
        if ((event.metaKey || event.ctrlKey || event.altKey) && !['Meta', 'Control', 'Alt', 'Shift'].includes(event.key)) { event.preventDefault(); event.stopPropagation(); recordingNotice(); }
      }}>按下新快捷键</button>
      <p className="settings-shortcuts-record-help">录制区已聚焦，直接按下新的组合键。</p>
      <div className="settings-shortcuts-modal-footer"><button type="button" onClick={closeOverlay}>取消</button><button type="button" disabled>保存快捷键</button></div>
    </Modal>}
  </section>;
}
