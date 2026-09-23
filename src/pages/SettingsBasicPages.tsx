import React from 'react';
import { Icon, Toggle } from '../components/Controls';

type Notice = (message: string) => void;
type Setting = { label: string; description: string; icon?: string; accessibleLabel?: string; actionLabel?: string } & (
  { kind: 'switch'; checked: boolean } |
  { kind: 'value' | 'action'; value: string }
);

const GENERAL_TASK_SETTINGS: Setting[] = [
  { label: '运行中发送方式', description: '设置主输入框和桌面宠物在 Agent 执行期间发送的新输入默认排队或立即插话。', icon: 'chat', kind: 'value', value: '排队' },
  { label: '问答面板静默跳过', description: '开启后，当前任务前台无人操作 150 秒、后台 90 秒后，以空答案自动跳过未回答的问答；面板内交互会取消自动跳过。', icon: 'clock', kind: 'switch', checked: false },
  { label: '产物文件默认打开位置', description: '控制会话流中的产物文件默认在右侧工作区还是新窗口打开。文件菜单仍可选择其他方式。', icon: 'panel', kind: 'value', value: '右侧工作区' },
  { label: '提示建议', description: 'Agent 完成回复后显示可继续追问的建议。', icon: 'bolt', kind: 'switch', checked: true },
  { label: '新消息保持在阅读起点', description: '发送后将新一轮定位到视口顶部，内容填满后继续贴底追随；关闭后发送新消息时直接定位到底部。', icon: 'chat', kind: 'switch', checked: false },
  { label: '显示工具调用次数', description: '在折叠的处理过程前显示这一段里的工具调用数量。', icon: 'code', kind: 'switch', checked: false },
  { label: '默认展开工具调用', description: '工具调用卡片默认显示输入与响应详情。', icon: 'code', kind: 'switch', checked: false },
  { label: '折叠回复过程', description: '回复成功完成后，将最终正文前的过程文本、思考和工具调用收进活动详情。', icon: 'panel', kind: 'switch', checked: false },
  { label: '耗时显示格式', description: '控制会话流和回复结果里的执行耗时精度。', icon: 'clock', kind: 'value', value: '整数秒' },
  { label: '思考状态 Loader', description: '选择思考状态文案左侧的加载动效。', icon: 'grid', kind: 'value', value: 'Matrix（默认）' },
  { label: '思考状态文案', description: '同时自定义思考期间轮换显示的中文和英文文案。', icon: 'chat', kind: 'action', value: '编辑文案' },
  { label: '目标驱动执行', description: '设定最大轮次上限。设置目标后，Qoder 会自动持续推进目标，直到达成或用完轮次。', icon: 'bolt', kind: 'value', value: '20' },
  { label: '首页小游戏', description: '选择首页游戏，两种工作模式共用。更改从下次入口展示起生效，不影响当前游玩。', icon: 'grid', kind: 'value', value: '随机' },
];

const GENERAL_NOTIFICATION_SETTINGS: Setting[] = [
  { label: '轮次完成通知', description: '设置 Agent 完成一轮后何时通过系统通知提醒你。', icon: 'chat', kind: 'value', value: '仅在未聚焦时' },
  { label: '权限请求通知', description: 'Agent 需要授权才能继续时显示系统通知。', icon: 'settings', kind: 'switch', checked: true },
  { label: '等待回答通知', description: 'Agent 等待你回答问题时显示系统通知。', icon: 'chat', kind: 'switch', checked: true },
  { label: '系统通知设置', description: '系统已关闭 Qoder 通知。打开系统设置后即可恢复提醒。', icon: 'monitor', kind: 'action', value: '打开系统设置' },
];

const MODE_SETTINGS = [
  { label: '运行位置入口', description: '控制 Local、Worktree、SSH 和分支选择是否展示。编程默认展示，通用默认收起。', icon: 'folder' },
  { label: '输入区运行环境标签', description: '控制任务输入框下方的本地、Worktree、SSH 和 Git 分支标签是否展示，不影响任务监控卡片。', icon: 'code' },
  { label: '任务监控卡片环境信息', description: '控制任务监控卡片中的分支、运行位置和本地服务等工程信息是否展示，不影响输入区标签。', icon: 'monitor' },
  { label: '浏览器本地服务入口', description: '控制浏览器空白页是否展示本地服务列表。', icon: 'globe' },
  { label: '任务文件变更卡片', description: '控制 Agent 完成一轮后，是否在任务流末尾展示文件变更和 Diff 审阅入口。', icon: 'file' },
];

const TASK_MONITOR_GROUPS: { title: string; settings: Setting[] }[] = [
  { title: '展示方式', settings: [
    { label: '任务监控形式', description: '选择任务监控以浮层打开，或固定在任务右侧。', kind: 'value', value: '固定' },
    { label: '固定模式默认展示', description: '选择进入任务时是否自动展示固定任务监控；隐藏时需要手动点击打开。', kind: 'value', value: '默认展示' },
  ] },
  { title: '进度与上下文', settings: [
    { label: '任务回顾', description: '在任务监控中生成简短回顾。使用自带密钥或外部模型渠道时，优先沿用会话模型；否则使用指定模型或自动选择最低价平台模型。费用按所用模型计收。', kind: 'switch', checked: true, actionLabel: '设置任务回顾' },
    { label: '任务目标', description: '显示当前任务正在追踪的目标。', kind: 'switch', checked: true },
    { label: '计划', description: '显示当前任务的计划入口。', kind: 'switch', checked: true },
  ] },
  { title: '执行活动', settings: [
    { label: '子智能体', description: '显示后台子智能体的运行状态和入口。', kind: 'switch', checked: true },
    { label: '后台进程', description: '显示后台命令和长时间运行进程。', kind: 'switch', checked: true },
    { label: '侧边聊天', description: '显示从当前任务分出的侧边聊天。', kind: 'switch', checked: true },
    { label: 'Skill 与 MCP', description: '显示任务使用的 Skill、MCP 和其他运行时能力。', kind: 'switch', checked: true },
  ] },
  { title: '结果与来源', settings: [
    { label: '产出', description: '显示任务产生的文件和其他结果。', kind: 'switch', checked: true },
    { label: '网页查阅', description: '显示任务过程中打开的网页。', kind: 'switch', checked: true },
    { label: '来源', description: '显示任务引用的文件和链接，以及添加来源的入口。', kind: 'switch', checked: true },
  ] },
  { title: '辅助入口', settings: [
    { label: '记忆更新', description: '记忆发生更新时，显示前往记忆设置的入口。', kind: 'switch', checked: true },
    { label: '演示画面', description: '在固定模式中显示演示画面的显隐控制。', kind: 'switch', checked: true },
  ] },
];

function modeSettings(mode: '编程' | '通用'): Setting[] {
  return [
    { label: '绑定主题', accessibleLabel: `${mode}：绑定主题`, description: '切换到这个模式时使用的主题配色，亮暗模式沿用外观设置。', icon: 'grid', kind: 'value', value: mode === '编程' ? '森林' : '蜜蜂' },
    ...MODE_SETTINGS.map(setting => ({ ...setting, accessibleLabel: `${mode}：${setting.label}`, kind: 'switch' as const, checked: mode === '编程' })),
  ];
}

function SettingRow({ setting, onNotice }: { setting: Setting; onNotice: Notice }) {
  const label = setting.accessibleLabel || setting.label;
  const unavailable = () => onNotice(`“${label}”的操作尚未采集；仅展示已观察默认值，未修改 Qoder 或系统设置。`);
  return <div className={`settings-basic-row${setting.actionLabel ? ' settings-basic-row-with-action' : ''}`}>
    {setting.icon && <span className="settings-basic-row-icon" aria-hidden="true"><Icon name={setting.icon} size={16} /></span>}
    <div className="settings-basic-row-copy"><h3>{setting.label}</h3><p>{setting.description}</p></div>
    <div className="settings-basic-row-control">{setting.actionLabel && <button type="button" className="settings-basic-row-settings" aria-label={setting.actionLabel} aria-haspopup="dialog" aria-expanded="false" onClick={() => onNotice(`“${setting.actionLabel}”的操作尚未采集；未打开配置、修改设置或调用模型。`)}><Icon name="settings" size={15} /></button>}{setting.kind === 'switch'
      ? <Toggle label={label} checked={setting.checked} onChange={unavailable} />
      : <button type="button" role={setting.kind === 'value' ? 'combobox' : undefined} aria-expanded={setting.kind === 'value' ? false : undefined} aria-haspopup={setting.kind === 'value' ? 'listbox' : undefined} className={setting.kind === 'value' ? 'settings-basic-select' : 'settings-basic-action'} aria-label={label} onClick={unavailable}><span>{setting.value}</span>{setting.kind === 'value' && <Icon name="down" size={12} />}</button>}
    </div>
  </div>;
}

function SettingsGroup({ title, settings, onNotice }: { title: string; settings: Setting[]; onNotice: Notice }) {
  return <section className="settings-basic-section" aria-label={title}><h2>{title}</h2><div className="settings-basic-card">{settings.map(setting => <SettingRow key={setting.label} setting={setting} onNotice={onNotice} />)}</div></section>;
}

export type SettingsBasicSection = 'general' | 'mode' | 'task-monitor';

export function SettingsBasicPage({ section, onNotice }: { section: SettingsBasicSection; onNotice: Notice }) {
  const mode = section === 'mode';
  const monitor = section === 'task-monitor';
  const title = monitor ? '任务监控' : mode ? '模式配置' : '常规';
  return <section className={`settings-basic${mode ? ' settings-basic-mode' : monitor ? ' settings-basic-task-monitor' : ''}`} aria-label={section === 'general' ? '常规设置' : title}>
    <div className="settings-basic-content">
      <h1 id={`settings-${section}-heading`} tabIndex={-1}>{title}</h1>
      {monitor ? <><p className="settings-basic-subtitle">选择任务监控的展示方式，以及需要启用的内容。修改会立即应用到所有任务。</p>
        {TASK_MONITOR_GROUPS.map(group => <SettingsGroup key={group.title} title={group.title} settings={group.settings} onNotice={onNotice} />)}
      </> : mode ? <><p className="settings-basic-subtitle">分别配置编程和通用的界面展示方式。</p>
        <SettingsGroup title="编程" settings={modeSettings('编程')} onNotice={onNotice} />
        <SettingsGroup title="通用" settings={modeSettings('通用')} onNotice={onNotice} />
      </> : <>
      <SettingsGroup title="任务与工具" settings={GENERAL_TASK_SETTINGS} onNotice={onNotice} />
      <SettingsGroup title="通知" settings={GENERAL_NOTIFICATION_SETTINGS} onNotice={onNotice} />
      <section className="settings-basic-section" aria-label="隐私"><h2>隐私</h2><div className="settings-basic-card">
        <div className="settings-basic-row settings-basic-privacy-row">
          <span className="settings-basic-row-icon" aria-hidden="true"><Icon name="settings" size={16} /></span>
          <div className="settings-basic-row-copy"><h3>数据共享</h3><p>你的提示词、上下文及使用数据将用于产品改进，以便提供更好的服务。更多信息可参考<button type="button" className="settings-basic-link" onClick={() => onNotice('“隐私政策”的后续页面尚未采集；未打开外部页面。')}>隐私政策</button>。</p></div>
          <div className="settings-basic-row-control"><button type="button" role="combobox" aria-expanded="false" aria-haspopup="listbox" className="settings-basic-select" aria-label="数据共享模式" disabled><span>共享改进模式</span><Icon name="down" size={12} /></button></div>
        </div>
      </div><p className="settings-basic-upgrade-note">升级套餐后可自定义数据共享偏好。</p></section>
      <SettingsGroup title="托盘与菜单栏" settings={[{ label: '显示菜单栏图标', description: '在 macOS 菜单栏显示 Qoder，可快速打开任务或退出应用。', icon: 'monitor', kind: 'switch', checked: true }]} onNotice={onNotice} />
      </>}
    </div>
  </section>;
}
