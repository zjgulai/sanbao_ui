import React from 'react';
import { Icon } from '../components/Controls';

const STATISTICS = ['近一年 Credits 消耗', 'Credits 日峰值', '当前连续活跃天数', '累计活跃天数'];

function ProfileActionIcon({ action }: { action: 'edit' | 'share' | 'achievement' }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {action === 'edit' ? <><path d="m14 4 6 6M4 20l4-1L20 7a2 2 0 0 0-3-3L5 16Z" /><path d="M13 20h7" /></> : action === 'share' ? <><path d="M12 15V3m-4 4 4-4 4 4M6 10H4v11h16V10h-2" /></> : <><path d="M8 3h8v6a4 4 0 0 1-8 0ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4M12 13v6m-4 2h8m-6-2h4" /></>}
  </svg>;
}

export function SettingsProfilePage({ onNotice }: { onNotice: (message: string) => void }) {
  const unavailable = (action: string, boundary: string) => onNotice(`“${action}”后续操作尚未采集；当前仅为本地资料示例，${boundary}。`);
  return <section className="settings-profile" aria-label="个人资料">
    <div className="settings-profile-content">
      <header className="settings-profile-header">
        <button type="button" className="settings-profile-avatar" aria-label="编辑头像" onClick={() => unavailable('编辑头像', '未修改或上传头像')}><span aria-hidden="true">三</span><span className="settings-profile-avatar-edit" aria-hidden="true"><ProfileActionIcon action="edit" /></span></button>
        <div className="settings-profile-identity">
          <div className="settings-profile-name-row"><h1 id="settings-profile-heading" tabIndex={-1}>三宝设计团队</h1><button type="button" className="settings-profile-role" aria-label="选择身份：全栈开发 · 设计师…" onClick={() => unavailable('选择身份', '未改变身份或账户资料')}><span>全栈开发 · 设计师…</span><Icon name="down" size={11} /></button></div>
          <div className="settings-profile-email"><span>demo@example.invalid</span><button type="button" aria-label="复制邮箱" title="复制邮箱" onClick={() => unavailable('复制邮箱', '未写入剪贴板')}><Icon name="copy" size={13} /></button></div>
        </div>
        <div className="settings-profile-actions">
          <button type="button" aria-label="编辑资料" onClick={() => unavailable('编辑资料', '未打开编辑表单或保存资料')}><ProfileActionIcon action="edit" /><span>编辑</span></button>
          <button type="button" aria-label="分享个人资料" onClick={() => unavailable('分享个人资料', '未分享或打开外部页面')}><ProfileActionIcon action="share" /><span>分享</span></button>
          <button type="button" aria-label="成就墙" onClick={() => unavailable('成就墙', '未打开成就页面')}><ProfileActionIcon action="achievement" /><span>成就墙</span><i aria-hidden="true" /></button>
        </div>
      </header>

      <section className="settings-profile-activity" aria-label="活动统计">
        <button type="button" className="settings-profile-stat-scope" aria-label="统计范围：Qoder" onClick={() => unavailable('统计范围', '未切换统计范围或请求账户数据')}>Qoder<Icon name="down" size={12} /></button>
        <dl className="settings-profile-stats">{STATISTICS.map(label => <div key={label}><dt>{label}</dt><dd>0</dd></div>)}</dl>
      </section>

      <section className="settings-profile-account" aria-labelledby="settings-profile-account-heading">
        <h2 id="settings-profile-account-heading">账户与订阅</h2>
        <div className="settings-profile-account-card">
          <div className="settings-profile-account-row"><div><h3>当前计划</h3><p>当前账户的订阅套餐</p></div><span className="settings-profile-plan">体验版</span></div>
          <div className="settings-profile-account-row"><div><h3>退出登录</h3><p>清除本机登录凭证；本地任务和设置不会被删除。</p></div><button type="button" className="settings-profile-signout" aria-label="退出登录" onClick={() => unavailable('退出登录', '未退出账户、清除凭证或删除本地数据')}>退出登录</button></div>
        </div>
      </section>
      <p className="settings-profile-fixture-note">虚构资料与统计，仅用于本地原型评审。</p>
    </div>
  </section>;
}
