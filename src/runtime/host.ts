/**
 * SanBao UI ↔ 壳（运行时）的接线缝。
 *
 * 这是"206 页逐页接线"的正式接缝：页面不再直接假设 fixture，而是先问壳。
 * 契约（与项目既定边界一致）：
 * - 无壳（独立原型 / 静态站）：保持 fixture 行为不变，绝不假装已接线；
 * - 有壳：读写走壳；壳缺该能力时如实返回 unavailable，不用 fixture 冒充成功；
 * - 注入点：壳在页面脚本执行前设置 window.__SANBAO_HOST__（协议号 + 具名方法）。
 *
 * 已接线片：
 * - P01.home.workspace：工作区绑定读取 ＋ 需求提交（返回会话引用）；
 * - S1 会话页 running：按会话引用只读读取壳侧会话消息；
 * - S1 会话页 streaming（QDR.S01.session.streaming）：流式态——`streaming` 标志驱动
 *   跟随轮询与停止键；`stopSession` 为可选停止能力，缺省时停止动作如实未接线；
 * - S2 澄清（QDR.S02.clarification.*）：`pendingClarification` 驱动澄清卡；
 *   `answerClarification` 为可选回答能力，缺省时提交如实未接线。
 * 后续页面批次按同一模式增量扩展本接口，不在页面内各自发明通道。
 */

export type HostUnavailable = { readonly state: 'unavailable'; readonly reason: string };

export type HostWorkspaceRead = {
  readonly state: 'read';
  readonly name: string;
  readonly mode: string;
  readonly repo?: string;
  readonly branch?: string;
};

export type HostRequirementOpened = { readonly state: 'opened'; readonly sessionRef: string };

export type HostSessionMessage = { readonly role: 'user' | 'assistant'; readonly text: string };

export type HostClarification = {
  readonly question: string;
  readonly options: readonly string[];
  readonly recommended?: string;
};

export type HostSessionRead =
  | { readonly state: 'read'; readonly sessionRef: string; readonly messages: readonly HostSessionMessage[]; readonly streaming?: boolean; readonly pendingClarification?: HostClarification | null }
  | HostUnavailable;

/** 页面对壳会话的绑定态（由 app 计算，页面只渲染；不新增第二事实家）。 */
export type SessionHostBinding =
  | { readonly kind: 'none' }
  | { readonly kind: 'awaiting-ref' }
  | { readonly kind: 'loading'; readonly sessionRef: string }
  | { readonly kind: 'loaded'; readonly sessionRef: string; readonly result: HostSessionRead };

export interface SanbaoHostPort {
  readonly protocolVersion: 1;
  readWorkspace(): Promise<HostWorkspaceRead | HostUnavailable>;
  startRequirement(text: string): Promise<HostRequirementOpened | HostUnavailable>;
  /** S1 会话页（第二片起）；缺省＝该能力未提供，页面如实显示“未接线”。 */
  readSession?(sessionRef: string): Promise<HostSessionRead>;
  /** S1.streaming 停止键（第三片起）；缺省＝停止未接线，点击后如实说明。 */
  stopSession?(sessionRef: string): Promise<{ readonly state: 'stopped' } | HostUnavailable>;
  /** S2 澄清回答（第四片起）；缺省＝回答未接线，提交后如实说明。 */
  answerClarification?(sessionRef: string, answer: string): Promise<{ readonly state: 'submitted' } | HostUnavailable>;
}

declare global {
  interface Window {
    /** 壳在页面加载前注入；缺省表示独立原型（fixture）模式。 */
    __SANBAO_HOST__?: SanbaoHostPort;
  }
}

export function getHostPort(): SanbaoHostPort | null {
  if (typeof window === 'undefined') return null;
  const candidate = window.__SANBAO_HOST__;
  if (candidate === undefined || candidate === null) return null;
  if (candidate.protocolVersion !== 1) return null;
  if (typeof candidate.readWorkspace !== 'function' || typeof candidate.startRequirement !== 'function') return null;
  return candidate;
}

export function getWiringMode(): 'fixture' | 'live' {
  return getHostPort() === null ? 'fixture' : 'live';
}
