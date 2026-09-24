export type PresentationContentProfile = {
  kind: 'product' | 'research';
  sidebar: {
    showBrandMark: boolean;
    showModeTabs: boolean;
    primaryAction: string;
    showSearch: boolean;
    workspaceLabel: string;
    showWorkspace: boolean;
    showSession: boolean;
    sessionLabel: string;
    showTechnicalNavigation: boolean;
    automationLabel: string;
    accountName: string;
    accountDetail: string;
    showUsage: boolean;
  };
  home: {
    showMobileInfo: boolean;
    mobileInfoLabel: string;
    headline: string;
    description: string;
    summaryAriaLabel: string;
    summaryTitle: string;
    summaryDetail: string;
    summaryMeta: string;
    activityPrimary: string;
    activitySecondary: string;
    activityPrimaryCaption: string;
    activitySecondaryCaption: string;
    activityAriaLabel: string;
    showQuickPrompts: boolean;
    quickPrompts: readonly [string, string, string];
    composerHint: string;
  };
  composer: {
    ariaLabel: string;
    placeholder: string;
    sendLabel: string;
    contextMenuLabel: string;
    showTechnicalContexts: boolean;
    showAutoSelector: boolean;
    showWorkspaceContext: boolean;
    localModeLabel: string;
    localBoundary: string;
    goalPlanNotice: string;
  };
  session: {
    title: string;
    modeLabel: string;
    assistantName: string;
    defaultPrompt: string;
    lead: string;
    plan: readonly [string, string, string];
    boundary: string;
    panelTitle: string;
    panelSummary: string;
    returnHome: string;
  };
  automation: {
    title: string;
    lead: string;
    action: string;
    emptyTitle: string;
    emptyDetail: string;
    boundary: string;
  };
};

export const sanbaoProductContentProfile: PresentationContentProfile = {
  kind: 'product',
  sidebar: {
    showBrandMark: true,
    showModeTabs: false,
    primaryAction: '开始协同',
    showSearch: false,
    workspaceLabel: '本地演示范围',
    showWorkspace: false,
    showSession: false,
    sessionLabel: '本地协作示例',
    showTechnicalNavigation: false,
    automationLabel: '例行协作（本地演示）',
    accountName: '三宝设计团队',
    accountDetail: '原型虚构账号',
    showUsage: false,
  },
  home: {
    showMobileInfo: false,
    mobileInfoLabel: '了解移动协作端',
    headline: '让经营目标，在明确边界内持续推进。',
    description: '从目标、事实与约束出发，明确下一步。',
    summaryAriaLabel: 'SanBao 本地演示范围',
    summaryTitle: 'SanBao 本地演示',
    summaryDetail: '当前演示范围 · 未连接业务系统',
    summaryMeta: '不创建经营事项或外部记录',
    activityPrimary: '协同记录',
    activitySecondary: '资源用量',
    activityPrimaryCaption: '演示数据，仅用于呈现协同记录的布局。',
    activitySecondaryCaption: '演示数据，不代表实际额度或使用量。',
    activityAriaLabel: '本地演示活动热力图，虚构示例数据',
    showQuickPrompts: false,
    quickPrompts: ['梳理一个经营问题', '比较一个经营选项', '组织一次跨专业协作'],
    composerHint: '描述目标、背景、约束，或需要核对的经营事实。',
  },
  composer: {
    ariaLabel: '经营事项输入',
    placeholder: '描述目标、背景、约束，或需要核对的经营事实。',
    sendLabel: '开始本地协作演示',
    contextMenuLabel: '添加经营上下文',
    showTechnicalContexts: false,
    showAutoSelector: false,
    showWorkspaceContext: false,
    localModeLabel: '本地演示',
    localBoundary: '当前输入只在本地原型中演示；不创建经营事项、不调用外部系统，也不授予真实权限。',
    goalPlanNotice: '本地演示；目标与计划仅用于组织当前页面，不触发真实动作。',
  },
  session: {
    title: '本地协作示例',
    modeLabel: '本地演示',
    assistantName: 'SanBao',
    defaultPrompt: '请把这项协作示意整理为目标、事实、约束、待确认事项与下一步。',
    lead: '先把目标、事实与约束放到同一处，再明确下一步需要谁来确认。',
    plan: [
      '明确目标、已知事实和当前约束。',
      '记录待比较的选项与需要补充的判断。',
      '保留责任、确认和外部回执的边界。',
    ],
    boundary: '此页是本地协作演示：不创建经营事项、不写入外部系统、不授予真实权限，也不代表业务动作已经完成。',
    panelTitle: '协作说明',
    panelSummary: '当前页面只展示可讨论的经营协作结构；真实对象、授权和外部回执仍需在接入后分别验证。',
    returnHome: '返回协作入口',
  },
  automation: {
    title: '例行协作',
    lead: '为已定义的例行协作安排提醒、整理或待核对事项。',
    action: '查看演示边界',
    emptyTitle: '还没有例行协作',
    emptyDetail: '先定义范围、责任和执行条件；当前原型不创建真实调度。',
    boundary: '本地演示，不连接真实调度、模型或业务系统，也不授予真实权限。',
  },
};

export const qoderResearchContentProfile: PresentationContentProfile = {
  kind: 'research',
  sidebar: {
    showBrandMark: false,
    showModeTabs: true,
    primaryAction: '新任务',
    showSearch: true,
    workspaceLabel: '工作区',
    showWorkspace: true,
    showSession: true,
    sessionLabel: 'UI 原型规划',
    showTechnicalNavigation: true,
    automationLabel: '自动化',
    accountName: '三宝设计团队',
    accountDetail: '原型虚构账号',
    showUsage: true,
  },
  home: {
    showMobileInfo: true,
    mobileInfoLabel: '下载移动端',
    headline: '不止于编程',
    description: '你好，欢迎来到 {workspaceName}。',
    summaryAriaLabel: '已绑定的本地示例工作区',
    summaryTitle: '{workspaceName}',
    summaryDetail: '已绑定 · 本地模式',
    summaryMeta: '示例仓库 · main',
    activityPrimary: '会话',
    activitySecondary: 'Credits',
    activityPrimaryCaption: '从一个想法，开始新的探索',
    activitySecondaryCaption: '记录每一次思考与创造',
    activityAriaLabel: '活动热力图，虚构示例数据',
    showQuickPrompts: true,
    quickPrompts: ['帮我梳理一个想法', '制作一个小工具', '安排一项自动化'],
    composerHint: '思考、创作、执行，都从这里开始',
  },
  composer: {
    ariaLabel: '任务输入',
    placeholder: '描述你想完成的任务…',
    sendLabel: '发送任务',
    contextMenuLabel: '添加上下文',
    showTechnicalContexts: true,
    showAutoSelector: true,
    showWorkspaceContext: true,
    localModeLabel: '本地模式',
    localBoundary: '本地模式',
    goalPlanNotice: '本地模式示例；目标与计划暂按互斥展示，原产品互斥行为尚未验证。',
  },
  session: {
    title: 'UI 原型规划',
    modeLabel: '{workspaceName}',
    assistantName: 'Qoder',
    defaultPrompt: '请帮我规划一个简单的纸飞机待办清单：整理桌面、浇花、阅读十页。先说明步骤，再创建一个可以预览的 HTML 页面。',
    lead: '从界面和交互路径开始，拆分可以逐项核对的部分。',
    plan: [
      '确定页面骨架：标题、待办清单和一个添加按钮，让主要操作一眼可见。',
      '完成单文件原型：将样式与交互放在 demo.html 中，使用虚构的三项待办。',
      '核对交互：点击完成、添加新事项，并检查小窗口中的排版。',
    ],
    boundary: '原型内容仅用于 Qoder 研究与本地复刻，不会修改真实文件。',
    panelTitle: '任务回顾',
    panelSummary: '从想法出发，制作一个轻量的纸飞机待办清单。',
    returnHome: '返回首页',
  },
  automation: {
    title: '自动化',
    lead: '让任务按计划自动执行',
    action: '新建自动化',
    emptyTitle: '还没有自动化任务',
    emptyDetail: '创建一个定时任务，让日常工作自动完成。',
    boundary: '此页只展示当前原型会话中创建的自动化，未连接真实调度或模型。',
  },
};

export function getPresentationContentProfile(search = window.location.search): PresentationContentProfile {
  return new URLSearchParams(search).get('mode') === 'research'
    ? qoderResearchContentProfile
    : sanbaoProductContentProfile;
}
