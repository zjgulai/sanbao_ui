import React, { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Icon, Modal } from '../components/Controls';

type CustomMcpProps = { initialVariant: string; onNavigate: (id: string) => void; onNotice: (message: string) => void; onClose: () => void };
type Transport = '' | 'stdio' | 'http' | 'sse';
type Pair = { name: string; value: string };
const IDS = { form: 'QDR.O08.mcp.form.empty', json: 'QDR.O08.mcp.json.default', transport: 'QDR.O08.mcp.transport.open', stdio: 'QDR.O08.mcp.form.stdio', http: 'QDR.O08.mcp.form.http', header: 'QDR.O08.mcp.http.header-row', sse: 'QDR.O08.mcp.form.sse', named: 'QDR.O08.mcp.name.preview', discard: 'QDR.O08.mcp.discard.open', argument: 'QDR.O08.mcp.stdio.argument-row', env: 'QDR.O08.mcp.stdio.environment-row' };
const VARIANTS: Record<string, string> = { form: 'form', json: 'json', transport: 'transport', stdio: 'stdio', http: 'http', header: 'http-header', sse: 'sse', named: 'sse-named', discard: 'discard', argument: 'stdio-argument', env: 'stdio-env' };
const INITIAL_JSON = JSON.stringify({ mcpServers: { example: { type: 'streamable-http', url: 'https://example.com/mcp' } } }, null, 2);
const modeOf = (variant: string) => variant.replace('extensions-connectors-mcp-', '');
const transportOf = (mode: string): Transport => mode.startsWith('stdio') ? 'stdio' : mode.startsWith('http') ? 'http' : mode.startsWith('sse') || mode === 'discard' ? 'sse' : '';
const emptyPair = (): Pair => ({ name: '', value: '' });

function TrashIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" /></svg>;
}

function DiscardConfirmation({ keepEditing, discard }: { keepEditing: () => void; discard: () => void }) {
  const keep = useRef<HTMLButtonElement>(null), leave = useRef<HTMLButtonElement>(null);
  return <Modal title="放弃未保存的修改？" className="custom-mcp-discard" onClose={keepEditing}>
    <div onKeyDown={event => {
      if (event.nativeEvent.isComposing || event.key !== 'Tab') return;
      event.preventDefault();
      (document.activeElement === keep.current ? leave : keep).current?.focus();
    }}>
      <p>关闭后，本次表单或 JSON 修改不会保留。</p>
      <footer><button ref={keep} type="button" data-autofocus onClick={keepEditing}>继续编辑</button><button ref={leave} type="button" className="custom-mcp-danger" onClick={discard}>放弃修改</button></footer>
    </div>
  </Modal>;
}

export function CustomMcpDialog({ initialVariant, onNavigate, onNotice, onClose }: CustomMcpProps) {
  const initial = modeOf(initialVariant);
  const [jsonMode, setJsonMode] = useState(initial === 'json');
  const [transport, setTransport] = useState<Transport>(transportOf(initial));
  const [menuOpen, setMenuOpen] = useState(initial === 'transport');
  const [discardOpen, setDiscardOpen] = useState(initial === 'discard');
  const [name, setName] = useState(initial === 'sse-named' || initial === 'discard' ? 'sanbao-fixture' : '');
  const [command, setCommand] = useState(''), [directory, setDirectory] = useState(''), [address, setAddress] = useState('');
  const [json, setJson] = useState(INITIAL_JSON);
  const [headers, setHeaders] = useState<Pair[]>(initial === 'http-header' ? [emptyPair()] : []);
  const [args, setArgs] = useState<string[]>(initial === 'stdio-argument' ? [''] : []);
  const [environment, setEnvironment] = useState<Pair[]>(initial === 'stdio-env' ? [emptyPair()] : []);
  const [rowView, setRowView] = useState(initial === 'stdio-env' ? 'env' : 'argument');
  // Local dirty rule: editing, selecting a transport, or changing rows stays dirty
  // until discard/reset. Returning fields to their original values does not clear it.
  const [dirty, setDirty] = useState(Boolean(transportOf(initial)));
  const id = useId();
  const transportRoot = useRef<HTMLDivElement>(null), options = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null);
  const formTab = useRef<HTMLButtonElement>(null), jsonTab = useRef<HTMLButtonElement>(null), cancel = useRef<HTMLButtonElement>(null), nameInput = useRef<HTMLInputElement>(null);
  const headerAdd = useRef<HTMLButtonElement>(null), argumentAdd = useRef<HTMLButtonElement>(null), environmentAdd = useRef<HTMLButtonElement>(null);
  const openRef = useRef(menuOpen), openingIndex = useRef(0), internalRoute = useRef<string | null>(null), previousVariant = useRef(initialVariant), previousDiscard = useRef(discardOpen);
  const returnRoute = useRef<string>(IDS.named);
  openRef.current = menuOpen;
  const pending = (action: string) => onNotice(`“${action}”的操作结果尚未采集；仅保留本地草稿，未保存 MCP 配置、启动进程、连接服务或授权账户。`);
  const formId = transport === 'stdio' ? rowView === 'env' && environment.length ? IDS.env : args.length ? IDS.argument : environment.length ? IDS.env : IDS.stdio : transport === 'http' ? headers.length ? IDS.header : IDS.http : transport === 'sse' ? name === 'sanbao-fixture' ? IDS.named : IDS.sse : IDS.form;
  const route = (next: string) => {
    const key = Object.keys(IDS).find(key => IDS[key as keyof typeof IDS] === next)!;
    const nextVariant = `extensions-connectors-mcp-${VARIANTS[key]}`;
    if (initialVariant === nextVariant) return;
    internalRoute.current = nextVariant;
    onNavigate(next);
  };

  useEffect(() => {
    if (previousVariant.current === initialVariant) return;
    previousVariant.current = initialVariant;
    if (internalRoute.current === initialVariant) { internalRoute.current = null; return; }
    internalRoute.current = null;
    const mode = modeOf(initialVariant);
    setMenuOpen(mode === 'transport'); setDiscardOpen(mode === 'discard');
    if (mode === 'discard') { returnRoute.current = jsonMode ? IDS.json : formId; return; }
    setJsonMode(mode === 'json');
    if (mode === 'json' || mode === 'transport') return;
    const next = transportOf(mode);
    setTransport(next);
    if (next) setDirty(true);
    if (mode === 'http-header' && !headers.length) setHeaders([emptyPair()]);
    if (mode === 'stdio-argument') { if (!args.length) setArgs(['']); setRowView('argument'); }
    if (mode === 'stdio-env') { if (!environment.length) setEnvironment([emptyPair()]); setRowView('env'); }
    if (mode === 'sse-named') setName('sanbao-fixture');
  }, [initialVariant]);
  useEffect(() => {
    if (!transportOf(initial) || initial === 'discard') return;
    const frame = requestAnimationFrame(() => {
      const modal = trigger.current?.closest('.modal[role="dialog"]');
      if (Array.from(document.querySelectorAll('.modal[role="dialog"]')).at(-1) !== modal || document.activeElement !== formTab.current && document.activeElement !== document.body) return;
      const target = initial === 'sse-named' ? nameInput.current : initial === 'http-header' ? headerAdd.current : initial === 'stdio-argument' ? argumentAdd.current : initial === 'stdio-env' ? environmentAdd.current : trigger.current;
      target?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    const returning = previousDiscard.current && !discardOpen;
    previousDiscard.current = discardOpen;
    if (!returning) return;
    const frame = requestAnimationFrame(() => {
      if ((!document.activeElement || document.activeElement === document.body) && Array.from(document.querySelectorAll('.modal[role="dialog"]')).at(-1) === cancel.current?.closest('.modal')) cancel.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [discardOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    const frame = requestAnimationFrame(() => {
      const ownModal = transportRoot.current?.closest('.modal[role="dialog"]');
      if (Array.from(document.querySelectorAll('.modal[role="dialog"]')).at(-1) !== ownModal || options.current?.contains(document.activeElement)) return;
      options.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')[openingIndex.current]?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [menuOpen]);
  const closeMenu = (restore = false) => {
    if (!openRef.current) return;
    openRef.current = false; setMenuOpen(false); route(formId);
    if (restore) trigger.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    if (!menuOpen) return;
    const outside = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target, ownModal = transportRoot.current?.closest('.custom-mcp-dialog');
      if (transportRoot.current?.contains(target) || target.closest('.custom-mcp-dialog') !== ownModal || target.closest('[data-mcp-navigation], .modal-heading')) return;
      closeMenu();
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [menuOpen, formId, onNavigate]);
  const openMenu = (index = transport ? ['stdio', 'http', 'sse'].indexOf(transport) : 0) => {
    openingIndex.current = index;
    if (openRef.current) { options.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')[index]?.focus(); return; }
    openRef.current = true; setMenuOpen(true); route(IDS.transport);
  };
  const menuKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (!menuOpen) { if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); openMenu(event.key === 'ArrowUp' ? 2 : 0); } return; }
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeMenu(true); return; }
    if (event.key === 'Tab') { trigger.current?.focus(); closeMenu(); return; }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const items = Array.from(options.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? []), index = items.indexOf(document.activeElement as HTMLButtonElement);
    items[event.key === 'Home' ? 0 : event.key === 'End' ? 2 : event.key === 'ArrowDown' ? (index + 1) % 3 : (index + 2) % 3]?.focus();
  };
  const chooseTransport = (next: Transport) => {
    openRef.current = false; setMenuOpen(false); setTransport(next); setDirty(true);
    if (next === 'stdio') setRowView(args.length ? 'argument' : 'env');
    route(next === 'stdio' ? args.length ? IDS.argument : environment.length ? IDS.env : IDS.stdio : next === 'http' ? headers.length ? IDS.header : IDS.http : name === 'sanbao-fixture' ? IDS.named : IDS.sse);
    trigger.current?.focus({ preventScroll: true });
  };
  const switchTab = (nextJson: boolean) => {
    if (nextJson === jsonMode && !menuOpen) return;
    openRef.current = false; setMenuOpen(false); setJsonMode(nextJson); route(nextJson ? IDS.json : formId);
  };
  const tabKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.nativeEvent.isComposing || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextJson = event.key === 'End' || event.key !== 'Home' && !jsonMode;
    switchTab(nextJson); (nextJson ? jsonTab : formTab).current?.focus();
  };
  const requestClose = () => {
    if (!dirty) { onClose(); return; }
    returnRoute.current = jsonMode ? IDS.json : formId;
    openRef.current = false; setMenuOpen(false); setDiscardOpen(true); route(IDS.discard);
  };
  const keepEditing = () => { setDiscardOpen(false); route(returnRoute.current); };
  const editName = (value: string) => {
    setName(value); setDirty(true);
    if (transport === 'sse') route(value === 'sanbao-fixture' ? IDS.named : IDS.sse);
  };
  const addRow = (kind: 'header' | 'argument' | 'env') => {
    if ((kind === 'header' ? headers : kind === 'argument' ? args : environment).length) { onNotice('本批仅演示一条动态行；更多行的原生行为尚未采集，这不是原产品行数上限。'); return; }
    setDirty(true);
    if (kind === 'header') { setHeaders([emptyPair()]); if (transport === 'http') route(IDS.header); }
    else if (kind === 'argument') { setArgs(['']); setRowView('argument'); route(IDS.argument); }
    else { setEnvironment([emptyPair()]); setRowView('env'); route(IDS.env); }
  };
  const removeRow = (kind: 'header' | 'argument' | 'env') => {
    setDirty(true);
    if (kind === 'header') { setHeaders([]); if (transport === 'http') route(IDS.http); }
    else if (kind === 'argument') { setArgs([]); setRowView('env'); route(environment.length ? IDS.env : IDS.stdio); }
    else { setEnvironment([]); setRowView('argument'); route(args.length ? IDS.argument : IDS.stdio); }
    (kind === 'header' ? headerAdd : kind === 'argument' ? argumentAdd : environmentAdd).current?.focus({ preventScroll: true });
  };
  const pairRows = (kind: 'header' | 'env', rows: Pair[]) => rows.map((row, index) => {
    const label = kind === 'header' ? 'Header' : '环境变量';
    const update = (key: keyof Pair, value: string) => { setDirty(true); const next = rows.map((item, i) => i === index ? { ...item, [key]: value } : item); (kind === 'header' ? setHeaders : setEnvironment)(next); };
    return <div className="custom-mcp-dynamic-row" key={index}>
      <input aria-label={`${label} ${index + 1} 的名称`} placeholder={kind === 'header' ? 'Header 名称' : '变量名'} value={row.name} onChange={event => update('name', event.target.value)} />
      <input aria-label={`${label} ${index + 1} 的值`} placeholder="值" value={row.value} onChange={event => update('value', event.target.value)} />
      <button type="button" aria-label={kind === 'header' ? `移除 Header ${index + 1}` : `移除环境变量 ${index + 1}`} onClick={() => removeRow(kind)}><TrashIcon /></button>
    </div>;
  });
  return <><Modal title="添加自定义 MCP" className={`custom-mcp-dialog ${jsonMode ? 'custom-mcp-json' : transport === 'stdio' ? 'custom-mcp-stdio' : transport ? 'custom-mcp-network' : 'custom-mcp-form'} ${headers.length && transport === 'http' ? 'custom-mcp-with-header' : ''} ${args.length || environment.length ? 'custom-mcp-with-rows' : ''}`} onClose={requestClose}>
    <p className="custom-mcp-intro">添加用户级 MCP Server。配置将保存到 <code>~/.qoder/settings.json</code> 的 <code>mcpServers</code> 字段。</p>
    <div className="custom-mcp-tabs" role="tablist" aria-label="MCP 配置方式" onKeyDown={tabKeys}>
      <button ref={formTab} type="button" role="tab" id={`${id}-form-tab`} aria-controls={`${id}-form`} aria-selected={!jsonMode} tabIndex={!jsonMode ? 0 : -1} data-autofocus={!jsonMode ? true : undefined} data-mcp-navigation onClick={() => switchTab(false)}>表单</button>
      <button ref={jsonTab} type="button" role="tab" id={`${id}-json-tab`} aria-controls={`${id}-json`} aria-selected={jsonMode} tabIndex={jsonMode ? 0 : -1} data-autofocus={jsonMode ? true : undefined} data-mcp-navigation onClick={() => switchTab(true)}>JSON</button>
    </div>
    <form className="custom-mcp-form-content" noValidate onSubmit={event => { event.preventDefault(); pending(jsonMode ? '预览导入' : '添加 MCP'); }}>
      <div className="custom-mcp-body">
        {jsonMode ? <div id={`${id}-json`} role="tabpanel" aria-labelledby={`${id}-json-tab`}><textarea aria-label="标准 MCP JSON" spellCheck={false} value={json} onChange={event => { setJson(event.target.value); setDirty(true); }} /></div> : <div id={`${id}-form`} role="tabpanel" aria-labelledby={`${id}-form-tab`}>
          <div className="custom-mcp-field"><label htmlFor={`${id}-name`}>MCP 名称</label><input ref={nameInput} id={`${id}-name`} aria-label="MCP 名称" placeholder="例如 github-search" value={name} onChange={event => editName(event.target.value)} /><p>{transport === 'sse' && name === 'sanbao-fixture' ? 'Agent 将看到 serverName：sanbao_fixture' : name ? '此名称的 serverName 规则尚未采集。' : '输入名称后将显示传给 Agent 的 serverName。'}</p></div>
          <div className="custom-mcp-field custom-mcp-transport" ref={transportRoot} onKeyDown={menuKeys}>
            <label id={`${id}-transport-label`}>传输类型</label>
            <button ref={trigger} type="button" className="custom-mcp-select" role="combobox" aria-labelledby={`${id}-transport-label`} aria-haspopup="listbox" aria-expanded={menuOpen} aria-controls={menuOpen ? `${id}-transport-options` : undefined} onClick={() => menuOpen ? closeMenu(true) : openMenu()}><span className={transport ? '' : 'placeholder'}>{transport ? transport.toUpperCase() : '选择传输类型'}</span><Icon name="down" size={12} /></button>
            {menuOpen && <div ref={options} id={`${id}-transport-options`} role="listbox" aria-label="MCP 传输类型" className="custom-mcp-options">{(['stdio', 'http', 'sse'] as Transport[]).map(option => <button type="button" role="option" key={option} aria-selected={option === transport} tabIndex={-1} onClick={() => chooseTransport(option)}><span>{option.toUpperCase()}</span>{option === transport && <Icon name="check" size={12} />}</button>)}</div>}
          </div>
          {transport === 'stdio' && <div className="custom-mcp-stdio-fields">
            <div className="custom-mcp-field"><label htmlFor={`${id}-command`}>命令</label><input id={`${id}-command`} aria-label="命令" placeholder="例如 npx 或 python" value={command} onChange={event => { setCommand(event.target.value); setDirty(true); }} /></div>
            <div className="custom-mcp-field custom-mcp-collection"><div><span>参数</span><button ref={argumentAdd} type="button" onClick={() => addRow('argument')}><Icon name="plus" size={12} />添加参数</button></div>{args.map((value, index) => <div className="custom-mcp-dynamic-row custom-mcp-argument-row" key={index}><input aria-label={`参数 ${index + 1}`} placeholder="输入一个参数" value={value} onChange={event => { setArgs([event.target.value]); setDirty(true); }} /><button type="button" aria-label={`移除参数 ${index + 1}`} onClick={() => removeRow('argument')}><TrashIcon /></button></div>)}</div>
            <div className="custom-mcp-field"><label htmlFor={`${id}-directory`}>工作目录（可选）</label><input id={`${id}-directory`} aria-label="工作目录（可选）" placeholder="/absolute/path" value={directory} onChange={event => { setDirectory(event.target.value); setDirty(true); }} /><p>用户级 stdio MCP 只接受绝对路径。</p></div>
            <div className="custom-mcp-field custom-mcp-collection"><div><span>环境变量</span><button ref={environmentAdd} type="button" onClick={() => addRow('env')}><Icon name="plus" size={12} />添加变量</button></div>{pairRows('env', environment)}</div>
          </div>}
          {(transport === 'http' || transport === 'sse') && <div className="custom-mcp-network-fields"><div className="custom-mcp-field"><label htmlFor={`${id}-address`}>服务地址</label><input id={`${id}-address`} type="url" aria-label="服务地址" placeholder="https://example.com/mcp" value={address} onChange={event => { setAddress(event.target.value); setDirty(true); }} /><p>支持 HTTP 或 HTTPS。不要在 URL 中放入 token 或密码。</p></div><div className="custom-mcp-field custom-mcp-collection"><div><span>请求头</span><button ref={headerAdd} type="button" onClick={() => addRow('header')}><Icon name="plus" size={12} />添加 Header</button></div>{pairRows('header', headers)}</div></div>}
        </div>}
      </div>
      <footer className="custom-mcp-footer"><button ref={cancel} type="button" className="custom-mcp-cancel" data-mcp-navigation onClick={requestClose}>取消</button><button type="submit" className="custom-mcp-primary">{jsonMode ? '预览导入' : '添加 MCP'}</button></footer>
    </form>
  </Modal>{discardOpen && <DiscardConfirmation keepEditing={keepEditing} discard={onClose} />}</>;
}
