import React, { useState } from 'react';
import { Icon, Toggle } from '../components/Controls';

type Props = { onNotice: (message: string) => void; onPreview?: () => void };

const MOBILE_CAPABILITIES = [
  ['查看 Agent 进度', '在移动端查看正在进行的任务、步骤与当前状态。'],
  ['处理审批', '在需要你确认时接收并处理待办事项。'],
  ['追加指令', '为现有任务补充说明，再回到桌面端继续处理。'],
  ['预览验收成果', '查看任务结果并完成验收前的确认。'],
];

export function SettingsMobilePage({ onNotice, onPreview }: Props) {
  const [remoteControl, setRemoteControl] = useState(false);
  const [keepAwake, setKeepAwake] = useState(false);
  const updateRemoteControl = (value: boolean) => {
    setRemoteControl(value);
    onNotice(value
      ? '远程控制仅在本地原型中显示为开启；没有建立手机连接、控制桌面设备或保存设置。'
      : '远程控制仅在本地原型中显示为关闭；没有断开设备或修改任何系统设置。');
  };
  const updateKeepAwake = (value: boolean) => {
    setKeepAwake(value);
    onNotice(value
      ? '保持唤醒仅在本地原型中显示为开启；没有改变系统电源设置或创建后台任务。'
      : '保持唤醒仅在本地原型中显示为关闭；没有改变系统电源设置。');
  };
  const openPreview = () => {
    if (onPreview) { onPreview(); return; }
    const url = new URL(window.location.href);
    url.searchParams.set('state', 'QDR.P06.settings.mobile.partial');
    url.searchParams.set('mobileFlow', 'start');
    window.location.assign(url.toString());
  };
  return <section className="settings-mobile" aria-label="移动端设置">
    <div className="settings-mobile-content">
      <header className="settings-mobile-heading">
        <div><span className="settings-mobile-eyebrow">移动协作</span><h1 tabIndex={-1}>移动端</h1><p>在手机上查看 Agent 进度、处理审批、补充指令，并预览验收成果。</p></div>
        <span className="settings-mobile-device-icon" aria-hidden="true"><Icon name="monitor" size={22} /></span>
      </header>

      <section className="settings-mobile-section" aria-labelledby="mobile-capabilities-heading">
        <div className="settings-mobile-section-heading"><div><h2 id="mobile-capabilities-heading">可协作事项</h2><p>以下文字来自已记录的移动端页面说明；页面完整布局与手机端运行仍待核验。</p></div><button type="button" className="secondary-button" onClick={() => onNotice('“获取移动端”的打开与下载流程尚未采集；原型没有打开外部页面、下载应用或生成配对信息。')}>获取移动端</button></div>
        <div className="settings-mobile-capability-grid">{MOBILE_CAPABILITIES.map(([title, description], index) => <article key={title} className="settings-mobile-capability"><span aria-hidden="true">0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>
      </section>

      <section className="settings-mobile-section"><div className="settings-mobile-card"><div><h3>手机协作流程预览</h3><p>以 Sanbao 设计状态展示发起、进度、审批、补充指令和成果验收。</p></div><button type="button" className="secondary-button" onClick={openPreview}>打开手机原型</button></div></section>

      <section className="settings-mobile-section" aria-labelledby="mobile-connection-heading">
        <h2 id="mobile-connection-heading">连接与设备</h2>
        <div className="settings-mobile-card">
          <div className="settings-mobile-connection-status"><span className="settings-mobile-status-dot" aria-hidden="true" /><div><h3>配对信息尚未采集</h3><p>本地原型不会显示二维码、配对码、设备名称或连接状态。</p></div></div>
          <button type="button" className="secondary-button" onClick={() => onNotice('移动端连接与配对流程尚未采集；原型没有生成配对码、扫描二维码或读取设备信息。')}>连接移动端</button>
        </div>
        <div className="settings-mobile-card settings-mobile-settings-card">
          <div className="settings-mobile-row"><div><h3>远程控制桌面设备</h3><p>原产品观察时该开关为关闭。切换后的保存、授权和设备控制均未验证。</p></div><Toggle label="远程控制桌面设备" checked={remoteControl} onChange={updateRemoteControl} /></div>
          <div className="settings-mobile-row"><div><h3>保持唤醒</h3><p>原产品观察时该开关为关闭。它与系统电源设置、后台连接的关系仍待核验。</p></div><Toggle label="保持唤醒" checked={keepAwake} onChange={updateKeepAwake} /></div>
        </div>
      </section>

      <p className="settings-mobile-boundary" role="note"><Icon name="bolt" size={14} />这是 `QD0-05` 的本地 fixture：未验证移动端下载、手机运行、设备配对、开关持久化或 DSH Host 事件链。</p>
    </div>
  </section>;
}
