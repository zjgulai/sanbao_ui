import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Controls';

export type ArtifactWorkbenchView = 'window' | 'sidepanel' | 'image' | 'diagram' | 'table-document' | 'text-image' | 'version-failed' | 'voice';

export const ARTIFACT_WORKBENCH_ENTRIES: readonly { stateId: string; view: ArtifactWorkbenchView; id: string; label: string; source: string }[] = [
  { stateId: 'QDR.P12.scope.unexpanded', view: 'window', id: 'SANBAO.P12.F01', label: '独立预览窗口', source: 'P12 静态候选' },
  { stateId: 'QDR.P14.scope.unexpanded', view: 'sidepanel', id: 'SANBAO.P14.F01', label: '工作台侧面板', source: 'P14 静态候选' },
  { stateId: 'QDR.O10.scope.unexpanded', view: 'image', id: 'SANBAO.O10.F01', label: '图片预览与批注', source: 'O10 静态候选' },
  { stateId: 'QDR.O11.scope.unexpanded', view: 'diagram', id: 'SANBAO.O11.F01', label: 'Mermaid 与链接', source: 'O11 静态候选' },
  { stateId: 'QDR.A03.scope.unexpanded', view: 'table-document', id: 'SANBAO.A03.F01', label: '表格与文档', source: 'A03 静态候选' },
  { stateId: 'QDR.A04.scope.unexpanded', view: 'text-image', id: 'SANBAO.A04.F01', label: '文本与图片产物', source: 'A04 静态候选' },
  { stateId: 'QDR.A05.scope.unexpanded', view: 'version-failed', id: 'SANBAO.A05.F01', label: '版本与预览失败', source: 'A05 静态候选' },
  { stateId: 'QDR.A06.scope.unexpanded', view: 'voice', id: 'SANBAO.A06.F01', label: '语音便签摘要', source: 'A06 静态候选' },
];

type Props = { initialView: ArtifactWorkbenchView; onNavigate: (view: ArtifactWorkbenchView) => void; onNotice: (notice: string) => void };
const entryFor = (view: ArtifactWorkbenchView) => ARTIFACT_WORKBENCH_ENTRIES.find(entry => entry.view === view)!;

export function ArtifactWorkspaceWorkbench({ initialView, onNavigate, onNotice }: Props) {
  const [view, setView] = useState(initialView);
  const [windowOpen, setWindowOpen] = useState(false);
  const [sidePanel, setSidePanel] = useState<'浏览器' | '变更' | '终端'>('浏览器');
  const [previewKind, setPreviewKind] = useState<'表格' | '文档' | '文本' | '图片'>('表格');
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [linkStatus, setLinkStatus] = useState<'idle' | 'unavailable'>('idle');
  const [version, setVersion] = useState('v2 · 最新草稿');
  const [previewStatus, setPreviewStatus] = useState<'failed' | 'ready'>('failed');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setView(initialView); setWindowOpen(false); setSidePanel('浏览器'); setPreviewKind(initialView === 'text-image' ? '文本' : '表格'); setZoom(100); setFullscreen(false); setLinkStatus('idle'); setVersion('v2 · 最新草稿'); setPreviewStatus('failed'); setPlaying(false);
  }, [initialView]);

  const switchTo = (next: ArtifactWorkbenchView) => { setView(next); onNavigate(next); };
  const entry = entryFor(view);

  return <section className="design-workbench artifact-workbench" data-state-source="static-only" aria-label="Sanbao 产物与预览设计工作面">
    <header className="artifact-workbench-header"><div><span>SANBAO DESIGN WORKBENCH</span><h1>产物与预览工作面</h1><p>已观察的 HTML 卡、Diff 与内嵌预览继续保留在原会话 fixture。本页只补静态候选的设计路径，所有内容均为本地示例。</p></div><div className="artifact-source"><strong>{entry.id}</strong><small>{entry.source} · 待原生校准</small></div></header>
    <nav className="artifact-nav" aria-label="产物设计状态">{ARTIFACT_WORKBENCH_ENTRIES.map(item => <button key={item.view} type="button" className={item.view === view ? 'active' : ''} aria-current={item.view === view ? 'page' : undefined} onClick={() => switchTo(item.view)}><span>{item.id.replace('SANBAO.', '')}</span>{item.label}</button>)}</nav>
    <main className={`artifact-stage ${fullscreen ? 'fullscreen' : ''}`}>{view === 'window' ? <WindowFixture open={windowOpen} setOpen={setWindowOpen} onNotice={onNotice} /> : view === 'sidepanel' ? <SidePanelFixture panel={sidePanel} setPanel={setSidePanel} /> : view === 'image' ? <ImageFixture zoom={zoom} setZoom={setZoom} /> : view === 'diagram' ? <DiagramFixture fullscreen={fullscreen} setFullscreen={setFullscreen} linkStatus={linkStatus} setLinkStatus={setLinkStatus} onNotice={onNotice} /> : view === 'table-document' ? <TableDocumentFixture kind={previewKind === '文档' ? '文档' : '表格'} setKind={setPreviewKind} /> : view === 'text-image' ? <TextImageFixture kind={previewKind === '图片' ? '图片' : '文本'} setKind={setPreviewKind} /> : view === 'version-failed' ? <VersionFailureFixture version={version} setVersion={setVersion} status={previewStatus} setStatus={setPreviewStatus} /> : <VoiceFixture playing={playing} setPlaying={setPlaying} />}</main>
    <footer className="artifact-boundary" role="note"><Icon name="bolt" size={15} />本地 fixture 不会打开独立系统窗口、运行终端、播放真实录音、加载外链、创建文件、修改版本或访问用户内容。</footer>
  </section>;
}

function Frame({ eyebrow, title, children, actions }: { eyebrow: string; title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return <article className="artifact-frame"><header><div><span>{eyebrow}</span><h2>{title}</h2></div>{actions}</header>{children}</article>;
}

function WindowFixture({ open, setOpen, onNotice }: { open: boolean; setOpen: (open: boolean) => void; onNotice: (notice: string) => void }) {
  return <Frame eyebrow="SANBAO.P12.F01 · 独立运行窗口替身" title="将产物从会话工作面中打开" actions={<span className={open ? 'artifact-status ready' : 'artifact-status'}>{open ? '本地窗口已打开' : '尚未打开'}</span>}><p className="artifact-intro">它与已观察的 `QDR.P14.preview.html` 内嵌 HTML 预览分开建模。本页只模拟窗口的打开、关闭和重开，不创建真实 OS 窗口。</p>{open && <section className="artifact-window-sim" aria-label="本地独立预览窗口"><header><span className="window-dots"><i /><i /><i /></span><strong>发布说明.html · 本地预览</strong><button type="button" aria-label="关闭本地预览窗口" onClick={() => setOpen(false)}><Icon name="close" size={14} /></button></header><div><p>发布前页面核对</p><h3>验收入口已加入说明草稿</h3><span>独立窗口中的内容仅为本地占位，没有运行 HTML、脚本或网络请求。</span></div></section>}<footer><button type="button" className="secondary-button" onClick={() => onNotice('内嵌 HTML 预览已有观察；独立运行窗口的原生入口与窗口策略仍待采集。')}>查看差异说明</button><button type="button" className="primary-button" onClick={() => setOpen(!open)}>{open ? '关闭本地窗口' : '打开本地窗口'}</button></footer></Frame>;
}

function SidePanelFixture({ panel, setPanel }: { panel: '浏览器' | '变更' | '终端'; setPanel: (panel: '浏览器' | '变更' | '终端') => void }) {
  return <Frame eyebrow="SANBAO.P14.F01 · 工作台侧面板" title="同一任务内切换工具工作面"><p className="artifact-intro">终端和侧面板入口只具备历史入口证据。本地状态机保留切换、关闭和恢复意图，不运行命令或读取工作区。</p><div className="artifact-split"><section className="artifact-task-summary"><span>任务</span><h3>发布前页面核对</h3><p>任务主区保留会话摘要和产物入口。</p><button type="button">定位到本地摘要</button></section><section className="artifact-sidepanel"><nav>{(['浏览器', '变更', '终端'] as const).map(item => <button type="button" key={item} className={panel === item ? 'active' : ''} onClick={() => setPanel(item)}>{item}</button>)}</nav><div>{panel === '浏览器' ? <><span className="artifact-panel-label">内嵌预览替身</span><strong>发布说明.html</strong><p>浏览器区域只展示本地结构，不渲染外部页面。</p></> : panel === '变更' ? <><span className="artifact-panel-label">变更摘要替身</span><strong>1 个本地草稿</strong><p>完整 Diff、评论和 Git 路由仍由已观察页面与后续 DSH 接缝分别验证。</p></> : <><span className="artifact-panel-label">终端占位</span><strong>尚未连接运行时</strong><p>没有启动 shell、读取命令历史或访问本机文件。</p></>}</div></section></div></Frame>;
}

function ImageFixture({ zoom, setZoom }: { zoom: number; setZoom: (zoom: number) => void }) {
  return <Frame eyebrow="SANBAO.O10.F01 · 图片预览" title="缩放与批注设计状态"><div className="artifact-image-layout"><div className="artifact-image-canvas" style={{ '--artifact-zoom': `${zoom / 100}` } as React.CSSProperties}><div className="artifact-image-placeholder"><span>发布页主视觉</span><i /><i /><i /></div></div><aside><label>缩放 <strong>{zoom}%</strong><input aria-label="图片缩放" type="range" min="60" max="160" value={zoom} onChange={event => setZoom(Number(event.target.value))} /></label><div className="artifact-note"><Icon name="chat" size={15} /><div><strong>批注入口</strong><p>仅演示批注区域，未保存坐标、文字或图片数据。</p></div></div></aside></div></Frame>;
}

function DiagramFixture({ fullscreen, setFullscreen, linkStatus, setLinkStatus, onNotice }: { fullscreen: boolean; setFullscreen: (fullscreen: boolean) => void; linkStatus: 'idle' | 'unavailable'; setLinkStatus: (status: 'idle' | 'unavailable') => void; onNotice: (notice: string) => void }) {
  return <Frame eyebrow="SANBAO.O11.F01 · Mermaid 与链接预览" title={fullscreen ? '图表全屏本地演示' : '图表与链接预览'} actions={<button type="button" className="secondary-button" onClick={() => setFullscreen(!fullscreen)}>{fullscreen ? '退出全屏演示' : '全屏演示'}</button>}><div className="artifact-diagram"><div className="artifact-node start">发布说明</div><i /><div className="artifact-node">页面核对</div><i /><div className="artifact-node end">验收摘要</div></div><div className={`artifact-link-preview ${linkStatus === 'unavailable' ? 'unavailable' : ''}`}><Icon name={linkStatus === 'unavailable' ? 'close' : 'globe'} size={16} /><div><strong>{linkStatus === 'unavailable' ? '链接预览暂不可用' : '链接预览入口'}</strong><p>{linkStatus === 'unavailable' ? '本地失败态不重试外部链接。' : '只展示结构，不请求网络内容。'}</p></div></div><footer><button type="button" className="secondary-button" onClick={() => { setLinkStatus(linkStatus === 'unavailable' ? 'idle' : 'unavailable'); onNotice('链接预览仅切换本地可用/不可用状态；没有加载外部页面。'); }}>{linkStatus === 'unavailable' ? '恢复本地占位' : '模拟预览不可用'}</button></footer></Frame>;
}

function TableDocumentFixture({ kind, setKind }: { kind: '表格' | '文档'; setKind: (kind: '表格' | '文档') => void }) {
  return <Frame eyebrow="SANBAO.A03.F01 · 结构化产物" title="表格、文档与不可用预览"><div className="artifact-subtabs"><button type="button" className={kind === '表格' ? 'active' : ''} onClick={() => setKind('表格')}>表格预览</button><button type="button" className={kind === '文档' ? 'active' : ''} onClick={() => setKind('文档')}>文档缩略图</button></div>{kind === '表格' ? <table className="artifact-table"><thead><tr><th>检查项</th><th>负责人</th><th>状态</th></tr></thead><tbody><tr><td>页面入口</td><td>设计</td><td>待验收</td></tr><tr><td>说明文案</td><td>内容</td><td>草稿</td></tr><tr><td>交互回归</td><td>工程</td><td>进行中</td></tr></tbody></table> : <div className="artifact-document"><span>DOC</span><div><strong>发布前核对清单</strong><p>这是本地缩略图替身，不读取、导入或导出文档。</p><i /><i /><i /></div></div>}<p className="artifact-inline-note">不可用预览作为 `A05` 的独立失败状态处理，避免把所有文件类型混成同一个通用卡片。</p></Frame>;
}

function TextImageFixture({ kind, setKind }: { kind: '文本' | '图片'; setKind: (kind: '文本' | '图片') => void }) {
  return <Frame eyebrow="SANBAO.A04.F01 · 可预览产物" title="文本、源码与图片产物"><div className="artifact-subtabs"><button type="button" className={kind === '文本' ? 'active' : ''} onClick={() => setKind('文本')}>文本 / 源码</button><button type="button" className={kind === '图片' ? 'active' : ''} onClick={() => setKind('图片')}>图片摘要</button></div>{kind === '文本' ? <pre className="artifact-code"><code>{'<section>\n  <h1>发布前页面核对</h1>\n  <p>验收入口已加入草稿。</p>\n</section>'}</code></pre> : <div className="artifact-image-summary"><span>PNG</span><div><strong>页面检查图</strong><p>只展示本地生成的视觉占位，不读取用户图片。</p></div><button type="button">查看本地摘要</button></div>}<p className="artifact-inline-note">已观察的 `QDR.A02.output.html` 与 `QDR.P14.preview.html` 仍使用原会话卡和内嵌预览，不被本设计状态替代。</p></Frame>;
}

function VersionFailureFixture({ version, setVersion, status, setStatus }: { version: string; setVersion: (version: string) => void; status: 'failed' | 'ready'; setStatus: (status: 'failed' | 'ready') => void }) {
  return <Frame eyebrow="SANBAO.A05.F01 · 版本与失败" title="同一产物的版本与加载恢复"><div className="artifact-version-row"><label>版本<select aria-label="本地产物版本" value={version} onChange={event => { setVersion(event.target.value); setStatus('failed'); }}><option>v2 · 最新草稿</option><option>v1 · 初始草稿</option></select></label><span className={`artifact-status ${status === 'ready' ? 'ready' : 'failed'}`}>{status === 'ready' ? '本地占位已恢复' : '预览不可用'}</span></div>{status === 'ready' ? <div className="artifact-recovery"><Icon name="check" size={17} /><div><strong>已恢复本地预览替身</strong><p>没有重新加载远端内容或生成真实版本。</p></div></div> : <div className="artifact-failure"><Icon name="close" size={18} /><div><strong>暂时无法加载该预览</strong><p>原生错误文案、重试策略与运行槽仍待单独取证。</p></div></div>}<footer><button type="button" className="secondary-button" onClick={() => setStatus('failed')}>重置失败态</button><button type="button" className="primary-button" onClick={() => setStatus('ready')}>重试本地占位</button></footer></Frame>;
}

function VoiceFixture({ playing, setPlaying }: { playing: boolean; setPlaying: (playing: boolean) => void }) {
  return <Frame eyebrow="SANBAO.A06.F01 · 语音讨论摘要" title="语音便签与可恢复摘要"><div className="artifact-voice"><button type="button" className={playing ? 'playing' : ''} aria-pressed={playing} aria-label={playing ? '暂停本地语音演示' : '播放本地语音演示'} onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ' : '▶'}</button><div><span>00:00 / 01:12 · 本地演示</span><strong>发布前核对的讨论摘要</strong><p>确认验收入口的位置，并将复杂 Diff 留在桌面端审阅。</p><div className="artifact-wave" aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <i key={index} style={{ height: `${8 + (index * 7) % 22}px` }} />)}</div></div></div><p className="artifact-inline-note">没有录音、麦克风、音频文件、个人记录或真实播放行为；语音原生页面仍需在获批条件下自然出现。</p></Frame>;
}
