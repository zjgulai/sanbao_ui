import data from './catalog-data.json';

export interface CatalogGroup {
  id: string;
  kind: string;
  label: string;
  evidence: string;
  runtimeStatus: string;
}
export interface PrototypeState {
  id: string;
  title: string;
  groupIds: string[];
  // QB observation namespaces stay batch-specific; QD0 denotes historical discovery backfill.
  observationIds: string[];
  page: string;
  variant: string;
  sourceKind: 'observed' | 'entry-observed' | 'static-only'; // observed 仍可能只覆盖部分内容。
  evidence: string;
  trigger: string;
  exit: string;
  implemented: boolean;
  notes: string;
}

export type DeliveryDimensionKey = 'source' | 'prototype' | 'visual' | 'figma' | 'dsh';

export interface DeliveryDimension {
  key: DeliveryDimensionKey;
  label: string;
  status: string;
  detail: string;
}

export function getDeliveryDimensions(state: PrototypeState, implemented: Set<string>): DeliveryDimension[] {
  const localFixture = state.observationIds.some(id => implemented.has(id));
  const source = state.sourceKind === 'observed'
    ? { status: '已观察', detail: '原产品已有对应观察记录。' }
    : state.sourceKind === 'entry-observed'
      ? { status: '仅入口', detail: '只确认入口，页内仍待核验。' }
      : { status: '静态候选', detail: '仅有资源线索，尚未确认可达。' };
  return [
    { key: 'source', label: '原产品', ...source },
    { key: 'prototype', label: '原型', status: localFixture ? '本地模拟' : '设计工作面', detail: localFixture ? '可直达的本地 fixture，须单独验证交互。' : 'Sanbao 设计型工作面；待原生证据校准，不能视作 Qoder 复刻。' },
    { key: 'visual', label: '视觉', status: '待校准', detail: '尚无同条件像素验收结论。' },
    { key: 'figma', label: 'Figma', status: '冻结', detail: '当前不访问 Figma，未同步可编辑节点。' },
    { key: 'dsh', label: 'DSH', status: '未验证', detail: '没有 Host 事件链或壳内验收结论。' },
  ];
}

export function getUncollectedReason(state: PrototypeState, implemented: Set<string>): string {
  const [source, prototype] = getDeliveryDimensions(state, implemented);
  if (state.sourceKind === 'static-only' || state.sourceKind === 'entry-observed') return `${source.detail} ${prototype.detail}`;
  return prototype.status === '设计工作面'
    ? '原产品状态已有观察，但当前仅提供 Sanbao 设计型工作面，仍需原生校准。'
    : '本地 fixture 已存在；视觉、Figma 与 DSH 仍需分别核对。';
}

export const groups: CatalogGroup[] = data.groups;
export const states = data.states as PrototypeState[];
