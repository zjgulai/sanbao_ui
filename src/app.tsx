import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { states } from './catalog';
import { ReviewBar, ResearchDetail, StateDirectory } from './components/ReviewShell';
import { AUTOMATION_TEMPLATES, AutomationDialog, AutomationPage, HomePage, ProductSidebar, SearchDialog, UsageDialog, WorkspaceDialog, type AutomationConfig, type AutomationTemplate, type AutomationView, type WorkspaceConfig } from './pages/ProductPages';
import { SessionPage } from './pages/SessionPage';
import { SettingsAppearancePage, SettingsSidebar } from './pages/SettingsAppearancePage';
import { KnowledgePage, SitesPage } from './pages/KnowledgePages';
import { SettingsProfilePage } from './pages/SettingsProfilePage';
import { SettingsBasicPage } from './pages/SettingsBasicPages';
import { SettingsShortcutsPage } from './pages/SettingsShortcutsPage';
import { SettingsVoicePage } from './pages/SettingsVoicePage';
import { SettingsModelsPage } from './pages/SettingsModelsPage';
import { SettingsMobilePage } from './pages/SettingsMobilePage';
import { MOBILE_FLOWS, MobileCollaborationPrototype, type MobileFlow } from './pages/MobileCollaborationPrototype';
import { ApprovalPlanWorkbench, type ApprovalPlanView } from './pages/ApprovalPlanWorkbench';
import { ARTIFACT_WORKBENCH_ENTRIES, ArtifactWorkspaceWorkbench, type ArtifactWorkbenchView } from './pages/ArtifactWorkspaceWorkbench';
import { EXECUTION_LIFECYCLE_ENTRIES, ExecutionLifecycleWorkbench, type ExecutionLifecycleSource, type ExecutionLifecycleView } from './pages/ExecutionLifecycleWorkbench';
import { SETTINGS_LEAF_KEYS, SettingsLeafWorkbench, type SettingsLeafKey, type SettingsLeafView } from './pages/SettingsLeafWorkbench';
import { WORKSPACE_MULTIPANE_ENTRY, WorkspaceMultipaneWorkbench, type WorkspaceMultipaneView } from './pages/WorkspaceMultipaneWorkbench';
import { TASK_SEARCH_WORKSPACE_ENTRIES, TaskSearchWorkspaceWorkbench, type TaskSearchWorkspaceView } from './pages/TaskSearchWorkspaceWorkbench';
import { COLLABORATION_WORKBENCH_ENTRIES, CollaborationCollectionWorkbench, type CollaborationWorkbenchSection, type CollaborationWorkbenchView } from './pages/CollaborationCollectionWorkbench';
import { AGENT_RUNTIME_WORKBENCH_ENTRIES, AgentRuntimeWorkbench, type AgentRuntimeView } from './pages/AgentRuntimeWorkbench';
import { COMPOSER_WORKBENCH_ENTRIES, COMPOSER_WORKBENCH_STATE_BY_VIEW, ComposerDesignWorkbench, type ComposerWorkbenchView } from './pages/ComposerDesignWorkbench';
import { TASK_MONITOR_WORKBENCH_ENTRY, TaskMonitorWorkbench, type TaskMonitorView } from './pages/TaskMonitorWorkbench';
import { ENTRY_SYSTEM_WORKBENCH_ENTRIES, ENTRY_SYSTEM_STATE_BY_VIEW, EntrySystemWorkbench, type EntrySystemView } from './pages/EntrySystemWorkbench';
import { SESSION_RESILIENCE_ENTRIES, SESSION_RESILIENCE_STATE_BY_VIEW, SESSION_RESILIENCE_VIEWS, SessionResilienceWorkbench, type SessionResilienceView } from './pages/SessionResilienceWorkbench';
import { SETTINGS_EXTENSION_WORKBENCH_ENTRIES, SETTINGS_EXTENSION_WORKBENCH_QDR_BY_VIEW, SETTINGS_EXTENSION_WORKBENCH_VIEWS, SettingsExtensionWorkbench, type SettingsExtensionWorkbenchView } from './pages/SettingsExtensionWorkbench';
import { TOOL_RESULT_ENTRIES, TOOL_RESULT_STATE_BY_VIEW, TOOL_RESULT_VIEWS, ToolResultWorkbench, type ToolResultView } from './pages/ToolResultWorkbench';
import { AUTOMATION_LIFECYCLE_ENTRIES, AUTOMATION_LIFECYCLE_STATE_ID, AUTOMATION_LIFECYCLE_VIEWS, AutomationLifecycleWorkbench, type AutomationLifecycleView } from './pages/AutomationLifecycleWorkbench';
import { SESSION_INTERACTION_ENTRIES, SESSION_INTERACTION_STATE_BY_VIEW, SESSION_INTERACTION_VIEWS, SessionInteractionWorkbench, type SessionInteractionView } from './pages/SessionInteractionWorkbench';
import { REMAINING_SCOPE_ENTRIES, REMAINING_SCOPE_STATE_BY_VIEW, REMAINING_SCOPE_VIEWS, RemainingScopeWorkbench, type RemainingScopeView } from './pages/RemainingScopeWorkbench';
import { SessionWorkspaceEntryWorkbench } from './pages/SessionWorkspaceEntryWorkbench';
import { InstalledExtensionsPage, ExtensionMarketPage, ExtensionDetailPage } from './pages/ExtensionPages';
import { MarketDetailPage, PluginMarketDetailPage } from './pages/MarketDetailPages';
import type { ComposerContextState } from './components/Controls';
import type { UserAppearancePanel } from './components/UserAppearanceMenu';

// Explicit local implementations; this list does not certify Qoder fidelity or DSH integration.
export const IMPLEMENTED_OBSERVATIONS = [
  'QB1-01', 'QB1-02', 'QB1-03', 'QB1-04', 'QB1-05', 'QB1-06',
  'QB1-07', 'QB1-08', 'QB1-09', 'QB1-10', 'QB1-11', 'QB1-12',
  'QB1-13', 'QB1-14', 'QB1-15', 'QB1-16', 'QB1-17', 'QB1-18',
  'QB1-19', 'QB1-20', 'QB1-21', 'QB1-22', 'QB1-23', 'QB1-24',
  'QB1-25', 'QB1-26',
  'QD0-03', 'QD0-04', 'QD0-05',
  'QB3-01', 'QB3-02', 'QB3-03', 'QB3-04',
  'QB3-05', 'QB3-06', 'QB3-07', 'QB3-08',
  'QB3-09', 'QB3-10', 'QB3-11', 'QB3-12',
  'QB3-13', 'QB3-14', 'QB3-15', 'QB3-16', 'QB3-17',
  'QB5-01', 'QB5-02', 'QB5-03', 'QB5-04', 'QB5-05', 'QB5-06', 'QB5-07',
  'QB6-01', 'QB6-02', 'QB6-03', 'QB6-04', 'QB6-05', 'QB6-06', 'QB6-07', 'QB6-08',
  'QB7-01',
  'QB8-01', 'QB8-02', 'QB8-03', 'QB8-04', 'QB8-05', 'QB8-06', 'QB8-07', 'QB8-08',
  'QB9-01',
  'QB12-01', 'QB12-02', 'QB12-03', 'QB12-04', 'QB12-05', 'QB12-06', 'QB12-07',
  'QB13-01', 'QB13-02', 'QB13-03', 'QB13-04',
  'QB14-01', 'QB14-02', 'QB14-03', 'QB14-04', 'QB14-05',
  'QB15-01', 'QB15-02', 'QB16-01', 'QB17-01',
  'QB18-01', 'QB18-02', 'QB18-03', 'QB18-04', 'QB18-05', 'QB18-06', 'QB18-07', 'QB18-08',
  'QB19-01', 'QB19-02', 'QB19-03',
  'QB20-01', 'QB20-02', 'QB20-03', 'QB20-04', 'QB20-05', 'QB20-06', 'QB20-07',
  'QB21-01', 'QB21-02', 'QB21-03',
  'QB11-01', 'QB11-02', 'QB11-03', 'QB11-04',
  'QB10-01', 'QB10-02', 'QB10-03', 'QB10-04', 'QB10-05', 'QB10-06', 'QB10-07',
] as const;
const implemented = new Set<string>(IMPLEMENTED_OBSERVATIONS);
const homeId = states.find(state => state.observationIds.includes('QB1-06'))!.id;
const getStateId = () => new URLSearchParams(window.location.search).get('state') || homeId;
type PresentationMode = 'product' | 'research';
const getPresentationMode = (): PresentationMode => new URLSearchParams(window.location.search).get('mode') === 'research' ? 'research' : 'product';
const getAutomationView = (): 'mine' | 'templates' | 'runs' => {
  const view = new URLSearchParams(window.location.search).get('automationView');
  return view === 'templates' || view === 'runs' ? view : 'mine';
};
const getAutomationFixture = (): string | null => {
  const fixture = new URLSearchParams(window.location.search).get('automationFixture');
  if (fixture === 'manual' || fixture === 'created') return fixture;
  return fixture && AUTOMATION_TEMPLATES.some(template => fixture === `template:${template.id}`) ? fixture : null;
};
const getAutomationTemplate = (fixture: string | null): AutomationTemplate | undefined => fixture?.startsWith('template:') ? AUTOMATION_TEMPLATES.find(template => template.id === fixture.slice('template:'.length)) : undefined;
const getClarificationCollapsed = () => new URLSearchParams(window.location.search).get('clarificationView') === 'collapsed';
const getTaskReviewExpanded = () => new URLSearchParams(window.location.search).get('taskReviewView') === 'expanded';
const getUsageRefreshed = () => new URLSearchParams(window.location.search).get('usageView') === 'refreshed';
const getToolCollapsed = () => new URLSearchParams(window.location.search).get('toolView') === 'collapsed';
const getStopContinuation = () => new URLSearchParams(window.location.search).get('stopView') === 'continued';
const getMobileFlow = (): MobileFlow | null => {
  const flow = new URLSearchParams(window.location.search).get('mobileFlow');
  return MOBILE_FLOWS.includes(flow as MobileFlow) ? flow as MobileFlow : null;
};
const workspaceMultipaneViews = ['overview', 'create', 'confirm-close', 'closed'] as const;
const getWorkspaceMultipaneView = (): WorkspaceMultipaneView | null => {
  if (getStateId() !== WORKSPACE_MULTIPANE_ENTRY.stateId) return null;
  const view = new URLSearchParams(window.location.search).get('workspaceView');
  return workspaceMultipaneViews.includes(view as WorkspaceMultipaneView) ? view as WorkspaceMultipaneView : 'overview';
};
const executionViewsBySource: Record<ExecutionLifecycleSource, readonly ExecutionLifecycleView[]> = {
  queue: ['queue-pending', 'queue-retrying', 'queue-ready', 'queue-cancelled'],
  steps: ['steps-running', 'steps-blocked', 'steps-resumed', 'steps-cancelled'],
  'follow-up': ['follow-up-composer', 'follow-up-queued', 'follow-up-delivered', 'follow-up-cancelled'],
};
const getExecutionLifecycleView = (): ExecutionLifecycleView | null => {
  const entry = EXECUTION_LIFECYCLE_ENTRIES.find(item => item.stateId === getStateId());
  if (!entry) return null;
  const view = new URLSearchParams(window.location.search).get('executionView') as ExecutionLifecycleView | null;
  return view && executionViewsBySource[entry.source].includes(view) ? view : entry.defaultView;
};
const getSettingsLeafKey = (): SettingsLeafKey | null => {
  const key = new URLSearchParams(window.location.search).get('settingsLeaf');
  return SETTINGS_LEAF_KEYS.includes(key as SettingsLeafKey) ? key as SettingsLeafKey : null;
};
const settingsLeafViews = ['overview', 'draft', 'result'] as const;
const getSettingsLeafView = (): SettingsLeafView => {
  const view = new URLSearchParams(window.location.search).get('settingsLeafView');
  return settingsLeafViews.includes(view as SettingsLeafView) ? view as SettingsLeafView : 'overview';
};
const taskSearchWorkspaceViews = ['tasks', 'search', 'workspace', 'actions'] as const;
const getTaskSearchWorkspaceView = (): TaskSearchWorkspaceView | null => {
  const entry = TASK_SEARCH_WORKSPACE_ENTRIES.find(item => item.stateId === getStateId());
  if (!entry) return null;
  const view = new URLSearchParams(window.location.search).get('taskWorkspaceView');
  return taskSearchWorkspaceViews.includes(view as TaskSearchWorkspaceView) ? view as TaskSearchWorkspaceView : entry.view;
};
const collaborationSections = ['projects', 'issues', 'discussions', 'my-work'] as const;
const collaborationViewsBySection: Record<CollaborationWorkbenchSection, readonly CollaborationWorkbenchView[]> = {
  projects: ['list', 'detail', 'project-draft', 'feedback'],
  issues: ['list', 'detail', 'issue-run', 'feedback'],
  discussions: ['list', 'detail', 'discussion-status', 'feedback'],
  'my-work': ['list', 'detail', 'feedback'],
};
const getCollaborationSection = (): CollaborationWorkbenchSection | null => {
  const entry = COLLABORATION_WORKBENCH_ENTRIES.find(item => item.stateId === getStateId());
  if (!entry) return null;
  const section = new URLSearchParams(window.location.search).get('collaborationSection');
  return collaborationSections.includes(section as CollaborationWorkbenchSection) && section === entry.section ? section as CollaborationWorkbenchSection : entry.section;
};
const getCollaborationView = (): CollaborationWorkbenchView | null => {
  const section = getCollaborationSection();
  if (!section) return null;
  const entry = COLLABORATION_WORKBENCH_ENTRIES.find(item => item.section === section)!;
  const view = new URLSearchParams(window.location.search).get('collaborationView') as CollaborationWorkbenchView | null;
  return view && collaborationViewsBySection[section].includes(view) ? view : entry.defaultView;
};
const configViews = ['agent-list', 'agent-create', 'agent-selected', 'squad-list', 'squad-create', 'squad-selected', 'runtime-profiles', 'runtime-create', 'runtime-connecting', 'runtime-unavailable', 'handoff-connection', 'handoff-unavailable'] as const;
const configStateByView: Record<AgentRuntimeView, string> = {
  'agent-list': 'QDR.P10.scope.unexpanded', 'agent-create': 'QDR.P10.scope.unexpanded', 'agent-selected': 'QDR.P10.scope.unexpanded',
  'squad-list': 'QDR.P10.scope.unexpanded', 'squad-create': 'QDR.P10.scope.unexpanded', 'squad-selected': 'QDR.P10.scope.unexpanded',
  'runtime-profiles': 'QDR.P11.scope.unexpanded', 'runtime-create': 'QDR.P11.scope.unexpanded', 'runtime-connecting': 'QDR.P11.scope.unexpanded', 'runtime-unavailable': 'QDR.P11.scope.unexpanded',
  'handoff-connection': 'QDR.O06.scope.unexpanded', 'handoff-unavailable': 'QDR.O06.scope.unexpanded',
};
const getAgentRuntimeView = (): AgentRuntimeView | null => {
  const stateId = getStateId();
  if (!AGENT_RUNTIME_WORKBENCH_ENTRIES.some(entry => entry.stateId === stateId)) return null;
  const view = new URLSearchParams(window.location.search).get('configView');
  if (configViews.includes(view as AgentRuntimeView) && configStateByView[view as AgentRuntimeView] === stateId) return view as AgentRuntimeView;
  return stateId === 'QDR.P11.scope.unexpanded' ? 'runtime-profiles' : stateId === 'QDR.O06.scope.unexpanded' ? 'handoff-connection' : 'agent-list';
};
const composerWorkbenchViews = ['suggestions', 'context', 'input', 'permission', 'git'] as const;
const getComposerWorkbenchView = (): ComposerWorkbenchView | null => {
  const entry = COMPOSER_WORKBENCH_ENTRIES.find(item => item.stateId === getStateId());
  if (!entry) return null;
  const view = new URLSearchParams(window.location.search).get('composerWorkbenchView');
  return composerWorkbenchViews.includes(view as ComposerWorkbenchView) && COMPOSER_WORKBENCH_STATE_BY_VIEW[view as ComposerWorkbenchView] === getStateId() ? view as ComposerWorkbenchView : entry.view;
};
const taskMonitorViews = ['fixed', 'floating', 'detail', 'stopped', 'recovered'] as const;
const getTaskMonitorView = (): TaskMonitorView | null => {
  if (getStateId() !== TASK_MONITOR_WORKBENCH_ENTRY.stateId) return null;
  const view = new URLSearchParams(window.location.search).get('taskMonitorView');
  return taskMonitorViews.includes(view as TaskMonitorView) ? view as TaskMonitorView : 'fixed';
};
const entrySystemViews = ['onboarding-intro', 'onboarding-preview', 'onboarding-login-prompt', 'login-network', 'access-domain', 'domain-local-error', 'domain-ready', 'architecture-mismatch', 'feedback-draft', 'feedback-ready', 'about', 'system-task-exit', 'system-unsaved-exit', 'system-update-running', 'system-cancelled'] as const;
const getEntrySystemView = (): EntrySystemView | null => {
  const entry = ENTRY_SYSTEM_WORKBENCH_ENTRIES.find(item => item.stateId === getStateId());
  if (!entry) return null;
  const view = new URLSearchParams(window.location.search).get('entrySystemView');
  return entrySystemViews.includes(view as EntrySystemView) && ENTRY_SYSTEM_STATE_BY_VIEW[view as EntrySystemView] === getStateId() ? view as EntrySystemView : entry.defaultView;
};
const getSessionResilienceView = (): SessionResilienceView | null => {
  const entry = SESSION_RESILIENCE_ENTRIES.find(item => item.stateId === getStateId());
  if (!entry) return null;
  const view = new URLSearchParams(window.location.search).get('sessionRecoveryView');
  return SESSION_RESILIENCE_VIEWS.includes(view as SessionResilienceView) && SESSION_RESILIENCE_STATE_BY_VIEW[view as SessionResilienceView] === getStateId() ? view as SessionResilienceView : entry.view;
};
const getSettingsExtensionWorkbenchView = (): SettingsExtensionWorkbenchView | null => {
  const entry = SETTINGS_EXTENSION_WORKBENCH_ENTRIES.find(item => item.sourceId === getStateId());
  if (!entry) return null;
  const view = new URLSearchParams(window.location.search).get('pluginEntryView');
  return SETTINGS_EXTENSION_WORKBENCH_VIEWS.includes(view as SettingsExtensionWorkbenchView) && SETTINGS_EXTENSION_WORKBENCH_QDR_BY_VIEW[view as SettingsExtensionWorkbenchView] === getStateId() ? view as SettingsExtensionWorkbenchView : entry.view;
};
const getToolResultView = (): ToolResultView | null => {
  const entry = TOOL_RESULT_ENTRIES.find(item => item.stateId === getStateId());
  if (!entry) return null;
  const view = new URLSearchParams(window.location.search).get('toolResultView');
  return TOOL_RESULT_VIEWS.includes(view as ToolResultView) && TOOL_RESULT_STATE_BY_VIEW[view as ToolResultView] === getStateId() ? view as ToolResultView : entry.view;
};
const getAutomationLifecycleView = (): AutomationLifecycleView | null => {
  if (getStateId() !== AUTOMATION_LIFECYCLE_STATE_ID) return null;
  const view = new URLSearchParams(window.location.search).get('automationLifecycleView');
  return AUTOMATION_LIFECYCLE_VIEWS.includes(view as AutomationLifecycleView) ? view as AutomationLifecycleView : null;
};
const getSessionInteractionView = (): SessionInteractionView | null => {
  const entry = SESSION_INTERACTION_ENTRIES.find(item => item.stateId === getStateId());
  if (!entry) return null;
  const view = new URLSearchParams(window.location.search).get('sessionInteractionView');
  return SESSION_INTERACTION_VIEWS.includes(view as SessionInteractionView) && SESSION_INTERACTION_STATE_BY_VIEW[view as SessionInteractionView] === getStateId() ? view as SessionInteractionView : null;
};
const getRemainingScopeView = (): RemainingScopeView | null => {
  const entry = REMAINING_SCOPE_ENTRIES.find(item => item.stateId === getStateId());
  if (!entry) return null;
  const view = new URLSearchParams(window.location.search).get('remainingScopeView');
  return REMAINING_SCOPE_VIEWS.includes(view as RemainingScopeView) && REMAINING_SCOPE_STATE_BY_VIEW[view as RemainingScopeView] === getStateId() ? view as RemainingScopeView : entry.view;
};
const clearDesignParams = (url: URL) => {
  for (const key of ['mobileFlow', 'approvalView', 'planView', 'workspaceView', 'executionView', 'settingsLeaf', 'settingsLeafView', 'taskWorkspaceView', 'collaborationSection', 'collaborationView', 'configView', 'composerWorkbenchView', 'taskMonitorView', 'entrySystemView', 'sessionRecoveryView', 'pluginEntryView', 'toolResultView', 'automationLifecycleView', 'sessionInteractionView', 'remainingScopeView']) url.searchParams.delete(key);
};
const permissionDesignViews = ['request', 'waiting', 'resolved'] as const;
const planDesignViews = ['preview', 'expanded', 'confirmation', 'approved', 'exit'] as const;
const getApprovalPlanView = (): ApprovalPlanView | null => {
  const url = new URL(window.location.href);
  const id = url.searchParams.get('state');
  if (id === 'QDR.S03.scope.unexpanded') {
    const view = url.searchParams.get('approvalView');
    return permissionDesignViews.includes(view as typeof permissionDesignViews[number]) ? view as ApprovalPlanView : 'request';
  }
  if (id === 'QDR.S04.scope.unexpanded') {
    const view = url.searchParams.get('planView');
    return planDesignViews.includes(view as typeof planDesignViews[number]) ? view as ApprovalPlanView : 'preview';
  }
  return null;
};
const isSearchState = (id: string) => !!states.find(state => state.id === id)?.observationIds.includes('QB1-03');
const isKnowledgeState = (id: string) => states.find(state => state.id === id)?.page === 'knowledge';
const isInstalledExtensionsState = (id: string) => { const state = states.find(item => item.id === id); return state?.page === 'settings' && state.variant.startsWith('extensions-'); };
const settingsFamily = (id: string) => {
  const state = states.find(item => item.id === id);
  if (state?.id === 'QDR.P06.settings.mobile.partial') return 'mobile';
  if (state?.page !== 'settings') return null;
  return (['shortcuts', 'voice', 'models', 'mobile'] as const).find(family => state.variant === family || state.variant.startsWith(`${family}.`)) ?? null;
};
const isMobileSettingsState = (id: string) => id === 'QDR.P06.settings.mobile.partial';

const pluginDetailVariants = ['plugins-superpowers-detail', 'plugins-superpowers-expanded', 'plugins-context7-detail', 'connectors-context7-error'];
const isMarketListState = (id: string) => { const state = states.find(item => item.id === id); return state?.page === 'extensions' && !state.variant.endsWith('-detail') && !pluginDetailVariants.includes(state.variant); };
const batch21CompatibleReferenceVariants = new Set(['models.add.openai-compatible', 'models.openai-compatible.api-type.open', 'models.add.anthropic-compatible']);
const batch21DefaultModelReferenceVariants = new Set(['models.add.default']);
const batch21DiscardReferenceVariants = new Set(['models.discard.open']);

export function App() {
  const [id, setId] = useState(getStateId);
  const [presentationMode, setPresentationMode] = useState<PresentationMode>(getPresentationMode);
  const [automationView, setAutomationView] = useState(getAutomationView);
  const [automationFixture, setAutomationFixture] = useState(getAutomationFixture);
  const [automationLifecycleView, setAutomationLifecycleView] = useState<AutomationLifecycleView | null>(getAutomationLifecycleView);
  const [sessionInteractionView, setSessionInteractionView] = useState<SessionInteractionView | null>(getSessionInteractionView);
  const [remainingScopeView, setRemainingScopeView] = useState<RemainingScopeView | null>(getRemainingScopeView);
  const [clarificationCollapsed, setClarificationCollapsed] = useState(getClarificationCollapsed);
  const [taskReviewExpanded, setTaskReviewExpanded] = useState(getTaskReviewExpanded);
  const [usageRefreshed, setUsageRefreshed] = useState(getUsageRefreshed);
  const [toolCollapsed, setToolCollapsed] = useState(getToolCollapsed);
  const [stopContinuation, setStopContinuation] = useState(getStopContinuation);
  const [mobileFlow, setMobileFlow] = useState<MobileFlow | null>(getMobileFlow);
  const [approvalPlanView, setApprovalPlanView] = useState<ApprovalPlanView | null>(getApprovalPlanView);
  const [workspaceMultipaneView, setWorkspaceMultipaneView] = useState<WorkspaceMultipaneView | null>(getWorkspaceMultipaneView);
  const [executionLifecycleView, setExecutionLifecycleView] = useState<ExecutionLifecycleView | null>(getExecutionLifecycleView);
  const [settingsLeafKey, setSettingsLeafKey] = useState<SettingsLeafKey | null>(getSettingsLeafKey);
  const [settingsLeafView, setSettingsLeafView] = useState<SettingsLeafView>(getSettingsLeafView);
  const [taskSearchWorkspaceView, setTaskSearchWorkspaceView] = useState<TaskSearchWorkspaceView | null>(getTaskSearchWorkspaceView);
  const [collaborationSection, setCollaborationSection] = useState<CollaborationWorkbenchSection | null>(getCollaborationSection);
  const [collaborationView, setCollaborationView] = useState<CollaborationWorkbenchView | null>(getCollaborationView);
  const [agentRuntimeView, setAgentRuntimeView] = useState<AgentRuntimeView | null>(getAgentRuntimeView);
  const [composerWorkbenchView, setComposerWorkbenchView] = useState<ComposerWorkbenchView | null>(getComposerWorkbenchView);
  const [taskMonitorView, setTaskMonitorView] = useState<TaskMonitorView | null>(getTaskMonitorView);
  const [entrySystemView, setEntrySystemView] = useState<EntrySystemView | null>(getEntrySystemView);
  const [sessionResilienceView, setSessionResilienceView] = useState<SessionResilienceView | null>(getSessionResilienceView);
  const [settingsExtensionWorkbenchView, setSettingsExtensionWorkbenchView] = useState<SettingsExtensionWorkbenchView | null>(getSettingsExtensionWorkbenchView);
  const [toolResultView, setToolResultView] = useState<ToolResultView | null>(getToolResultView);
  const [sceneId, setSceneId] = useState(() => isSearchState(getStateId()) ? homeId : getStateId());
  const [revision, setRevision] = useState(0);
  const [directoryOpen, setDirectoryOpen] = useState(() => localStorage.getItem('sanbao-prototype-directory') !== 'closed');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [automationItems, setAutomationItems] = useState<AutomationConfig[]>([]);
  const [prompt, setPrompt] = useState('');
  const [homeDraft, setHomeDraft] = useState('');
  const [homeSkill, setHomeSkill] = useState('');
  const [workspace, setWorkspace] = useState<WorkspaceConfig>({ name: 'paper-plane', color: '#789783' });
  const [clarificationAnswer, setClarificationAnswer] = useState('');
  const [toast, setToast] = useState('');
  const previous = useRef(homeId);
  const searchOpener = useRef<{ element: HTMLElement; id: string; label: string | null } | null>(null);
  const restoreSearchFocus = useRef(false);
  const searchResetOrigin = useRef<Element | null>(null);
  const currentId = useRef(id);
  currentId.current = id;
  const currentSceneId = useRef(sceneId);
  currentSceneId.current = sceneId;
  const state = states.find(item => item.id === id);
  const scene = states.find(item => item.id === sceneId);
  const referenceTheme = !scene ? undefined : batch21CompatibleReferenceVariants.has(scene.variant) || batch21DefaultModelReferenceVariants.has(scene.variant) ? 'dark' : batch21DiscardReferenceVariants.has(scene.variant) ? 'dark-discard' : undefined;
  const searchOpen = isSearchState(id);
  const observation = Number(scene?.observationIds.find(item => item.startsWith('QB1-'))?.split('-')[1] ?? 0);
  const initialContextMenu: ComposerContextState | undefined = scene?.observationIds.includes('QD0-03') ? 'context' : scene?.observationIds.includes('QD0-04') ? 'skills' : ({ 'goal-mode': 'goal', 'plan-mode': 'plan', 'site-templates': 'sites', 'files-menu': 'files', 'plugins-menu': 'plugins' } as Record<string, ComposerContextState>)[scene?.variant ?? ''];
  const available = !!scene?.observationIds.some(item => implemented.has(item));
  const applyRoute = useCallback((next: string, searchBackground?: string) => {
    setPresentationMode(getPresentationMode());
    if (isSearchState(next)) {
      if (!isSearchState(currentId.current)) {
        searchResetOrigin.current = null;
        const element = document.activeElement;
        searchOpener.current = element instanceof HTMLElement ? { element, id: element.id || element.closest('[data-focus-return]')?.getAttribute('data-focus-return') || '', label: element.getAttribute('aria-label') } : null;
      }
      const background = searchBackground && !isSearchState(searchBackground) ? searchBackground : currentSceneId.current;
      if (background !== currentSceneId.current) {
        currentSceneId.current = background;
        setSceneId(background);
        setRevision(value => value + 1);
      }
    } else if (isSearchState(currentId.current) && next === currentSceneId.current) {
      // Closing a temporary search must retain the live background and its form state.
      restoreSearchFocus.current = true;
    } else {
      previous.current = currentSceneId.current;
      const sameDesignFixture = next === currentSceneId.current && (!!getWorkspaceMultipaneView() || !!getExecutionLifecycleView() || !!getSettingsLeafKey() || !!getTaskSearchWorkspaceView() || !!getCollaborationSection() || !!getAgentRuntimeView() || !!getComposerWorkbenchView() || !!getTaskMonitorView() || !!getEntrySystemView() || !!getSessionResilienceView() || !!getSettingsExtensionWorkbenchView() || !!getToolResultView() || !!getAutomationLifecycleView() || !!getSessionInteractionView() || !!getRemainingScopeView());
      if (!sameDesignFixture && !(isKnowledgeState(next) && isKnowledgeState(currentSceneId.current)) && !(isInstalledExtensionsState(next) && isInstalledExtensionsState(currentSceneId.current)) && !(isMarketListState(next) && isMarketListState(currentSceneId.current)) && !(settingsFamily(next) && settingsFamily(next) === settingsFamily(currentSceneId.current))) setRevision(value => value + 1);
      currentSceneId.current = next;
      setSceneId(next);
    }
    currentId.current = next;
    setId(next);
    setAutomationView(getAutomationView());
    setAutomationFixture(getAutomationFixture());
    setClarificationCollapsed(getClarificationCollapsed());
    setTaskReviewExpanded(getTaskReviewExpanded());
    setUsageRefreshed(getUsageRefreshed());
    setToolCollapsed(getToolCollapsed());
    setStopContinuation(getStopContinuation());
    setApprovalPlanView(getApprovalPlanView());
    setWorkspaceMultipaneView(getWorkspaceMultipaneView());
    setExecutionLifecycleView(getExecutionLifecycleView());
    setSettingsLeafKey(getSettingsLeafKey());
    setSettingsLeafView(getSettingsLeafView());
    setTaskSearchWorkspaceView(getTaskSearchWorkspaceView());
    setCollaborationSection(getCollaborationSection());
    setCollaborationView(getCollaborationView());
    setAgentRuntimeView(getAgentRuntimeView());
    setComposerWorkbenchView(getComposerWorkbenchView());
    setTaskMonitorView(getTaskMonitorView());
    setEntrySystemView(getEntrySystemView());
    setSessionResilienceView(getSessionResilienceView());
    setSettingsExtensionWorkbenchView(getSettingsExtensionWorkbenchView());
    setToolResultView(getToolResultView());
    setAutomationLifecycleView(getAutomationLifecycleView());
    setSessionInteractionView(getSessionInteractionView());
    setRemainingScopeView(getRemainingScopeView());
  }, []);
  const navigate = useCallback((next: string) => {
    if (isSearchState(next) && next === currentId.current) return;
    const url = new URL(window.location.href);
    url.searchParams.set('state', next);
    clearDesignParams(url);
    if (next !== 'QDR.S02.clarification.waiting') url.searchParams.delete('clarificationView');
    if (next !== 'QDR.P16.review.summary') url.searchParams.delete('taskReviewView');
    if (next !== 'QDR.OBS01.usage.open') url.searchParams.delete('usageView');
    if (next !== 'QDR.M02.edit.expanded' || next !== currentId.current) url.searchParams.delete('toolView');
    url.searchParams.delete('stopView');
    const background = isSearchState(next) ? currentSceneId.current : undefined;
    window.history.pushState(background ? { searchBackground: background } : {}, '', url);
    applyRoute(next, background);
  }, [applyRoute]);
  const navigateMobile = useCallback((flow: MobileFlow) => {
    const url = new URL(window.location.href);
    url.searchParams.set('state', 'QDR.P06.settings.mobile.partial');
    clearDesignParams(url);
    url.searchParams.set('mobileFlow', flow);
    window.history.pushState({}, '', url);
    setMobileFlow(flow);
    applyRoute('QDR.P06.settings.mobile.partial');
  }, [applyRoute]);
  const navigateApprovalPlan = useCallback((next: ApprovalPlanView) => {
    const id = getStateId();
    if (id !== 'QDR.S03.scope.unexpanded' && id !== 'QDR.S04.scope.unexpanded') return;
    const url = new URL(window.location.href);
    url.searchParams.set('state', id);
    clearDesignParams(url);
    if (id === 'QDR.S03.scope.unexpanded') {
      url.searchParams.set('approvalView', next);
      url.searchParams.delete('planView');
    } else {
      url.searchParams.set('planView', next);
      url.searchParams.delete('approvalView');
    }
    window.history.pushState({}, '', url);
    setApprovalPlanView(next);
    applyRoute(id);
  }, [applyRoute]);
  const navigateArtifactWorkbench = useCallback((next: ArtifactWorkbenchView) => {
    const entry = ARTIFACT_WORKBENCH_ENTRIES.find(item => item.view === next);
    if (!entry) return;
    const url = new URL(window.location.href);
    url.searchParams.set('state', entry.stateId);
    clearDesignParams(url);
    window.history.pushState({}, '', url);
    applyRoute(entry.stateId);
  }, [applyRoute]);
  const navigateWorkspaceMultipane = useCallback((next: WorkspaceMultipaneView) => {
    const url = new URL(window.location.href);
    url.searchParams.set('state', WORKSPACE_MULTIPANE_ENTRY.stateId);
    clearDesignParams(url);
    url.searchParams.set('workspaceView', next);
    window.history.pushState({}, '', url);
    setWorkspaceMultipaneView(next);
    applyRoute(WORKSPACE_MULTIPANE_ENTRY.stateId);
  }, [applyRoute]);
  const navigateExecutionLifecycle = useCallback((source: ExecutionLifecycleSource, next: ExecutionLifecycleView) => {
    const entry = EXECUTION_LIFECYCLE_ENTRIES.find(item => item.source === source);
    if (!entry || !executionViewsBySource[source].includes(next)) return;
    const url = new URL(window.location.href);
    url.searchParams.set('state', entry.stateId);
    clearDesignParams(url);
    url.searchParams.set('executionView', next);
    window.history.pushState({}, '', url);
    setExecutionLifecycleView(next);
    applyRoute(entry.stateId);
  }, [applyRoute]);
  const navigateSettingsLeaf = useCallback((key: SettingsLeafKey, view: SettingsLeafView = 'overview') => {
    const url = new URL(window.location.href);
    // Entry-only settings have no Qoder leaf state in the 206-record register. Keep a documented settings shell anchor.
    url.searchParams.set('state', 'QDR.P06.settings.appearance.default');
    clearDesignParams(url);
    url.searchParams.set('settingsLeaf', key);
    url.searchParams.set('settingsLeafView', view);
    window.history.pushState({}, '', url);
    setSettingsLeafKey(key);
    setSettingsLeafView(view);
    applyRoute('QDR.P06.settings.appearance.default');
  }, [applyRoute]);
  const navigateTaskSearchWorkspace = useCallback((view: TaskSearchWorkspaceView) => {
    const entry = TASK_SEARCH_WORKSPACE_ENTRIES.find(item => item.view === view);
    if (!entry) return;
    const url = new URL(window.location.href);
    url.searchParams.set('state', entry.stateId);
    clearDesignParams(url);
    url.searchParams.set('taskWorkspaceView', view);
    window.history.pushState({}, '', url);
    setTaskSearchWorkspaceView(view);
    applyRoute(entry.stateId);
  }, [applyRoute]);
  const navigateCollaboration = useCallback((section: CollaborationWorkbenchSection, view: CollaborationWorkbenchView) => {
    const entry = COLLABORATION_WORKBENCH_ENTRIES.find(item => item.section === section);
    if (!entry || !collaborationViewsBySection[section].includes(view)) return;
    const url = new URL(window.location.href);
    url.searchParams.set('state', entry.stateId);
    clearDesignParams(url);
    url.searchParams.set('collaborationSection', section);
    url.searchParams.set('collaborationView', view);
    window.history.pushState({}, '', url);
    setCollaborationSection(section);
    setCollaborationView(view);
    applyRoute(entry.stateId);
  }, [applyRoute]);
  const navigateAgentRuntime = useCallback((view: AgentRuntimeView) => {
    const stateId = configStateByView[view];
    const url = new URL(window.location.href);
    url.searchParams.set('state', stateId);
    clearDesignParams(url);
    url.searchParams.set('configView', view);
    window.history.pushState({}, '', url);
    setAgentRuntimeView(view);
    applyRoute(stateId);
  }, [applyRoute]);
  const navigateComposerWorkbench = useCallback((view: ComposerWorkbenchView) => {
    const stateId = COMPOSER_WORKBENCH_STATE_BY_VIEW[view];
    const url = new URL(window.location.href);
    url.searchParams.set('state', stateId);
    clearDesignParams(url);
    url.searchParams.set('composerWorkbenchView', view);
    window.history.pushState({}, '', url);
    setComposerWorkbenchView(view);
    applyRoute(stateId);
  }, [applyRoute]);
  const navigateTaskMonitor = useCallback((view: TaskMonitorView) => {
    const url = new URL(window.location.href);
    url.searchParams.set('state', TASK_MONITOR_WORKBENCH_ENTRY.stateId);
    clearDesignParams(url);
    url.searchParams.set('taskMonitorView', view);
    window.history.pushState({}, '', url);
    setTaskMonitorView(view);
    applyRoute(TASK_MONITOR_WORKBENCH_ENTRY.stateId);
  }, [applyRoute]);
  const navigateEntrySystem = useCallback((view: EntrySystemView) => {
    const stateId = ENTRY_SYSTEM_STATE_BY_VIEW[view];
    const url = new URL(window.location.href);
    url.searchParams.set('state', stateId);
    clearDesignParams(url);
    url.searchParams.set('entrySystemView', view);
    window.history.pushState({}, '', url);
    setEntrySystemView(view);
    applyRoute(stateId);
  }, [applyRoute]);
  const navigateSessionResilience = useCallback((view: SessionResilienceView) => {
    const stateId = SESSION_RESILIENCE_STATE_BY_VIEW[view];
    const url = new URL(window.location.href);
    url.searchParams.set('state', stateId);
    clearDesignParams(url);
    url.searchParams.set('sessionRecoveryView', view);
    window.history.pushState({}, '', url);
    setSessionResilienceView(view);
    applyRoute(stateId);
  }, [applyRoute]);
  const navigateSettingsExtensionWorkbench = useCallback((view: SettingsExtensionWorkbenchView) => {
    const stateId = SETTINGS_EXTENSION_WORKBENCH_QDR_BY_VIEW[view];
    const url = new URL(window.location.href);
    url.searchParams.set('state', stateId);
    clearDesignParams(url);
    url.searchParams.set('pluginEntryView', view);
    window.history.pushState({}, '', url);
    setSettingsExtensionWorkbenchView(view);
    applyRoute(stateId);
  }, [applyRoute]);
  const navigateToolResult = useCallback((view: ToolResultView) => {
    const stateId = TOOL_RESULT_STATE_BY_VIEW[view];
    const url = new URL(window.location.href);
    url.searchParams.set('state', stateId);
    clearDesignParams(url);
    url.searchParams.set('toolResultView', view);
    window.history.pushState({}, '', url);
    setToolResultView(view);
    applyRoute(stateId);
  }, [applyRoute]);
  const navigateAutomationLifecycle = useCallback((view: AutomationLifecycleView) => {
    const url = new URL(window.location.href);
    url.searchParams.set('state', AUTOMATION_LIFECYCLE_STATE_ID);
    clearDesignParams(url);
    url.searchParams.set('automationLifecycleView', view);
    window.history.pushState({}, '', url);
    setAutomationLifecycleView(view);
    applyRoute(AUTOMATION_LIFECYCLE_STATE_ID);
  }, [applyRoute]);
  const navigateSessionInteraction = useCallback((view: SessionInteractionView) => {
    const stateId = SESSION_INTERACTION_STATE_BY_VIEW[view];
    const url = new URL(window.location.href);
    url.searchParams.set('state', stateId);
    clearDesignParams(url);
    url.searchParams.set('sessionInteractionView', view);
    window.history.pushState({}, '', url);
    setSessionInteractionView(view);
    applyRoute(stateId);
  }, [applyRoute]);
  const navigateRemainingScope = useCallback((view: RemainingScopeView) => {
    const stateId = REMAINING_SCOPE_STATE_BY_VIEW[view];
    const url = new URL(window.location.href);
    url.searchParams.set('state', stateId);
    clearDesignParams(url);
    url.searchParams.set('remainingScopeView', view);
    window.history.pushState({}, '', url);
    setRemainingScopeView(view);
    applyRoute(stateId);
  }, [applyRoute]);
  const exitMobile = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('state', 'QDR.P06.settings.mobile.partial');
    clearDesignParams(url);
    window.history.pushState({}, '', url);
    setMobileFlow(null);
    applyRoute('QDR.P06.settings.mobile.partial');
  }, [applyRoute]);
  const navigateAutomation = useCallback((next: string, view: AutomationView, fixture: string | null = null) => {
    const url = new URL(window.location.href);
    url.searchParams.set('state', next);
    clearDesignParams(url);
    url.searchParams.delete('clarificationView');
    url.searchParams.delete('taskReviewView');
    url.searchParams.delete('usageView');
    url.searchParams.delete('toolView');
    url.searchParams.delete('stopView');
    url.searchParams.delete('taskWorkspaceView');
    url.searchParams.delete('collaborationSection');
    url.searchParams.delete('collaborationView');
    url.searchParams.delete('configView');
    url.searchParams.set('automationView', view);
    if (fixture) url.searchParams.set('automationFixture', fixture);
    else url.searchParams.delete('automationFixture');
    window.history.pushState({}, '', url);
    applyRoute(next);
  }, [applyRoute]);
  const navigateClarification = useCallback((collapsed: boolean) => {
    const url = new URL(window.location.href);
    url.searchParams.set('state', 'QDR.S02.clarification.waiting');
    clearDesignParams(url);
    url.searchParams.delete('usageView');
    url.searchParams.delete('toolView');
    url.searchParams.delete('stopView');
    if (collapsed) url.searchParams.set('clarificationView', 'collapsed');
    else url.searchParams.delete('clarificationView');
    window.history.pushState({}, '', url);
    applyRoute('QDR.S02.clarification.waiting');
  }, [applyRoute]);
  const navigateTaskReview = useCallback((expanded: boolean) => {
    const url = new URL(window.location.href);
    url.searchParams.set('state', 'QDR.P16.review.summary');
    clearDesignParams(url);
    url.searchParams.delete('usageView');
    url.searchParams.delete('toolView');
    url.searchParams.delete('stopView');
    if (expanded) url.searchParams.set('taskReviewView', 'expanded');
    else url.searchParams.delete('taskReviewView');
    window.history.pushState({}, '', url);
    applyRoute('QDR.P16.review.summary');
  }, [applyRoute]);
  const navigateUsage = useCallback((refreshed: boolean) => {
    const url = new URL(window.location.href);
    url.searchParams.set('state', 'QDR.OBS01.usage.open');
    clearDesignParams(url);
    url.searchParams.delete('toolView');
    url.searchParams.delete('stopView');
    if (refreshed) url.searchParams.set('usageView', 'refreshed');
    else url.searchParams.delete('usageView');
    window.history.pushState({}, '', url);
    applyRoute('QDR.OBS01.usage.open');
  }, [applyRoute]);
  const navigateToolList = useCallback((collapsed: boolean) => {
    const url = new URL(window.location.href);
    url.searchParams.set('state', 'QDR.M02.edit.expanded');
    clearDesignParams(url);
    url.searchParams.delete('clarificationView');
    url.searchParams.delete('taskReviewView');
    url.searchParams.delete('usageView');
    url.searchParams.delete('stopView');
    if (collapsed) url.searchParams.set('toolView', 'collapsed');
    else url.searchParams.delete('toolView');
    window.history.pushState({}, '', url);
    applyRoute('QDR.M02.edit.expanded');
  }, [applyRoute]);
  const continueAfterStop = useCallback((text: string) => {
    setPrompt(text);
    const url = new URL(window.location.href);
    url.searchParams.set('state', 'QDR.S08.reply.continued');
    clearDesignParams(url);
    url.searchParams.delete('automationView');
    url.searchParams.delete('automationFixture');
    url.searchParams.delete('automationLifecycleView');
    url.searchParams.delete('sessionInteractionView');
    url.searchParams.delete('remainingScopeView');
    url.searchParams.delete('clarificationView');
    url.searchParams.delete('taskReviewView');
    url.searchParams.delete('usageView');
    url.searchParams.delete('toolView');
    url.searchParams.set('stopView', 'continued');
    window.history.pushState({}, '', url);
    applyRoute('QDR.S08.reply.continued');
  }, [applyRoute]);
  const go = useCallback((number: number) => {
    const next = states.find(item => item.observationIds.includes(`QB1-${String(number).padStart(2, '0')}`));
    if (!next) return;
    if (number === 1) { navigateAutomation(next.id, 'mine'); return; }
    if (number === 2) { navigateAutomation(next.id, 'mine', 'manual'); return; }
    navigate(next.id);
  }, [navigate, navigateAutomation]);
  const pending = useCallback((group: string) => {
    if (group === 'QDR.P06.settings.extensions.entry') { navigate('QDR.P04.installed.plugins.empty'); return; }
    if (group === 'P04') { navigate('QDR.P04.market.plugins.default'); return; }
    if (['profile', 'appearance', 'general', 'mode', 'task-monitor', 'shortcuts', 'voice', 'models'].some(section => group === `QDR.P06.settings.${section}.entry`)) { navigate(group.replace('.entry', '.default')); return; }
    const settingsKey = group.match(/^QDR\.P06\.settings\.([\w-]+)\.entry$/)?.[1] as SettingsLeafKey | undefined;
    if (settingsKey && SETTINGS_LEAF_KEYS.includes(settingsKey)) { navigateSettingsLeaf(settingsKey); return; }
    const next = states.find(item => item.id === group) ?? states.find(item => item.groupIds.includes(group) && !item.observationIds.some(observationId => implemented.has(observationId)));
    if (next) navigate(next.id);
    else setToast(`此入口尚未完成独立采集（${group}）。当前仅演示已有观察状态。`);
  }, [navigate, navigateSettingsLeaf]);
  const reset = () => {
    searchResetOrigin.current = searchOpen ? document.activeElement : null;
    setRevision(value => value + 1);
    setPrompt(''); setHomeDraft(''); setHomeSkill(''); setAutomationItems([]);
    setWorkspace({ name: 'paper-plane', color: '#789783' }); setClarificationAnswer('');
    const url = new URL(window.location.href);
    clearDesignParams(url);
    url.searchParams.delete('automationView');
    url.searchParams.delete('automationFixture');
    url.searchParams.delete('automationLifecycleView');
    url.searchParams.delete('sessionInteractionView');
    url.searchParams.delete('remainingScopeView');
    url.searchParams.delete('clarificationView');
    url.searchParams.delete('taskReviewView');
    url.searchParams.delete('usageView');
    url.searchParams.delete('toolView');
    url.searchParams.delete('stopView');
    const resetState = scene?.page === 'automation' ? 'QDR.P03.list.empty' : id === 'QDR.P01.anchor.preview' ? 'QDR.S08.reply.continued' : stopContinuation && id === 'QDR.S08.reply.continued' ? 'QDR.S08.reply.interrupted' : id;
    url.searchParams.set('state', resetState);
    window.history.replaceState({}, '', url);
    if (resetState === id) {
      setAutomationView('mine'); setAutomationFixture(null); setAutomationLifecycleView(getAutomationLifecycleView()); setSessionInteractionView(getSessionInteractionView()); setRemainingScopeView(getRemainingScopeView()); setClarificationCollapsed(false); setTaskReviewExpanded(false); setUsageRefreshed(false); setToolCollapsed(false); setStopContinuation(false); setApprovalPlanView(getApprovalPlanView());
      setWorkspaceMultipaneView(getWorkspaceMultipaneView()); setExecutionLifecycleView(getExecutionLifecycleView()); setSettingsLeafKey(getSettingsLeafKey()); setSettingsLeafView(getSettingsLeafView());
      setTaskSearchWorkspaceView(getTaskSearchWorkspaceView()); setCollaborationSection(getCollaborationSection()); setCollaborationView(getCollaborationView()); setAgentRuntimeView(getAgentRuntimeView());
      setComposerWorkbenchView(getComposerWorkbenchView()); setTaskMonitorView(getTaskMonitorView());
      setEntrySystemView(getEntrySystemView());
      setSessionResilienceView(getSessionResilienceView()); setSettingsExtensionWorkbenchView(getSettingsExtensionWorkbenchView());
      setToolResultView(getToolResultView());
    }
    else applyRoute(resetState);
    setToast('当前场景已重置，本地模拟记录已清空。');
  };
  const send = (text: string) => { setPrompt(text); go(7); };
  const closeSearch = () => navigate(currentSceneId.current);
  const closeModal = () => {
    const before = states.find(item => item.id === previous.current);
    const beforeObservation = Number(before?.observationIds.find(item => item.startsWith('QB1-'))?.split('-')[1] ?? 0);
    navigate([2, 3, 4, 5, 16].includes(beforeObservation) || !before ? homeId : before.id);
  };
  useEffect(() => {
    if (!restoreSearchFocus.current) return;
    restoreSearchFocus.current = false;
    const opener = searchOpener.current;
    const resetOrigin = searchResetOrigin.current;
    searchResetOrigin.current = null;
    if (!opener) return;
    // A search remount during review reset captures the review button, not the original opener.
    // Correct only that reset target or an empty focus; retain subsequent user choices.
    const needsRestore = () => !document.activeElement || document.activeElement === document.body || document.activeElement === resetOrigin;
    if (!needsRestore()) return;
    const frame = requestAnimationFrame(() => {
      if (!needsRestore()) return;
      const target = opener.element.isConnected ? opener.element : opener.id ? document.getElementById(opener.id) : opener.label ? document.querySelector<HTMLElement>(`[aria-label="${CSS.escape(opener.label)}"]`) : null;
      const topDialog = Array.from(document.querySelectorAll<HTMLElement>('.modal[role="dialog"]')).at(-1);
      if (target && (!topDialog || topDialog.contains(target))) target.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [id, revision]);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('state')) { url.searchParams.set('state', homeId); window.history.replaceState({}, '', url); }
    // A reload/direct search starts with the documented home backdrop, not stale live data.
    if (isSearchState(getStateId())) window.history.replaceState({ searchBackground: currentSceneId.current }, '', url);
    const pop = () => {
      const mobile = getMobileFlow();
      setMobileFlow(mobile);
      if (mobile) { applyRoute('QDR.P06.settings.mobile.partial'); return; }
      setApprovalPlanView(getApprovalPlanView());
      setWorkspaceMultipaneView(getWorkspaceMultipaneView());
      setExecutionLifecycleView(getExecutionLifecycleView());
      setSettingsLeafKey(getSettingsLeafKey());
      setSettingsLeafView(getSettingsLeafView());
      setTaskSearchWorkspaceView(getTaskSearchWorkspaceView());
      setCollaborationSection(getCollaborationSection());
      setCollaborationView(getCollaborationView());
      setAgentRuntimeView(getAgentRuntimeView());
      setComposerWorkbenchView(getComposerWorkbenchView());
      setTaskMonitorView(getTaskMonitorView());
      setEntrySystemView(getEntrySystemView());
      setSessionResilienceView(getSessionResilienceView());
      setSettingsExtensionWorkbenchView(getSettingsExtensionWorkbenchView());
      setToolResultView(getToolResultView());
      const next = getStateId();
      const recorded = window.history.state?.searchBackground;
      const background = typeof recorded === 'string' && states.some(item => item.id === recorded) ? recorded : homeId;
      applyRoute(next, isSearchState(next) ? background : undefined);
    };
    const key = (event: KeyboardEvent) => {
      if (event.isComposing) return;
      if (presentationMode === 'product') return;
      if ((event.metaKey || event.ctrlKey) && ['g', 'k'].includes(event.key.toLowerCase())) { event.preventDefault(); go(3); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'n') { event.preventDefault(); go(6); }
    };
    window.addEventListener('popstate', pop);
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('popstate', pop); window.removeEventListener('keydown', key); };
  }, [go, applyRoute, presentationMode]);
  useEffect(() => { localStorage.setItem('sanbao-prototype-directory', directoryOpen ? 'open' : 'closed'); }, [directoryOpen]);
  useEffect(() => { document.title = presentationMode === 'research' ? 'SanBao · Qoder UI 研究' : 'SanBao · 产品原型'; }, [presentationMode]);
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('.prototype');
    if (!root) return;
    root.classList.remove('product-mode', 'research-mode');
    root.classList.add(`${presentationMode}-mode`);
  }, [presentationMode]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 4500); return () => window.clearTimeout(timer); }, [toast]);
  const initialUserMenu: UserAppearancePanel | undefined = available && scene?.groupIds.includes('OBS04') ? scene.variant === 'user-menu' ? 'user' : scene.variant === 'appearance-menu' ? 'appearance' : scene.variant.replace('quick-appearance-', '') as UserAppearancePanel : undefined;
  const approvalPlanKind = id === 'QDR.S03.scope.unexpanded' ? 'permission' : id === 'QDR.S04.scope.unexpanded' ? 'plan' : null;
  const artifactWorkbenchEntry = ARTIFACT_WORKBENCH_ENTRIES.find(entry => entry.stateId === id);
  const executionLifecycleEntry = EXECUTION_LIFECYCLE_ENTRIES.find(entry => entry.stateId === id);
  const workspaceMultipaneEntry = id === WORKSPACE_MULTIPANE_ENTRY.stateId ? WORKSPACE_MULTIPANE_ENTRY : null;
  const taskSearchWorkspaceEntry = TASK_SEARCH_WORKSPACE_ENTRIES.find(entry => entry.stateId === id);
  const collaborationEntry = COLLABORATION_WORKBENCH_ENTRIES.find(entry => entry.stateId === id);
  const agentRuntimeEntry = AGENT_RUNTIME_WORKBENCH_ENTRIES.find(entry => entry.stateId === id);
  const composerWorkbenchEntry = COMPOSER_WORKBENCH_ENTRIES.find(entry => entry.stateId === id);
  const taskMonitorEntry = id === TASK_MONITOR_WORKBENCH_ENTRY.stateId ? TASK_MONITOR_WORKBENCH_ENTRY : null;
  const entrySystemEntry = ENTRY_SYSTEM_WORKBENCH_ENTRIES.find(entry => entry.stateId === id);
  const sessionResilienceEntry = SESSION_RESILIENCE_ENTRIES.find(entry => entry.stateId === id);
  const settingsExtensionWorkbenchEntry = SETTINGS_EXTENSION_WORKBENCH_ENTRIES.find(entry => entry.sourceId === id);
  const toolResultEntry = TOOL_RESULT_ENTRIES.find(entry => entry.stateId === id);
  const automationLifecycleEntry = id === AUTOMATION_LIFECYCLE_STATE_ID && !!automationLifecycleView ? AUTOMATION_LIFECYCLE_ENTRIES.find(entry => entry.view === automationLifecycleView) : null;
  const sessionInteractionEntry = !!sessionInteractionView ? SESSION_INTERACTION_ENTRIES.find(entry => entry.view === sessionInteractionView && entry.stateId === id) : null;
  const remainingScopeEntry = !!remainingScopeView ? REMAINING_SCOPE_ENTRIES.find(entry => entry.view === remainingScopeView && entry.stateId === id) : null;
  const entrySettingsKey = scene?.sourceKind === 'entry-observed' && scene.variant.startsWith('settings-') ? scene.variant.slice('settings-'.length) : null;
  const entrySettingsLeafKey = SETTINGS_LEAF_KEYS.includes(entrySettingsKey as SettingsLeafKey) ? entrySettingsKey as SettingsLeafKey : null;
  const entryKnowledge = scene?.id === 'QDR.OBS02.knowledge.entry';
  const entrySites = scene?.id === 'QDR.OBS03.sites.entry';
  const entryP14Workbench = scene?.id === 'QDR.P14.terminal.entry' || scene?.id === 'QDR.P14.sidepanel.entry';
  const automationScopeEntry = id === 'QDR.P03.scope.unexpanded';
  const entryBasicSettings = entrySettingsKey === 'general' || entrySettingsKey === 'mode' || entrySettingsKey === 'task-monitor';
  const localFixtureAvailable = available || !!approvalPlanKind || !!artifactWorkbenchEntry || !!executionLifecycleEntry || !!workspaceMultipaneEntry || !!settingsLeafKey || !!entrySettingsKey || entryKnowledge || entrySites || entryP14Workbench || automationScopeEntry || !!taskSearchWorkspaceEntry || !!collaborationEntry || !!agentRuntimeEntry || !!composerWorkbenchEntry || !!taskMonitorEntry || !!entrySystemEntry || !!sessionResilienceEntry || !!settingsExtensionWorkbenchEntry || !!toolResultEntry || !!automationLifecycleEntry || !!sessionInteractionEntry || !!remainingScopeEntry;
  const page = approvalPlanKind || artifactWorkbenchEntry || entryP14Workbench || executionLifecycleEntry || workspaceMultipaneEntry || taskSearchWorkspaceEntry || collaborationEntry || agentRuntimeEntry || composerWorkbenchEntry || taskMonitorEntry || entrySystemEntry || sessionResilienceEntry || toolResultEntry || automationLifecycleEntry || sessionInteractionEntry || remainingScopeEntry ? 'session' : settingsExtensionWorkbenchEntry ? 'extensions' : settingsLeafKey || entrySettingsKey ? 'settings' : automationScopeEntry || initialUserMenu ? 'automation' : initialContextMenu ? 'home' : scene?.page ?? 'home';
  const navigateSetting = (variant: string) => {
    const target = states.find(item => item.page === 'settings' && item.variant === variant);
    if (target) navigate(target.id);
  };
  const sceneKey = `${entryKnowledge ? 'knowledge-entry' : entrySites ? 'sites-entry' : scene?.page === 'knowledge' ? 'knowledge' : isInstalledExtensionsState(sceneId) ? 'installed-extensions' : isMarketListState(sceneId) ? 'extension-market' : entrySettingsKey ?? settingsFamily(sceneId) ?? sceneId}-${revision}`;
  const settingsVisible = scene?.page === 'settings' || isMobileSettingsState(sceneId) || !!settingsLeafKey || !!entrySettingsKey;
  const automationTemplate = getAutomationTemplate(automationFixture);
  const openManualAutomation = () => navigateAutomation('QDR.P03.create.empty', 'mine', 'manual');
  const openTemplateAutomation = (template: AutomationTemplate) => navigateAutomation('QDR.P03.create.empty', 'templates', `template:${template.id}`);
  const closeAutomation = () => navigateAutomation('QDR.P03.list.empty', automationTemplate ? 'templates' : 'mine');
  if (mobileFlow) return <MobileCollaborationPrototype initialFlow={mobileFlow} onNavigate={navigateMobile} onExit={exitMobile} />;
  return <div className="prototype"><ReviewBar state={state} implemented={implemented} drawerOpen={directoryOpen} toggleDrawer={() => setDirectoryOpen(!directoryOpen)} reset={reset} navigate={navigate} /><div className="prototype-body">{directoryOpen && <StateDirectory selected={id} navigate={navigate} implemented={implemented} close={() => setDirectoryOpen(false)} />}<div className="product-window" data-reference-theme={referenceTheme}>{settingsVisible ? <SettingsSidebar key={sceneKey} activeSection={settingsLeafKey ?? entrySettingsLeafKey ?? (entrySettingsKey === 'extensions' || isInstalledExtensionsState(sceneId) ? 'extensions' : entrySettingsKey === 'profile' || scene?.variant === 'profile' ? 'profile' : entryBasicSettings ? entrySettingsKey as 'general' | 'mode' | 'task-monitor' : settingsFamily(sceneId) ?? (scene?.variant === 'general' || scene?.variant === 'mode' || scene?.variant === 'task-monitor' ? scene.variant : 'appearance'))} onBack={() => go(6)} onPending={pending} /> : <ProductSidebar initialUserMenu={initialUserMenu} menuRevision={sceneKey} notify={setToast} workspace={workspace} page={page} go={go} pending={pending} onSearch={() => go(3)} onWorkspace={() => go(4)} collapsed={sidebarCollapsed} toggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)} />}<main className="product-surface" data-source-kind={scene?.sourceKind}>{localFixtureAvailable ? <React.Fragment key={sceneKey}>{entryP14Workbench ? <SessionWorkspaceEntryWorkbench initialView={scene?.id === 'QDR.P14.terminal.entry' ? 'terminal' : 'sidepanel'} onExit={() => navigate(homeId)} /> : entrySettingsLeafKey ? <SettingsLeafWorkbench settingKey={entrySettingsLeafKey} view={settingsLeafView} onNavigateView={view => navigateSettingsLeaf(entrySettingsLeafKey, view)} onExit={() => navigate('QDR.P06.settings.appearance.default')} onReset={() => setToast('')} /> : entrySettingsKey === 'profile' ? <SettingsProfilePage onNotice={setToast} /> : entrySettingsKey === 'shortcuts' ? <SettingsShortcutsPage variant="shortcuts" onNavigate={navigateSetting} onNotice={setToast} /> : entrySettingsKey === 'voice' ? <SettingsVoicePage variant="voice" onNavigate={navigateSetting} onNotice={setToast} /> : entrySettingsKey === 'models' ? <SettingsModelsPage variant="models" onNavigate={navigateSetting} onNotice={setToast} /> : entryBasicSettings ? <SettingsBasicPage section={entrySettingsKey as 'general' | 'mode' | 'task-monitor'} onNotice={setToast} /> : entrySettingsKey === 'extensions' ? <InstalledExtensionsPage initialVariant="extensions-plugins" onNavigate={navigate} onNotice={setToast} /> : entrySettingsKey === 'appearance' ? <SettingsAppearancePage onBack={() => go(6)} onPending={pending} /> : entryKnowledge ? <KnowledgePage initialVariant="empty" workspaceName={workspace.name} onNavigate={navigate} onNotice={setToast} /> : entrySites ? <SitesPage initialVariant="empty" onNavigate={navigate} onNotice={setToast} /> : approvalPlanKind ? <ApprovalPlanWorkbench kind={approvalPlanKind} initialView={approvalPlanView ?? (approvalPlanKind === 'permission' ? 'request' : 'preview')} onViewChange={navigateApprovalPlan} onNotice={setToast} /> : artifactWorkbenchEntry ? <ArtifactWorkspaceWorkbench initialView={artifactWorkbenchEntry.view} onNavigate={navigateArtifactWorkbench} onNotice={setToast} /> : workspaceMultipaneEntry ? <WorkspaceMultipaneWorkbench view={workspaceMultipaneView ?? 'overview'} onNavigateView={navigateWorkspaceMultipane} onExit={() => navigate(homeId)} onReset={() => setToast('多窗格本地状态已重置。')} /> : executionLifecycleEntry ? <ExecutionLifecycleWorkbench source={executionLifecycleEntry.source} view={(executionLifecycleView ?? executionLifecycleEntry.defaultView) as never} onNavigateView={view => navigateExecutionLifecycle(executionLifecycleEntry.source, view)} onNavigateSource={source => { const next = EXECUTION_LIFECYCLE_ENTRIES.find(item => item.source === source); if (next) navigateExecutionLifecycle(source, next.defaultView); }} onExit={() => navigate(homeId)} onReset={() => setToast('执行生命周期本地状态已重置。')} /> : settingsLeafKey ? <SettingsLeafWorkbench settingKey={settingsLeafKey} view={settingsLeafView} onNavigateView={view => navigateSettingsLeaf(settingsLeafKey, view)} onExit={() => navigate('QDR.P06.settings.appearance.default')} onReset={() => setToast('设置叶页本地状态已重置。')} /> : taskSearchWorkspaceEntry ? <TaskSearchWorkspaceWorkbench initialView={taskSearchWorkspaceView ?? taskSearchWorkspaceEntry.view} onNavigate={navigateTaskSearchWorkspace} onExit={() => navigate(homeId)} onReset={() => setToast('任务、搜索与工作区本地状态已重置。')} /> : collaborationEntry ? <CollaborationCollectionWorkbench section={collaborationSection ?? collaborationEntry.section} view={collaborationView ?? collaborationEntry.defaultView} onNavigateSection={section => { const entry = COLLABORATION_WORKBENCH_ENTRIES.find(item => item.section === section); if (entry) navigateCollaboration(section, entry.defaultView); }} onNavigateView={view => navigateCollaboration(collaborationSection ?? collaborationEntry.section, view)} onExit={() => navigate(homeId)} onReset={() => setToast('项目协作本地状态已重置。')} /> : agentRuntimeEntry ? <AgentRuntimeWorkbench view={agentRuntimeView ?? agentRuntimeEntry.defaultView} onNavigateView={navigateAgentRuntime} onExit={() => navigate(homeId)} onReset={() => setToast('Agent、Squad 与 Runtime 本地状态已重置。')} /> : composerWorkbenchEntry ? <ComposerDesignWorkbench view={composerWorkbenchView ?? composerWorkbenchEntry.view} onNavigateView={navigateComposerWorkbench} onExit={() => navigate(homeId)} onReset={() => setToast('输入区本地状态已重置。')} /> : taskMonitorEntry ? <TaskMonitorWorkbench view={taskMonitorView ?? 'fixed'} onNavigateView={navigateTaskMonitor} onExit={() => navigate(homeId)} onReset={() => setToast('任务监控本地状态已重置。')} /> : entrySystemEntry ? <EntrySystemWorkbench view={entrySystemView ?? entrySystemEntry.defaultView} onNavigateView={navigateEntrySystem} onExit={() => navigate(homeId)} onReset={() => setToast('入口与系统提示本地状态已重置。')} /> : sessionResilienceEntry ? <SessionResilienceWorkbench view={sessionResilienceView ?? sessionResilienceEntry.view} onNavigateView={navigateSessionResilience} onExit={() => navigate(homeId)} onReset={() => setToast('失败与局部恢复本地状态已重置。')} /> : settingsExtensionWorkbenchEntry ? <SettingsExtensionWorkbench view={settingsExtensionWorkbenchView ?? settingsExtensionWorkbenchEntry.view} onNavigateView={navigateSettingsExtensionWorkbench} onExit={() => navigate(homeId)} onReset={() => setToast('设置与扩展本地状态已重置。')} /> : toolResultEntry ? <ToolResultWorkbench view={toolResultView ?? toolResultEntry.view} onNavigateView={navigateToolResult} onExit={() => navigate(homeId)} onReset={() => setToast('工具结果本地状态已重置。')} /> : automationLifecycleEntry ? <AutomationLifecycleWorkbench view={automationLifecycleView ?? automationLifecycleEntry.view} onNavigateView={navigateAutomationLifecycle} onExit={() => navigate('QDR.P03.list.empty')} onReset={() => setToast('自动化生命周期本地状态已重置。')} /> : sessionInteractionEntry ? <SessionInteractionWorkbench view={sessionInteractionView ?? sessionInteractionEntry.view} onNavigateView={navigateSessionInteraction} onExit={() => navigate(homeId)} onReset={() => setToast('会话交互本地状态已重置。')} /> : remainingScopeEntry ? <RemainingScopeWorkbench view={remainingScopeView ?? remainingScopeEntry.view} onNavigateView={navigateRemainingScope} onExit={() => navigate(homeId)} onReset={() => setToast('组级入口本地状态已重置。')} /> : scene?.page === 'knowledge' ? <KnowledgePage initialCreate={scene.variant === 'create'} initialVariant={scene.variant} workspaceName={workspace.name} onNavigate={navigate} onNotice={setToast} /> : scene?.page === 'sites' ? <SitesPage initialVariant={scene.variant} onNavigate={navigate} onNotice={setToast} /> : scene?.page === 'extensions' ? pluginDetailVariants.includes(scene.variant) ? <PluginMarketDetailPage initialVariant={scene.variant} onNavigate={navigate} onNotice={setToast} /> : scene.variant === 'plugins-ppt-detail' ? <ExtensionDetailPage onNavigate={navigate} onNotice={setToast} /> : scene.variant === 'skills-deep-research-detail' || scene.variant === 'connectors-github-detail' ? <MarketDetailPage kind={scene.variant === 'skills-deep-research-detail' ? 'skill' : 'connector'} onNavigate={navigate} onNotice={setToast} /> : <ExtensionMarketPage initialVariant={scene.variant} onNavigate={navigate} onNotice={setToast} /> : isMobileSettingsState(sceneId) ? <SettingsMobilePage onNotice={setToast} /> : scene?.page === 'settings' ? isInstalledExtensionsState(sceneId) ? <InstalledExtensionsPage initialVariant={scene.variant} onNavigate={navigate} onNotice={setToast} /> : scene.variant === 'profile' ? <SettingsProfilePage onNotice={setToast} /> : settingsFamily(sceneId) === 'shortcuts' ? <SettingsShortcutsPage variant={scene.variant} onNavigate={navigateSetting} onNotice={setToast} /> : settingsFamily(sceneId) === 'voice' ? <SettingsVoicePage variant={scene.variant} onNavigate={navigateSetting} onNotice={setToast} /> : settingsFamily(sceneId) === 'models' ? <SettingsModelsPage variant={scene.variant} onNavigate={navigateSetting} onNotice={setToast} /> : scene.variant === 'general' || scene.variant === 'mode' || scene.variant === 'task-monitor' ? <SettingsBasicPage section={scene.variant} onNotice={setToast} /> : <SettingsAppearancePage initialPanel={scene.variant === 'default' ? undefined : scene.variant} onBack={() => go(6)} onPending={pending} /> : scene?.page === 'session' ? <SessionPage onSend={(text, continued) => { if (continued) { continueAfterStop(text); return; } setPrompt(text); go(7); }} workspaceName={workspace.name} answerText={clarificationAnswer} onAnswer={answer => { setClarificationAnswer(answer); go(11); }} observation={observation} go={go} pending={pending} prompt={prompt} notify={setToast} initialQuestionCollapsed={sceneId === 'QDR.S02.clarification.waiting' && clarificationCollapsed} onQuestionCollapsedChange={sceneId === 'QDR.S02.clarification.waiting' ? navigateClarification : undefined} initialReviewExpanded={sceneId === 'QDR.P16.review.summary' && taskReviewExpanded} onReviewExpandedChange={sceneId === 'QDR.P16.review.summary' ? navigateTaskReview : undefined} initialToolCollapsed={sceneId === 'QDR.M02.edit.expanded' && toolCollapsed} onToolCollapsedChange={sceneId === 'QDR.M02.edit.expanded' ? navigateToolList : undefined} /> : scene?.page === 'automation' || initialUserMenu || automationScopeEntry ? <AutomationPage go={go} pending={pending} items={automationItems} view={automationView} fixture={automationFixture} onViewChange={view => navigateAutomation('QDR.P03.list.empty', view, view !== 'templates' && automationItems.length ? 'created' : null)} onStartCreate={openManualAutomation} onUseTemplate={openTemplateAutomation} onNotice={setToast} /> : <HomePage workspaceName={workspace.name} go={go} pending={pending} onSend={send} initialContextMenu={initialContextMenu} draft={homeDraft} onDraftChange={setHomeDraft} skill={homeSkill} onSkillChange={setHomeSkill} />}{[4, 5].includes(observation) && <WorkspaceDialog ready={observation === 5} close={closeModal} markReady={() => navigate('QDR.P13.create.ready')} created={value => { setWorkspace(value); setToast('示例工作区已创建；没有访问本机文件夹。'); go(6); }} />}{observation === 2 && <AutomationDialog template={automationTemplate} close={closeAutomation} create={config => { setAutomationItems(items => [config, ...items]); setToast('自动化已在本地原型中创建；未安排真实执行。'); navigateAutomation('QDR.P03.list.empty', 'mine', 'created'); }} />}{observation === 16 && <UsageDialog close={closeModal} pending={pending} initialRefreshed={sceneId === 'QDR.OBS01.usage.open' && usageRefreshed} onRefreshedChange={sceneId === 'QDR.OBS01.usage.open' ? navigateUsage : undefined} />}</React.Fragment> : <ResearchDetail key={sceneKey} state={scene} onHome={() => go(6)} />}{searchOpen && <SearchDialog key={`search-${revision}`} close={closeSearch} go={go} />}</main></div></div>{toast && <div className="prototype-toast" role="status"><span>{toast}</span><button aria-label="关闭提示" onClick={() => setToast('')}>×</button></div>}</div>;
}
