import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon, Modal } from '../components/Controls';

export type ModelsVariant = 'models' | 'models.add.default' | 'models.provider.open' | 'models.add.deepseek' | 'models.deepseek.models.open' | 'models.deepseek.type.open' | 'models.discard.open' | 'models.add.openai-compatible' | 'models.openai-compatible.api-type.open' | 'models.add.anthropic-compatible';
type Props = { variant?: string; onNavigate: (variant: ModelsVariant) => void; onNotice: (message: string) => void };
type Provider = 'aliyun' | 'deepseek' | 'openai-compatible' | 'anthropic-compatible';
type Panel = 'provider' | 'type' | 'models' | 'api-type';
const PROVIDER_NAMES: Record<Provider, string> = { aliyun: '阿里云百炼 - 中国', deepseek: 'DeepSeek', 'openai-compatible': 'OpenAI Compatible', 'anthropic-compatible': 'Anthropic Compatible' };
const PROVIDERS = [
  { group: '推荐', names: ['阿里云百炼 - 中国', '阿里云百炼 - 新加坡', '阿里云百炼 - 美国', '千问AI平台 - 中国', '千问AI平台 - 新加坡'] },
  { group: '更多', names: ['智谱 - 中国', '智谱 - 国际', 'Kimi', 'MiniMax - 中国', 'MiniMax - 国际', 'DeepSeek', '小米 MIMO - 中国', 'OpenAI', 'Google', 'OpenRouter'] },
  { group: '自定义', names: ['OpenAI Compatible', 'Anthropic Compatible'] },
] as const;
const providerFor = (variant: string): Provider => variant.includes('openai-compatible') ? 'openai-compatible' : variant.includes('anthropic-compatible') ? 'anthropic-compatible' : variant.includes('.deepseek') || variant === 'models.discard.open' ? 'deepseek' : 'aliyun';
const panelFor = (variant: string): Panel | null => variant === 'models.provider.open' ? 'provider' : variant === 'models.deepseek.type.open' ? 'type' : variant === 'models.deepseek.models.open' ? 'models' : variant === 'models.openai-compatible.api-type.open' ? 'api-type' : null;

function ModelSelect({ panel, label, value, open, onOpen, onClose, children }: { panel: Panel; label: string; value: string; open: boolean; onOpen: () => void; onClose: () => void; children?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), menu = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose), first = useRef<'first' | 'last' | null>(null);
  closeRef.current = onClose;
  const triggerId = `models-${panel}-trigger`, menuId = `models-${panel}-options`;
  const items = () => Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('[role="option"], [role="menuitemcheckbox"]') || []);
  const close = (restore = true) => { closeRef.current(); if (restore) trigger.current?.focus({ preventScroll: true }); };
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      if (Array.from(document.querySelectorAll('.modal[role="dialog"]')).at(-1) !== root.current?.closest('.modal') || menu.current?.contains(document.activeElement)) return;
      const choices = items();
      const selected = menu.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
      (first.current === 'last' ? choices.at(-1) : first.current === 'first' ? choices[0] : selected ?? choices[0])?.focus({ preventScroll: true });
      first.current = null;
    });
    const outside = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('.product-window') || !event.target.closest('.settings-models-dialog') || event.target.closest('[data-models-select]')) return;
      if (!root.current?.contains(event.target)) closeRef.current();
    };
    document.addEventListener('pointerdown', outside);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  const keys = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
    if (event.key === 'Tab') { close(); return; }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const choices = items(), index = choices.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : event.key === 'ArrowDown' ? (index + 1) % choices.length : (index - 1 + choices.length) % choices.length;
    choices[next]?.focus();
  };
  return <div ref={root} className="settings-models-select" data-models-select={panel}>
    <button ref={trigger} id={triggerId} type="button" role="combobox" aria-label={label} aria-description={panel === 'models' ? '已选择 0 个模型' : undefined} aria-expanded={open} aria-haspopup={panel === 'models' ? 'menu' : 'listbox'} aria-controls={open ? menuId : undefined} data-autofocus={panel === 'provider' ? true : undefined} onClick={() => open ? close() : onOpen()} onKeyDown={event => {
      if (event.nativeEvent.isComposing) return;
      if (open && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (open) { (event.key === 'End' ? items().at(-1) : items()[0])?.focus(); return; }
      first.current = event.key === 'End' ? 'last' : event.key === 'Home' ? 'first' : null; onOpen();
    }}><span>{value}</span><Icon name="down" size={12} /></button>
    {open && <div ref={menu} id={menuId} className={`settings-models-options settings-models-options-${panel}`} role={panel === 'models' ? 'menu' : 'listbox'} aria-label={label} data-focus-return={triggerId} onKeyDown={keys}>{children}</div>}
  </div>;
}

export function SettingsModelsPage({ variant = 'models', onNavigate, onNotice }: Props) {
  const [provider, setProvider] = useState<Provider>(() => providerFor(variant));
  const [compatibleDiscard, setCompatibleDiscard] = useState(false);
  const localRoute = useRef<ModelsVariant | null>(null), previous = useRef(variant), addTrigger = useRef<HTMLButtonElement>(null);
  const cancelTrigger = useRef<HTMLButtonElement>(null);
  const keepEditing = useRef<HTMLButtonElement>(null), discardTrigger = useRef<HTMLButtonElement>(null);
  const focusAddAfterDiscard = useRef(false);
  const compatible = provider === 'openai-compatible' || provider === 'anthropic-compatible';
  const open = variant !== 'models', discard = variant === 'models.discard.open' || compatibleDiscard, panel = panelFor(variant);
  const providerName = PROVIDER_NAMES[provider];
  const formVariant: ModelsVariant = provider === 'aliyun' ? 'models.add.default' : `models.add.${provider}`;
  const navigate = (next: ModelsVariant) => { if (next === variant) return; localRoute.current = next; onNavigate(next); };
  const pending = (action: string) => onNotice(`“${action}”的结果尚未采集；仅保留本地表单，未校验或保存凭据、添加模型、访问供应商或调用模型服务。`);
  const closeForm = () => compatible ? setCompatibleDiscard(true) : navigate(provider === 'deepseek' ? 'models.discard.open' : 'models');
  const continueEditing = () => compatibleDiscard ? setCompatibleDiscard(false) : navigate(formVariant);
  const leave = () => {
    // A search reset may leave the generic modal return target on the review bar.
    focusAddAfterDiscard.current = true;
    setCompatibleDiscard(false);
    setProvider('aliyun');
    navigate('models');
  };
  useEffect(() => {
    const before = previous.current;
    if (localRoute.current === variant) localRoute.current = null;
    else { localRoute.current = null; setProvider(providerFor(variant)); setCompatibleDiscard(false); }
    previous.current = variant;
    const forceAddFocus = focusAddAfterDiscard.current && variant === 'models';
    const target = forceAddFocus || (before !== 'models' && !open) ? addTrigger : before === 'models.discard.open' && !discard ? cancelTrigger : null;
    if (!target) return;
    const frame = requestAnimationFrame(() => {
      const top = Array.from(document.querySelectorAll('.modal[role="dialog"]')).at(-1);
      if (forceAddFocus) {
        focusAddAfterDiscard.current = false;
        addTrigger.current?.focus({ preventScroll: true });
        return;
      }
      if ((!document.activeElement || document.activeElement === document.body) && (!top || top.contains(target.current))) target.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [variant]);
  const selectProvider = (name: string) => {
    const next = (Object.keys(PROVIDER_NAMES) as Provider[]).find(key => key !== 'aliyun' && PROVIDER_NAMES[key] === name);
    if (!next || next === 'aliyun') { pending(`选择供应商 ${name}`); return; }
    setProvider(next); setCompatibleDiscard(false); onNotice(''); navigate(`models.add.${next}`);
  };
  const openPanel = (next: Panel) => {
    if (next === 'provider') { if (provider === 'deepseek') onNotice('从 DeepSeek 再次展开供应商属于本地草稿演示；只接入已采集的供应商表单。'); navigate('models.provider.open'); return; }
    if (next === 'api-type' && provider === 'openai-compatible') { navigate('models.openai-compatible.api-type.open'); return; }
    if (provider !== 'deepseek') { pending(next === 'type' ? 'Token plan 类型' : '阿里云模型列表'); return; }
    navigate(next === 'type' ? 'models.deepseek.type.open' : 'models.deepseek.models.open');
  };
  return <section className="settings-basic settings-models" aria-label="模型设置">
    <div className="settings-basic-content"><header className="settings-models-heading"><div><h1 id="settings-models-heading" tabIndex={-1}>模型</h1><p>使用自有 API Key 管理自定义模型。</p></div><button ref={addTrigger} id="models-add-trigger" type="button" aria-label="添加模型" onClick={() => navigate('models.add.default')}><Icon name="plus" size={14} />添加模型</button></header>
      <div className="settings-models-empty"><span><Icon name="settings" size={25} /></span><p>暂无自定义模型，点击添加模型开始使用</p></div>
    </div>
    {open && <Modal title="添加模型" className="settings-models-dialog" onClose={closeForm}>
      <button type="button" className="settings-models-feedback" onClick={() => pending('反馈')}>反馈</button>
      <form noValidate onSubmit={event => { event.preventDefault(); pending(compatible ? '下一步' : '校验并添加模型'); }}>
        <div className="settings-models-fields">
          <div className="settings-models-field"><label>供应商</label><ModelSelect panel="provider" label="供应商" value={providerName} open={panel === 'provider'} onOpen={() => openPanel('provider')} onClose={() => navigate(formVariant)}>
            {PROVIDERS.map(group => <div role="group" aria-label={group.group} key={group.group}><h3>{group.group}</h3>{group.names.map(name => <button type="button" role="option" aria-selected={name === providerName} tabIndex={name === providerName ? 0 : -1} key={name} onClick={() => selectProvider(name)}><span>{name}</span>{name === providerName && <Icon name="check" size={13} />}</button>)}</div>)}
          </ModelSelect></div>
          {compatible ? <>
            {provider === 'openai-compatible' && <div className="settings-models-field"><label>API 类型</label><ModelSelect panel="api-type" label="API 类型" value="Chat Completions API" open={panel === 'api-type'} onOpen={() => openPanel('api-type')} onClose={() => navigate(formVariant)}>{['Chat Completions API', 'Responses API'].map(option => <button type="button" role="option" aria-selected={option === 'Chat Completions API'} tabIndex={option === 'Chat Completions API' ? 0 : -1} key={option} onClick={() => pending(`选择 ${option}`)}><span>{option}</span>{option === 'Chat Completions API' && <Icon name="check" size={13} />}</button>)}</ModelSelect></div>}
            <div className="settings-models-field"><label htmlFor="models-endpoint-draft">接口地址（Base URL）</label><input className="settings-models-text" id="models-endpoint-draft" aria-label="接口地址（Base URL）" placeholder="https://api.example.com/v1" value="" readOnly autoComplete="off" onClick={() => pending('录入接口地址')} /></div>
          </> : <>
            <div className="settings-models-field"><div className="settings-models-label"><label>类型</label>{provider === 'aliyun' && <button type="button" onClick={() => pending('购买 Token Plan')}>购买 Token Plan<span aria-hidden="true">↗</span></button>}</div><ModelSelect panel="type" label="类型" value={provider === 'deepseek' ? '按量付费' : 'Token plan'} open={panel === 'type'} onOpen={() => openPanel('type')} onClose={() => navigate(formVariant)}><button type="button" role="option" aria-selected="true" onClick={() => pending('按量付费选值')}><span>按量付费</span><Icon name="check" size={13} /></button></ModelSelect></div>
            <div className="settings-models-field"><label>模型</label><ModelSelect panel="models" label="选择模型" value="选择模型" open={panel === 'models'} onOpen={() => openPanel('models')} onClose={() => navigate(formVariant)}>{['全选', 'DeepSeek-V4-Pro', 'DeepSeek-Flash'].map(name => <button type="button" role="menuitemcheckbox" aria-checked="false" key={name} onClick={() => pending(`选择模型 ${name}`)}><i aria-hidden="true" /><span>{name}</span></button>)}</ModelSelect></div>
          </>}
          <div className="settings-models-field"><div className="settings-models-label"><label htmlFor="models-api-draft">API Key</label>{!compatible && <button type="button" onClick={() => pending('获取 API Key')}>获取 API Key<span aria-hidden="true">↗</span></button>}</div><div className="settings-models-key"><input id="models-api-draft" type="password" aria-label="API Key" placeholder="请输入 API Key" autoComplete="off" spellCheck={false} value="" readOnly onClick={() => pending('录入 API Key')} /><button type="button" aria-label="显示 API Key" onClick={() => pending('显示 API Key')}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg></button></div></div>
          {compatible && <div className="settings-models-field"><div className="settings-models-label"><label htmlFor="models-id-draft">Model ID</label><button type="button" aria-label="添加 Model ID" onClick={() => pending('添加 Model ID')}><Icon name="plus" size={12} />添加 Model ID</button></div><div className="settings-models-id-row"><input className="settings-models-text" id="models-id-draft" aria-label="Model ID" placeholder="例如 qwen3.8-max" value="" readOnly autoComplete="off" onClick={() => pending('录入 Model ID')} /><button type="button" aria-label="移除 Model ID" disabled><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" /></svg></button></div></div>}
        </div>
        <footer className="settings-models-footer"><button ref={cancelTrigger} type="button" onClick={closeForm}>取消</button><button type="submit" disabled>{compatible ? '下一步' : '校验并添加模型'}</button></footer>
      </form>
    </Modal>}
    {discard && <Modal title="放弃未保存的模型配置？" className="settings-models-discard" onClose={continueEditing}><div onKeyDown={event => {
      if (event.nativeEvent.isComposing || event.key !== 'Tab') return;
      event.preventDefault(); (document.activeElement === keepEditing.current ? discardTrigger : keepEditing).current?.focus();
    }}><p>关闭后，本次输入的 Endpoint、模型能力和 API Key 都会被清空。</p><footer><button ref={keepEditing} type="button" data-autofocus onClick={continueEditing}>继续编辑</button><button ref={discardTrigger} type="button" className="settings-models-danger" onClick={leave}>放弃更改</button></footer></div></Modal>}
  </section>;
}
