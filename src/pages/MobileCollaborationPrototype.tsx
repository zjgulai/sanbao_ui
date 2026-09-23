import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Controls';

export const MOBILE_FLOWS = ['start', 'progress', 'approval', 'instruction', 'review', 'offline', 'expired', 'unavailable'] as const;
export type MobileFlow = typeof MOBILE_FLOWS[number];

type Props = {
  initialFlow: MobileFlow;
  onNavigate: (flow: MobileFlow) => void;
  onExit: () => void;
};

const flowTitles: Record<MobileFlow, string> = {
  start: '发起任务',
  progress: '任务进度',
  approval: '处理审批',
  instruction: '补充指令',
  review: '验收成果',
  offline: '等待连接',
  expired: '审批已过期',
  unavailable: '预览暂不可用',
};

const events = [
  ['正在整理范围', '刚刚', 'Agent 正在把任务拆成可核对的步骤。'],
  ['等待你的审批', '2 分钟前', '一项需要确认的动作正在等待处理。'],
  ['已更新任务摘要', '8 分钟前', '桌面端新增了一个可预览的结果摘要。'],
];

export function MobileCollaborationPrototype({ initialFlow, onNavigate, onExit }: Props) {
  const [flow, setFlow] = useState<MobileFlow>(initialFlow);
  const [taskDraft, setTaskDraft] = useState('整理本周发布前需要确认的页面与文案');
  const [instruction, setInstruction] = useState('请把移动端的验收入口放在任务摘要之后。');
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'accepted' | 'revision' | null>(null);
  const [notice, setNotice] = useState('所有数据均为本地原型示例。');

  useEffect(() => { setFlow(initialFlow); }, [initialFlow]);

  const go = (next: MobileFlow) => {
    setFlow(next);
    onNavigate(next);
  };
  const reset = () => {
    setTaskDraft('整理本周发布前需要确认的页面与文案');
    setInstruction('请把移动端的验收入口放在任务摘要之后。');
    setDecision(null);
    setReviewDecision(null);
    setNotice('本地手机流程已重置。');
    go('start');
  };
  const submitTask = () => {
    if (!taskDraft.trim()) return;
    setNotice('任务已在本地演示中创建；没有发送到桌面端。');
    go('progress');
  };
  const submitInstruction = () => {
    if (!instruction.trim()) return;
    setNotice('补充指令已加入本地事件流；没有发送到桌面端。');
    go('progress');
  };
  const makeDecision = (next: 'approved' | 'rejected') => {
    setDecision(next);
    setNotice(next === 'approved' ? '审批已在本地演示中批准。' : '审批已在本地演示中拒绝。');
  };
  const makeReviewDecision = (next: 'accepted' | 'revision') => {
    setReviewDecision(next);
    setNotice(next === 'accepted' ? '成果已在本地演示中验收。' : '已在本地演示中请求补充。');
  };

  return <main className="mobile-prototype" aria-label="Sanbao 移动协作原型">
    <section className="mobile-device" aria-label={`${flowTitles[flow]}手机界面`}>
      <header className="mobile-statusbar" aria-hidden="true"><span>9:41</span><span className="mobile-status-icons">● ◖ ▰</span></header>
      <div className="mobile-product-header">
        <button type="button" className="mobile-back" aria-label="返回桌面原型" onClick={onExit}>‹</button>
        <div><span>Sanbao 协作</span><strong>{flowTitles[flow]}</strong></div>
        <button type="button" className="mobile-reset" onClick={reset}>重置</button>
      </div>

      <div className="mobile-page" aria-live="polite">
        {flow === 'start' && <section className="mobile-flow-stack">
          <div className="mobile-hero"><span className="mobile-eyebrow">SANBAO DESIGN · F01</span><h1>把一件事交给桌面端</h1><p>手机只负责发起和跟进。复杂工作区、文件与配置仍在桌面端完成。</p></div>
          <label className="mobile-field"><span>任务目标</span><textarea aria-label="移动端任务目标" value={taskDraft} onChange={event => setTaskDraft(event.target.value)} placeholder="描述希望完成的事情" /></label>
          <div className="mobile-context-card"><span className="mobile-context-icon"><Icon name="folder" size={15} /></span><div><strong>paper-plane · 示例工作区</strong><small>来自已授权桌面任务的本地摘要</small></div><Icon name="chevron" size={14} /></div>
          <button type="button" className="mobile-primary" disabled={!taskDraft.trim()} onClick={submitTask}>开始本地演示 <Icon name="arrow" size={15} /></button>
          <button type="button" className="mobile-text-action" onClick={() => go('offline')}>模拟离线发起</button>
        </section>}

        {flow === 'progress' && <section className="mobile-flow-stack">
          <div className="mobile-task-title"><div><span className="mobile-eyebrow">SANBAO DESIGN · F02</span><h1>发布前页面核对</h1><p><i className="mobile-live-dot" />桌面任务正在处理</p></div><button type="button" className="mobile-icon-action" aria-label="刷新本地任务进度" onClick={() => setNotice('已刷新本地示例状态；没有读取桌面端。')}>↻</button></div>
          <div className="mobile-progress-card"><div><span>当前阶段</span><strong>整理页面与文案范围</strong></div><b>2 / 4</b><div className="mobile-progress-track"><span /></div><small>最近同步 · 刚刚</small></div>
          <section className="mobile-event-section"><div className="mobile-section-heading"><h2>最新进展</h2><button type="button" onClick={() => setNotice('事件详情将在桌面接缝验证后补齐。')}>查看全部</button></div>{events.map(([title, time, description]) => <article className="mobile-event" key={title}><span className="mobile-event-dot" /><div><strong>{title}</strong><small>{description}</small></div><time>{time}</time></article>)}</section>
          <div className="mobile-action-grid"><button type="button" onClick={() => go('approval')}><Icon name="bolt" size={16} /><span>处理审批</span><small>1 项待办</small></button><button type="button" onClick={() => go('instruction')}><Icon name="chat" size={16} /><span>补充指令</span><small>继续当前任务</small></button><button type="button" onClick={() => go('review')}><Icon name="check" size={16} /><span>查看成果</span><small>预览验收摘要</small></button></div>
          <button type="button" className="mobile-text-action" onClick={() => go('offline')}>模拟桌面不可用</button>
        </section>}

        {flow === 'approval' && <section className="mobile-flow-stack">
          <div className="mobile-hero compact"><span className="mobile-eyebrow">SANBAO DESIGN · F03</span><h1>需要你的确认</h1><p>审批范围与实际执行接缝等待桌面端验证；此处只演示手机决策流程。</p></div>
          <div className="mobile-approval-card"><div className="mobile-approval-top"><span className="mobile-context-icon"><Icon name="bolt" size={15} /></span><div><strong>允许更新发布说明</strong><small>影响范围 · 1 个说明文件</small></div><time>10:30 到期</time></div><p>桌面 Agent 请求将验收入口补充到发布说明中。手机端只展示影响摘要，不执行文件变更。</p><ul><li>任务：发布前页面核对</li><li>动作：更新说明草稿</li><li>结果：回到任务进度等待同步</li></ul></div>
          {decision ? <div className="mobile-result-note"><Icon name="check" size={15} /><span>{decision === 'approved' ? '已批准本地演示动作' : '已拒绝本地演示动作'}</span></div> : <div className="mobile-decision-actions"><button type="button" className="mobile-secondary" onClick={() => makeDecision('rejected')}>拒绝</button><button type="button" className="mobile-primary" onClick={() => makeDecision('approved')}>批准本地演示</button></div>}
          <button type="button" className="mobile-text-action" onClick={() => go('expired')}>模拟审批已过期</button>
        </section>}

        {flow === 'instruction' && <section className="mobile-flow-stack mobile-composer-flow">
          <div className="mobile-hero compact"><span className="mobile-eyebrow">SANBAO DESIGN · F04</span><h1>补充指令</h1><p>这条信息会关联当前任务。离线时仅进入本地待同步队列。</p></div>
          <div className="mobile-linked-task"><Icon name="chat" size={15} /><div><strong>发布前页面核对</strong><small>正在进行 · 最近同步刚刚</small></div></div>
          <label className="mobile-field grow"><span>补充说明</span><textarea aria-label="移动端补充指令" value={instruction} onChange={event => setInstruction(event.target.value)} placeholder="写下新的要求或补充信息" /></label>
          <div className="mobile-composer-actions"><button type="button" className="mobile-secondary" onClick={() => go('offline')}>离线队列</button><button type="button" className="mobile-primary" disabled={!instruction.trim()} onClick={submitInstruction}>加入任务</button></div>
        </section>}

        {flow === 'review' && <section className="mobile-flow-stack">
          <div className="mobile-hero compact"><span className="mobile-eyebrow">SANBAO DESIGN · F05</span><h1>预览验收成果</h1><p>手机只提供摘要与安全预览。完整 Diff、文件树和版本管理留在桌面端。</p></div>
          <article className="mobile-result-card"><div className="mobile-result-type">HTML</div><div><strong>发布说明预览</strong><small>1 个可预览成果 · 本地示例</small></div><Icon name="chevron" size={14} /></article>
          <div className="mobile-review-summary"><div><span>已完成</span><strong>4 个任务步骤</strong></div><div><span>变更摘要</span><strong>1 个说明草稿</strong></div><div><span>来源</span><strong>桌面任务事件</strong></div></div>
          {reviewDecision ? <div className="mobile-result-note"><Icon name="check" size={15} /><span>{reviewDecision === 'accepted' ? '成果已验收（本地演示）' : '已请求补充（本地演示）'}</span></div> : <div className="mobile-decision-actions"><button type="button" className="mobile-secondary" onClick={() => makeReviewDecision('revision')}>请求补充</button><button type="button" className="mobile-primary" onClick={() => makeReviewDecision('accepted')}>验收成果</button></div>}
          <button type="button" className="mobile-text-action" onClick={() => go('unavailable')}>模拟预览不可用</button>
        </section>}

        {flow === 'offline' && <section className="mobile-empty-state"><span className="mobile-empty-icon">⌁</span><h1>正在等待桌面连接</h1><p>草稿与待同步动作只保留在本地演示中。恢复连接后才能取得真实任务状态。</p><button type="button" className="mobile-primary" onClick={() => go('progress')}>恢复本地连接演示</button><button type="button" className="mobile-text-action" onClick={() => go('start')}>返回任务草稿</button></section>}

        {flow === 'expired' && <section className="mobile-empty-state"><span className="mobile-empty-icon warning">!</span><h1>这项审批已经过期</h1><p>它可能已由桌面端或其他设备处理。刷新后回到任务进度确认当前状态。</p><button type="button" className="mobile-primary" onClick={() => go('progress')}>刷新本地演示</button></section>}

        {flow === 'unavailable' && <section className="mobile-empty-state"><span className="mobile-empty-icon warning">×</span><h1>暂时无法预览成果</h1><p>手机端保留任务摘要；请在桌面端查看完整产物、文件和差异。</p><button type="button" className="mobile-primary" onClick={() => go('progress')}>返回任务摘要</button></section>}
      </div>

      <footer className="mobile-nav" aria-label="移动端主导航"><button type="button" className={flow === 'start' ? 'active' : ''} onClick={() => go('start')}><Icon name="home" size={17} /><span>今天</span></button><button type="button" className={flow === 'progress' || flow === 'instruction' ? 'active' : ''} onClick={() => go('progress')}><Icon name="clock" size={17} /><span>任务</span></button><button type="button" className={flow === 'approval' || flow === 'expired' ? 'active' : ''} onClick={() => go('approval')}><Icon name="bolt" size={17} /><span>审批</span></button></footer>
    </section>
    <aside className="mobile-prototype-notice"><strong>Sanbao 设计工作面</strong><p>{notice}</p><code>SANBAO.IOS.F0{flow === 'start' ? '1' : flow === 'progress' ? '2' : flow === 'approval' || flow === 'expired' ? '3' : flow === 'instruction' || flow === 'offline' ? '4' : '5'}</code></aside>
  </main>;
}
