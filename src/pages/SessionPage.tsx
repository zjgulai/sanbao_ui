import React, { useEffect, useState } from 'react';
import { Composer, Icon, IconButton } from '../components/Controls';

type Props = { onSend: (text: string, continued: boolean) => void; workspaceName: string; answerText: string; onAnswer: (text: string) => void; observation: number; go: (observation: number) => void; pending: (group: string) => void; prompt: string; notify: (text: string) => void; initialQuestionCollapsed?: boolean; onQuestionCollapsedChange?: (collapsed: boolean) => void; initialReviewExpanded?: boolean; onReviewExpandedChange?: (expanded: boolean) => void; initialToolCollapsed?: boolean; onToolCollapsedChange?: (collapsed: boolean) => void };
const PLAN = ['确定页面骨架：标题、待办清单和一个添加按钮，让主要操作一眼可见。', '完成单文件原型：将样式与交互放在 demo.html 中，使用虚构的三项待办。', '核对交互：点击完成、添加新事项，并检查小窗口中的排版。'];
const STREAM = ['我会先从界面和交互路径开始，把任务拆成可以逐项核对的部分。', '第一步，整理已经观察到的首页、工作区、搜索和任务状态，区分实际证据与设计假设。', '第二步，用一个纸飞机清单作为小型示例，串起澄清、生成、预览和修改流程。', '第三步，保留尚未观察到的页面，不把推断当成已经完成的研究。'];
const DEFAULT_PROMPT = '请帮我规划一个简单的纸飞机待办清单：整理桌面、浇花、阅读十页。先说明步骤，再创建一个可以预览的 HTML 页面。';
const INTERRUPTED_PROMPT = '这次只输出文字，不调用任何工具、不读写文件、不联网。请为虚构产品“今日纸飞机”连续写 20 段详细使用说明，每段约 100 字，涵盖整理桌面、浇花、阅读、勾选与添加等日常场景。直接开始正文，不提问，不等待确认，不增加实现任务。';
const CONTINUED_PROMPT = '从刚才被我中断的位置继续，只补充接下来的 3 段使用说明，总计不超过 300 字，不重复前文。只输出文字，不调用工具、不读写文件、不联网。写完这 3 段后结束。';

export function SessionPage({ observation, go, pending, prompt, notify, workspaceName, answerText, onAnswer, onSend, initialQuestionCollapsed = false, onQuestionCollapsedChange, initialReviewExpanded = false, onReviewExpandedChange, initialToolCollapsed = false, onToolCollapsedChange }: Props) {
  const running = [7, 8, 11, 17].includes(observation);
  const clarification = [9, 10].includes(observation);
  const artifact = observation >= 17 && observation <= 23;
  const [elapsed, setElapsed] = useState(0);
  const [thoughtOpen, setThoughtOpen] = useState(false);
  const [toolOpen, setToolOpen] = useState(observation === 22 && !initialToolCollapsed);
  const [selected, setSelected] = useState('');
  const [custom, setCustom] = useState('');
  const [questionCollapsed, setQuestionCollapsed] = useState(initialQuestionCollapsed);
  const [contextOpen, setContextOpen] = useState(observation === 15);
  const [anchorOpen, setAnchorOpen] = useState(observation === 26);
  const [fileMenu, setFileMenu] = useState(false);
  const [replyMenu, setReplyMenu] = useState(false);
  const [reviewExpanded, setReviewExpanded] = useState(initialReviewExpanded);
  const [panel, setPanel] = useState<'summary' | 'preview' | 'diff'>(observation === 20 ? 'preview' : [21, 23].includes(observation) ? 'diff' : 'summary');
  const [panelClosed, setPanelClosed] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setElapsed(value => value + 1), 1000);
    const next = window.setTimeout(() => go(observation === 11 ? 12 : observation === 17 ? 18 : 9), observation === 11 ? 3200 : observation === 17 ? 6500 : 16000);
    return () => { window.clearInterval(timer); window.clearTimeout(next); };
  }, [running, observation, go]);
  useEffect(() => { setQuestionCollapsed(initialQuestionCollapsed); }, [initialQuestionCollapsed]);
  useEffect(() => { setReviewExpanded(initialReviewExpanded); }, [initialReviewExpanded]);
  useEffect(() => { setToolOpen(observation === 22 && !initialToolCollapsed); }, [observation, initialToolCollapsed]);
  useEffect(() => {
    if (!anchorOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      if (observation === 26) go(25);
      else setAnchorOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [anchorOpen, observation, go]);
  const answer = () => { const text = observation === 10 ? custom.trim() : selected; if (text) onAnswer(text); };
  const changeQuestionCollapsed = (collapsed: boolean) => {
    setQuestionCollapsed(collapsed);
    onQuestionCollapsedChange?.(collapsed);
  };
  const changeReviewExpanded = (expanded: boolean) => {
    setReviewExpanded(expanded);
    onReviewExpandedChange?.(expanded);
  };
  const changeToolOpen = (open: boolean) => {
    setToolOpen(open);
    onToolCollapsedChange?.(!open);
  };
  const changePanel = (next: 'summary' | 'preview' | 'diff') => {
    if (observation === 20 && next === 'diff') { go(21); return; }
    if (observation === 21 && next === 'preview') { go(20); return; }
    setPanel(next);
  };
  const completed = !running && !clarification && observation !== 24;
  const sessionPrompt = observation === 24 ? INTERRUPTED_PROMPT : observation >= 25 ? prompt || CONTINUED_PROMPT : prompt || DEFAULT_PROMPT;
  return <div className="session-page"><header className="session-header"><div><span className={running ? 'running-dot' : clarification ? 'waiting-dot' : 'tiny-dot'} /><strong>UI 原型规划</strong><span className="session-mode">{workspaceName}</span></div><div><button className="text-button" onClick={() => setPanelClosed(!panelClosed)}><Icon name="panel" size={15} /> {panelClosed ? '打开面板' : '工作面'}</button><IconButton name="more" label="任务更多操作" onClick={() => pending('O04')} /></div></header><div className="session-layout"><div className="conversation"><div className="message-scroll"><div className="user-message"><span>{sessionPrompt}</span></div>{(observation === 11 || !!answerText) && <div className="user-message"><span><strong>这次原型，优先验证哪一部分？</strong><br />{answerText || "先完成一个小型可操作示例"}</span></div>}<div className="assistant-message"><div className="assistant-heading"><span className="assistant-mark">Q</span><strong>Qoder</strong>{running && <span className="run-label"><i /> 正在{observation === 17 ? '写入文件' : '思考'} · {elapsed}s</span>}</div><button className="thought-toggle" onClick={() => setThoughtOpen(!thoughtOpen)}><Icon name={thoughtOpen ? 'down' : 'chevron'} size={12} />{running ? '正在整理任务与执行步骤' : '已完成思考'}</button>{thoughtOpen && <div className="thought-content">先确认目标与范围，再安排可验证的小步骤。此摘要为原型虚构内容，不展示真实模型内部推理。</div>}
    {running && <div className="reply-body"><h2>{observation === 11 ? '已收到你的选择' : observation === 17 ? '正在创建纸飞机清单' : '先把这件事拆开来看'}</h2>{STREAM.slice(0, observation === 11 ? 1 : Math.min(4, Math.floor(elapsed / 3) + 1)).map(line => <p key={line}>{line}</p>)}{observation === 17 && <div className="tool-running"><span className="spinner" /><Icon name="file" /> 写入文件 <code>demo.html</code></div>}<span className="typing-cursor" /></div>}
    {clarification && <div className="reply-body"><p>在开始之前，我想先确认你希望从哪里入手。</p><h2>这次原型，优先验证哪一部分？</h2><p>确认方向后，我会给出三步计划，接着完成这个小型示例。</p></div>}
    {completed && !artifact && <div className="reply-body">{observation >= 25 ? <><p>接着把日常的小事整理成容易完成的步骤。</p><ol><li><strong>整理桌面。</strong> 给常用物品留出固定位置，让开始工作的过程更轻松。</li><li><strong>给植物浇水。</strong> 先观察土壤的状态，再决定今天是否需要补水。</li><li><strong>阅读十页。</strong> 留出一段安静的时间，读完后记下一句印象深刻的话。</li></ol></> : <><h2>纸飞机清单 · 三步计划</h2><p>我们先制作一个简单、清楚、可以直接打开的小页面。</p><ol>{PLAN.map((line, index) => <li key={line}><strong>第 {index + 1} 步</strong><p>{line}</p></li>)}</ol><p>你确认后，我就按这个计划创建页面。</p><div className="completed-meta"><Icon name="check" size={12} /> 已完成 · 12s · 1 次模型迭代</div></>}</div>}
    {artifact && !running && <div className="reply-body"><p>{observation >= 22 ? '已完成限定修改：标题、强调色和添加按钮已更新。' : '纸飞机清单已创建。页面包含三项待办，并提供添加事项和勾选完成的入口。'}</p><button className="tool-toggle" aria-expanded={toolOpen} aria-controls="tool-execution-list" onClick={() => changeToolOpen(!toolOpen)}><Icon name={toolOpen ? 'down' : 'chevron'} size={12} /><Icon name="check" size={14} /> 执行工具 {observation >= 22 ? 4 : 1} 次</button>{toolOpen && <div id="tool-execution-list" className="tool-list">{Array.from({ length: observation >= 22 ? 4 : 1 }, (_, index) => <div key={index}><Icon name="check" size={13} /><span>{observation >= 22 ? '编辑文件' : '写入文件'} <code>demo.html</code></span><button onClick={() => { setPanelClosed(false); go(observation >= 22 ? 23 : 21); }}>查看本次修改</button></div>)}</div>}<div className="artifact-card"><button className="artifact-open" onClick={() => go(20)}><span className="html-file">HTML</span><span><strong>demo.html</strong><small>{observation >= 22 ? '今日纸飞机' : '纸飞机清单'} · HTML 文件</small></span><Icon name="chevron" size={15} /></button><div className="relative"><IconButton name="more" label="文件更多操作" onClick={() => setFileMenu(!fileMenu)} />{fileMenu && <div className="small-menu"><button onClick={() => go(20)}>在浏览器中打开</button><button onClick={() => { setFileMenu(false); go(observation >= 22 ? 23 : 21); }}>查看文件差异</button><button onClick={() => notify('示例文件路径：/示例工作区/paper-plane/demo.html')}>显示示例路径</button></div>}</div></div><div className="changes-card"><div><Icon name="file" size={14} /><span>1 个文件已更改</span><strong className="added">+{observation >= 22 ? 4 : 67}</strong><strong className="removed">−{observation >= 22 ? 4 : 0}</strong></div><div><button onClick={() => notify('撤销行为尚未在 Qoder 中实测；原型未修改真实文件。')}>撤销</button><button onClick={() => go(observation >= 22 ? 23 : 21)}>审阅</button></div></div></div>}
    {observation === 24 && <div className="reply-body"><h2>让每一天轻一点</h2>{STREAM.map(line => <p key={line}>{line}</p>)}<p>17. 不必等一切准备好再开始，为当下的小事留一点空间……</p><div className="interrupted-notice"><Icon name="clock" size={15} /> Qoder 的回复已被你终止。</div><small className="muted">已中断 · 40s · 1 次模型迭代</small></div>}
    {completed && <><div className="reply-actions"><IconButton name="copy" label="复制回复" onClick={() => notify('回复复制入口已演示；此版本不写入系统剪贴板。')} /><button aria-label="赞同回复" onClick={() => notify('已记录本地反馈：赞同')}>♧</button><button aria-label="从回复分支" onClick={() => pending('M01')}>⑂</button><div className="relative"><IconButton name="more" label="更多回复操作" onClick={() => setReplyMenu(!replyMenu)} />{replyMenu && <div className="small-menu"><button onClick={() => pending('M01')}>回复操作 · 待采集</button><button onClick={() => notify('已记录本地反馈')}>反馈此回复</button></div>}</div></div>{!artifact && observation < 25 && <div className="suggestion-chips"><button onClick={() => go(17)}>按计划创建页面 <Icon name="arrow" size={12} /></button><button onClick={() => go(9)}>进一步明确设计 <Icon name="arrow" size={12} /></button><button onClick={() => go(18)}>查看示例产物 <Icon name="arrow" size={12} /></button></div>}</>}
    </div></div><div className="conversation-bottom">{clarification ? <div className="clarification-card"><div className="clarification-heading"><Icon name="chat" size={17} /><strong>需要你的选择</strong><button className="text-button" aria-expanded={!questionCollapsed} aria-controls="clarification-response-controls" onClick={() => changeQuestionCollapsed(!questionCollapsed)}>{questionCollapsed ? '展开问题' : '收起问题'}</button></div><p>这次原型，优先验证哪一部分？</p>{!questionCollapsed && <div id="clarification-response-controls">{observation === 10 ? <textarea aria-label="自定义答案" placeholder="告诉我你的想法…" value={custom} onChange={event => setCustom(event.target.value)} /> : <div className="clarification-options">{['先完成一个小型可操作示例', '先讨论完整产品的信息架构', '先确定视觉风格与组件'].map((option, index) => <button key={option} className={selected === option ? 'selected' : ''} onClick={() => setSelected(option)}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}{index === 0 && <em>推荐</em>}{selected === option && <Icon name="check" size={14} />}</button>)}</div>}<div className="clarification-footer"><button className="text-button" onClick={() => go(observation === 10 ? 9 : 10)}>{observation === 10 ? '返回选项' : '自定义答案'}</button><button className="primary-button" onClick={selected || custom.trim() ? answer : () => onAnswer('无偏好')}>{selected || custom.trim() ? '发送答案' : '无偏好'}</button></div></div>}</div> : <><div className="session-input-top"><div className="relative"><button className="context-indicator" onClick={() => setContextOpen(!contextOpen)}><span /> 上下文 16%</button>{contextOpen && <div className="context-popover"><strong>当前任务上下文</strong><p>占用 16% · 模拟展示</p><small>上下文明细与压缩尚未实测。</small><button onClick={() => pending('S10')}>查看研究详情</button></div>}</div></div><Composer workspaceName={workspaceName} compact running={running} onSend={text => onSend(text, observation === 24)} onStop={() => go(24)} onRoute={pending} onInputFocus={anchorOpen && observation === 26 ? () => go(25) : undefined} /></>}</div></div>
    {!panelClosed && <aside className="task-panel"><div className="panel-tabs"><button className={panel === 'summary' ? 'active' : ''} onClick={() => changePanel('summary')}>任务</button>{(artifact || panel !== 'summary') && <><button className={panel === 'preview' ? 'active' : ''} onClick={() => changePanel('preview')}>浏览器</button><button className={panel === 'diff' ? 'active' : ''} onClick={() => changePanel('diff')}>审阅</button></>}<IconButton name="close" label="关闭工作面" onClick={() => setPanelClosed(true)} /></div>{panel === 'summary' ? <div className="task-summary"><div className="summary-heading"><strong>任务回顾</strong><IconButton name="more" label="回顾更多操作" onClick={() => pending('P16')} /></div><button className="recap-card" aria-expanded={reviewExpanded} aria-controls="task-review-expanded-content" onClick={() => changeReviewExpanded(!reviewExpanded)}><span><Icon name="chat" size={16} /> UI 原型规划</span><p>从想法出发，制作一个轻量的纸飞机待办清单。</p><small>刚刚更新 <Icon name={reviewExpanded ? 'down' : 'chevron'} size={12} /></small>{reviewExpanded && <p id="task-review-expanded-content">本地示例已整理需求、列出计划，并保留文件产物和审阅入口。展开内容为原型补充，不属于原产品实测全文。</p>}</button><h4>产出 <span>{artifact ? 1 : 0}</span></h4>{artifact ? <button className="output-row" onClick={() => go(20)}><Icon name="file" /> demo.html <Icon name="chevron" size={12} /></button> : <p className="muted panel-empty">暂无产出</p>}<h4>来源 <span>0</span></h4><p className="muted panel-empty">暂无来源</p></div> : panel === 'preview' ? <PreviewPane /> : <DiffPane modified={observation >= 22} />}</aside>}</div><div className="message-anchor-wrap"><button className="message-anchor" aria-label="预览最后一轮消息" aria-expanded={anchorOpen} aria-controls="message-anchor-preview" onMouseEnter={() => { if (observation !== 26) go(26); }} onClick={() => { if (observation !== 26) go(26); }}>━</button>{anchorOpen && <div id="message-anchor-preview" className="anchor-popover" role="dialog" aria-label="会话锚点内容预览"><strong>继续刚才的内容</strong><p>接着把日常的小事整理成容易完成的步骤。</p><button onClick={() => go(25)}>定位到此轮消息</button><button onClick={() => observation === 26 ? go(25) : setAnchorOpen(false)}>关闭预览</button></div>}</div></div>;
}

function PreviewPane() {
  const [items, setItems] = useState([{ title: '整理桌面', done: false }, { title: '浇花', done: false }, { title: '阅读十页', done: false }]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  return <div className="preview-pane"><div className="browser-address"><Icon name="globe" size={13} /><span>file:///示例工作区/paper-plane/demo.html</span></div><div className="browser-tab"><span className="tiny-dot" /> 今日纸飞机</div><div className="paper-preview"><span className="paper-plane">⌁</span><p className="paper-eyebrow">慢慢来，也能抵达</p><h2>今日纸飞机</h2><p>把今天的小事，轻轻放在这里。</p><div className="paper-items">{items.map((item, index) => <label key={index}><input type="checkbox" checked={item.done} onChange={() => setItems(items.map((old, at) => at === index ? { ...old, done: !old.done } : old))} /><span className={item.done ? 'done' : ''}>{item.title}</span></label>)}</div>{adding ? <form className="paper-add" onSubmit={event => { event.preventDefault(); if (title.trim()) { setItems([...items, { title: title.trim(), done: false }]); setTitle(''); setAdding(false); } }}><input autoFocus aria-label="新事项" placeholder="写下一件小事" value={title} onChange={event => setTitle(event.target.value)} /><button disabled={!title.trim()} type="submit">添加</button><button type="button" onClick={() => setAdding(false)}>取消</button></form> : <button className="paper-button" onClick={() => setAdding(true)}>＋ 记录一件事</button>}<small>每天一点点，就很好。</small></div></div>;
}

function DiffPane({ modified }: { modified: boolean }) {
  const pairs = [['6', '<title>纸飞机清单</title>', '<title>今日纸飞机</title>'], ['9', '  --accent: #789783;', '  --accent: #2563eb;'], ['41', '<h1>纸飞机清单</h1>', '<h1>今日纸飞机</h1>'], ['47', '<button>＋ 添加</button>', '<button>＋ 记录一件事</button>']];
  return <div className="diff-pane"><div className="diff-toolbar"><span>最后一轮 <Icon name="down" size={11} /></span><span><b className="added">+{modified ? 4 : 67}</b> <b className="removed">−{modified ? 4 : 0}</b></span></div><div className="diff-filename"><Icon name="file" size={14} /> demo.html</div><div className="diff-code">{modified ? pairs.map(([line, before, after]) => <React.Fragment key={line}><div className="diff-ellipsis">⋯ 未更改的行</div><div className="diff-line minus"><span>{line}</span><b>−</b><code>{before}</code></div><div className="diff-line plus"><span>{line}</span><b>+</b><code>{after}</code></div></React.Fragment>) : ['<!doctype html>', '<html lang="zh-CN">', '<head>', '  <meta charset="utf-8">', '  <meta name="viewport"', '        content="width=device-width">', '  <title>纸飞机清单</title>', '  <style>', '    :root { --accent: #789783; }', '    body { margin: 0; }', '  </style>', '</head>', '<body>', '  <h1>纸飞机清单</h1>', '  <!-- 示例页面内容 -->'].map((line, index) => <div key={index} className="diff-line plus"><span>{index + 1}</span><b>+</b><code>{line}</code></div>)}<div className="diff-ellipsis">原型代码节选 · 未读取或修改实际文件</div></div></div>;
}
