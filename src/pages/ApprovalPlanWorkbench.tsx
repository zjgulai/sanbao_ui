import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Controls';

export type ApprovalPlanView = 'request' | 'waiting' | 'resolved' | 'preview' | 'expanded' | 'confirmation' | 'approved' | 'exit';

type Props = {
  kind: 'permission' | 'plan';
  initialView: ApprovalPlanView;
  onViewChange: (view: ApprovalPlanView) => void;
  onNotice: (message: string) => void;
};

const permissionViews = new Set<ApprovalPlanView>(['request', 'waiting', 'resolved']);
const planViews = new Set<ApprovalPlanView>(['preview', 'expanded', 'confirmation', 'approved', 'exit']);

export function ApprovalPlanWorkbench({ kind, initialView, onViewChange, onNotice }: Props) {
  const fallback = kind === 'permission' ? 'request' : 'preview';
  const allowed = kind === 'permission' ? permissionViews : planViews;
  const [view, setView] = useState<ApprovalPlanView>(allowed.has(initialView) ? initialView : fallback);

  useEffect(() => { setView(allowed.has(initialView) ? initialView : fallback); }, [allowed, fallback, initialView]);

  const change = (next: ApprovalPlanView) => {
    setView(next);
    onViewChange(next);
  };

  return <section className="design-workbench approval-plan-workbench" data-state-source="static-only" aria-label={kind === 'permission' ? 'Sanbao 权限与授权设计工作面' : 'Sanbao 计划确认设计工作面'}>
    <header className="approval-plan-header">
      <div><span>Sanbao DESIGN WORKBENCH</span><h1>{kind === 'permission' ? '权限申请与外部授权' : '计划预览与确认'}</h1><p>{kind === 'permission' ? '以下为 S03 静态线索衍生的本地审批交互，不会打开浏览器、请求授权或保存访问令牌。' : '以下为 S04 静态线索衍生的本地计划确认交互，不会执行任务、修改文件或调用模型。'}</p></div>
      <div className="approval-plan-source"><strong>{kind === 'permission' ? 'QDR.S03' : 'QDR.S04'}</strong><small>静态候选 · 待原生校准</small></div>
    </header>

    <div className="approval-plan-steps" aria-label="本地流程状态">
      {(kind === 'permission' ? ['申请', '等待外部授权', '本地回执'] : ['计划摘要', '完整计划', '确认或退出']).map((label, index) => <span key={label} className={(kind === 'permission' ? (view === 'request' ? index === 0 : view === 'waiting' ? index <= 1 : true) : (view === 'preview' ? index === 0 : view === 'expanded' ? index <= 1 : true)) ? 'active' : ''}><i>{index + 1}</i>{label}</span>)}
    </div>

    {kind === 'permission' ? <PermissionFlow view={view} change={change} onNotice={onNotice} /> : <PlanFlow view={view} change={change} onNotice={onNotice} />}
    <footer className="approval-plan-boundary" role="note"><Icon name="bolt" size={15} />原产品当前未实测该叶状态。本地流程只用于 Sanbao 评审，并保留打开、返回、重置及失效前的状态边界。</footer>
  </section>;
}

function PermissionFlow({ view, change, onNotice }: { view: ApprovalPlanView; change: (next: ApprovalPlanView) => void; onNotice: (message: string) => void }) {
  if (view === 'waiting') return <article className="approval-plan-card waiting-card"><span className="approval-plan-icon spinner"><Icon name="globe" size={19} /></span><div><p className="approval-plan-eyebrow">SANBAO.S03.F02 · 本地等待</p><h2>正在等待外部服务授权</h2><p>本地演示不会启动浏览器。真实授权完成、取消、超时和凭据处理仍待桌面接缝和原生页面核验。</p><dl><div><dt>目标</dt><dd>示例发布知识库</dd></div><div><dt>当前状态</dt><dd>等待用户在浏览器中完成</dd></div></dl></div><div className="approval-plan-actions"><button type="button" className="secondary-button" onClick={() => change('request')}>返回申请</button><button type="button" className="primary-button" onClick={() => change('resolved')}>模拟已完成</button></div></article>;
  if (view === 'resolved') return <article className="approval-plan-card result-card"><span className="approval-plan-icon success"><Icon name="check" size={20} /></span><div><p className="approval-plan-eyebrow">SANBAO.S03.F03 · 本地回执</p><h2>授权结果已记录到演示状态</h2><p>本地回执只用于演示任务可以继续等待事件同步；没有保存外部账户、令牌或真实授权结果。</p></div><div className="approval-plan-actions"><button type="button" className="secondary-button" onClick={() => change('request')}>重置演示</button><button type="button" className="primary-button" onClick={() => onNotice('授权结果仅停留在本地 fixture；桌面任务、浏览器和外部服务均未被访问。')}>查看边界说明</button></div></article>;
  return <article className="approval-plan-card request-card"><span className="approval-plan-icon"><Icon name="bolt" size={20} /></span><div><p className="approval-plan-eyebrow">SANBAO.S03.F01 · 本地申请</p><h2>需要授权才能继续</h2><p>任务准备读取“发布知识库”的公开说明，以核对页面文案。请先确认影响范围，再决定是否开始外部授权流程。</p><dl><div><dt>请求动作</dt><dd>读取已授权的说明摘要</dd></div><div><dt>影响范围</dt><dd>仅本地示例任务 · 不修改文件</dd></div><div><dt>失效时间</dt><dd>10 分钟后需重新确认</dd></div></dl></div><div className="approval-plan-actions"><button type="button" className="secondary-button" onClick={() => onNotice('已在本地演示中暂缓授权；不会终止真实任务或写入任何用户设置。')}>稍后处理</button><button type="button" className="primary-button" onClick={() => change('waiting')}>继续本地授权演示 <Icon name="chevron" size={14} /></button></div></article>;
}

function PlanFlow({ view, change, onNotice }: { view: ApprovalPlanView; change: (next: ApprovalPlanView) => void; onNotice: (message: string) => void }) {
  if (view === 'exit') return <article className="approval-plan-card exit-card"><span className="approval-plan-icon warning">×</span><div><p className="approval-plan-eyebrow">SANBAO.S04.F05 · 本地退出</p><h2>已退出计划确认</h2><p>本地示例保留未执行结果，未创建计划产物、未运行工具，也没有对任务内容进行修改。</p></div><div className="approval-plan-actions"><button type="button" className="secondary-button" onClick={() => change('preview')}>恢复计划预览</button><button type="button" className="primary-button" onClick={() => onNotice('退出结果只存在于本地 fixture；真实计划退出与产物行为待原生核验。')}>查看边界说明</button></div></article>;
  if (view === 'approved') return <article className="approval-plan-card result-card"><span className="approval-plan-icon success"><Icon name="check" size={20} /></span><div><p className="approval-plan-eyebrow">SANBAO.S04.F04 · 本地确认</p><h2>计划已在本地演示中确认</h2><p>确认只推进此页面的演示状态。实际 Agent 执行、文件产物、版本与任务事件仍保持未验证。</p></div><div className="approval-plan-actions"><button type="button" className="secondary-button" onClick={() => change('preview')}>重新查看计划</button><button type="button" className="primary-button" onClick={() => change('exit')}>查看未执行结果</button></div></article>;
  const expanded = view === 'expanded';
  const confirmation = view === 'confirmation';
  return <article className={`approval-plan-card plan-card ${expanded ? 'expanded' : ''}`}><span className="approval-plan-icon"><Icon name="file" size={20} /></span><div><p className="approval-plan-eyebrow">SANBAO.S04.{confirmation ? 'F03' : expanded ? 'F02' : 'F01'} · 本地计划</p><h2>{confirmation ? '确认后开始执行计划？' : expanded ? '发布前页面核对 · 完整计划' : '发布前页面核对 · 计划摘要'}</h2><p>{confirmation ? '请确认以下范围。这个按钮不会开始任务、修改文件或触发外部授权。' : '先核对目标、范围和可恢复的退出路径，再决定是否进入本地确认步骤。'}</p><ol className="approval-plan-list"><li><strong>整理范围</strong><span>核对页面、发布说明和验收入口。</span></li><li><strong>形成草稿</strong><span>仅在任务工作面中形成可审阅的本地摘要。</span></li>{expanded && <><li><strong>等待审批</strong><span>如遇到影响范围扩大，回到 S03 审批卡等待确认。</span></li><li><strong>交接成果</strong><span>在桌面端审阅完整 Diff 与产物版本。</span></li></>}</ol></div><div className="approval-plan-actions">{confirmation ? <><button type="button" className="secondary-button" onClick={() => change('preview')}>返回调整</button><button type="button" className="primary-button" onClick={() => change('approved')}>确认本地演示</button></> : expanded ? <><button type="button" className="secondary-button" onClick={() => change('preview')}>收起计划</button><button type="button" className="primary-button" onClick={() => change('confirmation')}>进入确认</button></> : <><button type="button" className="secondary-button" onClick={() => change('exit')}>退出计划</button><button type="button" className="primary-button" onClick={() => change('expanded')}>展开完整计划 <Icon name="chevron" size={14} /></button></>}</div></article>;
}
