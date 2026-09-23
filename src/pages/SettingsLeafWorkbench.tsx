import { useEffect, useState } from 'react';

export const SETTINGS_LEAF_KEYS = [
  'pet',
  'memory',
  'import',
  'hooks',
  'computer-control',
  'mobile',
  'git',
  'worktrees',
  'workspace-index',
  'connections',
  'security',
  'archived-tasks',
  'experiments',
  'network',
  'playground',
] as const;

export type SettingsLeafKey = typeof SETTINGS_LEAF_KEYS[number];
export type SettingsLeafView = 'overview' | 'draft' | 'result';

export type SettingsLeafWorkbenchProps = {
  settingKey: SettingsLeafKey;
  view?: SettingsLeafView;
  onNavigateView: (view: SettingsLeafView) => void;
  onExit: () => void;
  onReset: () => void;
};

type LeafConfig = {
  id: string;
  title: string;
  summary: string;
  controlLabel: string;
  draftLabel: string;
  draftPlaceholder: string;
  source: string;
};

const LEAF_CONFIG: Record<SettingsLeafKey, LeafConfig> = {
  'pet': {
    id: 'SANBAO.SET.PET.F01', title: '桌面宠物', summary: '管理桌面陪伴形象的显示偏好与本地示例状态。',
    controlLabel: '显示桌面宠物本地预览', draftLabel: '宠物展示说明', draftPlaceholder: '例如：仅在空闲状态显示…', source: '原产品仅设置入口',
  },
  memory: {
    id: 'SANBAO.SET.MEMORY.F01', title: '记忆', summary: '查看记忆范围的说明，并在本地编辑一条不持久化的偏好草稿。',
    controlLabel: '显示记忆范围本地说明', draftLabel: '记忆偏好草稿', draftPlaceholder: '例如：保留项目级工作偏好…', source: '原产品仅设置入口',
  },
  'import': {
    id: 'SANBAO.SET.IMPORT.F01', title: '数据导入', summary: '展示导入前置条件、空态和本地草稿，而不读取任何文件。',
    controlLabel: '显示导入准备清单', draftLabel: '导入说明草稿', draftPlaceholder: '例如：准备一个虚构 CSV 示例…', source: '原产品仅设置入口',
  },
  hooks: {
    id: 'SANBAO.SET.HOOKS.F01', title: '钩子', summary: '展示自动化钩子的本地配置说明与未连接空态。',
    controlLabel: '显示本地钩子占位', draftLabel: '钩子说明草稿', draftPlaceholder: '例如：任务完成后提示审阅…', source: '原产品仅设置入口',
  },
  'computer-control': {
    id: 'SANBAO.SET.COMPUTER.F01', title: '电脑操控', summary: '说明设备操控的范围、授权边界与未授权状态。',
    controlLabel: '显示本地设备授权说明', draftLabel: '操控范围草稿', draftPlaceholder: '例如：仅供设计评审的虚构范围…', source: '原产品仅设置入口',
  },
  mobile: {
    id: 'SANBAO.SET.MOBILE.F02', title: '移动端', summary: '补充手机协作入口的本地说明，不创建配对或远程连接。',
    controlLabel: '显示移动协作本地提示', draftLabel: '移动协作草稿', draftPlaceholder: '例如：处理一个本地模拟审批…', source: '原产品仅设置入口',
  },
  git: {
    id: 'SANBAO.SET.GIT.F01', title: 'Git', summary: '展示版本控制连接的空态与本地策略草稿，不读取仓库。',
    controlLabel: '显示 Git 本地空态', draftLabel: '版本策略草稿', draftPlaceholder: '例如：审阅变更后再创建提交…', source: '原产品仅设置入口',
  },
  worktrees: {
    id: 'SANBAO.SET.WORKTREES.F01', title: 'Worktrees', summary: '展示隔离工作目录的本地策略与尚未创建状态。',
    controlLabel: '显示 Worktrees 本地空态', draftLabel: '工作目录策略草稿', draftPlaceholder: '例如：为评审任务准备隔离目录…', source: '原产品仅设置入口',
  },
  'workspace-index': {
    id: 'SANBAO.SET.INDEX.F01', title: '工作区索引', summary: '展示索引范围、等待状态和本地忽略规则草稿。',
    controlLabel: '显示索引范围本地提示', draftLabel: '忽略规则草稿', draftPlaceholder: '例如：忽略虚构构建产物目录…', source: '原产品仅设置入口',
  },
  connections: {
    id: 'SANBAO.SET.CONNECTIONS.F01', title: '连接', summary: '展示服务连接的本地空态，不读取 Endpoint、令牌或账号。',
    controlLabel: '显示连接状态本地占位', draftLabel: '连接说明草稿', draftPlaceholder: '例如：等待授权后显示连接详情…', source: '原产品仅设置入口',
  },
  security: {
    id: 'SANBAO.SET.SECURITY.F01', title: '安全', summary: '展示安全策略的本地说明与待核验提示，不修改权限。',
    controlLabel: '显示安全边界提示', draftLabel: '安全策略草稿', draftPlaceholder: '例如：敏感操作先请求确认…', source: '原产品仅设置入口',
  },
  'archived-tasks': {
    id: 'SANBAO.SET.ARCHIVE.F01', title: '已归档任务', summary: '展示归档任务的空态和本地筛选草稿，不读取历史记录。',
    controlLabel: '显示归档任务本地空态', draftLabel: '归档筛选草稿', draftPlaceholder: '例如：仅显示本地示例任务…', source: '原产品仅设置入口',
  },
  experiments: {
    id: 'SANBAO.SET.EXPERIMENTAL.F01', title: '实验功能', summary: '展示实验能力的本地试用说明，开关不影响运行时。',
    controlLabel: '显示实验功能本地说明', draftLabel: '实验备注草稿', draftPlaceholder: '例如：供设计评审的功能假设…', source: '原产品仅入口或静态候选',
  },
  network: {
    id: 'SANBAO.SET.NETWORK.F01', title: '网络', summary: '展示网络策略的本地空态与草稿，不读取代理或系统网络配置。',
    controlLabel: '显示网络策略本地提示', draftLabel: '网络策略草稿', draftPlaceholder: '例如：等待网络策略确认…', source: '原产品仅设置入口',
  },
  playground: {
    id: 'SANBAO.SET.PLAYGROUND.F01', title: 'QQQ 游乐场', summary: '展示实验示例入口的本地空态，不打开外部页面或运行示例。',
    controlLabel: '显示游乐场本地空态', draftLabel: '示例备注草稿', draftPlaceholder: '例如：用于演示的本地场景…', source: '原产品仅入口或静态候选',
  },
};

export function SettingsLeafWorkbench({ settingKey, view = 'overview', onNavigateView, onExit, onReset }: SettingsLeafWorkbenchProps) {
  const [currentView, setCurrentView] = useState<SettingsLeafView>(view);
  const [enabled, setEnabled] = useState(false);
  const [draft, setDraft] = useState('');
  const config = LEAF_CONFIG[settingKey];

  useEffect(() => { setCurrentView(view); }, [view]);
  useEffect(() => {
    setEnabled(false);
    setDraft('');
  }, [settingKey]);

  const navigate = (next: SettingsLeafView) => {
    setCurrentView(next);
    onNavigateView(next);
  };

  const reset = () => {
    setEnabled(false);
    setDraft('');
    navigate('overview');
    onReset();
  };

  return <section className="settings-leaf-workbench" aria-label={`${config.title} Sanbao 设计工作面`}>
    <header className="settings-leaf-header">
      <div>
        <p className="settings-leaf-kicker">SANBAO DESIGN WORKBENCH</p>
        <h1 tabIndex={-1}>{config.title}</h1>
        <p>{config.summary}</p>
      </div>
      <div className="settings-leaf-source">
        <strong>{config.id}</strong>
        <span>{config.source}</span>
      </div>
    </header>

    <div className="settings-leaf-state-row" aria-label="本地演示状态">
      {(['overview', 'draft', 'result'] as const).map(item => <button
        key={item}
        type="button"
        className={item === currentView ? 'active' : ''}
        aria-current={item === currentView ? 'step' : undefined}
        onClick={() => navigate(item)}
      >{item === 'overview' ? '概览' : item === 'draft' ? '草稿' : '结果'}</button>)}
    </div>

    {currentView === 'overview' && <article className="settings-leaf-card">
      <div className="settings-leaf-card-heading">
        <div><h2>本地状态说明</h2><p>当前没有已连接的真实配置、任务、设备、文件、凭据或网络资源。</p></div>
        <span className={`settings-leaf-status ${enabled ? 'ready' : ''}`}>{enabled ? '本地提示已显示' : '本地空态'}</span>
      </div>
      <div className="settings-leaf-control-row">
        <div><h3>{config.controlLabel}</h3><p>切换只更新这张原型页面，不会保存或调用任何系统能力。</p></div>
        <button type="button" role="switch" aria-checked={enabled} aria-label={config.controlLabel} className={`settings-leaf-toggle ${enabled ? 'on' : ''}`} onClick={() => setEnabled(value => !value)}><span /></button>
      </div>
      {enabled && <p className="settings-leaf-local-note" role="status">本地设计提示已打开。原产品的默认值、保存方式、校验与错误分支仍待单独取证。</p>}
      <footer><button type="button" className="secondary-button" onClick={onExit}>退出此工作面</button><button type="button" className="primary-button" onClick={() => navigate('draft')}>编辑本地草稿</button></footer>
    </article>}

    {currentView === 'draft' && <article className="settings-leaf-card">
      <div className="settings-leaf-card-heading"><div><h2>仅本地草稿</h2><p>输入内容保留在当前 React 组件内，切换页面、刷新或重置后都会丢失。</p></div><span className="settings-leaf-status">未保存</span></div>
      <label className="settings-leaf-field"><span>{config.draftLabel}</span><textarea value={draft} onChange={event => setDraft(event.target.value)} placeholder={config.draftPlaceholder} rows={4} /></label>
      <footer><button type="button" className="secondary-button" onClick={reset}>放弃本地草稿</button><button type="button" className="primary-button" onClick={() => navigate('result')} disabled={!draft.trim()}>查看本地结果</button></footer>
    </article>}

    {currentView === 'result' && <article className="settings-leaf-card settings-leaf-result">
      <div className="settings-leaf-result-icon" aria-hidden="true">✓</div>
      <div><p className="settings-leaf-kicker">LOCAL RESULT ONLY</p><h2>本地演示结果已生成</h2><p>{draft.trim() ? `已保留 ${draft.trim().length} 个字符用于当前页面预览。` : '没有草稿内容；此状态只用于演示结果与恢复路径。'}</p></div>
      <div className="settings-leaf-result-copy">{draft.trim() || '尚未输入本地草稿。'}</div>
      <footer><button type="button" className="secondary-button" onClick={() => navigate('draft')}>继续编辑</button><button type="button" className="primary-button" onClick={reset}>重置工作面</button></footer>
    </article>}

    <p className="settings-leaf-boundary" role="note">Sanbao 设计工作面：不会读取或写入真实设置，不调用网络、文件、凭据、设备或系统 API。</p>
  </section>;
}
