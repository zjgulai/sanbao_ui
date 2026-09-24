(()=>{'use strict';
const uxMotion = { ready: false, animations: new Set(), panels: new WeakMap(), searchTimer: 0 };

// Localize source text at the presentation boundary; business identifiers and user input stay intact.
const localeStrings = JSON.parse(document.getElementById('wp-locale-en').textContent);
const brandCopy = {
 zh: {
  title:'SanBao · 经营网络的 Native AgenticOS',
  description:'SanBao 是面向跨境电商与出海品牌的 Native AgenticOS，以共享经营事项连接经营信号、专业判断、责任边界与结果反馈。',
  nav:['三宝是什么','经营网络','专业协作','经营场景','责任与治理'],
  scenarioCta:'在本页整理演示问题', desktopCta:'了解桌面端',
  heroEyebrow:'面向跨境电商与出海品牌',
  heroMarkup:'<span class="hero-prefix">让经营目标，</span><span class="hero-zh-rest"><span>在明确边界内</span><span>持续推进。</span></span>',
  heroBody:'SanBao 将经营信号、责任、约束、专业判断与外部回执组织到同一经营事项中，帮助团队比较方案、协同交付，并在有效授权范围内推进下一步。',
  heroCaption:'一个经营事项，关联目标、责任、证据、行动与回执。',
  architecture:{
   eyebrow:'01 / 当前经营模型',
   title:'让经营事实、专业判断与行动边界，<br>在同一经营网络中衔接。',
   lead:'当前页面展示经营网络与能力模型：将商品、市场、渠道、供应与资金关联为可追溯的经营事实，并让判断、责任与授权行动在明确边界内衔接。',
   graphTitle:'共享经营事项，<span>让事实、判断与责任相遇。</span>', graphMark:'CURRENT OPERATING MODEL',
   decisionTitle:'以有依据的判断，<br>比较下一步的经营选择。',
   decisionText:'把经营信号与企业事实放进同一判断框架，比较假设、资源约束、风险与停止条件，形成可审查的选项，而不是自动给出结论。',
   decisionFields:['先看边界','形成决策'],
   collaborationTitle:'围绕同一经营事项，<br>让专业责任清晰接续。',
   collaborationText:'目标被拆为可交接的专业工作。每一项交付明确输入、责任、验收和下一位接收者；人、Native Agent 与工具按各自边界承接。',
   executionTitle:'用外部回执校验行动，<br>用结果观察更新下一轮判断。',
   executionText:'目标系统已接入且行动获得有效授权时，才可读取对象、版本与状态；随后在约定观察窗口内，把经营结果反馈给下一轮判断。',
   governance:['贯穿经营事项','身份与权限','预算与人工 Gate','对象版本与审计','查看责任与治理']
  },
  workforce:{
   title:'围绕同一经营事项，<span>让专业责任清晰协作。</span>',
   lead:'沿着同一经营事项，查看不同专业责任如何接力。每项能力都明确输入、交付、验收与下一位责任人。',
   current:'当前经营事项（示例）', directory:'当前经营模型 / 专业责任目录', directoryTitle:'专业责任与交付目录'
  },
  scenarios:{
   title:'从一个经营问题，<span>到跨域协同。</span>',
   lead:'从正在处理的经营问题出发，沿当前模型的 7 条价值流查看场景、专业责任与交付关系；场景目录是经营模型，不代表已连接的生产覆盖。'
  },
  trust:{
   title:'经营协作持续推进，<span>权责始终清晰。</span>',
   lead:'在三宝的治理模型中，企业规则、责任边界、授权范围与异常处理共同约束下一步。当前页面展示判断、授权和回执的组织方式，不代表已连接业务系统或替代人工执行。',
   authority:'判断有依据，协作有责任，行动有边界，结果有回执。',
   status:'当前等待具名确认', noExternal:'等待具名确认 · 没有外部执行', currentMatter:'当前经营事项', approval:'授权状态', boundary:'行动边界', recovery:'异常与恢复', modelMatter:'当前经营事项示例', modelBoundary:'示例将行动边界附着在共享经营事项上；条件变化时需要具名责任人重新确认。', modelRecovery:'示例会保留已完成部分、待处理事项、责任人与恢复条件。'
  },
  demo:{
   eyebrow:'YOUR NEXT OPERATING MATTER', title:'查看一个经营事项，<span>如何从判断走向可验证的下一步。</span>',
   lead:'在本页梳理一个经营目标、约束与演示范围。页面只展示组织方式，不发送信息、不连接业务系统，也不执行外部动作。',
   intro:'从目标、事实与约束开始', company:'公司 / 品牌', email:'工作邮箱', goal:'想梳理的经营问题',
   companyPlaceholder:'你的公司或品牌', emailPlaceholder:'name@company.com', goalPlaceholder:'例如：在现金约束下，降低库存压力并稳定订单增长',
   submit:'在本页整理演示问题', note:'交互示意：填写内容仅在本页整理，不会发送。', result:'演示问题已在本页整理，尚未发送。', complete:'演示问题已整理'
  },
  desktop:{
   title:'了解 SanBao Desktop', lead:'桌面工作台的产品方向，是承载专业协作、能力调用与审阅。',
   availability:'规划与验证中', note:'当前页面不提供安装包、运行时或业务系统连接。可在本页整理演示问题。'
  },
  core:{ariaLabel:'六阶段经营事项流程示意', demoTag:'交互示意 · 不触发外部动作，不授予业务权限', pending:'当前等待具名确认', noExternal:'等待具名确认 · 没有外部执行'}
 },
 en: {
  title:'SanBao · Native AgenticOS for operating networks',
  description:'SanBao is a Native AgenticOS for cross-border commerce and global brands. It brings business signals, specialist judgment, accountable collaboration, action boundaries, and outcome feedback into shared operating matters.',
  nav:['What is SanBao?','Operating network','Specialist collaboration','Business scenarios','Accountability & governance'],
  scenarioCta:'Frame a demo question', desktopCta:'Explore desktop workspace',
  heroEyebrow:'For cross-border commerce and global brands',
  heroMarkup:'<span class="hero-prefix">Move business goals</span><span class="hero-zh-rest">forward within clear boundaries.</span>',
  heroBody:'SanBao brings business signals, accountability, constraints, specialist judgment, and external receipts into one shared operating matter so teams can compare options, coordinate delivery, and move the next step forward within valid authorization.',
  heroCaption:'One shared operating matter connects goals, accountability, evidence, action, and receipts.',
  architecture:{
   eyebrow:'01 / CURRENT OPERATING MODEL',
   title:'Connect operating facts, specialist judgment, and action boundaries<br>in one operating network.',
   lead:'This page presents an operating-network and capability model: it connects product, market, channel, supply, and cash as traceable operating facts, then links judgment, accountability, and authorized action within clear boundaries.',
   graphTitle:'Shared operating matters<br><span>bring facts, judgment, and accountability together.</span>', graphMark:'CURRENT OPERATING MODEL',
   decisionTitle:'Use grounded judgment<br>to compare the next operating choice.',
   decisionText:'Place business signals and enterprise facts in one decision frame. Compare hypotheses, resource constraints, risks, and stop conditions to form reviewable options, rather than automatically producing a conclusion.',
   decisionFields:['Decision boundary','Decision formed'],
   collaborationTitle:'Center specialist accountability<br>on the same operating matter.',
   collaborationText:'Goals are broken into hand-off-ready professional work. Each deliverable names its inputs, accountability, acceptance, and next recipient; people, Native Agents, and tools each take work within their own boundaries.',
   executionTitle:'Use external receipts to check action,<br>and outcome observation to inform the next judgment.',
   executionText:'Only when a target system is connected and an action has valid authorization can an object, version, and state be read back. Outcomes are then observed within an agreed window to inform the next judgment.',
   governance:['Across the operating matter','Identity & permissions','Budget & human gate','Object versions & audit','View accountability & governance']
  },
  workforce:{
   title:'Center specialist accountability<br><span>on the same operating matter.</span>',
   lead:'Follow one shared operating matter to see how specialist accountabilities take turns. Every capability names inputs, deliverables, acceptance, and the next accountable recipient.',
   current:'Current operating matter (example)', directory:'CURRENT OPERATING MODEL / SPECIALIST DIRECTORY', directoryTitle:'Specialist accountability & deliverables'
  },
  scenarios:{
   title:'From one operating question<br><span>to cross-domain collaboration.</span>',
   lead:'Start with the operating question at hand, then examine scenarios, specialist accountability, and delivery relationships across the model’s seven value streams. This directory is an operating model, not proof of connected production coverage.'
  },
  trust:{
   title:'Operating collaboration keeps moving,<br><span>while accountability stays clear.</span>',
   lead:'In SanBao’s governance model, enterprise rules, accountability boundaries, authorization scope, and exception handling constrain the next step. This page demonstrates how judgment, authorization, and receipts are organized; it does not show a connected business system or replace human execution.',
   authority:'Judgment is grounded. Collaboration is accountable. Action is bounded. Outcomes have receipts.',
   status:'Awaiting named confirmation', noExternal:'Awaiting named confirmation · no external action', currentMatter:'Current operating matter', approval:'Authorization state', boundary:'Action boundary', recovery:'Exception & recovery', modelMatter:'Selected operating-matter example', modelBoundary:'This example keeps the action boundary attached to a shared operating matter; named-accountable confirmation is required when conditions change.', modelRecovery:'This example retains completed work, open items, accountable owners, and recovery conditions.'
  },
  demo:{
   eyebrow:'YOUR NEXT OPERATING MATTER', title:'See how one operating matter<br><span>moves from judgment to a verifiable next step.</span>',
   lead:'Use this page to frame an operating goal, its constraints, and the scope of a walkthrough. It demonstrates an organizing model only: it does not send information, connect a business system, or take external action.',
   intro:'Start with goals, facts, and constraints', company:'Company / brand', email:'Work email', goal:'Operating question to frame',
   companyPlaceholder:'Your company or brand', emailPlaceholder:'name@company.com', goalPlaceholder:'For example: reduce inventory pressure while protecting order growth under cash constraints',
   submit:'Frame a demo question', note:'Interaction example: entries are organized on this page only and are not sent.', result:'The demo question is organized on this page and has not been sent.', complete:'Demo question organized'
  },
  desktop:{
   title:'Explore SanBao Desktop', lead:'The desktop workspace is a product direction for specialist collaboration, capability use, and review.',
   availability:'Planned and under validation', note:'This page does not provide an installer, runtime, or business-system connection. You can frame a demo question on this page.'
  },
  core:{ariaLabel:'Six-stage operating-matter flow example', demoTag:'Interaction example · no external action or business permission is granted', pending:'Awaiting named confirmation', noExternal:'Awaiting named confirmation · no external action'}
 }
};
const localeText = new WeakMap(), localeAttrs = new WeakMap(), localeCache = new Map(), panelSource = new WeakMap();
const localeTerms = new RegExp(Object.keys(localeStrings).filter(key => /[\u3400-\u9fff]/.test(key)).sort((a,b) => b.length-a.length).map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
const localeSkip = 'script,style,input,textarea,[data-i18n-skip],.locale-native';
const localeAttributeNames = ['aria-label','aria-roledescription','title','alt','placeholder'];
const localeObservation = {subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:localeAttributeNames};
let localeObserver = null, localeReady = false, heroMarkup = null;

function translateText(value, language = state.lang) {
 const source = String(value ?? '');
 if (language !== 'en' || !/[\u3400-\u9fff]/.test(source)) return source;
 if (localeCache.has(source)) return localeCache.get(source);
 const text = source.trim(), leading = source.slice(0,source.length-source.trimStart().length), trailing = source.slice(source.trimEnd().length);
 let result = localeStrings[text];
 if (result === undefined) {
  const roleLabel = /^查看 (.+) 的岗位职责$/.exec(text);
  if (roleLabel) result = `View ${translateText(roleLabel[1], 'en')}'s role and responsibilities`;
  else result = text.replace(localeTerms, key => localeStrings[key]);
 }
 result = result.replace(/：/g, ': ').replace(/，/g, ', ').replace(/；/g, '; ').replace(/、/g, ', ').replace(/。/g, '.').replace(/（/g, ' (').replace(/）/g, ')');
 result = leading + result + trailing;
 localeCache.set(source, result);
 return result;
}

function localizeTextNode(node) {
 const parent = node.parentElement;
 if (!parent || parent.closest(localeSkip)) return;
 let record = localeText.get(node);
 if (!record || record.output !== node.data) record = {source:node.data,output:node.data};
 let output = translateText(record.source);
 if (state.lang === 'en' && parent.classList.contains('kg-label') && output.length > 32) {
  const cut = output.lastIndexOf(' ',29);
  output = output.slice(0,cut > 15 ? cut : 29).replace(/[\s,;:]+$/,'')+'…';
 }
 record.output = output;
 localeText.set(node,record);
 if (node.data !== output) node.data = output;
}

function localizeElement(element) {
 if (element.closest('script,style,[data-i18n-skip],.locale-native')) return;
 let records = localeAttrs.get(element);
 if (!records) { records = new Map(); localeAttrs.set(element,records); }
 for (const name of localeAttributeNames) {
  const value = element.getAttribute(name);
  if (value === null) continue;
  let record = records.get(name);
  if (!record || record.output !== value) record = {source:value,output:value};
  record.output = translateText(record.source);
  records.set(name,record);
  if (value !== record.output) element.setAttribute(name,record.output);
 }
}

function localizeTree(root) {
 if (!root) return;
 if (root.nodeType === 3) { localizeTextNode(root); return; }
 if (root.nodeType !== 1 && root.nodeType !== 9) return;
 if (root.nodeType === 1) localizeElement(root);
 const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let node;
 while ((node=walker.nextNode())) localizeTextNode(node);
 root.querySelectorAll('[aria-label],[aria-roledescription],[title],[alt],[placeholder]').forEach(localizeElement);
}

function setBrandText(selector, value) {
 $$(selector).forEach(element => {
  element.dataset.i18nSkip = '';
  element.textContent = value;
 });
}

function setBrandMarkup(selector, value) {
 $$(selector).forEach(element => {
  element.dataset.i18nSkip = '';
  element.innerHTML = value;
 });
}

function setBrandActionLabel(selector, value) {
 $$(selector).forEach(action => {
  const label = action.querySelector('[data-nav-book],[data-i18n]') || action.querySelector('span:not(.icon)') || action;
  label.dataset.i18nSkip = '';
  label.textContent = value;
 });
}

function graphKindLabel(kind, lang = state.lang) {
 if (kind === 'DSH 数字员工') return lang === 'en' ? 'Specialist accountability' : '专业责任节点';
 return translateText(kind, lang);
}

function applyBrandCopy(lang = state.lang) {
 const copy = brandCopy[lang === 'en' ? 'en' : 'zh'];
 document.title = copy.title;
 const description = $('meta[name="description"]');
 if (description) description.content = copy.description;
 $$('.nav-links a, #mobile-nav > a').forEach((link, index) => {
  link.dataset.i18nSkip = '';
  link.textContent = copy.nav[index % copy.nav.length];
 });
 $('.nav-links')?.setAttribute('aria-label',lang === 'en' ? 'Main navigation' : '主导航');
 setBrandActionLabel('[data-book]', copy.scenarioCta);
 setBrandActionLabel('[data-download]', copy.desktopCta);
 setBrandText('#positioning .hero-story > .eyebrow', copy.heroEyebrow);
 setBrandMarkup('#hero-title', copy.heroMarkup);
 setBrandText('#positioning .hero-body', copy.heroBody);
 setBrandText('#positioning .hero-caption', copy.heroCaption);
 $('#operating-core')?.setAttribute('aria-label', copy.core.ariaLabel);

 setBrandText('#architecture .section-intro .eyebrow', copy.architecture.eyebrow);
 setBrandMarkup('#architecture .section-intro h2', copy.architecture.title);
 setBrandText('#architecture .section-intro .lead', copy.architecture.lead);
 setBrandMarkup('#knowledge-graph .kg-heading h3', copy.architecture.graphTitle);
 setBrandText('#knowledge-graph .brand-name', lang === 'en' ? 'SanBao / OPERATING MODEL' : 'SanBao / 当前经营模型');
 const graphMark = $('#knowledge-graph .kg-heading-mark');
 if (graphMark) {
  graphMark.dataset.i18nSkip = '';
  graphMark.lastChild.nodeValue = ' ' + copy.architecture.graphMark;
 }
 const graphTitle = $('#kg-title'), graphDescription = $('#kg-desc');
 if (graphTitle) graphTitle.textContent = lang === 'en' ? 'SanBao operating-network model' : 'SanBao 经营网络模型';
 if (graphDescription) graphDescription.textContent = lang === 'en' ? 'The current model connects operating facts, business scenarios, specialist accountability, and cross-domain pathways. It is an operating-model illustration, not proof of connected production execution.' : '当前模型连接经营事实、业务场景、专业责任与跨域路径。它是经营模型示意，不代表已连接生产系统或已执行外部动作。';
 $$('#kg-space .kg-node').forEach(node => {
  const source = kgData.nodes.find(item => item.id === node.dataset.node);
  if (!source) return;
  const name = translateText(source.name, lang), kind = graphKindLabel(source.kind, lang);
  node.setAttribute('aria-label', kind + (lang === 'en' ? ': ' : '：') + name);
  const title = node.querySelector('title');
  if (title) title.textContent = name + ' · ' + kind;
 });
 setBrandText('.decision-intelligence > .tiny', lang === 'en' ? '02 / GROUNDED JUDGMENT' : '02 / 有依据的判断');
 setBrandMarkup('.decision-intelligence h3', copy.architecture.decisionTitle);
 setBrandText('.decision-intelligence .cap-description', copy.architecture.decisionText);
 const prerequisites = lang === 'en' ? ['Traceable sources','Comparable hypotheses','Clear boundaries','Decide the next step'] : ['来源可追溯','假设可比较','边界清楚','决定下一步'];
 $$('.insight-prerequisite span').forEach((item, index) => { item.dataset.i18nSkip = ''; item.textContent = prerequisites[index]; });
 const prerequisiteOutcome = $('.insight-prerequisite strong');
 if (prerequisiteOutcome) { prerequisiteOutcome.dataset.i18nSkip = ''; prerequisiteOutcome.textContent = prerequisites[3]; }
 setBrandText('.decision-demo .artifact-label b', lang === 'en' ? 'New-product investment example' : '新品投入判断示例');
 setBrandText('.decision-demo .artifact-label span', lang === 'en' ? 'Option-comparison example' : '方案比较示例');
 setBrandText('.goal-orchestration > .tiny', lang === 'en' ? '03 / SPECIALIST COLLABORATION' : '03 / 专业协作');
 setBrandMarkup('.goal-orchestration h3', copy.architecture.collaborationTitle);
 setBrandText('.goal-orchestration .cap-description', copy.architecture.collaborationText);
 const assignment = lang === 'en' ? [['Confirm the matter, goal, and boundaries','Operating goal · budget · stop conditions · accountable owner'],['Name specialist accountability and deliverables','Specialist accountability · professional capabilities · work dependencies · standard deliverables'],['Accept, hand off, and handle exceptions','Version check · recipient acceptance · replanning · human takeover']]:[['确认事项、目标与边界','经营目标 · 预算 · 停止条件 · 责任人'],['明确专业责任与交付','专业责任 · 专业能力 · 工作依赖 · 标准交付'],['验收、交接与异常处理','版本检查 · 下游签收 · 重规划 · 人工接管']];
 $$('.assignment-path li').forEach((item, index) => { const title = item.querySelector('b'), detail = item.querySelector('p'); if (title) { title.dataset.i18nSkip=''; title.textContent=assignment[index][0]; } if (detail) { detail.dataset.i18nSkip=''; detail.textContent=assignment[index][1]; } });
 const collaborationLink = $('.cap-inline-link');
 if (collaborationLink?.firstChild) {
  collaborationLink.dataset.i18nSkip = '';
  collaborationLink.firstChild.nodeValue = (lang === 'en' ? 'See how specialist accountability collaborates' : '查看专业责任如何协作') + ' ';
 }
 setBrandMarkup('.execution-cap-heading h3', copy.architecture.executionTitle);
 setBrandText('.execution-cap-heading > p', copy.architecture.executionText);
 const governance = $('.cap-governance');
 if (governance) {
  governance.querySelector('span').textContent = copy.architecture.governance[0];
  governance.querySelectorAll('b').forEach((item, index) => { item.textContent = copy.architecture.governance[index + 1]; });
  const link = governance.querySelector('a');
  if (link?.firstChild) link.firstChild.nodeValue = copy.architecture.governance[4] + ' ';
 }

 setBrandMarkup('#workforce .section-intro h2', copy.workforce.title);
 setBrandText('#workforce .section-intro .eyebrow', lang === 'en' ? '02 / SPECIALIST COLLABORATION' : '02 / 专业协作');
 setBrandText('#workforce .section-intro .lead', copy.workforce.lead);
 setBrandText('#team-carousel .carousel-heading .tiny', copy.workforce.current);
 setBrandText('#roles-carousel .carousel-heading .tiny', copy.workforce.directory);
 setBrandText('#roles-carousel .carousel-heading h3', copy.workforce.directoryTitle);
 $('#team-carousel')?.setAttribute('aria-label', lang === 'en' ? 'Specialist accountability handoffs for an operating matter' : '经营事项的专业责任接续');
 $('#team-stage-tabs')?.setAttribute('aria-label', lang === 'en' ? 'Specialist collaboration stages' : '专业协作阶段');
 $('#roles-carousel')?.setAttribute('aria-label', lang === 'en' ? 'Specialist accountability directory' : '专业责任目录');
 setBrandText('#carousel-help', lang === 'en' ? 'The page automatically presents operating stages and specialist accountability. You can select a stage, use arrow keys after focusing a carousel, or swipe on touch; playback pauses while you read or inspect a role.' : '页面自动展示经营阶段与专业责任。可点击切换阶段；聚焦轮播区域后可用左右方向键切换，触屏可左右滑动。阅读或查看岗位详情时会暂停自动切换。');
 setBrandMarkup('#scenarios .section-intro h2', copy.scenarios.title);
 setBrandText('#scenarios .section-intro .lead', copy.scenarios.lead);
 setBrandMarkup('#trust .section-intro h2', copy.trust.title);
 setBrandText('#trust .section-intro .lead', copy.trust.lead);
 setBrandText('.authority-note strong', copy.trust.authority);

 setBrandText('#demo .demo-layout > div > .eyebrow', copy.demo.eyebrow);
 setBrandMarkup('#demo .demo-layout > div > h2', copy.demo.title);
 setBrandText('#demo .demo-layout > div > .lead', copy.demo.lead);
 setBrandText('#demo-form > .tiny', copy.demo.intro);
 const formLabels = $$('#demo-form label');
 const formText = [copy.demo.company, copy.demo.email, copy.demo.goal];
 const placeholders = [copy.demo.companyPlaceholder, copy.demo.emailPlaceholder, copy.demo.goalPlaceholder];
 formLabels.forEach((label, index) => {
  label.dataset.i18nSkip = '';
  const text = [...label.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
  if (text) text.nodeValue = formText[index];
  const input = label.querySelector('input,textarea');
  if (input) input.placeholder = placeholders[index];
 });
 setBrandText('#submit-demo', copy.demo.submit);
 setBrandText('#demo-form .form-note', copy.demo.note);

 setBrandText('#download-title', copy.desktop.title);
 setBrandText('#download > p:not(.muted)', copy.desktop.lead);
 setBrandText('#download > p.muted', copy.desktop.note);
 setBrandText('#download .download-options > div > span', copy.desktop.availability);
}

function syncLanguageMenu() {
 const english = state.lang === 'en';
 $('[data-language-label]').textContent = english ? 'English' : '简体中文';
 $('[data-nav-book]').textContent = brandCopy[english ? 'en' : 'zh'].scenarioCta;
 $('#lang').value = state.lang;
 $$('[data-language]').forEach(button => {
  const selected = button.dataset.language === state.lang;
  button.setAttribute('aria-checked',String(selected));
  button.tabIndex = selected ? 0 : -1;
 });
}

function syncThemeControl() {
 const button = $('[data-theme-toggle]');
 const label = translateText(document.body.dataset.theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
 button.setAttribute('aria-label',label);
 button.setAttribute('title',label);
}

function applyLanguage(lang, notify = true) {
 lang = lang === 'en' ? 'en' : 'zh';
 if (!localeReady) { state.lang = lang; return; }
 const changed = state.lang !== lang;
 state.lang = lang;
 document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
 localeObserver?.disconnect();
 if (changed || !heroMarkup.applied) {
  $('#hero-title').innerHTML = lang === 'en' ? heroMarkup.en : heroMarkup.zh;
  heroMarkup.applied = true;
 }
 syncLanguageMenu();
 syncThemeControl();
 localizeTree(document.documentElement);
 applyBrandCopy(lang);
 renderOperatingState();
 renderArchitecture();
 renderTrust();
 localeObserver?.observe(document.documentElement,localeObservation);
 try { localStorage.setItem('worldpilot-v1-language',lang); } catch {}
 updateURL();
 if ($('#scenario-search').value) renderV1Explorer();
 v1.globeRefresh?.();
 window.dispatchEvent(new Event('worldpilot:languagechange'));
}

function closeSettingsMenus(restoreFocus = false, source = null) {
 const target = source || $$('.settings-menu').find(menu => menu.open);
 $$('.settings-menu').forEach(menu => { menu.open = false; menu.querySelector('summary').setAttribute('aria-expanded','false'); });
 if (restoreFocus && target) target.querySelector('summary').focus({preventScroll:true});
}

function initLocale() {
 heroMarkup = {
  zh:brandCopy.zh.heroMarkup,
  en:brandCopy.en.heroMarkup,
  description:brandCopy.zh.description,
  applied:false
 };
 localeReady = true;
 localeObserver = new MutationObserver(records => {
  const roots = new Set();
  records.forEach(record => {
   if (record.type === 'childList') record.addedNodes.forEach(node => roots.add(node));
   else roots.add(record.target);
  });
  localeObserver.disconnect();
  roots.forEach(root => { if (root.isConnected) localizeTree(root); });
  localeObserver.observe(document.documentElement,localeObservation);
 });
 let saved = 'zh';
 try { saved = localStorage.getItem('worldpilot-v1-language') || 'zh'; } catch {}
 const requested = new URL(location.href).searchParams.get('lang');
 applyLanguage(requested === 'en' || requested === 'zh' ? requested : saved,false);
 $$('.settings-menu').forEach(menu => {
  const summary = menu.querySelector('summary');
  let pointerInside = false;
  document.addEventListener('pointerdown',e => { pointerInside = menu.contains(e.target); },true);
  const releasePointer = () => { pointerInside = false; };
  document.addEventListener('click',releasePointer);
  document.addEventListener('pointercancel',releasePointer,true);
  document.addEventListener('keydown',releasePointer,true);
  window.addEventListener('blur',releasePointer);
  summary.addEventListener('click',e => {
   e.preventDefault();
   const opening = !menu.open;
   closeSettingsMenus();
   menu.open = opening;
   summary.setAttribute('aria-expanded',String(opening));
  });
  menu.addEventListener('toggle',() => {
   summary.setAttribute('aria-expanded',String(menu.open));
  });
  menu.addEventListener('keydown',e => {
   const buttons = [...menu.querySelectorAll('[role="menuitemradio"]')];
   if (e.key === 'Escape' && menu.open) { e.preventDefault();e.stopPropagation();closeSettingsMenus(true,menu);return; }
   if (!['ArrowDown','ArrowUp','Home','End'].includes(e.key)) return;
   e.preventDefault();
   const index = buttons.indexOf(document.activeElement);
   let next;
   if (!menu.open || document.activeElement === summary) {
    closeSettingsMenus();
    menu.open = true;
    summary.setAttribute('aria-expanded','true');
    next = e.key === 'ArrowUp' || e.key === 'End' ? buttons.length-1 : Math.max(0,buttons.findIndex(button => button.getAttribute('aria-checked') === 'true'));
   } else next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length-1 : (index+(e.key === 'ArrowDown' ? 1 : -1)+buttons.length)%buttons.length;
   buttons.forEach((button,i) => button.tabIndex = i === next ? 0 : -1);
   buttons[next].focus();
  });
  menu.addEventListener('focusout',e => {
   // Focus may briefly be on body between pointerdown and click. Do not hide
   // the clicked option before its click event can apply the new preference.
   if (pointerInside || (e.relatedTarget && menu.contains(e.relatedTarget))) return;
   if (e.relatedTarget) { menu.open = false;summary.setAttribute('aria-expanded','false');return; }
   queueMicrotask(() => {
    if (!pointerInside && !menu.contains(document.activeElement)) { menu.open = false;summary.setAttribute('aria-expanded','false'); }
   });
  });
 });
}

function animateUX(el, distance = 8, duration = 280) {
 if (!el || !uxMotion.ready || v1.reduced || document.hidden || !el.animate) return;
 const previous = uxMotion.panels.get(el);
 if (previous) previous.cancel();
 const animation = el.animate([
  { opacity: .3, transform: `translateY(${distance}px)` },
  { opacity: 1, transform: 'translateY(0)' }
 ], { duration, easing: 'cubic-bezier(.22,1,.36,1)' });
 uxMotion.panels.set(el, animation);
 uxMotion.animations.add(animation);
 const complete = () => { uxMotion.animations.delete(animation); if (uxMotion.panels.get(el) === animation) uxMotion.panels.delete(el); };
 animation.finished.then(complete, complete);
}

function setPanelContent(el, html) {
 if (!el || panelSource.get(el) === html || el.innerHTML === html) return;
 const current = document.activeElement;
 const attrs = ['id', 'data-explore-domain', 'data-explore-scene', 'data-explore-chain', 'data-role', 'data-scene', 'data-trust', 'data-arch', 'name'];
 const bookmark = el.contains(current) ? attrs.map(name => [name, current.getAttribute(name)]).find(([,value]) => value !== null) : null;
 const scroll = el.scrollTop;
 const mounted = el.childElementCount > 0;
 el.innerHTML = html;
 panelSource.set(el,html);
 if (bookmark) {
  const next = [...el.querySelectorAll(`[${bookmark[0]}]`)].find(node => node.getAttribute(bookmark[0]) === bookmark[1]);
  if (next) { next.focus({preventScroll:true}); el.scrollTop = scroll; }
 }
 if (mounted && !['stream-filter', 'scenario-catalog', 'trust-states'].includes(el.id)) animateUX(el);
}

function queueSceneFilter() {
 clearTimeout(uxMotion.searchTimer);
 const input = $('#scenario-search');
 if (!input.value) { filterScenes(); return; }
 uxMotion.searchTimer = setTimeout(filterScenes, 130);
}

function syncHeaderAction() {
 const header = $('.nav'), book = $('.context-book'), actions = $('#hero-actions'), form = $('#demo-form');
 if (!header || !book || !actions || !form) return;
 const headerBottom = header.getBoundingClientRect().bottom;
 const actionsPassed = actions.getBoundingClientRect().bottom <= headerBottom;
 const formRect = form.getBoundingClientRect();
 const formVisible = formRect.top < innerHeight && formRect.bottom > headerBottom;
 const menuOpen = !$('#mobile-nav').hidden;
 const visible = actionsPassed && !formVisible && !menuOpen;
 // Keep a focused action available until focus moves to its destination.
 if (!visible && !menuOpen && book.contains(document.activeElement)) return;
 book.dataset.contextVisible = String(visible);
 book.inert = !visible;
 book.setAttribute('aria-hidden', String(!visible));
 book.tabIndex = visible ? 0 : -1;
}

function initUXMotion() {
 uxMotion.ready = true;
 const menu = $('#mobile-nav'), toggle = $('.menu-toggle'), themeToggle = $('[data-theme-toggle]'), lang = $('.lang-label'), navTools = $('.nav-tools');
 const settings = document.createElement('div');
 settings.className = 'mobile-settings';
 menu.append(settings);
 const smallScreen = matchMedia('(max-width:760px)'), menuScreen = matchMedia('(max-width:1180px)');
 const syncMenu = () => {
  const open = menuScreen.matches && !menu.hidden;
  document.body.classList.toggle('ux-menu-open', open);
  $('#main').inert = open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  syncHeaderAction();
 };
 const closeMenu = (restoreFocus = false) => {
  menu.hidden = true;
  syncMenu();
  if (restoreFocus) toggle.focus({preventScroll:true});
 };
 const placeSettings = () => {
  if (smallScreen.matches) { settings.append(themeToggle, lang); settings.hidden = false; }
  else { navTools.prepend(themeToggle, lang); settings.hidden = true; closeMenu(); }
 };
 placeSettings();
 smallScreen.addEventListener('change', placeSettings);
 menuScreen.addEventListener('change', () => { if (menuScreen.matches) syncMenu(); else closeMenu(); });
 new MutationObserver(syncMenu).observe(menu, {attributes:true,attributeFilter:['hidden']});
 syncMenu();
 document.addEventListener('pointerdown', e => {
  if ($('dialog[open]')) return;
  $$('.settings-menu').forEach(control => { if (control.open && !control.contains(e.target)) { control.open = false;control.querySelector('summary').setAttribute('aria-expanded','false'); } });
  if (!menu.hidden && !menu.contains(e.target) && !e.target.closest('header')) closeMenu();
 }, true);
 document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if ($('dialog[open]')) { e.stopImmediatePropagation(); return; }
  if ($$('.settings-menu').some(control => control.open)) { e.preventDefault(); e.stopImmediatePropagation(); closeSettingsMenus(true); }
  else if (!menu.hidden) { e.preventDefault(); e.stopImmediatePropagation(); closeMenu(true); }
 }, true);
 document.addEventListener('click', e => {
  const navigation = e.target.closest('#mobile-nav a[href^="#"],.nav-links a[href^="#"]');
  if (navigation) closeSettingsMenus();
  if (e.target.closest('[data-explore-domain],[data-explore-mode],[data-explore-chain]')) clearTimeout(uxMotion.searchTimer);
 });
 // Remember the download trigger before the delegated handler opens the modal.
 document.addEventListener('click', e => {
  const trigger = e.target.closest('[data-download]');
  if (trigger) dialogOpener = trigger;
 }, true);
 $('#scenario-search').addEventListener('search', () => { clearTimeout(uxMotion.searchTimer); filterScenes(); });
 $('#scenario-search').addEventListener('keydown', e => {
  if (e.key === 'Enter') { clearTimeout(uxMotion.searchTimer); filterScenes(); }
 });
 [$('.option-tabs'), $('#trust-states'), $('.kg-filters')].filter(Boolean).forEach(group => {
  group.addEventListener('keydown', e => {
   if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key) || e.altKey || e.ctrlKey || e.metaKey) return;
   const buttons = [...group.querySelectorAll('button')], index = buttons.indexOf(document.activeElement);
   if (index < 0) return;
   e.preventDefault();
   const next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length-1 : (index+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
   buttons[next].click();
   group.querySelectorAll('button')[next]?.focus({preventScroll:true});
  });
 });
 const preference = matchMedia('(prefers-reduced-motion: reduce)');
 const syncMotion = () => {
  v1.reduced = preference.matches;
  v1.globePaused = preference.matches;
  document.body.classList.toggle('ux-reduced', preference.matches);
  if (preference.matches) {
   stop();
   uxMotion.animations.forEach(animation => animation.cancel());
   uxMotion.animations.clear();
  } else { state.playing = true; scheduleV1(); }
  // Reduced motion removes sliding effects, while the employee catalog keeps rotating.
  Object.keys(carousels).forEach(scheduleCarousel);
  renderCore();
  v1.globeRefresh?.();
 };
 preference.addEventListener('change', syncMotion);
 document.body.classList.toggle('ux-reduced', preference.matches);
 const visibility = () => document.body.classList.toggle('ux-document-hidden', document.hidden);
 document.addEventListener('visibilitychange', visibility);
 visibility();
 let scrollFrame = 0;
 const updateHeader = () => { scrollFrame = 0; $('.nav').classList.toggle('ux-scrolled', scrollY > 12); syncHeaderAction(); };
 const queueHeader = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHeader); };
 window.addEventListener('scroll', queueHeader, {passive:true});
 window.addEventListener('resize', queueHeader);
 window.addEventListener('pageshow', queueHeader);
 window.addEventListener('hashchange', queueHeader);
 window.addEventListener('worldpilot:languagechange', queueHeader);
 $('.context-book').addEventListener('focusout', queueHeader);
 if ('ResizeObserver' in window) {
  const headerLayout = new ResizeObserver(queueHeader);
  [$('.nav'), $('#hero-actions'), $('#demo-form')].forEach(el => headerLayout.observe(el));
 }
 document.fonts?.ready.then(queueHeader);
 updateHeader();
 if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
   if (!entry.isIntersecting) return;
   animateUX(entry.target, 12, 520);
   observer.unobserve(entry.target);
  }), {threshold:.12,rootMargin:'0px 0px -36px 0px'});
  $$('.section-intro,.ontology-foundation,.decision-duet,.execution-capability,#team-carousel,#roles-carousel,.explorer-body,.trust-layout,#demo-form').forEach(el => observer.observe(el));
 }
 window.addEventListener('pagehide', () => { clearTimeout(uxMotion.searchTimer); cancelAnimationFrame(scrollFrame); });
}

const D=JSON.parse(document.getElementById('wp-data').textContent),$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=n=>`<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><use href="#wp-icon-${n}"></use></svg>`;
const roleMap=Object.fromEntries(D.roles.map(r=>[r.id,r]));
const state={mission:0,view:2,progress:2,approved:false,playing:false,teamStage:0,arch:0,exec:0,trust:2,surface:1,proof:0,domain:'',lang:'zh'};
let timer=null,toastTimer=null,dialogOpener=null,dialogOpenerKeyboard=false;
const chain=()=>D.chains[state.mission];
const team=i=>D.teams[chain().id][Math.min(i,D.teams[chain().id].length-1)].split(',').map(id=>roleMap['AGT-'+id]);
const names=arr=>arr.map(r=>r.name).join(' · ');
function bindings(text){const out=[];for(const m of text.matchAll(/([A-Z]{2})-(\d{2}(?:\/\d{2})*)/g))for(const n of m[2].split('/'))out.push(m[1]+'-'+n);return out;}
const relatedScenes=c=>new Set(c.steps.flatMap(s=>bindings(s[0])));
function notice(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,4500);}
function dialog(html){dialogOpener=document.activeElement;dialogOpenerKeyboard=!!dialogOpener?.matches?.(':focus-visible');$('#dialog-body').innerHTML=html;$('#detail-dialog').showModal();}
function closeDialogs(){$$('dialog[open]').forEach(d=>d.close());}
function stop(){clearTimeout(timer);state.playing=false;}
function schedule(){scheduleV1();}
function chooseMission(index,fromLink=false){if(!Number.isInteger(index)||index<0||index>=D.chains.length)return;stop();Object.assign(state,{mission:index,view:0,progress:0,approved:false,teamStage:0,playing:!v1.reduced});renderMissionContext();updateURL();schedule();if(fromLink)notice("经营目标已同步至团队与执行示例。");}
function updateURL(){try{const u=new URL(location.href);u.searchParams.set('mission',chain().alias);u.searchParams.set('lang',state.lang);history.replaceState(null,'',u);}catch{}}
function renderSelectors(){const opts=D.chains.map((c,i)=>`<option value="${i}">${c.alias} · ${E(c.title)}</option>`).join('');$$('.mission-selector').forEach(s=>{s.innerHTML=opts;s.value=state.mission;});}
const coreStages=['信号','决策','审批','AI 团队','执行','证据'],stageIcons=['signal','decision','gate','orchestrator','action','receipt'];
function renderCore(){renderV1Core();}
const layers=[['Shared Operating Context','目标、实体、事实与记忆','同一个商品，只有一套经营事实。','把需求、产品、供应、库存、渠道和资金关联到同一经营对象。每个判断知道依据来自哪里，每个动作知道改的是哪一个版本。','goal'],['Decision Intelligence','信号、假设、选项与承诺','从“发生了什么”走向“现在做什么”。','比较机会与风险，拆出可证伪假设，在预算、供应能力与贡献底线内推演方案。决策与所依据的证据一起留存。','decision'],['AI Workforce','岗位、技能、依赖与交付','围绕目标组队，围绕产物交接。','按经营链选择 DSH 专业岗位。每个任务绑定输入、交付、验收和下一位责任人；编排器协调依赖与例外。','agent'],['Execution Network','工具、连接器、任务与动作','将批准范围带到真正的业务动作。','专业 Skills 形成产物，工具完成加工，连接器更新具体对象。变更前校验范围与版本，变更后读取目标系统状态。','connector'],['Trust & Governance','身份、政策、审批与审计','让经营权责贯穿每一次行动。','按对象、账户、预算、时效限定批准范围；独立复核、人工 Gate 和异常接管持续生效。证据不足时保留等待状态。','gate']];
const objects=[['产品','商品规格与资料版本','goal'],['需求','市场与 VOC 证据','signal'],['供应','报价、准入与质量','skill'],['库存','仓库、批次与承诺','connector'],['渠道','Listing、价格与状态','action'],['资金','订单贡献与现金约束','outcome']];
function renderArchitecture(){renderV1Capabilities();}
const teamStageNames=['机会与研究','目标与资源','商品与准入','供给与交付','渠道与增长','结果与复盘'];
function renderTeam(){renderV1Team();}
function renderRoles(){renderV1Roles();}
const execution=[['专业 Skills','Research · Copy · Forecast','skill','把经营问题整理为可审查的专业产物。','研究、规格、预测和计划由岗位技能完成，每项交付都明确输入、版本与接收方。',['研究与商业论证','商品规格与渠道资料包','试验与验收计划'],'产物版本','专业产物已生成 · 示例'],['AI 工具','Data · Text · Image · Video','tool','用专业工具完成素材和数据加工。','对表格、文本、图片与数据进行加工。工具输出先经过岗位质量检查，再进入业务动作。',['数据检查与计算','素材与本地化加工','产物一致性检查'],'加工状态','工具输出待复核 · 示例'],['人与 Agent 协作','Task · Review · Exception','gate','把人工确认留在真正需要负责的地方。','涉及预算、采购、公开发布或敏感业务时，等待具名负责人核准；补充证据和修改方案都保留在同一任务内。',['审批范围与限制','产物版本与差异','待处理事项与负责人'],'审批状态','等待本次批准'],['业务动作','Store · Ads · ERP · Support','action','在业务平台上执行准确的已授权变更。','变更绑定对象、版本、账户与作用域。依赖未满足、权限变化或预算超界时停止，并交接尚未完成的事项。',['目标对象与版本校验','已批准字段变更','平台受理与读回请求'],'平台状态','尚未执行'],['外部回执','Object · Version · State · Time','receipt','确认真正生效的变化，再观察经营结果。','平台回执说明什么动作已经生效；订单、交付、退款与现金证据说明经营结果。二者分别验收。',['业务对象读回','动作版本与时间','结果观察与反馈'],'验证状态','暂无外部回执']];
function renderExecution(){const x=execution[state.exec],c=chain();$('#execution-tabs').innerHTML=execution.map((t,i)=>`<button role="tab" id="exec-tab-${i}" aria-controls="execution-detail" aria-selected="${i===state.exec}" data-exec="${i}">${icon(t[2])}<b data-i18n="exec.n${i+1}">${t[0]}</b><small>${t[1]}</small></button>`).join('');$('#execution-detail').setAttribute('aria-labelledby','exec-tab-'+state.exec);const rs=state.exec<2?x[7]:!state.approved?x[7]:state.exec===2?'本次样例动作已批准':state.progress===5?'示例读回已确认':'示例动作处理中';$('#execution-detail').innerHTML=`<div><span class="tiny">${state.exec+1} / 5 · 运营执行</span><h3>${x[3]}</h3><p>${x[4]}</p><ul class="document-list">${x[5].map(t=>`<li>${icon('receipt')}${t}</li>`).join('')}</ul></div><div class="receipt"><span class="tag">交互演示 · 样例记录</span><h4>${E(c.title)}</h4><dl><dt>${x[6]}</dt><dd class="${state.approved&&state.progress===5?'state-good':'state-wait'}">${rs}</dd><dt>业务对象</dt><dd>${E(c.steps[Math.min(state.exec,c.steps.length-1)][0])}</dd><dt>范围依据</dt><dd>当前目标、对象版本与本次批准</dd><dt>验收材料</dt><dd>${E(c.steps[Math.min(state.exec,c.steps.length-1)][3])}</dd><dt>经营结果</dt><dd>继续观察 · 不由工具成功直接判定</dd></dl></div>`;}
function renderSpotlight(){}
function renderCatalog(){renderV1Explorer();}
function filterScenes(){if(!state.domain)state.domain=D.domains[0].id;renderV1Explorer();}
function renderAllMissions(){}
const trustItems=[
 {icon:'signal',zh:{label:'默认只读',title:'先理解事实，再提出行动。',text:'读取范围受岗位身份和企业规则约束。尚未获得有效授权时，目标业务系统应保持原状态。'},en:{label:'Read by default',title:'Understand facts before proposing action.',text:'Read scope is constrained by role identity and enterprise rules. Until valid authorization exists, the target business system should remain unchanged.'}},
 {icon:'goal',zh:{label:'明确授权',title:'确认具体对象、行动与边界。',text:'有效授权应绑定对象版本、账户、动作、预算与时效。对象或条件变化后重新确认，不能沿用失效许可。'},en:{label:'Explicit authorization',title:'Confirm the object, action, and boundary.',text:'Valid authorization should bind an object version, account, action, budget, and time window. Reconfirm when an object or condition changes; expired permission cannot be reused.'}},
 {icon:'gate',zh:{label:'人工 Gate',title:'需要负责的人，能够看清并确认。',text:'在三宝的治理模型中，高影响行动应等待具名负责人确认。首屏仅自动展示阶段，不模拟批准、不授予业务权限。'},en:{label:'Human gate',title:'The accountable person can see and confirm.',text:'In SanBao’s governance model, high-impact action should wait for named-accountable confirmation. The hero only advances stages automatically; it does not simulate approval or grant business permission.'}},
 {icon:'receipt',zh:{label:'平台回执',title:'以外部状态确认发生了什么。',text:'平台受理与实际生效应分别验收。超时或部分成功保留“待确认”，不能以直接重试制造重复动作。'},en:{label:'Platform receipt',title:'Use external state to confirm what happened.',text:'Platform acceptance and actual effect should be accepted separately. Preserve a pending state for timeouts or partial success instead of creating duplicate actions through direct retry.'}},
 {icon:'risk',zh:{label:'异常接管',title:'把已发生与待处理的工作清楚交接。',text:'预算超界、证据缺失或依赖失效时，应暂停相关行动并保留已完成部分、待处理事项、责任人与恢复条件。'},en:{label:'Exception takeover',title:'Hand off completed and pending work clearly.',text:'When budget is exceeded, evidence is missing, or a dependency fails, related action should pause while completed work, open items, accountable owners, and recovery conditions remain visible.'}}
];
function renderTrust(){const locale=state.lang==='en'?'en':'zh',copy=brandCopy[locale],t=trustItems[state.trust][locale],c=chain(),matter=locale==='en'?copy.trust.modelMatter:E(c.title),boundary=locale==='en'?copy.trust.modelBoundary:E(c.gate),recovery=locale==='en'?copy.trust.modelRecovery:E(c.recovery);setPanelContent($('#trust-states'),trustItems.map((x,i)=>`<button data-trust="${i}" aria-pressed="${i===state.trust}">${icon(x.icon)}${x[locale].label}</button>`).join(''));setPanelContent($('#trust-detail'),`<span class="tiny">${t.label} / ${copy.trust.status}</span><h3>${t.title}</h3><p>${t.text}</p><div class="boundary-grid"><div><small>${copy.trust.currentMatter}</small>${matter}</div><div><small>${copy.trust.approval}</small><span class="state-wait">${copy.trust.noExternal}</span></div><div><small>${copy.trust.boundary}</small>${boundary}</div><div><small>${copy.trust.recovery}</small>${recovery}</div></div>`);}
const surfaces=['Web 决策视图','Desktop 岗位工作台','Mobile / Channels'];
function renderSurface(){const c=chain();$('#surface-tabs').innerHTML=surfaces.map((s,i)=>`<button id="surface-tab-${i}" role="tab" aria-controls="surface-detail" aria-selected="${i===state.surface}" data-surface="${i}">${s}</button>`).join('');$('#surface-detail').setAttribute('aria-labelledby','surface-tab-'+state.surface);let visual='',h='',text='';if(state.surface===1){visual=`<figure style="margin:0"><img src="${D.assets.dsh}" alt="DSH 实际岗位矩阵，展示岗位职责、标准产物和已绑定技能" loading="lazy"><figcaption class="tiny" style="margin-top:12px">DSH 产品截图 · 岗位矩阵</figcaption></figure>`;h='职责、技能与产物，在岗位内闭环。';text='数字员工读取所需上下文，调用岗位技能与工具，完成专业产物，并留下可审查的任务与运行记录。50 个岗位按责任域组织。';}else if(state.surface===0){visual=`<div class="workspace"><div class="workspace-top"><b>SanBao / 经营决策</b><span class="tag">交互示意</span></div><h4>${E(c.title)}</h4><p class="muted" style="font-size:13px">${E(c.question)}</p><div class="workspace-item">决策依据<span>来源 · 假设 · 备选方案</span></div><div class="workspace-item">批准状态<span>${state.approved?'样例动作已批准':'等待具名确认'}</span></div><div class="workspace-item">下一步<span>${state.approved?'查看团队交付与读回':'确认边界与责任人'}</span></div><button class="text-btn" data-return-core style="margin-top:15px">查看当前审批</button></div>`;h='经营者看问题，比较选项，确认目标。';text='将市场信号与企业事实放进同一个判断。查看方案、资金占用、风险与停止条件，再确认本阶段的授权范围。';}else{visual=`<div class="workspace"><div class="workspace-top"><b>经营事项 · 待处理</b><span class="tag">协作入口示意</span></div><h4>${E(c.title)}</h4><div class="workspace-item">负责人<span>${E(c.owner)}</span></div><div class="workspace-item">当前状态<span>${state.approved?'样例动作推进中':'等待确认'}</span></div><div class="workspace-item">共享上下文<span>同一目标、版本与权限</span></div><p class="contract-strip">审批与例外携带依据，进入责任人的处理入口。</p></div>`;h='在需要响应的时候，收到完整的事项。';text='审批、提醒与例外带着同一目标、批准依据和下一步进入协作入口。具体渠道与企业现有系统按连接范围接入。';}$('#surface-detail').innerHTML=visual+`<div class="surface-description"><span class="tiny">${surfaces[state.surface]}</span><h3>${h}</h3><p>${text}</p><p class="contract-strip">当前目标：${E(c.title)}<br>职责不同，上下文与状态一致。</p></div>`;}
const proofNames=['问题证据','专业产物','执行回执','结果观察'];
function renderProof(){const c=chain(),i=state.proof;$('#proof-tabs').innerHTML=proofNames.map((t,j)=>`<button id="proof-tab-${j}" role="tab" aria-controls="proof-detail" aria-selected="${j===i}" data-proof="${j}">${t}</button>`).join('');$('#proof-detail').setAttribute('aria-labelledby','proof-tab-'+i);const titles=['先看证据，再决定是否投入。','让下游收到可以执行的工作。','确认动作已经在目标平台生效。','在真实经营周期中验证结果。'];const paragraphs=[c.trigger,c.steps[Math.min(2,c.steps.length-1)][2],state.progress===5?'样例回执展示对象、版本与状态。实际材料须对应真实平台记录，不能以任务完成提示替代。':'当前未产生业务回执。可在首屏批准并完成交互演示，查看动作与读回的状态变化。',c.verify];const evidence=[c.steps[0][3],c.steps[Math.min(2,c.steps.length-1)][3],c.steps[Math.min(4,c.steps.length-1)][3],c.learning];$('#proof-detail').innerHTML=`<div><span class="tiny">${proofNames[i]} / ${i+1}</span><h3>${titles[i]}</h3><p>${E(paragraphs[i])}</p><p class="contract-strip">流程示意。实际产品界面、脱敏产物、平台动作与回执可在端到端演示中核对。</p></div><div class="evidence-sheet"><span class="tiny">EVIDENCE RECORD · 示例结构</span><dl><dt>经营目标</dt><dd>${E(c.title)}</dd><dt>材料</dt><dd>${E(evidence[i])}</dd><dt>状态</dt><dd>${i===2?(state.progress===5?'样例读回已确认':'待外部回执'):i===3?'经营结果持续观察':'演示材料'}</dd><dt>判断边界</dt><dd>${i===3?'观察窗口覆盖交付、退款与现金，不提前承诺收益。':'依据、对象与版本随目标保留。'}</dd></dl></div>`;}
function openScene(id){const s=D.scenarios.find(s=>s.id===id);if(!s)return;const a=D.assignments[id],lead=roleMap[a.lead],other=a.others.map(id=>roleMap[id]).filter(Boolean),related=D.chains.map((c,i)=>({c,i})).filter(x=>relatedScenes(x.c).has(id));dialog(`<span class="tiny">${s.id} / ${D.domains.find(d=>d.id===s.domain).name}</span><h2 id="dialog-title">${E(s.name)}</h2><p class="dialog-question">${E(s.question)}</p><div class="detail-fields"><div class="detail-full"><b>业务边界</b>${E(s.scope)}</div><div><b>解决方式与产物</b>${E(s.deliver)}</div><div><b>结果验收</b>${E(s.kpi)}</div><div><b>DSH 主责岗位</b><button class="text-btn" data-role="${lead.id}">${E(lead.name)} · ${lead.id}</button><br>${E(lead.job)}</div><div><b>协同岗位</b>${other.map(r=>`<button class="text-btn" data-role="${r.id}">${E(r.name)}</button>`).join('')}</div><div class="detail-full"><b>人类业务责任</b>${E(s.owner)}。高影响动作按对象、版本、预算与本次批准范围执行。</div></div><h4>参与的端到端经营链</h4><div class="related-list">${related.map(({c,i})=>`<button data-mission="${i}" data-from-dialog>${c.alias} · ${E(c.title)}</button>`).join('')||'<span class="muted">可按企业目标装配为经营链。</span>'}</div>`);}
function openRole(id){const r=roleMap[id];if(!r)return;const scenes=D.scenarios.filter(s=>{const a=D.assignments[s.id];return a.lead===id||a.others.includes(id);});dialog(`<span class="tiny">${r.id} / ${E(r.plane)} / ${E(r.domain)}</span><h2 id="dialog-title">${E(r.name)} · ${E(r.job)}</h2><p class="dialog-question">${E(r.deliver)}</p><div class="detail-fields"><div><b>岗位闭环</b>接收上下文与任务，调用专业技能，完成产物自检，交付给下游签收；异常返回编排与人工处理。</div><div><b>岗位技能</b>${r.count} 项绑定技能。该数量为 DSH 此岗位的技能关联，不作为去重后平台技能总数。</div><div><b>输入与职责</b>使用当前目标所需的业务数据、岗位 SOP 与许可范围，围绕“${E(r.job)}”承担专业责任。</div><div><b>标准交付</b>${E(r.deliver)}。交付携带输入依据、版本、限制与验收条件。</div></div><h4>相关业务场景</h4><div class="related-list">${scenes.map(s=>`<button data-scene="${s.id}">${s.id} ${E(s.name)}</button>`).join('')||'<span class="muted">通过组织与平台控制为经营链提供支持。</span>'}</div>`);}
function renderOperatingState(){renderCore();}
function renderMissionContext(){$$(".goal-name").forEach(x=>x.textContent=chain().title);renderCore();renderTeam();renderTrust();renderArchitecture();renderCatalog();if(state.lang!=="zh")applyLanguage(state.lang,false);}
function theme(mode) {
 mode = mode === 'light' ? 'light' : 'dark';
 document.body.dataset.theme = mode;
 document.documentElement.style.colorScheme = mode;
 document.body.style.removeProperty('--accent');
 document.body.style.removeProperty('--on-accent');
 syncThemeControl();
 const background = getComputedStyle(document.body).getPropertyValue('--bg').trim();
 $('meta[name="theme-color"]').content = background;
 document.documentElement.style.backgroundColor = background;
 try { localStorage.setItem('worldpilot-v1-appearance', JSON.stringify({mode})); } catch {}
 v1.globeRefresh?.();
}
const v1={mode:'scenes',scene:D.scenarios[0].id,mission:0,option:0,cycle:0,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,resume:false,globePaused:false,globeTime:3,globeFrame:0,globeOptIn:false,coreVisible:true};
const standardCore=[
 {zh:{title:'经营信号',summary:'发现值得进一步判断的机会、风险与异常。',description:'将市场、订单、库存、成本与客户声音整理为带来源的经营信号。',input:'市场与企业数据',output:'带来源的经营信号',stage:'经营信号'},en:{title:'Operating signals',summary:'Identify opportunities, risks, and exceptions that deserve further judgment.',description:'Organize market, order, inventory, cost, and customer voices into sourced operating signals.',input:'Market and enterprise data',output:'Sourced operating signals',stage:'Operating signals'}},
 {zh:{title:'方案比较',summary:'把经营问题整理为有依据的可选路径。',description:'比较投入、假设、资源约束、风险与停止条件，形成可审查的选项。',input:'事实、目标与历史经验',output:'可比较的方案与边界',stage:'方案比较'},en:{title:'Option comparison',summary:'Organize an operating question into grounded, comparable paths.',description:'Compare investment, hypotheses, resource constraints, risks, and stop conditions to form reviewable options.',input:'Facts, goals, and history',output:'Comparable options and boundaries',stage:'Option comparison'}},
 {zh:{title:'授权确认',summary:'明确目标、责任与本次行动范围。',description:'对象、版本、预算与时效需要由具名责任人确认，不能由页面动画替代。',input:'方案、预算与责任人',output:'待确认的行动边界',stage:'授权确认'},en:{title:'Authorization confirmation',summary:'Make the goal, accountability, and scope of this action explicit.',description:'Object, version, budget, and time window need named-accountable confirmation; a page animation cannot replace it.',input:'Options, budget, and accountable owner',output:'Action boundary awaiting confirmation',stage:'Authorization'}},
 {zh:{title:'专业协作',summary:'让专业责任围绕同一经营事项接续。',description:'由人、Native Agent 与工具在各自边界内形成可交接的专业交付。',input:'经营事项与责任分工',output:'专业交付与待处理事项',stage:'专业协作'},en:{title:'Specialist collaboration',summary:'Let specialist accountability continue around one operating matter.',description:'People, Native Agents, and tools form hand-off-ready professional deliverables within their own boundaries.',input:'Operating matter and accountability split',output:'Professional deliverables and open items',stage:'Specialist collaboration'}},
 {zh:{title:'行动承接',summary:'在目标系统已接入、范围已核准时承接获授权行动。',description:'当前页面只展示行动承接结构；它不连接业务系统，也不代表动作已执行。',input:'有效授权与专业交付',output:'等待目标系统读回',stage:'行动承接'},en:{title:'Action handoff',summary:'Hand off an authorized action only when the target system is connected and the scope is approved.',description:'This page shows the action-handoff structure only. It does not connect a business system or mean an action has executed.',input:'Valid authorization and professional deliverables',output:'Awaiting target-system readback',stage:'Action handoff'}},
 {zh:{title:'回执与结果观察',summary:'区分动作生效与经营结果观察。',description:'用目标系统的外部回执校验行动，再在约定窗口内观察经营结果。',input:'外部回执与经营数据',output:'结果观察与下一轮判断',stage:'回执与结果观察'},en:{title:'Receipts & outcome observation',summary:'Separate action effect from business-outcome observation.',description:'Use external receipts from the target system to check action, then observe business outcomes in an agreed window.',input:'External receipts and operating data',output:'Outcome observation and next judgment',stage:'Receipts & outcomes'}}
];
function scheduleV1(){
 clearTimeout(timer);if(!state.playing||document.hidden||v1.coreVisible===false)return;
 timer=setTimeout(()=>{
  if(!state.playing)return;
  if(state.progress===5){state.progress=0;state.approved=false;v1.cycle++;}else state.progress++;
  state.view=state.progress;renderOperatingState();scheduleV1();
 },state.progress===5?4400:3000);
}
function sceneSearchText(s){const a=D.assignments[s.id];return [s.id,s.name,s.scope,s.question,s.deliver,...D.aliases.filter(x=>x.targets.includes(s.id)).flatMap(x=>[x.title,x.outcome]),...[a.lead,...a.others].map(id=>roleMap[id]).filter(Boolean).flatMap(r=>[r.id,r.name,r.job])].flatMap(text=>[text,translateText(text,'en')]).join(' ').toLowerCase();}
function renderV1Explorer(){
 const q=$('#scenario-search').value.trim().toLowerCase(),isScene=v1.mode==='scenes';if(!state.domain)state.domain=D.domains[0].id;
 $$('.explorer-modes button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.exploreMode===v1.mode)));
 $('#explorer-body').setAttribute('aria-labelledby',isScene?'explore-scenes-tab':'explore-chains-tab');$('#explorer-body').classList.toggle('chain-mode',!isScene);
 $('.explorer-domains').hidden=!isScene;
 setPanelContent($('#stream-filter'),D.domains.map(d=>`<button data-explore-domain="${d.id}" aria-pressed="${state.domain===d.id&&!q}"><span>${d.id}</span><b>${d.name}</b><small>${d.count}</small></button>`).join(''));
 $('#explorer-domain-select').innerHTML=D.domains.map(d=>`<option value="${d.id}">${d.name} · ${d.count}</option>`).join('');$('#explorer-domain-select').value=state.domain;
 let rows=[];
 if(isScene){rows=D.scenarios.filter(s=>q?sceneSearchText(s).includes(q):s.domain===state.domain);if(!rows.some(x=>x.id===v1.scene))v1.scene=rows[0]?.id||'';const d=D.domains.find(d=>d.id===state.domain);$('#explorer-list-heading').innerHTML=`<span class="tiny">${q?'跨价值流搜索':d.id+' / VALUE STREAM'}</span><h3>${q?'搜索结果':d.name}</h3>`;
  setPanelContent($('#scenario-catalog'),rows.map(s=>`<button class="explore-item" data-explore-scene="${s.id}" aria-pressed="${s.id===v1.scene}"><span>${s.id}</span><b>${E(s.name)}</b>${icon('action')}</button>`).join(''));

  renderV1SceneDetail(v1.scene);
 }else{rows=D.chains.map((c,i)=>({c,i})).filter(({c,i})=>!q||[c.alias,c.id,c.title,c.question,c.trigger,c.options,D.referenceMissions[i]?.name,...c.steps.flat()].flatMap(text=>[text,translateText(text,'en')]).join(' ').toLowerCase().includes(q));if(!rows.some(x=>x.i===v1.mission))v1.mission=rows[0]?.i??-1;
  $('#explorer-list-heading').innerHTML=`<span class="tiny">END-TO-END MISSIONS</span><h3>${q?'搜索结果':'从目标进入完整经营链'}</h3>`;
  setPanelContent($('#scenario-catalog'),rows.map(({c,i})=>`<button class="explore-item" data-explore-chain="${i}" aria-pressed="${i===v1.mission}"><span>${c.alias}</span><b>${E(c.title)}</b>${icon('action')}</button>`).join(''));
  renderV1ChainDetail(v1.mission);
 }
 $('#scenario-empty').hidden=rows.length>0;

$$('.explorer-modes button').forEach(button=>button.tabIndex=button.dataset.exploreMode===v1.mode?0:-1);
}
function roleLink(id){const r=roleMap[id];return r?`<button class="text-btn" data-role="${id}">${E(r.name)} · ${id}</button>`:'';}
function revealExplorerDetail(){const el=$('#explorer-detail'),r=el.getBoundingClientRect();if(innerWidth<761||r.top<85||r.top>innerHeight*.7)el.scrollIntoView({behavior:v1.reduced?'auto':'smooth',block:'start'});}
function renderV1SceneDetail(id){
 const s=D.scenarios.find(s=>s.id===id);if(!s){setPanelContent($('#explorer-detail'),'<div class="explorer-empty"><h3>换一个关键词，继续寻找答案。</h3><p>可以搜索业务问题、经营目标或 DSH 岗位。</p></div>');return;}
 const a=D.assignments[id],related=D.chains.map((c,i)=>({c,i})).filter(x=>relatedScenes(x.c).has(id));
 setPanelContent($('#explorer-detail'),`<div class="explorer-detail-head"><span class="tiny">${s.id} / ${D.domains.find(d=>d.id===s.domain).name}</span></div><h3>${E(s.question)}</h3><p class="scene-scope">${E(s.scope)}</p><div class="scene-answer"><b>SanBao 如何推进</b><p>${E(s.deliver)}</p></div><dl class="scene-facts"><dt>如何验收</dt><dd>${E(s.kpi)}</dd><dt>DSH 主责</dt><dd>${roleLink(a.lead)}<span>${E(roleMap[a.lead].job)}</span></dd><dt>协同岗位</dt><dd>${a.others.map(roleLink).join(' ')}</dd><dt>业务责任</dt><dd>${E(s.owner)}</dd></dl><div class="scene-chains"><b>进入相关经营链</b>${related.map(({c,i})=>`<button data-explore-chain="${i}">${c.alias} · ${E(c.title)} ${icon('action')}</button>`).join('')||'<p>可按企业目标装配经营链。</p>'}</div>`);
}
function renderV1ChainDetail(idx){
 const c=D.chains[idx];if(!c){setPanelContent($('#explorer-detail'),'<div class="explorer-empty"><h3>没有匹配的经营链。</h3><p>尝试搜索新品、现金、履约或风险。</p></div>');return;}
 const workers=j=>D.teams[c.id][j].split(',').map(n=>roleLink('AGT-'+n)).join(' ');
 setPanelContent($('#explorer-detail'),`<div class="explorer-detail-head"><span class="tiny">${c.alias} / ${c.steps.length} 个阶段 / ${relatedScenes(c).size} 个关联场景</span></div><h3>${E(c.title)}</h3><p class="chain-question">${E(c.question)}</p><div class="chain-brief"><div><b>什么触发行动</b><p>${E(c.trigger)}</p></div><div><b>比较哪些方案</b><p>${E(c.options)}</p></div></div><div class="chain-steps">${c.steps.map((s,j)=>`<details class="chain-step" ${j===0?'open':''}><summary><span>${String(j+1).padStart(2,'0')}</span><b>${E(s[2])}</b>${icon('action')}</summary><div><p>${E(s[0])}</p><p><b>交付与验收：</b>${E(s[3])}</p><div class="step-roles">${workers(j)}</div></div></details>`).join('')}</div><details class="chain-contract"><summary>查看批准、结果验证与恢复机制</summary><dl><dt>人工 Gate 与执行边界</dt><dd>${E(c.gate)}</dd><dt>结果验证</dt><dd>${E(c.verify)}</dd><dt>失败与恢复</dt><dd>${E(c.recovery)}</dd><dt>反馈与知识沉淀</dt><dd>${E(c.learning)}</dd><dt>原经营链名称</dt><dd>${E(D.referenceMissions[idx].name)}<br>${E(D.referenceMissions[idx].path)}</dd></dl></details><button class="text-btn inspect-team" data-inspect-team="${idx}">查看该目标的 AI 团队 ${icon('action')}</button>`);
}

function handleV1Visibility(){if(document.hidden){v1.resume=state.playing;stop();renderCore();}else if(v1.resume){state.playing=true;renderCore();scheduleV1();v1.resume=false;}}
function initV1(){
 Object.assign(state,{view:0,progress:0,approved:false,playing:!v1.reduced});renderOperatingState();scheduleV1();initEarth();initV1Carousels();
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{v1.coreVisible=entries[0].isIntersecting;if(v1.coreVisible&&state.playing)scheduleV1();else clearTimeout(timer);},{rootMargin:'40px'}).observe($('#operating-core'));
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.capOption!==undefined){v1.option=+b.dataset.capOption;renderV1Capabilities();}
  if(b.dataset.exploreMode){v1.mode=b.dataset.exploreMode;$('#scenario-search').value='';renderV1Explorer();}
  if(b.dataset.exploreDomain){state.domain=b.dataset.exploreDomain;$('#scenario-search').value='';renderV1Explorer();}
  if(b.dataset.exploreScene){v1.scene=b.dataset.exploreScene;renderV1Explorer();revealExplorerDetail();}
  if(b.dataset.exploreChain!==undefined){v1.mode='chains';v1.mission=+b.dataset.exploreChain;$('#scenario-search').value='';renderV1Explorer();revealExplorerDetail();}
  if(b.dataset.inspectTeam!==undefined){chooseMission(+b.dataset.inspectTeam);$('#workforce').scrollIntoView({behavior:v1.reduced?'auto':'smooth'});}
  if(b.dataset.orbitGoal!==undefined){v1.mode='chains';v1.mission=+b.dataset.orbitGoal;$('#scenario-search').value='';renderV1Explorer();$('#scenarios').scrollIntoView({behavior:v1.reduced?'auto':'smooth'});}
 });
 $('#explorer-domain-select').addEventListener('change',e=>{state.domain=e.target.value;$('#scenario-search').value='';renderV1Explorer();});
}
function readGlobeMaterial(){
 const raw=getComputedStyle(document.body).getPropertyValue('--accent').trim();
 let accent=[.239,.337,.431];
 if(/^#[0-9a-f]{6}$/i.test(raw))accent=[1,3,5].map(i=>parseInt(raw.slice(i,i+2),16)/255);
 else if(/^#[0-9a-f]{3}$/i.test(raw))accent=[1,2,3].map(i=>parseInt(raw[i]+raw[i],16)/255);
 else {const rgb=raw.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);if(rgb)accent=rgb.slice(1,4).map(x=>Math.min(1,Number(x)/255));}
 const light=document.body.dataset.theme==='light',titanium=true;
 return {light,titanium,accent,key:[light,titanium,...accent].join(':')};
}
function initEarth(){
 const canvas=$('#earth-canvas'),stage=$('#globe-stage'),gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
 const textureImage=new Image();textureImage.src='{{WORLD_PILOT_ASSET:earth-texture.png}}';
 const goalLabels=[0,1,2].map((_,j)=>{const b=document.createElement('button');b.className='orbit-goal';b.innerHTML='<span class="signal-point" aria-hidden="true"></span><span class="orbit-text"><b></b><small class="orbit-kind"></small></span>';$('#orbit-goals').append(b);return b;});
 let material=readGlobeMaterial();
 let render=()=>{},ready=false,globeInView=true,last=0,lastDraw=0,lastTextureTime=-1,lastWidth=0;
 const titleShort=['新品上市与规模化经营','新市场进入与首单验证','库存、投放与现金再平衡','多渠道可售与订单增长','品牌投入与贡献利润','支付恢复、结算与关账','全球交付与到岸成本','服务恢复与客户增值','质量纠正与复发预防','账户风险与经营恢复','企业商机、回款与续约','法规变化与合规恢复','经营复盘与资源重配','独立站上线与转化','爆量承接与现金保护','产品召回与复售决定','知识产权与品牌恢复','拒付证据与资金恢复','关税、汇率与组合调整','测量恢复与预算保护','结算追索、回款与关账'];
 const labelKinds=['增长与机会','新市场进入','库存与现金','渠道与订单','品牌与利润','支付与结算','供应与交付','服务与客户','质量与改善','账户与风控','商机与回款','法规与合规','经营与资源','独立站经营','爆量与供给','产品安全','知识产权','拒付与资金','成本与组合','测量与决策','结算与回款'];
 if(gl){
  const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};
  try{
   const p=gl.createProgram();gl.attachShader(p,compile(gl.VERTEX_SHADER,'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}'));
   gl.attachShader(p,compile(gl.FRAGMENT_SHADER,`precision mediump float;
uniform vec2 size;
uniform float angle;
uniform float daylight;
uniform float titanium;
uniform vec3 accent;
uniform sampler2D earth;
void main(){
 vec2 p=(gl_FragCoord.xy-size*.5)/(min(size.x,size.y)*.455);
 float r=length(p);
 if(r>1.055){gl_FragColor=vec4(0.0);return;}
 if(r>1.0){
  float glow=pow(max(0.0,1.0-(r-1.0)/.055),3.0);
  gl_FragColor=daylight>.5?vec4(.48,.65,.79,glow*.10):(titanium>.5?vec4(.30,.46,.61,glow*.16):vec4(.12,.44,.69,glow*.28));
  return;
 }
 vec3 n=vec3(p,sqrt(max(0.0,1.0-dot(p,p))));
 vec2 uv=vec2(fract(atan(n.x,n.z)/6.2831853+.5+angle/6.2831853),.5-asin(n.y)/3.1415927);
 vec3 tex=texture2D(earth,uv).rgb;
 float diffuse=max(0.0,dot(n,normalize(vec3(-.5,.4,1.0))));
 vec3 color;
 if(daylight>.5){
  // A cool daylight material: ocean blue, silver-white relief, subtle city accents.
  float terrain=smoothstep(.075,.24,dot(tex,vec3(.2126,.7152,.0722)));
  float city=smoothstep(.02,.25,tex.r-tex.b);
  vec3 surface=mix(vec3(.70,.82,.91),vec3(.94,.965,.98),terrain);
  surface=mix(surface,accent,city*.28);
  color=surface*(.88+.14*diffuse);
  color=mix(color,vec3(.80,.90,.97),pow(1.0-n.z,3.0)*.30);
 }else{
  if(titanium>.5){
   float city=smoothstep(.02,.25,tex.r-tex.b);
   float luminance=dot(tex,vec3(.2126,.7152,.0722));
   tex=mix(tex,vec3(.87,.95,1.0)*luminance*1.12,city);
  }
  float light=.48+.8*diffuse;
  vec3 rim=vec3(.12,.37,.6)*pow(1.0-n.z,3.0)*.48;
  color=tex*light+rim;
 }
 gl_FragColor=vec4(color,1.0-smoothstep(.997,1.0,r));
}`));
   gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));gl.useProgram(p);
   const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const a=gl.getAttribLocation(p,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
   const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
   const size=gl.getUniformLocation(p,'size'),angle=gl.getUniformLocation(p,'angle'),daylight=gl.getUniformLocation(p,'daylight'),accent=gl.getUniformLocation(p,'accent'),titanium=gl.getUniformLocation(p,'titanium');
   textureImage.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,textureImage);ready=true;stage.dataset.render='webgl';};
   render=t=>{const w=Math.min(1000,Math.round(stage.clientWidth*Math.min(devicePixelRatio,1.25))),h=Math.round(w*stage.clientHeight/stage.clientWidth);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}gl.useProgram(p);gl.uniform2f(size,w,h);gl.uniform1f(angle,t*.065-.24);gl.uniform1f(daylight,material.light?1:0);gl.uniform1f(titanium,material.titanium?1:0);gl.uniform3fv(accent,material.accent);gl.drawArrays(gl.TRIANGLES,0,6);};
   canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;});
  }catch(error){stage.dataset.render='fallback';stage.dataset.renderReason=String(error.message);}
 }
 if(!gl||stage.dataset.render==='fallback'){
  const cpuCanvas=document.createElement('canvas');cpuCanvas.id='earth-canvas';cpuCanvas.setAttribute('role','img');cpuCanvas.setAttribute('aria-label','持续转动的地球，展示全球经营目标');canvas.replaceWith(cpuCanvas);
  const ctx=cpuCanvas.getContext('2d'),res=innerWidth<761?360:480;
  cpuCanvas.width=cpuCanvas.height=res;stage.dataset.render='canvas-sphere';
  if(!gl)stage.dataset.renderReason='WebGL unavailable; spherical Canvas renderer enabled';
  let loaded=false;
  const load=()=>{
   if(loaded)return;loaded=true;
   const src=document.createElement('canvas');src.width=textureImage.naturalWidth;src.height=textureImage.naturalHeight;
   const sctx=src.getContext('2d',{willReadFrequently:true});sctx.drawImage(textureImage,0,0);
   const pixels=sctx.getImageData(0,0,src.width,src.height).data,frame=ctx.createImageData(res,res),pts=[],halo=[];
   for(let y=0;y<res;y++)for(let x=0;x<res;x++){
    const nx=(x+.5-res/2)/(res*.455),ny=(res/2-y-.5)/(res*.455),r2=nx*nx+ny*ny,at=(y*res+x)*4;
    if(r2>1.112)continue;
    if(r2>1){halo.push([at,Math.pow(Math.max(0,1-(Math.sqrt(r2)-1)/.055),3)]);continue;}
    const z=Math.sqrt(1-r2),u=(Math.atan2(nx,z)/(2*Math.PI)+.5)*src.width;
    const v=Math.min(src.height-1,Math.floor((.5-Math.asin(ny)/Math.PI)*src.height)),diffuse=Math.max(0,(-nx*.5+ny*.4+z)/1.1874),edge=Math.pow(1-z,3);
    pts.push([at,u,v*src.width,.48+.8*diffuse,edge*.48,.88+.14*diffuse,edge*.30]);
    frame.data[at+3]=Math.round(255*Math.min(1,(1-Math.sqrt(r2))/.003));
   }
   let paletteKey='',dayPixels=null,nightPixels=pixels;
   const oceanColor=[.70,.82,.91],landColor=[.94,.965,.98],rimColor=[204,229.5,247.35];
   const smooth=(lo,hi,value)=>{const t=Math.min(1,Math.max(0,(value-lo)/(hi-lo)));return t*t*(3-2*t);};
   render=t=>{
    if(paletteKey!==material.key){
     paletteKey=material.key;
     if(material.light){
      dayPixels=new Uint8ClampedArray(pixels.length);
      for(let i=0;i<pixels.length;i+=4){
       const terrain=smooth(.075,.24,(pixels[i]*.2126+pixels[i+1]*.7152+pixels[i+2]*.0722)/255);
       const city=smooth(.02,.25,(pixels[i]-pixels[i+2])/255)*.28;
       for(let c=0;c<3;c++){
        const ocean=oceanColor[c],land=landColor[c],surface=ocean+(land-ocean)*terrain;
        dayPixels[i+c]=(surface+(material.accent[c]-surface)*city)*255;
       }
      }
     }
     if(!material.light&&material.titanium){
      nightPixels=new Uint8ClampedArray(pixels.length);
      const reflection=[.87,.95,1.0];
      for(let i=0;i<pixels.length;i+=4){
       const city=smooth(.02,.25,(pixels[i]-pixels[i+2])/255);
       const luminance=(pixels[i]*.2126+pixels[i+1]*.7152+pixels[i+2]*.0722)*1.12;
       for(let c=0;c<3;c++)nightPixels[i+c]=pixels[i+c]+(luminance*reflection[c]-pixels[i+c])*city;
      }
     }else nightPixels=pixels;
     halo.forEach(([at,glow])=>{
      const rgb=material.light?[122,166,201]:material.titanium?[76.5,117.3,155.55]:[31,112,176];
      frame.data[at]=rgb[0];frame.data[at+1]=rgb[1];frame.data[at+2]=rgb[2];frame.data[at+3]=Math.round(glow*(material.light?25.5:material.titanium?40.8:71));
     });
    }
    const shift=(t*.065-.24)/(2*Math.PI)*src.width;
    for(let j=0;j<pts.length;j++){
     const p=pts[j],sx=((Math.floor(p[1]+shift)%src.width)+src.width)%src.width,from=(p[2]+sx)*4;
     if(material.light){
      for(let c=0;c<3;c++){const base=dayPixels[from+c]*p[5];frame.data[p[0]+c]=base+(rimColor[c]-base)*p[6];}
     }else{
      frame.data[p[0]]=nightPixels[from]*p[3]+31*p[4];frame.data[p[0]+1]=nightPixels[from+1]*p[3]+94*p[4];frame.data[p[0]+2]=nightPixels[from+2]*p[3]+153*p[4];
     }
    }
    ctx.putImageData(frame,0,0);
   };
   ready=true;
  };
  textureImage.addEventListener('load',load,{once:true});if(textureImage.complete&&textureImage.naturalWidth)load();
 }
 const draw=now=>{
 v1.globeFrame=0;
 if(document.hidden||!globeInView){last=0;return;}
 const focused=$('#orbit-goals').contains(document.activeElement);
 const moving=!v1.globePaused&&(!v1.reduced||v1.globeOptIn)&&!focused;
 const delta=last?Math.min((now-last)/1000,.08):0;last=now;
 if(moving)v1.globeTime+=delta;
 if(moving&&now-lastDraw<50){v1.globeFrame=requestAnimationFrame(draw);return;}
 lastDraw=now;
 const t=v1.globeTime;if(ready&&(t!==lastTextureTime||stage.clientWidth!==lastWidth)){render(t);lastTextureTime=t;lastWidth=stage.clientWidth;}if(stage.dataset.rotation!==t.toFixed(2))stage.dataset.rotation=t.toFixed(2);
  goalLabels.forEach((b,j)=>{const age=(t+j*6)%18,round=Math.floor((t+j*6)/18),idx=(round*3+j*7)%D.chains.length,lon=.78-age*.087,lat=[.49,-.05,-.52][j],w=stage.clientWidth,h=stage.clientHeight,r=Math.min(w,h)*.455,rawX=w*.5+Math.sin(lon)*Math.cos(lat)*r,half=b.offsetWidth/2,edge=innerWidth<761?24:40,left=stage.getBoundingClientRect().left,x=Math.max(edge-left+half,Math.min(innerWidth-edge-left-half,rawX)),y=h*.5-Math.sin(lat)*r;const opacity=v1.reduced?1:Math.min(1,age/1.2,(18-age)/1.2);b.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%)`;b.style.opacity=String(opacity);b.dataset.lit=String(age>2&&age<10);b.style.setProperty('--signal-intensity',String(.48+.52*Math.max(0,1-Math.abs(age-6)/6)));b.style.visibility=opacity<.05?'hidden':'visible';if(b.dataset.orbitGoal!==String(idx)){b.dataset.orbitGoal=String(idx);b.querySelector('.orbit-kind').textContent=labelKinds[idx];b.querySelector('b').textContent=titleShort[idx];b.setAttribute('aria-label',titleShort[idx]+'，查看经营链');}});

if(moving)v1.globeFrame=requestAnimationFrame(draw);
};
 const wake=()=>{if(!document.hidden&&globeInView&&!v1.globeFrame){last=0;v1.globeFrame=requestAnimationFrame(draw);}};
 const suspend=()=>{cancelAnimationFrame(v1.globeFrame);v1.globeFrame=0;last=0;};
 v1.globeRefresh=()=>{material=readGlobeMaterial();lastTextureTime=-1;wake();};
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{globeInView=entries[0].isIntersecting;if(globeInView)wake();else suspend();},{rootMargin:'100px'}).observe(stage);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();else wake();});
 stage.addEventListener('focusin',()=>{suspend();wake();});
 stage.addEventListener('focusout',()=>queueMicrotask(wake));
 textureImage.addEventListener('load',()=>v1.globeRefresh());
 window.addEventListener('resize',()=>v1.globeRefresh());
 window.addEventListener('pageshow',wake);
 window.addEventListener('pagehide',suspend);
 if(v1.reduced)v1.globePaused=true;
 wake();
}

// Homepage narrative: business flow and capability evidence, independent of team playback.
state.arch=0;
function renderV1Core(){
 const i=state.view,c=standardCore[i][state.lang==='en'?'en':'zh'],track=$('#core-stage-buttons'),copy=brandCopy[state.lang==='en'?'en':'zh'];
 if(!track.children.length)track.innerHTML=standardCore.map((s,j)=>`<button class="flow-step" data-core-stage="${j}" aria-pressed="false"><span class="flow-node">${String(j+1).padStart(2,'0')}</span><b>${s[state.lang==='en'?'en':'zh'].stage}</b></button>`).join('');
 [...track.children].forEach((b,j)=>{b.classList.toggle('active',i===j);b.classList.toggle('done',j<state.progress);b.setAttribute('aria-pressed',String(i===j));b.querySelector('b').textContent=standardCore[j][state.lang==='en'?'en':'zh'].stage;});
 track.style.setProperty('--flow-progress',String(state.progress/5));
 setPanelContent($('#core-panel'),`<div class="flow-current"><span>${String(i+1).padStart(2,'0')}</span><p>${c.summary}</p></div><div class="flow-result">${i===2?`<span class="tag">${copy.core.demoTag}</span>`:`<span>${icon(i===5?'receipt':stageIcons[i])}${c.output}</span>`}</div>`);
 $('#core-panel').dataset.status=state.approved?'demo-approved':'demo-running';$('#core-panel').dataset.stage=String(i);
 $('#operating-core').classList.toggle('is-playing',state.playing);$('#operating-core').dataset.cycle=String(v1.cycle);
 document.body.dataset.approved=String(state.approved);
}
const capabilitySteps=[
 {icon:'receipt',zh:{name:'外部回执',eyebrow:'EXTERNAL RECEIPTS',title:'外部状态，是行动验收的依据。',text:'目标系统已接入且行动获得有效授权时，才可将对象、版本与状态读回，用于区分平台受理、实际生效与待确认。',type:'行动验收结构',rows:[['对象一致','核对平台、账户与经营对象'],['版本一致','比对获批版本与实际变更'],['状态读回','保留生效、部分成功与异常证据'],['异常恢复','依据真实状态协调重试、补偿与接管']]},en:{name:'External receipts',eyebrow:'EXTERNAL RECEIPTS',title:'External state is the basis for action acceptance.',text:'Only when a target system is connected and an action has valid authorization can its object, version, and state be read back, distinguishing platform acceptance, actual effect, and pending confirmation.',type:'Action-acceptance structure',rows:[['Object match','Check platform, account, and operating object'],['Version match','Compare the approved version with the applied change'],['State readback','Preserve evidence of effect, partial success, and exceptions'],['Exception recovery','Coordinate retry, compensation, and takeover from real state']]}},
 {icon:'outcome',zh:{name:'经营结果',eyebrow:'OUTCOME OBSERVATION',title:'动作生效后，继续观察经营结果。',text:'把订单、交付、退款、贡献利润与现金关联到同一经营事项，在约定观察窗口内检验假设，为继续、调整或停止提供依据。',type:'结果观察',rows:[['关联结果','连接交易、交付与真实回款'],['统一口径','匹配同一商品、渠道与订单队列'],['完整观察','覆盖履约、退款与资金回收周期'],['反馈决策','根据贡献与现金结果调整经营方案']]},en:{name:'Operating outcomes',eyebrow:'OUTCOME OBSERVATION',title:'After action takes effect, continue to observe operating outcomes.',text:'Relate orders, fulfillment, refunds, contribution margin, and cash to the same operating matter. Test hypotheses in an agreed observation window to inform continuation, adjustment, or stop.',type:'Outcome observation',rows:[['Related outcomes','Connect transactions, fulfillment, and real cash collection'],['Consistent definition','Match the same product, channel, and order cohort'],['Complete observation','Cover fulfillment, refunds, and cash-recovery cycles'],['Feedback judgment','Adjust the operating option using contribution and cash outcomes']]}},
 {icon:'skill',zh:{name:'持续进化',eyebrow:'CONTINUOUS LEARNING',title:'让经过验证的经营经验服务下一轮判断。',text:'将外部证据、决策依据与结果归因沉淀为可审查的经验；经评测与版本审查后，才用于改进后续协作方式。',type:'可复用经验',rows:[['事实更新','平台状态与经营证据写回对象'],['经验沉淀','保留成功、失败与例外的决策依据'],['受控改进','通过评测与审查更新协作方式'],['持续验证','在后续经营结果中检验改进效果']]},en:{name:'Continuous learning',eyebrow:'CONTINUOUS LEARNING',title:'Let validated operating experience serve the next judgment.',text:'Retain external evidence, decision grounds, and outcome attribution as reviewable experience. Use it to improve future collaboration only after evaluation and version review.',type:'Reusable experience',rows:[['Fact updates','Write platform state and operating evidence back to the object'],['Experience retained','Keep the grounds behind success, failure, and exceptions'],['Controlled improvement','Update ways of collaborating through evaluation and review'],['Ongoing validation','Test improvements in later operating outcomes']]}}
];
function renderV1Capabilities(){
 const locale=state.lang==='en'?'en':'zh',opts=locale==='en'?
  [['Validate demand and contribution before committing to an investment pace.','Budget ceiling · validation window · stop condition','Smallest validation plan and acceptance criteria'],['Scale only when demand evidence and supply capability are sufficient.','Supply capability · cash tied up · marginal contribution','Phased investment plan and budget boundary'],['Fill critical evidence gaps before making a resource commitment.','Hypotheses to validate · accountable owner · reassessment time','Evidence checklist and continue / stop conditions']]:
  [['先验证需求与贡献，再决定投入节奏。','预算上限 · 验证窗口 · 停止条件','最小验证方案与验收标准'],['在需求证据和供给能力足够时加快放量。','供货能力 · 现金占用 · 边际贡献','分阶段投入方案与预算边界'],['先补足关键证据，再做资源承诺。','待验证假设 · 责任人 · 再评估时间','补证清单与继续 / 停止条件']],o=opts[v1.option],fields=brandCopy[locale].architecture.decisionFields;
 $('[data-cap-option="0"]').parentElement.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===v1.option)));
 setPanelContent($('#decision-preview'),`<p>${o[0]}</p><dl><dt>${fields[0]}</dt><dd>${o[1]}</dd><dt>${fields[1]}</dt><dd>${o[2]}</dd></dl>`);
 const tabs=$('#architecture-tabs');if(!tabs.children.length)tabs.innerHTML=capabilitySteps.map((x,i)=>`<button role="tab" id="arch-tab-${i}" aria-controls="architecture-detail" aria-selected="false" data-arch="${i}">${icon(x.icon)}<span>${x[locale].name}</span><small>0${i+1}</small></button>`).join('');
 [...tabs.children].forEach((b,i)=>{b.setAttribute('aria-selected',String(i===state.arch));b.querySelector('span').textContent=capabilitySteps[i][locale].name;});
 const x=capabilitySteps[state.arch][locale],detail=$('#architecture-detail');detail.setAttribute('aria-labelledby','arch-tab-'+state.arch);
 setPanelContent(detail,`<div class="action-story"><span class="tiny">${x.eyebrow}</span><h4>${x.title}</h4><p>${x.text}</p></div><div class="evidence-spec"><div class="artifact-label"><b>${x.type}</b></div><dl>${x.rows.map(r=>`<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')}</dl></div>`);

[...tabs.children].forEach((button,index)=>button.tabIndex=index===state.arch?0:-1);
}

// Both carousels preserve every calibrated role and stop while the visitor reads or interacts.
const carousels={};let rolePage=0,rolePageSize=5;
const carouselInView=el=>{const rect=el.getBoundingClientRect();return rect.bottom>0&&rect.top<innerHeight&&rect.right>0&&rect.left<innerWidth;};
const roleSize=()=>innerWidth<540?1:innerWidth<761?2:innerWidth<1050?3:innerWidth<1250?4:5;
function renderV1Team(){
 const c=chain(),idx=Math.min(state.teamStage,c.steps.length-1),rows=team(idx),step=c.steps[idx],tabs=$('#team-stage-tabs');
 if(tabs.dataset.mission!==String(state.mission)){tabs.innerHTML=c.steps.map((s,i)=>`<button class="team-stage-label" data-team-stage="${i}" aria-pressed="false"><b>${state.mission===0?teamStageNames[i]:E(s[2])}</b></button>`).join('');tabs.dataset.mission=String(state.mission);}
 tabs.style.setProperty('--team-stages',String(c.steps.length));
 [...tabs.children].forEach((b,i)=>{b.classList.toggle('active',i===idx);b.setAttribute('aria-pressed',String(i===idx));});
 $('#team-carousel').dataset.slide=String(idx);$('#team-carousel').dataset.mission=c.alias;
 setPanelContent($('#team-delivery'),`<div class="stage-marker"><p>${state.mission===0?teamStageNames[idx]:'阶段交付 '+(idx+1)}<small>${E(step[0])}</small></p></div><h3>${E(step[2])}</h3><p class="team-acceptance">${E(step[3])}</p><div class="team-next"><span>交付下一棒</span><strong>${idx<c.steps.length-1?names(team(idx+1)):'经营负责人复盘'}</strong></div>`);
 setPanelContent($('#team-members'),`<p class="tiny">本阶段专业岗位 / ${rows.length}</p>`+rows.map(r=>`<button class="person" data-role="${r.id}" aria-label="查看 ${r.name} 的岗位职责">${icon('agent')}<span class="person-name"><b>${E(r.name)}</b><small>${r.id}</small></span><span class="person-job">${E(r.job)}<small>${E(r.deliver)}</small></span>${icon('action')}</button>`).join(''));
 if(carousels.team)scheduleCarousel('team');
}
function renderV1Roles(){
 $('#role-directory').innerHTML=D.roles.map(r=>`<button data-role="${r.id}" class="role-entry"><span class="role-meta">${E(r.domain)}<small>${r.id}</small></span><span class="role-identity">${icon('agent')}<b>${E(r.name)}</b></span><strong>${E(r.job)}</strong><span class="role-output">${E(r.deliver)}</span><span class="role-skills">${r.count} 项岗位技能${icon('action')}</span></button>`).join('');
 rolePageSize=roleSize();renderRolePage();
}
function renderRolePage() {
 const total = Math.ceil(D.roles.length / rolePageSize);
 const previous = Number($('#roles-carousel').dataset.page || 0);
 rolePage = (rolePage + total) % total;
 const first = rolePage * rolePageSize, last = Math.min(D.roles.length, first + rolePageSize), track = $('#role-directory');
 const wrap = Math.abs(previous-rolePage) > 1;
 if (wrap) track.style.transition = 'none';
 track.style.setProperty('--role-columns', String(rolePageSize));
 track.style.transform = `translateX(-${rolePage*100}%)`;
 [...track.children].forEach((el,i) => {
  const visible = i >= first && i < last;
  el.inert = !visible;
  el.setAttribute('aria-hidden', String(!visible));
  el.tabIndex = visible ? 0 : -1;
 });
 $('#roles-carousel').dataset.page = String(rolePage);
 $('#roles-carousel').dataset.pageSize = String(rolePageSize);
 if (wrap) {
  animateUX($('.role-viewport'), 0, 260);
  requestAnimationFrame(() => requestAnimationFrame(() => track.style.removeProperty('transition')));
 }
 if (carousels.roles) { carousels.roles.hover = false; scheduleCarousel('roles'); }
}
function scheduleCarousel(name) {
 const x = carousels[name];
 if (!x) return;
 clearTimeout(x.timer);x.timer=null;
 x.progressMotion?.cancel();x.progressMotion=null;
 const canRun=()=>!document.hidden&&!x.suspended&&x.visible&&!x.hover&&!x.focus&&!x.paused&&!x.dragging&&!$('dialog[open]');
 const active=canRun();
 x.el.dataset.running = String(active);
 if (!active) return;
 const delay = Math.max(name==='roles'&&!x.hasAdvanced?1200:x.delay, (x.notBefore || 0) - performance.now());
 const progress=x.el.querySelector('.role-progress span');
 if(progress?.animate&&!v1.reduced)x.progressMotion=progress.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:delay,easing:'linear',fill:'forwards'});
 x.timer = setTimeout(() => {
  x.timer=null;
  if (!canRun()) { scheduleCarousel(name); return; }
  x.hasAdvanced=true;
  x.advance();
  scheduleCarousel(name);
 }, delay);
}
function initV1Carousels() {
 const specs = [
  ['team',8500,()=>{state.teamStage=(state.teamStage+1)%chain().steps.length;renderV1Team();}],
  ['roles',3600,()=>{rolePage++;renderRolePage();}]
 ];
 specs.forEach(([name,delay,advance]) => {
  const el = $('#'+name+'-carousel'), viewport = el.querySelector(name==='roles'?'.role-viewport':'.team-film');
  const track = name==='roles'?$('#role-directory'):viewport;
  const x = carousels[name] = {el,delay,advance,visible:carouselInView(el),hover:false,focus:false,paused:false,dragging:false,suspended:false,notBefore:0,timer:null,hasAdvanced:false,restoredPointerFocus:null,progressMotion:null};
  let gesture = null, suppressUntil = 0, wheelTotal = 0, wheelAt = -1000;
  const hold = () => { x.notBefore = performance.now()+8000; };
  const move = direction => {
   hold();
   if (name==='roles') {
    const keyboard = el.contains(document.activeElement) && document.activeElement.matches(':focus-visible');
    rolePage += direction;
    renderRolePage();
    if (keyboard) el.focus({preventScroll:true});
   } else { state.teamStage=(state.teamStage+direction+chain().steps.length)%chain().steps.length;renderV1Team(); }
   scheduleCarousel(name);
  };
  const restore = () => {
   track.style.removeProperty('transition');
   track.style.transform = name==='roles'?`translateX(-${rolePage*100}%)`:'';
   el.classList.remove('ux-dragging');
   x.dragging = false;
  };
  const resetGesture=()=>{
   const pointerId=gesture?.id;gesture=null;
   if(pointerId!==undefined&&viewport.hasPointerCapture?.(pointerId))viewport.releasePointerCapture(pointerId);
   restore();x.hover=false;
  };
  x.resetGesture=resetGesture;
  el.addEventListener('keydown',e => {
   if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
   e.preventDefault();
   const stage = e.target.closest('[data-team-stage]');
   if (name==='team' && stage) {
    const count=chain().steps.length, current=Number(stage.dataset.teamStage);
    state.teamStage=e.key==='Home'?0:e.key==='End'?count-1:(current+(e.key==='ArrowRight'?1:-1)+count)%count;
    hold();renderV1Team();$('[data-team-stage="'+state.teamStage+'"]').focus();
   } else if (e.key==='Home'||e.key==='End') {
    const target=e.key==='Home'?0:Math.ceil(D.roles.length/rolePageSize)-1;
    if(name==='roles')move(target-rolePage);
    else move((e.key==='Home'?0:chain().steps.length-1)-state.teamStage);
   } else move(e.key==='ArrowRight'?1:-1);
  });
  viewport.addEventListener('pointerdown',e => {
   if ((e.pointerType==='mouse' && e.button!==0) || gesture) return;
   gesture={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastAt:performance.now(),velocity:0,locked:false};
   x.dragging=true;scheduleCarousel(name);
  });
  viewport.addEventListener('pointermove',e => {
   if (!gesture || e.pointerId!==gesture.id) return;
   const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
   if (!gesture.locked) {
    if (Math.abs(dy)>12 && Math.abs(dy)>Math.abs(dx)*1.2) {gesture=null;restore();scheduleCarousel(name);return;}
    if (Math.abs(dx)<10 || Math.abs(dx)<Math.abs(dy)*1.2) return;
    gesture.locked=true;
    viewport.setPointerCapture?.(e.pointerId);
    el.classList.add('ux-dragging');track.style.transition='none';
   }
   e.preventDefault();
   const at=performance.now(),delta=at-gesture.lastAt;
   if(delta>0)gesture.velocity=(e.clientX-gesture.lastX)/delta;
   gesture.lastX=e.clientX;gesture.lastAt=at;
   const distance=Math.max(-viewport.clientWidth*.8,Math.min(viewport.clientWidth*.8,dx));
   track.style.transform=name==='roles'?`translateX(calc(-${rolePage*100}% + ${distance}px))`:`translateX(${Math.max(-20,Math.min(20,dx*.12))}px)`;
  });
  const finish=e => {
   if(!gesture || e.pointerId!==gesture.id)return;
   const g=gesture,dx=e.clientX-g.x,cancelled=e.type==='pointercancel';gesture=null;
   if(viewport.hasPointerCapture?.(e.pointerId))viewport.releasePointerCapture(e.pointerId);
   restore();
   if(g.locked){
    suppressUntil=performance.now()+400;
    const threshold=Math.max(35,Math.min(90,viewport.clientWidth*.14));
    if(!cancelled && (Math.abs(dx)>threshold || (Math.abs(dx)>24 && Math.abs(g.velocity)>.5)))move(dx<0?1:-1);
    else {hold();scheduleCarousel(name);}
   } else scheduleCarousel(name);
  };
  window.addEventListener('pointerup',finish);
  window.addEventListener('pointercancel',finish);
  viewport.addEventListener('lostpointercapture',e=>{if(gesture?.id===e.pointerId){gesture=null;restore();scheduleCarousel(name);}});
  el.addEventListener('click',e=>{if(performance.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
  viewport.addEventListener('wheel',e=>{
   const horizontal=e.shiftKey && Math.abs(e.deltaY)>Math.abs(e.deltaX)?e.deltaY:e.deltaX;
   if(!horizontal || (!e.shiftKey && Math.abs(e.deltaX)<Math.abs(e.deltaY)*1.2))return;
   e.preventDefault();
   const at=performance.now();if(at-wheelAt<480)return;
   wheelTotal+=horizontal*(e.deltaMode===1?16:1);
   if(Math.abs(wheelTotal)>=65){move(wheelTotal>0?1:-1);wheelTotal=0;wheelAt=at;}
  },{passive:false});
  const readingTarget=e=>name==='team'?e?.closest?.('.person'):null;
  el.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse')return;const reading=!!readingTarget(e.target);if(x.hover!==reading){x.hover=reading;scheduleCarousel(name);}});
  el.addEventListener('pointerout',e=>{if(e.pointerType!=='mouse')return;const reading=el.contains(e.relatedTarget)&&!!readingTarget(e.relatedTarget);if(x.hover!==reading){x.hover=reading;scheduleCarousel(name);}});
  const syncFocus=()=>{const active=document.activeElement;if(active!==x.restoredPointerFocus&&!$('dialog[open]'))x.restoredPointerFocus=null;x.focus=el.contains(active)&&active!==x.restoredPointerFocus&&active.matches(':focus-visible');scheduleCarousel(name);};
  el.addEventListener('focusin',syncFocus);
  el.addEventListener('focusout',()=>queueMicrotask(syncFocus));
  el.addEventListener('pointerdown',()=>{x.restoredPointerFocus=null;x.focus=false;});
  el.addEventListener('click',()=>queueMicrotask(syncFocus));
  el.addEventListener('keydown',()=>{x.restoredPointerFocus=null;x.focus=true;scheduleCarousel(name);});
  x.syncFocus=syncFocus;
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{x.visible=entries[0].isIntersecting;scheduleCarousel(name);},{threshold:.12}).observe(el);
  scheduleCarousel(name);
 });
 const recoverCarousels=(resume=false)=>Object.entries(carousels).forEach(([name,x])=>{
  x.resetGesture();
  if(resume){x.suspended=false;x.visible=carouselInView(x.el);}
  x.syncFocus();
 });
 document.addEventListener('visibilitychange',()=>recoverCarousels(!document.hidden));
 window.addEventListener('blur',()=>recoverCarousels());
 window.addEventListener('pageshow',()=>recoverCarousels(true));
 const modalState=new MutationObserver(()=>Object.keys(carousels).forEach(scheduleCarousel));
 document.querySelectorAll('dialog').forEach(dialog=>{
  modalState.observe(dialog,{attributes:true,attributeFilter:['open']});
  dialog.addEventListener('close',()=>queueMicrotask(()=>Object.values(carousels).forEach(x=>x.syncFocus())));
 });
 window.addEventListener('resize',()=>{
  const size=roleSize();
  if(size!==rolePageSize){rolePage=Math.floor(rolePage*rolePageSize/size);rolePageSize=size;renderRolePage();}
 });
 window.addEventListener('pagehide',()=>Object.entries(carousels).forEach(([name,x])=>{x.suspended=true;x.resetGesture();scheduleCarousel(name);}));
}

try { const saved = JSON.parse(localStorage.getItem('worldpilot-v1-appearance')); if(saved && ['light','dark'].includes(saved.mode)) { document.body.dataset.theme=saved.mode; } } catch {}
const start=new URL(location.href).searchParams;const initial=D.chains.findIndex(c=>c.alias===start.get('mission'));if(initial>=0)state.mission=initial;
renderSelectors();renderRoles();renderAllMissions();renderMissionContext();theme(document.body.dataset.theme);
document.addEventListener('click',e=>{const t=e.target.closest('button,a');if(!t)return;
 if(t.hasAttribute('data-close')){t.closest('dialog').close();return;}
 if(t.hasAttribute('data-book')){closeDialogs();$('#mobile-nav').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');setTimeout(()=>$('#demo-form [name=company]').focus({preventScroll:true}),100);return;}
 if(t.hasAttribute('data-download')){e.preventDefault();closeDialogs();$('#download').showModal();return;}
 if(t.dataset.scene){if($('#detail-dialog').open)$('#detail-dialog').close();openScene(t.dataset.scene);return;}
 if(t.dataset.role){if($('#detail-dialog').open)$('#detail-dialog').close();openRole(t.dataset.role);return;}
 if(t.dataset.mission!==undefined){chooseMission(+t.dataset.mission,true);if(t.hasAttribute('data-from-dialog')){closeDialogs();$('#scenarios').scrollIntoView({behavior:'smooth'});}return;}
 if(t.dataset.coreStage!==undefined){clearTimeout(timer);state.view=+t.dataset.coreStage;state.progress=state.view;state.approved=false;state.playing=!v1.reduced;renderCore();schedule();return;}
 if(t.hasAttribute('data-next-core')){stop();state.progress=Math.min(5,state.progress+1);state.view=state.progress;state.approved=false;renderOperatingState();return;}
 if(t.hasAttribute('data-reset-core')){chooseMission(state.mission);return;}
 if(t.dataset.arch!==undefined){state.arch=+t.dataset.arch;renderArchitecture();return;}
 if(t.dataset.teamStage!==undefined){state.teamStage=+t.dataset.teamStage;renderTeam();return;}
 if(t.dataset.exec!==undefined){state.exec=+t.dataset.exec;renderExecution();return;}
 if(t.dataset.stream!==undefined){state.domain=t.dataset.stream;filterScenes();return;}
 if(t.dataset.trust!==undefined){state.trust=+t.dataset.trust;renderTrust();return;}
 if(t.dataset.surface!==undefined){state.surface=+t.dataset.surface;renderSurface();return;}
 if(t.dataset.proof!==undefined){state.proof=+t.dataset.proof;renderProof();return;}
 if(t.hasAttribute('data-return-core')){$('#positioning').scrollIntoView({behavior:'smooth'});state.view=2;renderCore();return;}
 if(t.dataset.workstream!==undefined){const w=D.workstreams[+t.dataset.workstream];dialog(`<h2 id="dialog-title">${E(w.name)}</h2><p>${E(w.text)}</p><p class="muted">工作流分组连接下列真实 DSH 岗位。每位岗位均有自己的职责与标准交付。</p><div class="related-list">${w.ids.map(id=>`<button data-role="${id}">${roleMap[id].name} · ${id}</button>`).join('')}</div>`);return;}
 if(t.hasAttribute('data-control')){dialog('<h2 id="dialog-title">跨场景异常感知与调度</h2><p class="dialog-question">哪些变化需要调整判断、任务或责任？</p><p>比较经营事实与目标护栏，定位影响的业务对象和经营链。枢衡协调依赖与异常，明镜提供归因证据；目标、资源与停止条件变化后返回具名负责人确认。</p><p class="muted">这是贯穿价值流的控制能力，关联经营复盘、方案推演与异常接管。</p>');return;}
 if(t.hasAttribute('data-theme-toggle')){theme(document.body.dataset.theme === 'dark' ? 'light' : 'dark');closeSettingsMenus();return;}
 if(t.dataset.language){applyLanguage(t.dataset.language);closeSettingsMenus(true,t.closest('details'));return;}
 if(t.classList.contains('menu-toggle')){const open=$('#mobile-nav').hidden;$('#mobile-nav').hidden=!open;t.setAttribute('aria-expanded',String(open));return;}
 if(t.closest('#mobile-nav')){$('#mobile-nav').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');}
});
$$('.mission-selector').forEach(el=>el.addEventListener('change',()=>chooseMission(+el.value,true)));$('#scenario-search').addEventListener('input',queueSceneFilter);$('#lang').addEventListener('change',e=>applyLanguage(e.target.value));
$$('[role=tablist]').forEach(list=>list.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;const tabs=[...list.querySelectorAll('[role=tab]')],idx=tabs.indexOf(document.activeElement);if(idx<0)return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(idx+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+tabs.length)%tabs.length;tabs[next].click();list.querySelectorAll('[role=tab]')[next]?.focus();}));
$$('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});d.addEventListener('close',()=>{if(!dialogOpener?.isConnected)return;Object.values(carousels).forEach(x=>{if(x.el.contains(dialogOpener))x.restoredPointerFocus=dialogOpenerKeyboard?null:dialogOpener;});dialogOpener.focus({preventScroll:true});queueMicrotask(()=>Object.values(carousels).forEach(x=>x.syncFocus()));});});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#mobile-nav').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');closeSettingsMenus();}});
$('#demo-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;const data=new FormData(f),out=$('#demo-result'),copy=brandCopy[state.lang==='en'?'en':'zh'].demo;out.hidden=false;const message=document.createElement('span'),details=document.createElement('span');message.dataset.i18nSkip='';message.textContent=copy.result;details.dataset.i18nSkip='';details.textContent=data.get('company')+': '+data.get('goal');out.replaceChildren(message,details);const button=$('#submit-demo');button.dataset.i18nSkip='';button.textContent=copy.complete;});
document.addEventListener('visibilitychange',handleV1Visibility);
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$('.nav-links a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}),{rootMargin:'-15% 0px -65% 0px'});$$('main>section').forEach(s=>observer.observe(s));const reveals=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('content-entered');reveals.unobserve(e.target);}}),{threshold:.1});$$('.section-intro').forEach(e=>reveals.observe(e));}
window.addEventListener('pagehide',stop);
// SanBao operating graph; nodes and links derived from the preserved business catalog.
const kgData={"nodes":[{"id":"brand","name":"出海品牌","label":"出海品牌","kind":"经营世界","domain":"SP","r":32,"text":"把分散在市场、商品、供应、渠道与资金中的经营事实，连接为同一个可理解、可推演、可行动的世界。","degree":10},{"id":"SP","name":"战略与经营规划","question":"在哪些国家和业务下注，资源如何分配，何时调整？","count":5,"label":"战略与经营规划","kind":"价值流","domain":"SP","r":25,"text":"在哪些国家和业务下注，资源如何分配，何时调整？","degree":10},{"id":"IO","name":"洞察到产品创新","question":"做什么产品，是否值得做，是否准备好上市？","count":8,"label":"洞察到产品创新","kind":"价值流","domain":"IO","r":25,"text":"做什么产品，是否值得做，是否准备好上市？","degree":12},{"id":"SA","name":"供应到可售库存","question":"能否按承诺的成本、质量和交期备好可售库存？","count":10,"label":"供应到可售库存","kind":"价值流","domain":"SA","r":25,"text":"能否按承诺的成本、质量和交期备好可售库存？","degree":15},{"id":"AD","name":"认知到需求","question":"向谁表达什么价值，怎样获得可验证的有效需求？","count":9,"label":"认知到需求","kind":"价值流","domain":"AD","r":25,"text":"向谁表达什么价值，怎样获得可验证的有效需求？","degree":12},{"id":"CO","name":"渠道到订单","question":"在哪里卖、怎样成交，哪些订单可以接受？","count":10,"label":"渠道到订单","kind":"价值流","domain":"CO","r":25,"text":"在哪里卖、怎样成交，哪些订单可以接受？","degree":15},{"id":"OL","name":"订单到忠诚","question":"如何兑现交付、恢复服务，并维护客户长期价值？","count":9,"label":"订单到忠诚","kind":"价值流","domain":"OL","r":25,"text":"如何兑现交付、恢复服务，并维护客户长期价值？","degree":15},{"id":"TP","name":"交易到利润与现金","question":"究竟赚了多少，钱在哪里，增长占用多少资金？","count":8,"label":"交易到利润与现金","kind":"价值流","domain":"TP","r":25,"text":"究竟赚了多少，钱在哪里，增长占用多少资金？","degree":14},{"id":"SP-01","name":"国家与市场进入、加码与退出","scope":"结合市场、主体、税务、支付、渠道、能力与风险条件，比较进入、加码、收缩或退出的选择。","question":"应进入、加码、收缩或退出哪些国家／市场？","deliver":"比较需求、进入条件、到岸经济性与现金情景，形成可审查的进入／退出选项与决策依据。","owner":"CEO/国际业务负责人","kpi":"进入假设、止损线与责任边界的可审查性；后续观察市场贡献与现金回收。","domain":"SP","label":"国家与市场进入、加码与退出","kind":"业务场景","r":12,"text":"应进入、加码、收缩或退出哪些国家／市场？","degree":9},{"id":"SP-02","name":"品牌、产品线与渠道组合设计","scope":"围绕战略目标组织品牌、产品线与渠道组合，明确各自角色、边界与协同关系。","question":"品牌、产品线与渠道怎样组合，才能减少内耗并保留协同？","deliver":"识别重叠客群、价格冲突与资源挤占，形成可比较的组合配置与取舍说明。","owner":"CEO/业务总经理","kpi":"组合贡献、集中度变化与协同收益的观察。","domain":"SP","label":"品牌、产品线与渠道组合设计","kind":"业务场景","r":12,"text":"品牌、产品线与渠道怎样组合，才能减少内耗并保留协同？","degree":9},{"id":"SP-03","name":"年度季度战略与目标体系","scope":"将战略关联为可衡量的目标、责任、资源承诺与复盘节奏。","question":"战略目标如何关联为有责任、有资源边界的经营承诺？","deliver":"把目标、责任、资源承诺与复盘节奏关联到市场、商品和指标版本。","owner":"CEO/COO","kpi":"责任覆盖，以及目标、资源与指标版本的可追溯性。","domain":"SP","label":"年度季度战略与目标体系","kind":"业务场景","r":12,"text":"战略目标如何关联为有责任、有资源边界的经营承诺？","degree":9},{"id":"SP-04","name":"资金、人力、库存与能力配置","scope":"在市场、品牌、商品和渠道之间比较资金、人力、库存与关键能力的配置选择。","question":"在有限资金、人力和库存下，应优先配置到哪里？","deliver":"在服务、现金和风险约束下，形成可比较的资源配置选项与取舍依据。","owner":"CEO/CFO","kpi":"资源承诺与约束的对照，以及资本回报的后续观察。","domain":"SP","label":"资金、人力、库存与能力配置","kind":"业务场景","r":12,"text":"在有限资金、人力和库存下，应优先配置到哪里？","degree":13},{"id":"SP-05","name":"经营复盘与组合再配置","scope":"基于经营结果复盘组合表现，形成可追溯的加码、调整、暂停或退出选项。","question":"何时加码、暂停或退出现有业务？","deliver":"复盘实际与假设，形成可审查的组合调整建议，并按约定窗口观察后续结果。","owner":"经营委员会","kpi":"调整后结果与原假设差异的观察与复盘。","domain":"SP","label":"经营复盘与组合再配置","kind":"业务场景","r":12,"text":"何时加码、暂停或退出现有业务？","degree":14},{"id":"IO-01","name":"宏观市场品类与竞争情报","scope":"界定宏观、市场、品类与竞争信号的来源、时效和适用范围，用于发现值得进一步核查的变化。","question":"哪些市场、品类与竞品变化值得关注？","deliver":"整理带来源、时效与置信度说明的机会／威胁信号，并标出需要人工复核的假设。","owner":"战略/商品负责人","kpi":"信号来源、时效与复核记录的可追溯性；进入论证中被采用或排除的依据。","domain":"IO","label":"宏观市场品类与竞争情报","kind":"业务场景","r":12,"text":"哪些市场、品类与竞品变化值得关注？","degree":9},{"id":"IO-02","name":"客户声音需求与问题发现","scope":"整理搜索、评论、社媒与客服中的客户声音，区分可验证需求、质量问题与使用情境。","question":"消费者未满足需求和抱怨根因是什么？","deliver":"形成可追溯的需求与问题假设，标明原始证据、样本偏差与待验证项。","owner":"商品/客户体验负责人","kpi":"已复核的需求／问题假设、样本偏差记录与后续验证覆盖。","domain":"IO","label":"客户声音需求与问题发现","kind":"业务场景","r":12,"text":"消费者未满足需求和抱怨根因是什么？","degree":9},{"id":"IO-03","name":"商品机会评估与商业论证","scope":"在需求、成本、风险与回报假设明确的前提下，比较商品机会的验证优先级。","question":"这个新品机会值得花钱验证吗？","deliver":"形成需求、单位经济性、替代方案与最小验证设计的可审查论证。","owner":"商品负责人","kpi":"验证成本与假设覆盖的可追溯性；继续、停止或立项依据的完整性。","domain":"IO","label":"商品机会评估与商业论证","kind":"业务场景","r":12,"text":"这个新品机会值得花钱验证吗？","degree":9},{"id":"IO-04","name":"产品概念规格与技术资料","scope":"将已确认的产品假设整理为概念、规格、BOM、Tech Pack 与验收要求，并标出待定技术与合规条件。","question":"怎样把需求变成供应商能交付的规格？","deliver":"形成供研发、采购与供应商复核的规格、BOM、Tech Pack 与验收条件；不替代工程或合规签署。","owner":"产品/研发负责人","kpi":"规格版本、工程变更与样品符合情况的可追溯性。","domain":"IO","label":"产品概念规格与技术资料","kind":"业务场景","r":12,"text":"怎样把需求变成供应商能交付的规格？","degree":9},{"id":"IO-05","name":"样品、测试与产品验证","scope":"围绕已批准的验证要求组织样品、实验室与用户测试的证据结构；认证适用、宣称依据与市场放行归 IO-08。","question":"样品和设计是否通过已批准的验证要求？","deliver":"形成测试计划、缺陷关闭与验证证据清单；准入结论仍应由 IO-08 的具名责任人签署。","owner":"研发/质量负责人","kpi":"测试覆盖、缺陷关闭与验证证据完整性；本场景不判定市场准入。","domain":"IO","label":"样品、测试与产品验证","kind":"业务场景","r":12,"text":"样品和设计是否通过已批准的验证要求？","degree":8},{"id":"IO-06","name":"品类商品组合与生命周期","scope":"管理品类和商品组合的角色、生命周期假设与替代迁移边界。","question":"哪些商品应引入、升级、替代或清退？","deliver":"形成商品角色、生命周期与替代迁移的可审查建议及停止条件。","owner":"商品负责人","kpi":"组合贡献、尾货与替代承接的观察口径与后续结果。","domain":"IO","label":"品类商品组合与生命周期","kind":"业务场景","r":12,"text":"哪些商品应引入、升级、替代或清退？","degree":6},{"id":"IO-07","name":"商品主数据数字资产与渠道资料包","scope":"定义商品主数据、数字资产与渠道资料包的统一版本和发布前核对范围。","question":"各渠道商品资料为何经常不一致？","deliver":"整理可复核的商品版本、资产与渠道资料包，并记录差异与待处理项。","owner":"商品数据负责人","kpi":"属性完整性、版本一致性与资料差异关闭的可追溯性。","domain":"IO","label":"商品主数据数字资产与渠道资料包","kind":"业务场景","r":12,"text":"各渠道商品资料为何经常不一致？","degree":15},{"id":"IO-08","name":"产品准入、合规与上市后安全","question":"商品在目标市场能否合法上市，安全证据是否仍有效？","deliver":"形成义务矩阵、适用性与证据有效期的审查材料，供具名产品合规负责人审查准入、决定是否批准／拒绝，并安排安全信号的后续路由。","owner":"产品合规负责人","kpi":"准入证据与有效期的可追溯性，以及受影响商品识别与处置记录的完整性。","scope":"围绕主体×市场×产品×宣称整理准入、安全与上市后信号的证据范围；具体测试归 IO-05，批次隔离/CAPA 归 SA-07。","domain":"IO","added":true,"label":"产品准入、合规与上市后安全","kind":"业务场景","r":12,"text":"商品在目标市场能否合法上市，安全证据是否仍有效？","degree":14},{"id":"SA-01","name":"需求预测与供需计划","scope":"将滚动需求预测转化为供需计划、约束识别与协同节奏。","question":"下一周期该备多少货、何时备货？","deliver":"生成需求区间、供需约束和滚动计划","owner":"供应链负责人","kpi":"预测偏差、服务水平；不用单一销量点预测","domain":"SA","label":"需求预测与供需计划","kind":"业务场景","r":12,"text":"下一周期该备多少货、何时备货？","degree":9},{"id":"SA-02","name":"库存策略分配调拨与补货","scope":"制定库存策略，执行分配、调拨和补货，平衡服务水平与资金占用。","question":"缺货和积压并存时如何调拨与补货？","deliver":"比较补货、调拨、降速和清货的现金影响","owner":"供应链负责人","kpi":"缺货率、库存天数、净现金释放","domain":"SA","label":"库存策略分配调拨与补货","kind":"业务场景","r":12,"text":"缺货和积压并存时如何调拨与补货？","degree":16},{"id":"SA-03","name":"供应商发现询价与谈判","scope":"发现与评估供应商，发起 RFQ，并围绕价格、MOQ、交期和条款谈判。","question":"哪里能找到符合成本和交期的供应商？","deliver":"结构化 RFQ 与报价，比较 MOQ、账期、交期和质量","owner":"采购负责人","kpi":"有效报价、总成本与可履约性","domain":"SA","label":"供应商发现询价与谈判","kind":"业务场景","r":12,"text":"哪里能找到符合成本和交期的供应商？","degree":8},{"id":"SA-04","name":"供应商准入合同与绩效管理","scope":"完成供应商准入、合同管理、绩效评分、整改与退出。","question":"哪些供应商应准入、整改或退出？","deliver":"完成资质与合同约束校验，持续评价供应商履约","owner":"采购/质量负责人","kpi":"准入合规、OTIF、整改与追偿闭环","domain":"SA","label":"供应商准入合同与绩效管理","kind":"业务场景","r":12,"text":"哪些供应商应准入、整改或退出？","degree":9},{"id":"SA-05","name":"采购订单与交付承诺协同","scope":"协同采购订单、交付承诺、变更与异常升级。","question":"采购承诺能否按时兑现？","deliver":"生成 PO、确认交期、管理变更与升级","owner":"采购负责人","kpi":"供应商确认回执、承诺偏差","domain":"SA","label":"采购订单与交付承诺协同","kind":"业务场景","r":12,"text":"采购承诺能否按时兑现？","degree":13},{"id":"SA-06","name":"产能物料与生产执行协同","scope":"对齐产能、物料、排产和生产里程碑，管理执行偏差。","question":"产能和物料不足会影响哪些上市或订单？","deliver":"关联 BOM、物料、产能和订单，制定排产调整方案","owner":"生产/供应链负责人","kpi":"生产里程碑、物料满足率","domain":"SA","label":"产能物料与生产执行协同","kind":"业务场景","r":12,"text":"产能和物料不足会影响哪些上市或订单？","degree":9},{"id":"SA-07","name":"质量检验追溯纠正与召回","scope":"执行质量检验、批次追溯、纠正预防和必要的召回处置。","question":"质量问题影响哪些批次，如何纠正和召回？","deliver":"批次追溯、隔离、CAPA 与召回执行","owner":"质量负责人","kpi":"问题批次覆盖、复发率、处置证据","domain":"SA","label":"质量检验追溯纠正与召回","kind":"业务场景","r":12,"text":"质量问题影响哪些批次，如何纠正和召回？","degree":12},{"id":"SA-08","name":"国际运输、清关执行与入仓","scope":"物流执行和事件状态；归类、原产地、估价与管制适用归 SA-10。","question":"如何兑现跨境运输与清关计划并减少交付损失？","deliver":"按已批准的贸易结论准备单证、订舱、申报协作、追踪异常与入仓","owner":"物流/关务负责人","kpi":"入境时效、单证一致性、到岸费用差异","domain":"SA","label":"国际运输、清关执行与入仓","kind":"业务场景","r":12,"text":"如何兑现跨境运输与清关计划并减少交付损失？","degree":12},{"id":"SA-09","name":"仓储三方物流与可售库存","scope":"管理仓储与 3PL 作业，确保库存状态准确并可分配、可销售。","question":"账面库存为何不能实际销售？","deliver":"核对在途、冻结、预留、残次和可售库存","owner":"仓储负责人","kpi":"账实准确、可分配库存、入库完成","domain":"SA","label":"仓储三方物流与可售库存","kind":"业务场景","r":12,"text":"账面库存为何不能实际销售？","degree":13},{"id":"SA-10","name":"国际贸易合规与关务决策","question":"这批货如何归类、定原产地和估价，能否按当前规则通关？","deliver":"形成经具名复核的归类/原产地/估价/管制适用与单证要求，交给物流执行","owner":"贸易合规/关务负责人","kpi":"适用结论与版本可追溯、申报差异、违规事件","scope":"贸易事实和单次运输的合规决策；运输操作归 SA-08，税务申报归 TP-04。","domain":"SA","added":true,"label":"国际贸易合规与关务决策","kind":"业务场景","r":12,"text":"这批货如何归类、定原产地和估价，能否按当前规则通关？","degree":11},{"id":"AD-01","name":"品牌定位表达与治理","scope":"管理品牌定位、核心主张、表达规范与跨市场一致性。","question":"品牌表达是否清晰且跨市场一致？","deliver":"维护定位、声明依据、表达准则与审批版本","owner":"品牌负责人","kpi":"品牌主张一致性、违规承诺率","domain":"AD","label":"品牌定位表达与治理","kind":"业务场景","r":12,"text":"品牌表达是否清晰且跨市场一致？","degree":9},{"id":"AD-02","name":"受众细分洞察与沟通策略","scope":"细分目标受众，识别动机与障碍，制定差异化沟通策略。","question":"应该向哪些人群讲什么价值？","deliver":"构建受众、需求、障碍和触点策略","owner":"市场负责人","kpi":"合格受众、触达与增量响应","domain":"AD","label":"受众细分洞察与沟通策略","kind":"业务场景","r":12,"text":"应该向哪些人群讲什么价值？","degree":6},{"id":"AD-03","name":"内容创意本地化审核与发布","scope":"生成、审核、本地化并发布内容，控制品牌、合规和渠道要求。","question":"怎样让本地化内容更快发布且可验证？","deliver":"生成内容、事实核查、品牌审核和渠道发布","owner":"内容负责人","kpi":"审核通过、发布回执、内容引发的误购","domain":"AD","label":"内容创意本地化审核与发布","kind":"业务场景","r":12,"text":"怎样让本地化内容更快发布且可验证？","degree":14},{"id":"AD-04","name":"达人、联盟、直播与 PR 商业运营","scope":"合作、权利取得、交付与商业效果；内容生产归 AD-03，权属争议归 AD-08。","question":"哪些创作者与联盟合作真正赚钱？","deliver":"筛选、合作授权、交付验收、归因和结算输入","owner":"市场/联盟负责人","kpi":"扣退货与佣金后的增量贡献","domain":"AD","label":"达人、联盟、直播与 PR 商业运营","kind":"业务场景","r":12,"text":"哪些创作者与联盟合作真正赚钱？","degree":8},{"id":"AD-05","name":"付费媒体计划投放与优化","scope":"制定媒体计划，执行投放、预算控制、素材轮换与持续优化。","question":"广告如何在利润与库存边界内优化？","deliver":"比较媒体预算、出价与素材方案，受控执行","owner":"增长负责人","kpi":"增量贡献、获客质量与预算守约","domain":"AD","label":"付费媒体计划投放与优化","kind":"业务场景","r":12,"text":"广告如何在利润与库存边界内优化？","degree":15},{"id":"AD-06","name":"自有渠道私域社区与生命周期沟通","scope":"运营官网、邮件、私域和社区，并按客户生命周期组织沟通。","question":"如何用自有触点改善激活和客户沟通？","deliver":"配置授权范围内的邮件、社区与生命周期触达","owner":"CRM/增长负责人","kpi":"增量复购、退订与触达合规","domain":"AD","label":"自有渠道私域社区与生命周期沟通","kind":"业务场景","r":12,"text":"如何用自有触点改善激活和客户沟通？","degree":7},{"id":"AD-07","name":"增长实验、归因与增量评估","scope":"在合格测量数据上形成因果或相关性结论；事件采集质量和回填归 AD-09。","question":"增长究竟来自投放、促销还是自然变化？","deliver":"设计对照实验、归因窗口与增长组合学习","owner":"增长分析负责人","kpi":"增量效果区间、实验可重复性","domain":"AD","label":"增长实验、归因与增量评估","kind":"业务场景","r":12,"text":"增长究竟来自投放、促销还是自然变化？","degree":11},{"id":"AD-08","name":"品牌资产、知识产权与反仿冒","question":"品牌和素材有哪些权利风险，仿冒或投诉如何处理？","deliver":"固定证据、核验授权链、整理平台投诉/反通知材料并追踪处理结果","owner":"品牌/法务负责人","kpi":"权利证据完整率、处置周期、重复侵权与恢复状态","scope":"管理品牌/素材权属和权利处置；素材发布归 AD-03，账号申诉运行归 CO-07。","domain":"AD","added":true,"label":"品牌资产、知识产权与反仿冒","kind":"业务场景","r":12,"text":"品牌和素材有哪些权利风险，仿冒或投诉如何处理？","degree":10},{"id":"AD-09","name":"测量、事件质量与 Catalog Match","question":"转化变化是真的，还是事件、商品匹配或归因链路坏了？","deliver":"核对事件源、同意状态、去重与商品 ID，隔离异常数据并修复/回填测量链","owner":"增长数据负责人","kpi":"事件完整率、匹配率、重复率、对账差异、恢复时长","scope":"测量数据产品的可靠性；增长实验结论归 AD-07。G-04 提供全局规则，不重复承接事件修复。","domain":"AD","added":true,"label":"测量、事件质量与 Catalog Match","kind":"业务场景","r":12,"text":"转化变化是真的，还是事件、商品匹配或归因链路坏了？","degree":12},{"id":"CO-01","name":"渠道店铺与交易模式接入","scope":"接入渠道、店铺与交易模式，配置主体、支付、税务和运营基础。","question":"新渠道是否具备开店和交易条件？","deliver":"核对主体、支付、税务配置、渠道准入和交易模式","owner":"渠道负责人","kpi":"账户开通与测试交易通过","domain":"CO","label":"渠道店铺与交易模式接入","kind":"业务场景","r":12,"text":"新渠道是否具备开店和交易条件？","degree":9},{"id":"CO-02","name":"商品刊登映射与数字货架健康","scope":"完成商品映射与刊登，并持续监测数字货架的可见性、完整性和健康度。","question":"商品为何上架失败、不可见或不可售？","deliver":"校验字段、类目、政策与 SKU 映射，修复刊登","owner":"渠道运营负责人","kpi":"刊登接受且实际可售、抑制解除","domain":"CO","label":"商品刊登映射与数字货架健康","kind":"业务场景","r":12,"text":"商品为何上架失败、不可见或不可售？","degree":18},{"id":"CO-03","name":"品类陈列站内搜索推荐与商品发现","scope":"优化品类陈列、站内搜索、推荐与商品发现效率。","question":"消费者为何找不到适合的商品？","deliver":"优化分类、搜索、推荐与渠道内陈列","owner":"电商负责人","kpi":"可发现率、有效点击和增量订单","domain":"CO","label":"品类陈列站内搜索推荐与商品发现","kind":"业务场景","r":12,"text":"消费者为何找不到适合的商品？","degree":6},{"id":"CO-04","name":"定价价格表与渠道冲突管理","scope":"管理定价、价格表、价格变更和跨渠道价格冲突。","question":"如何定价并避免跨渠道价格冲突？","deliver":"形成价格表、底价和渠道冲突处置方案","owner":"商业负责人","kpi":"净贡献、价格执行一致性","domain":"CO","label":"定价价格表与渠道冲突管理","kind":"业务场景","r":12,"text":"如何定价并避免跨渠道价格冲突？","degree":11},{"id":"CO-05","name":"促销优惠组合与清货管理","scope":"设计促销与优惠组合，并管理清货目标、边界和结果。","question":"促销和清货怎样回收现金而不毁利润？","deliver":"模拟折扣、组合、费用和库存消化，审批后发布","owner":"商业/商品负责人","kpi":"净回收现金、折扣后贡献、尾货下降","domain":"CO","label":"促销优惠组合与清货管理","kind":"业务场景","r":12,"text":"促销和清货怎样回收现金而不毁利润？","degree":10},{"id":"CO-06","name":"店面商品页转化与结账体验","scope":"售前指导、PDP/购物旅程/Checkout 的转化实验；站点配置发布归 CO-10，真实支付授权归 CO-09。","question":"商品页到结账哪里流失最多？","deliver":"定位转化障碍，提出并验证店面与结账实验","owner":"电商负责人","kpi":"有效转化、支付成功、退款护栏","domain":"CO","label":"店面商品页转化与结账体验","kind":"业务场景","r":12,"text":"商品页到结账哪里流失最多？","degree":7},{"id":"CO-07","name":"平台市场日常经营与账户健康","scope":"管理平台市场日常运营、绩效规则、异常处置和账户健康。","question":"账户健康恶化时怎样避免经营中断？","deliver":"关联平台警告、绩效、申诉证据与恢复措施","owner":"渠道负责人","kpi":"警告解除、账户恢复和持续可售","domain":"CO","label":"平台市场日常经营与账户健康","kind":"业务场景","r":12,"text":"账户健康恶化时怎样避免经营中断？","degree":10},{"id":"CO-08","name":"企业客户批发分销报价到订单","scope":"管理企业客户与分销业务从商机、报价、合同到订单转化。","question":"B2B 商机怎样变成有利润的有效订单？","deliver":"资格判断、报价、合同、分销计划和订单转换","owner":"销售负责人","kpi":"签约订单、贡献底线、信用合规","domain":"CO","label":"企业客户批发分销报价到订单","kind":"业务场景","r":12,"text":"B2B 商机怎样变成有利润的有效订单？","degree":7},{"id":"CO-09","name":"结账订单捕获支付授权与风险预筛","scope":"捕获订单，完成支付授权，并在进入履约前执行风险预筛。","question":"哪些订单可以安全接收并进入履约？","deliver":"订单捕获、支付授权、风险筛选和有效性校验","owner":"电商/风控负责人","kpi":"有效订单、欺诈与误拒率","domain":"CO","label":"结账订单捕获支付授权与风险预筛","kind":"业务场景","r":12,"text":"哪些订单可以安全接收并进入履约？","degree":15},{"id":"CO-10","name":"DTC 独立站建设与持续运营","question":"独立站能否稳定上线，配置与应用变更是否影响关键购买旅程？","deliver":"治理域名、主题、应用、Markets、本地化和配置版本，实施 QA、发布与恢复","owner":"DTC 电商负责人","kpi":"关键旅程通过率、可用性、发布缺陷、恢复时长","scope":"持续运营和配置发布；渠道首次准入归 CO-01，Listing 归 CO-02，CRO 归 CO-06，实际支付归 CO-09。","domain":"CO","added":true,"label":"DTC 独立站建设与持续运营","kind":"业务场景","r":12,"text":"独立站能否稳定上线，配置与应用变更是否影响关键购买旅程？","degree":11},{"id":"OL-01","name":"订单编排分配保留与释放","scope":"编排订单，并管理库存分配、保留、释放和履约路由。","question":"订单该由哪个仓履约且不超卖？","deliver":"订单拆分、库存预留、释放和路由决策","owner":"履约负责人","kpi":"成功分配、超卖率、承诺达成","domain":"OL","label":"订单编排分配保留与释放","kind":"业务场景","r":12,"text":"订单该由哪个仓履约且不超卖？","degree":17},{"id":"OL-02","name":"拣配发运平台仓与直发履约","scope":"通过自营仓、平台仓和直发模式完成拣配、发运与履约协同。","question":"怎样保证正确商品按时发出？","deliver":"联动 WMS/平台仓，处理拣配和发运异常","owner":"履约负责人","kpi":"正确发运、首次扫描与出库时效","domain":"OL","label":"拣配发运平台仓与直发履约","kind":"业务场景","r":12,"text":"怎样保证正确商品按时发出？","degree":14},{"id":"OL-03","name":"末端配送追踪与交付异常","scope":"追踪末端配送，识别并处理延误、丢失、拒收等交付异常。","question":"延误、丢件、拒收如何及时恢复？","deliver":"追踪物流事件，生成改派、补发与索赔方案","owner":"物流/客服负责人","kpi":"签收率、恢复时长、索赔到账","domain":"OL","label":"末端配送追踪与交付异常","kind":"业务场景","r":12,"text":"延误、丢件、拒收如何及时恢复？","degree":14},{"id":"OL-04","name":"客户咨询服务与问题解决","scope":"已受理订单/权益关联的咨询、客诉与分诊；售前购买指导由 CO-06 调用安心 AGT-036，不把获客转化归入订单后价值流。","question":"客户问题如何一次解决而非反复转接？","deliver":"检索订单与政策，执行授权服务并跟踪解决","owner":"客服负责人","kpi":"一次解决、重开率、满意度","domain":"OL","label":"客户咨询服务与问题解决","kind":"业务场景","r":12,"text":"客户问题如何一次解决而非反复转接？","degree":15},{"id":"OL-05","name":"取消退款补偿与争议前处置","scope":"处理取消、退款、补偿和争议前干预，控制客户损失与风险。","question":"退款、取消和补偿如何兼顾客户与成本？","deliver":"核实权益与订单状态，生成补偿和争议前方案","owner":"客服/风控负责人","kpi":"退款回执、净损失和争议率","domain":"OL","label":"取消退款补偿与争议前处置","kind":"业务场景","r":12,"text":"退款、取消和补偿如何兼顾客户与成本？","degree":11},{"id":"OL-06","name":"退货换货与逆向物流","scope":"管理退货、换货、质检、入库及逆向物流。","question":"退换货如何更快完成并回收库存？","deliver":"RMA、逆向物流、收货质检、换货与退款联动","owner":"售后负责人","kpi":"退货周期、回库与退款一致性","domain":"OL","label":"退货换货与逆向物流","kind":"业务场景","r":12,"text":"退换货如何更快完成并回收库存？","degree":8},{"id":"OL-07","name":"保修维修替换翻新与再流通","scope":"管理保修、维修、替换、翻新和商品再流通。","question":"保修、维修和翻新怎样提高回收价值？","deliver":"判断保修资格、维修或替换路径与再流通等级","owner":"售后/质量负责人","kpi":"修复率、单位恢复成本、净回收价值","domain":"OL","label":"保修维修替换翻新与再流通","kind":"业务场景","r":12,"text":"保修、维修和翻新怎样提高回收价值？","degree":7},{"id":"OL-08","name":"忠诚会员订阅补充购买与口碑","scope":"经营会员、订阅、补充购买、复购与客户口碑。","question":"如何提高客户留存、复购与会员价值？","deliver":"管理会员权益、订阅、补充购买和下一最佳服务","owner":"客户经营负责人","kpi":"净客户贡献、复购、流失与投诉","domain":"OL","label":"忠诚会员订阅补充购买与口碑","kind":"业务场景","r":12,"text":"如何提高客户留存、复购与会员价值？","degree":7},{"id":"OL-09","name":"支付争议、拒付与资金恢复","question":"收到拒付后应接受损失还是抗辩，怎样在截止日前找回资金？","deliver":"按 Dispute ID 汇总订单、沟通、授权与签收证据，批准后提交并追踪结果","owner":"支付运营/争议处理负责人","kpi":"按时提交率、扣手续费后的净追回、误伤率、每案成本","scope":"已发生交易的争议 Case；售前风险拦截归 CO-09，资金入账与会计核对归 TP-01/07。","domain":"OL","added":true,"label":"支付争议、拒付与资金恢复","kind":"业务场景","r":12,"text":"收到拒付后应接受损失还是抗辩，怎样在截止日前找回资金？","degree":8},{"id":"TP-01","name":"支付平台结算回款费用与对账","scope":"对账平台结算、回款、费用和账单，识别并处理差异。","question":"钱为何没有按订单和账单足额到账？","deliver":"关联支付、平台费用、退款、拒付和银行入账","owner":"财务负责人","kpi":"对账差异、追回费用和清算时效","domain":"TP","label":"支付平台结算回款费用与对账","kind":"业务场景","r":12,"text":"钱为何没有按订单和账单足额到账？","degree":19},{"id":"TP-02","name":"企业应收信用催收与坏账管理","scope":"管理企业客户信用、应收、催收和坏账风险。","question":"企业客户何时开票、回款，信用是否过高？","deliver":"客户开票与应收、信用、账龄、催收及坏账管理","owner":"财务/销售负责人","kpi":"发票接受、回款、DSO 与坏账","domain":"TP","label":"企业应收信用催收与坏账管理","kind":"业务场景","r":12,"text":"企业客户何时开票、回款，信用是否过高？","degree":7},{"id":"TP-03","name":"采购应付发票匹配与付款","scope":"匹配采购订单、收货与发票，并在审批后执行付款。","question":"采购账款该付多少，是否重复或不匹配？","deliver":"采购订单、收货、发票三单匹配与付款申请","owner":"财务/采购负责人","kpi":"匹配率、重复付款和付款回执","domain":"TP","label":"采购应付发票匹配与付款","kind":"业务场景","r":12,"text":"采购账款该付多少，是否重复或不匹配？","degree":9},{"id":"TP-04","name":"间接税电子发票申报与法定合规","scope":"管理间接税、电子发票、申报和法定合规要求。","question":"税务申报和电子发票是否完整准确？","deliver":"判定税务适用、计算与核对申报、法定财务合规","owner":"税务负责人","kpi":"申报接受、税额差异与证据完整性","domain":"TP","label":"间接税电子发票申报与法定合规","kind":"业务场景","r":12,"text":"税务申报和电子发票是否完整准确？","degree":9},{"id":"TP-05","name":"外汇资金流动性与现金调度","scope":"管理外汇风险、流动性、现金头寸与资金调度。","question":"何时会缺现金，汇率变化如何应对？","deliver":"预测币种头寸、现金缺口与受控调度建议","owner":"CFO/资金负责人","kpi":"最低现金缓冲、预测偏差和汇兑暴露","domain":"TP","label":"外汇资金流动性与现金调度","kind":"业务场景","r":12,"text":"何时会缺现金，汇率变化如何应对？","degree":11},{"id":"TP-06","name":"商品渠道订单级成本利润与贡献分析","scope":"计算商品、渠道和订单级成本、利润与贡献。","question":"哪些商品、渠道和订单实际赚钱？","deliver":"统一收入、折扣、退款、费用、物流和广告成本口径","owner":"CFO/经营分析负责人","kpi":"订单贡献可解释、成本分摊与对账闭合","domain":"TP","label":"商品渠道订单级成本利润与贡献分析","kind":"业务场景","r":12,"text":"哪些商品、渠道和订单实际赚钱？","degree":25},{"id":"TP-07","name":"关账合并管理报告与审计准备","scope":"执行关账、合并、管理报告和审计准备。","question":"关账为何慢，管理报表是否可审计？","deliver":"执行关账检查、合并、管理报告和财务审计证据包","owner":"财务负责人","kpi":"关账周期、差异与可追溯覆盖","domain":"TP","label":"关账合并管理报告与审计准备","kind":"业务场景","r":12,"text":"关账为何慢，管理报表是否可审计？","degree":11},{"id":"TP-08","name":"财务预测营运资本与经营绩效","scope":"开展财务预测，管理营运资本并评估经营绩效。","question":"增长计划是否吃掉过多营运资本？","deliver":"构建利润、现金、营运资本滚动预测与压力测试","owner":"CFO","kpi":"预测误差、现金转化周期和预算兑现","domain":"TP","label":"财务预测营运资本与经营绩效","kind":"业务场景","r":12,"text":"增长计划是否吃掉过多营运资本？","degree":12},{"ordinal":1,"id":"AGT-001","name":"衡远","job":"经营目标与资源统筹","count":16,"deliver":"目标与资源决策包","plane":"经营管理","domain":"SP","label":"衡远","kind":"DSH 数字员工","r":10.5,"text":"经营目标与资源统筹。以目标与资源决策包参与跨场景协作。","degree":7},{"ordinal":2,"id":"AGT-002","name":"枢衡","job":"场景自主编排与异常协调","count":25,"deliver":"场景规则、装配决策依据、Case 状态与自治异常分析","plane":"经营管理","domain":"SP","label":"枢衡","kind":"DSH 数字员工","r":10.5,"text":"场景自主编排与异常协调。以场景规则、装配决策依据、Case 状态与自治异常分析参与跨场景协作。","degree":7},{"ordinal":3,"id":"AGT-003","name":"明镜","job":"经营分析与决策支持","count":18,"deliver":"带来源的经营分析包","plane":"经营管理","domain":"TP","label":"明镜","kind":"DSH 数字员工","r":10.5,"text":"经营分析与决策支持。以带来源的经营分析包参与跨场景协作。","degree":7},{"ordinal":4,"id":"AGT-004","name":"知人","job":"组织能力与人事行政","count":9,"deliver":"能力矩阵与组织调整建议","plane":"经营管理","domain":"SP","label":"知人","kind":"DSH 数字员工","r":10.5,"text":"组织能力与人事行政。以能力矩阵与组织调整建议参与跨场景协作。","degree":2},{"ordinal":5,"id":"AGT-041","name":"守金","job":"经营财务与资金","count":18,"deliver":"现金与资源约束方案","plane":"经营管理","domain":"TP","label":"守金","kind":"DSH 数字员工","r":10.5,"text":"经营财务与资金。以现金与资源约束方案参与跨场景协作。","degree":15},{"ordinal":6,"id":"AGT-006","name":"听澜","job":"消费者需求与 VOC 研究","count":16,"deliver":"需求证据与问题地图","plane":"业务运营","domain":"AD","label":"听澜","kind":"DSH 数字员工","r":10.5,"text":"消费者需求与 VOC 研究。以需求证据与问题地图参与跨场景协作。","degree":3},{"ordinal":7,"id":"AGT-007","name":"望野","job":"市场竞争与机会研究","count":19,"deliver":"机会证据包与反证","plane":"业务运营","domain":"IO","label":"望野","kind":"DSH 数字员工","r":10.5,"text":"市场竞争与机会研究。以机会证据包与反证参与跨场景协作。","degree":3},{"ordinal":8,"id":"AGT-008","name":"拓新","job":"产品组合与新品孵化","count":14,"deliver":"新品组合与继续停止建议","plane":"业务运营","domain":"IO","label":"拓新","kind":"DSH 数字员工","r":10.5,"text":"产品组合与新品孵化。以新品组合与继续停止建议参与跨场景协作。","degree":3},{"ordinal":9,"id":"AGT-009","name":"定形","job":"产品定义与商业立项","count":11,"deliver":"产品定义与立项包","plane":"业务运营","domain":"IO","label":"定形","kind":"DSH 数字员工","r":10.5,"text":"产品定义与商业立项。以产品定义与立项包参与跨场景协作。","degree":5},{"ordinal":10,"id":"AGT-010","name":"映物","job":"工业设计与用户体验","count":10,"deliver":"设计方案与体验验证计划","plane":"业务运营","domain":"IO","label":"映物","kind":"DSH 数字员工","r":10.5,"text":"工业设计与用户体验。以设计方案与体验验证计划参与跨场景协作。","degree":2},{"ordinal":11,"id":"AGT-011","name":"砺器","job":"硬件结构与材料工程","count":3,"deliver":"技术风险与工程验证清单","plane":"业务运营","domain":"IO","label":"砺器","kind":"DSH 数字员工","r":10.5,"text":"硬件结构与材料工程。以技术风险与工程验证清单参与跨场景协作。","degree":2},{"ordinal":12,"id":"AGT-012","name":"灵枢","job":"软件算法与应用生态","count":9,"deliver":"软件方案与验证证据","plane":"业务运营","domain":"IO","label":"灵枢","kind":"DSH 数字员工","r":10.5,"text":"软件算法与应用生态。以软件方案与验证证据参与跨场景协作。","degree":1},{"ordinal":13,"id":"AGT-013","name":"求证","job":"产品验证与研发项目","count":8,"deliver":"验证报告与缺陷闭合记录","plane":"业务运营","domain":"IO","label":"求证","kind":"DSH 数字员工","r":10.5,"text":"产品验证与研发项目。以验证报告与缺陷闭合记录参与跨场景协作。","degree":5},{"ordinal":14,"id":"AGT-014","name":"择源","job":"OEM 供应商开发与协同","count":14,"deliver":"供应商能力与风险档案","plane":"业务运营","domain":"SA","label":"择源","kind":"DSH 数字员工","r":10.5,"text":"OEM 供应商开发与协同。以供应商能力与风险档案参与跨场景协作。","degree":4},{"ordinal":15,"id":"AGT-015","name":"契约","job":"采购与合同履约","count":16,"deliver":"采购建议与交期异常记录","plane":"业务运营","domain":"SA","label":"契约","kind":"DSH 数字员工","r":10.5,"text":"采购与合同履约。以采购建议与交期异常记录参与跨场景协作。","degree":8},{"ordinal":16,"id":"AGT-016","name":"知量","job":"需求预测与补货计划","count":15,"deliver":"补货方案与预测区间","plane":"业务运营","domain":"SA","label":"知量","kind":"DSH 数字员工","r":10.5,"text":"需求预测与补货计划。以补货方案与预测区间参与跨场景协作。","degree":7},{"ordinal":17,"id":"AGT-017","name":"衡仓","job":"库存与商品生命周期","count":17,"deliver":"库存风险与处置方案","plane":"业务运营","domain":"SA","label":"衡仓","kind":"DSH 数字员工","r":10.5,"text":"库存与商品生命周期。以库存风险与处置方案参与跨场景协作。","degree":6},{"ordinal":18,"id":"AGT-018","name":"质守","job":"生产协同与质量控制","count":13,"deliver":"质量事件与纠正措施包","plane":"业务运营","domain":"SA","label":"质守","kind":"DSH 数字员工","r":10.5,"text":"生产协同与质量控制。以质量事件与纠正措施包参与跨场景协作。","degree":9},{"ordinal":19,"id":"AGT-019","name":"通途","job":"跨境物流与关务","count":14,"deliver":"运输方案与异常处置建议","plane":"业务运营","domain":"SA","label":"通途","kind":"DSH 数字员工","r":10.5,"text":"跨境物流与关务。以运输方案与异常处置建议参与跨场景协作。","degree":7},{"ordinal":20,"id":"AGT-020","name":"行舟","job":"仓储履约与退货处置","count":16,"deliver":"履约与退货处置记录","plane":"业务运营","domain":"OL","label":"行舟","kind":"DSH 数字员工","r":10.5,"text":"仓储履约与退货处置。以履约与退货处置记录参与跨场景协作。","degree":12},{"ordinal":21,"id":"AGT-021","name":"北辰","job":"Amazon 业务经营","count":20,"deliver":"Amazon 场景行动包","plane":"业务运营","domain":"CO","label":"北辰","kind":"DSH 数字员工","r":10.5,"text":"Amazon 业务经营。以Amazon 场景行动包参与跨场景协作。","degree":10},{"ordinal":22,"id":"AGT-022","name":"觅位","job":"Amazon 商品与搜索运营","count":16,"deliver":"商品与搜索优化包","plane":"业务运营","domain":"CO","label":"觅位","kind":"DSH 数字员工","r":10.5,"text":"Amazon 商品与搜索运营。以商品与搜索优化包参与跨场景协作。","degree":5},{"ordinal":23,"id":"AGT-023","name":"自航","job":"独立站经营与转化","count":19,"deliver":"独立站经营与实验包","plane":"业务运营","domain":"CO","label":"自航","kind":"DSH 数字员工","r":10.5,"text":"独立站经营与转化。以独立站经营与实验包参与跨场景协作。","degree":10},{"ordinal":24,"id":"AGT-024","name":"拓域","job":"其他平台与新市场经营","count":17,"deliver":"新渠道进入与验证方案","plane":"业务运营","domain":"SP","label":"拓域","kind":"DSH 数字员工","r":10.5,"text":"其他平台与新市场经营。以新渠道进入与验证方案参与跨场景协作。","degree":5},{"ordinal":25,"id":"AGT-025","name":"联商","job":"零售渠道与 B2B 拓展","count":8,"deliver":"渠道机会与合作建议","plane":"业务运营","domain":"CO","label":"联商","kind":"DSH 数字员工","r":10.5,"text":"零售渠道与 B2B 拓展。以渠道机会与合作建议参与跨场景协作。","degree":5},{"ordinal":26,"id":"AGT-026","name":"衡价","job":"定价促销与商品组合","count":18,"deliver":"价格与促销决策包","plane":"业务运营","domain":"CO","label":"衡价","kind":"DSH 数字员工","r":10.5,"text":"定价促销与商品组合。以价格与促销决策包参与跨场景协作。","degree":7},{"ordinal":27,"id":"AGT-027","name":"守店","job":"店铺账号健康与规则","count":15,"deliver":"账号健康与处置建议","plane":"业务运营","domain":"CO","label":"守店","kind":"DSH 数字员工","r":10.5,"text":"店铺账号健康与规则。以账号健康与处置建议参与跨场景协作。","degree":4},{"ordinal":28,"id":"AGT-028","name":"译境","job":"本地化与市场适配","count":13,"deliver":"本地化内容与差异清单","plane":"业务运营","domain":"AD","label":"译境","kind":"DSH 数字员工","r":10.5,"text":"本地化与市场适配。以本地化内容与差异清单参与跨场景协作。","degree":5},{"ordinal":29,"id":"AGT-029","name":"立言","job":"品牌战略与传播","count":21,"deliver":"品牌原则与传播方案","plane":"业务运营","domain":"AD","label":"立言","kind":"DSH 数字员工","r":10.5,"text":"品牌战略与传播。以品牌原则与传播方案参与跨场景协作。","degree":6},{"ordinal":30,"id":"AGT-030","name":"叙事","job":"内容与创意策划","count":17,"deliver":"内容方案与证据引用","plane":"业务运营","domain":"AD","label":"叙事","kind":"DSH 数字员工","r":10.5,"text":"内容与创意策划。以内容方案与证据引用参与跨场景协作。","degree":4},{"ordinal":31,"id":"AGT-031","name":"绘影","job":"视觉视频与素材生产","count":18,"deliver":"带版本的渠道素材包","plane":"业务运营","domain":"AD","label":"绘影","kind":"DSH 数字员工","r":10.5,"text":"视觉视频与素材生产。以带版本的渠道素材包参与跨场景协作。","degree":4},{"ordinal":32,"id":"AGT-032","name":"点火","job":"效果广告投放","count":17,"deliver":"广告行动与效果报告","plane":"业务运营","domain":"AD","label":"点火","kind":"DSH 数字员工","r":10.5,"text":"效果广告投放。以广告行动与效果报告参与跨场景协作。","degree":6},{"ordinal":33,"id":"AGT-033","name":"结伴","job":"达人与联盟合作","count":16,"deliver":"合作候选与效果归因包","plane":"业务运营","domain":"AD","label":"结伴","kind":"DSH 数字员工","r":10.5,"text":"达人与联盟合作。以合作候选与效果归因包参与跨场景协作。","degree":1},{"ordinal":34,"id":"AGT-034","name":"续缘","job":"CRM 留存与复购","count":15,"deliver":"用户经营计划与实验结果","plane":"业务运营","domain":"AD","label":"续缘","kind":"DSH 数字员工","r":10.5,"text":"CRM 留存与复购。以用户经营计划与实验结果参与跨场景协作。","degree":3},{"ordinal":35,"id":"AGT-035","name":"试真","job":"增长实验与增量评估","count":18,"deliver":"实验协议与继续停止结论","plane":"业务运营","domain":"AD","label":"试真","kind":"DSH 数字员工","r":10.5,"text":"增长实验与增量评估。以实验协议与继续停止结论参与跨场景协作。","degree":8},{"ordinal":36,"id":"AGT-036","name":"安心","job":"售前服务与购买指导","count":17,"deliver":"有依据的售前答复与线索","plane":"业务运营","domain":"IO","label":"安心","kind":"DSH 数字员工","r":10.5,"text":"售前服务与购买指导。以有依据的售前答复与线索参与跨场景协作。","degree":3},{"ordinal":37,"id":"AGT-037","name":"解忧","job":"售后客诉与服务补救","count":16,"deliver":"客诉工单与补救建议","plane":"业务运营","domain":"OL","label":"解忧","kind":"DSH 数字员工","r":10.5,"text":"售后客诉与服务补救。以客诉工单与补救建议参与跨场景协作。","degree":8},{"ordinal":38,"id":"AGT-038","name":"回声","job":"体验洞察与质量反馈","count":16,"deliver":"体验问题与根因假设","plane":"业务运营","domain":"IO","label":"回声","kind":"DSH 数字员工","r":10.5,"text":"体验洞察与质量反馈。以体验问题与根因假设参与跨场景协作。","degree":2},{"ordinal":39,"id":"AGT-039","name":"同行","job":"用户教育与会员社区","count":15,"deliver":"教育内容与服务反馈","plane":"业务运营","domain":"OL","label":"同行","kind":"DSH 数字员工","r":10.5,"text":"用户教育与会员社区。以教育内容与服务反馈参与跨场景协作。","degree":4},{"ordinal":40,"id":"AGT-040","name":"清账","job":"GMV 结算与会计对账","count":13,"deliver":"对账表与差异处理包","plane":"业务运营","domain":"TP","label":"清账","kind":"DSH 数字员工","r":10.5,"text":"GMV 结算与会计对账。以对账表与差异处理包参与跨场景协作。","degree":14},{"ordinal":41,"id":"AGT-005","name":"守衡","job":"内控审计与独立复核","count":12,"deliver":"复核结论与整改清单","plane":"独立控制","domain":"OL","label":"守衡","kind":"DSH 数字员工","r":10.5,"text":"内控审计与独立复核。以复核结论与整改清单参与跨场景协作。","degree":5},{"ordinal":42,"id":"AGT-042","name":"合账","job":"税务与跨境实体协作","count":13,"deliver":"税务与实体事项清单","plane":"独立控制","domain":"TP","label":"合账","kind":"DSH 数字员工","r":10.5,"text":"税务与跨境实体协作。以税务与实体事项清单参与跨场景协作。","degree":7},{"ordinal":43,"id":"AGT-043","name":"律衡","job":"法务与知识产权","count":13,"deliver":"法律风险与处理建议","plane":"独立控制","domain":"SA","label":"律衡","kind":"DSH 数字员工","r":10.5,"text":"法务与知识产权。以法律风险与处理建议参与跨场景协作。","degree":11},{"ordinal":44,"id":"AGT-044","name":"安界","job":"产品合规与隐私","count":17,"deliver":"合规矩阵与证据缺口","plane":"独立控制","domain":"IO","label":"安界","kind":"DSH 数字员工","r":10.5,"text":"产品合规与隐私。以合规矩阵与证据缺口参与跨场景协作。","degree":10},{"ordinal":45,"id":"AGT-050","name":"门卫","job":"信息安全与权限","count":16,"deliver":"权限矩阵与访问证据","plane":"独立控制","domain":"CO","label":"门卫","kind":"DSH 数字员工","r":10.5,"text":"信息安全与权限。以权限矩阵与访问证据参与跨场景协作。","degree":4},{"ordinal":46,"id":"AGT-045","name":"同尺","job":"业务口径与主数据","count":18,"deliver":"数据口径与对象关系契约","plane":"数据与 Agent 平台","domain":"TP","label":"同尺","kind":"DSH 数字员工","r":10.5,"text":"业务口径与主数据。以数据口径与对象关系契约参与跨场景协作。","degree":8},{"ordinal":47,"id":"AGT-046","name":"清源","job":"数据工程与质量","count":14,"deliver":"带质量状态的数据产物","plane":"数据与 Agent 平台","domain":"AD","label":"清源","kind":"DSH 数字员工","r":10.5,"text":"数据工程与质量。以带质量状态的数据产物参与跨场景协作。","degree":2},{"ordinal":48,"id":"AGT-047","name":"接桥","job":"系统集成与业务工具","count":14,"deliver":"工具能力与验收包","plane":"数据与 Agent 平台","domain":"CO","label":"接桥","kind":"DSH 数字员工","r":10.5,"text":"系统集成与业务工具。以工具能力与验收包参与跨场景协作。","degree":4},{"ordinal":49,"id":"AGT-048","name":"积知","job":"知识技能与 Playbook 治理","count":17,"deliver":"能力版本与评估记录","plane":"数据与 Agent 平台","domain":"SP","label":"积知","kind":"DSH 数字员工","r":10.5,"text":"知识技能与 Playbook 治理。以能力版本与评估记录参与跨场景协作。","degree":2},{"ordinal":50,"id":"AGT-049","name":"稳行","job":"Agent 平台与可靠运行","count":15,"deliver":"运行状态与恢复证据","plane":"数据与 Agent 平台","domain":"CO","label":"稳行","kind":"DSH 数字员工","r":10.5,"text":"Agent 平台与可靠运行。以运行状态与恢复证据参与跨场景协作。","degree":1},{"id":"J-01","name":"新品机会到规模化经营","label":"新品机会到规模化经营","kind":"经营链","domain":"IO","r":14,"text":"这个新品值得做吗，如何用最小风险验证并放量？","degree":29},{"id":"J-02","name":"新市场机会到首单与持续经营","label":"新市场机会到首单与持续经营","kind":"经营链","domain":"SP","r":14,"text":"进入新国家后，怎样确保能卖、能交付、能回款？","degree":21},{"id":"J-03","name":"需求变化到库存、投放与现金再平衡","label":"需求变化到库存、投放与现金再平衡","kind":"经营链","domain":"SA","r":14,"text":"销量突然变化时，广告、库存和现金怎样共同调整？","degree":11},{"id":"J-04","name":"商品组合到多渠道可售与订单增长","label":"商品组合到多渠道可售与订单增长","kind":"经营链","domain":"IO","r":14,"text":"相同商品如何在多个渠道准确可售并增加订单？","degree":12},{"id":"J-05","name":"品牌主张到内容、投放与贡献利润","label":"品牌主张到内容、投放与贡献利润","kind":"经营链","domain":"AD","r":14,"text":"内容与投放的钱究竟带来了多少新增利润？","degree":14},{"id":"J-06","name":"下单支付到异常恢复、结算与关账","label":"下单支付到异常恢复、结算与关账","kind":"经营链","domain":"CO","r":14,"text":"有订单却没收到对应的钱，损失发生在哪里？","degree":7},{"id":"J-07","name":"采购承诺到全球交付与到岸成本验证","label":"采购承诺到全球交付与到岸成本验证","kind":"经营链","domain":"SA","r":14,"text":"货能否按承诺到达，可控成本到底是多少？","degree":12},{"id":"J-08","name":"订单履约到服务恢复与客户增值","label":"订单履约到服务恢复与客户增值","kind":"经营链","domain":"OL","r":14,"text":"交付出了问题，如何把客户损失降到最低？","degree":11},{"id":"J-09","name":"客户声音到质量纠正、追偿与复发预防","label":"客户声音到质量纠正、追偿与复发预防","kind":"经营链","domain":"IO","r":14,"text":"退款和差评是否来自同一个产品缺陷？","degree":13},{"id":"J-10","name":"账户风险到停权预防与经营恢复","label":"账户风险到停权预防与经营恢复","kind":"经营链","domain":"CO","r":14,"text":"账户出现警告时，怎样保住经营连续性？","degree":10},{"id":"J-11","name":"企业商机到履约、回款与续约","label":"企业商机到履约、回款与续约","kind":"经营链","domain":"CO","r":14,"text":"大客户订单看起来很大，是否真有利润且能收回款？","degree":10},{"id":"J-12","name":"法规变化到合规恢复与持续经营","label":"法规变化到合规恢复与持续经营","kind":"经营链","domain":"IO","r":14,"text":"规则变了，哪些商品、订单和市场需要调整？","degree":15},{"id":"J-13","name":"经营复盘到资源重配与结果验证","label":"经营复盘到资源重配与结果验证","kind":"经营链","domain":"TP","r":14,"text":"增长是否值得继续投入，下一笔预算该投在哪里？","degree":12},{"id":"J-14","name":"独立站上线到稳定运营与转化","label":"独立站上线到稳定运营与转化","kind":"经营链","domain":"CO","r":14,"text":"独立站能否按期上线，并持续安全地改善购买体验？","degree":11},{"id":"J-15","name":"社媒与直播爆量到供给、履约与现金保护","label":"社媒与直播爆量到供给、履约与现金保护","kind":"经营链","domain":"AD","r":14,"text":"突然爆量时，哪些订单值得接，怎样避免超卖和现金失控？","degree":17},{"id":"J-16","name":"产品安全信号到停售、召回与复售决定","label":"产品安全信号到停售、召回与复售决定","kind":"经营链","domain":"IO","r":14,"text":"出现伤害或安全信号后，如何快速保护消费者并保全完整证据？","degree":13},{"id":"J-17","name":"知识产权事件到渠道处置与品牌恢复","label":"知识产权事件到渠道处置与品牌恢复","kind":"经营链","domain":"AD","r":14,"text":"遇到仿冒、盗图或被投诉，应固定什么证据、采取什么策略？","degree":8},{"id":"J-18","name":"欺诈与拒付到证据提交和净资金恢复","label":"欺诈与拒付到证据提交和净资金恢复","kind":"经营链","domain":"OL","r":14,"text":"这笔拒付应接受还是抗辩，能否在期限内拿出真实证据？","degree":7},{"id":"J-19","name":"关税、汇率与运费冲击到经营组合再平衡","label":"关税、汇率与运费冲击到经营组合再平衡","kind":"经营链","domain":"SA","r":14,"text":"成本结构突然改变，应该改价、改路线、改采购还是退出？","degree":13},{"id":"J-20","name":"测量故障到预算保护与决策恢复","label":"测量故障到预算保护与决策恢复","kind":"经营链","domain":"AD","r":14,"text":"广告数据异常时，如何先保护预算，再证明可以恢复优化？","degree":7},{"id":"J-21","name":"结算差异到追索、回款与关账","label":"结算差异到追索、回款与关账","kind":"经营链","domain":"TP","r":14,"text":"平台或供应链少付、多扣、重复收费，能否追回并关闭账务差异？","degree":6},{"id":"obj-sku","name":"商品 / SKU","label":"商品 / SKU","domain":"IO","kind":"经营对象","r":20,"text":"规格、成本与生命周期有了统一身份，需求、库存、订单与利润才能围绕同一件商品形成判断。","degree":12},{"id":"obj-market","name":"国家与市场","label":"国家与市场","domain":"SP","kind":"经营对象","r":20,"text":"需求证据与进入条件相互印证，明确每个市场的投入方向、资源边界与退出条件。","degree":4},{"id":"obj-customer","name":"客户与需求","label":"客户与需求","domain":"IO","kind":"经营对象","r":20,"text":"把客户声音、购买行为与需求假设关联起来，让产品创新始于可验证的需求。","degree":6},{"id":"obj-supplier","name":"供应商","label":"供应商","domain":"SA","kind":"经营对象","r":20,"text":"供应能力、报价与质量记录相互关联，让每次采购承诺都有可追溯的依据。","degree":5},{"id":"obj-purchase","name":"采购单","label":"采购单","domain":"SA","kind":"经营对象","r":20,"text":"让获批数量、价格与交期连接到生产、验货、入仓和资金占用。","degree":6},{"id":"obj-inventory","name":"库存批次","label":"库存批次","domain":"SA","kind":"经营对象","r":20,"text":"从在途、入仓到可售，持续连接商品、渠道承诺与真实库存状态。","degree":7},{"id":"obj-warehouse","name":"仓库与履约","label":"仓库与履约","domain":"OL","kind":"经营对象","r":20,"text":"库存、物流与订单交付共用一组状态，协同兑现客户承诺。","degree":5},{"id":"obj-listing","name":"Listing","label":"Listing","domain":"CO","kind":"经营对象","r":20,"text":"让商品资料、价格和渠道规则对齐，并以平台真实可售状态验收。","degree":7},{"id":"obj-store","name":"店铺与渠道","label":"店铺与渠道","domain":"CO","kind":"经营对象","r":20,"text":"连接账户状态、商品呈现、交易记录与平台回执，统一理解渠道经营。","degree":6},{"id":"obj-campaign","name":"营销计划","label":"营销计划","domain":"AD","kind":"经营对象","r":20,"text":"把人群、素材与投入连接到转化和贡献，在预算边界内验证增长假设。","degree":6},{"id":"obj-order","name":"订单","label":"订单","domain":"OL","kind":"经营对象","r":20,"text":"一个订单连接支付、库存、交付、售后与回款，让结果跨越系统边界。","degree":10},{"id":"obj-logistics","name":"物流单","label":"物流单","domain":"OL","kind":"经营对象","r":20,"text":"交接、在途与签收成为可核验的履约证据，及时识别异常并协调恢复。","degree":5},{"id":"obj-refund","name":"退款与售后","label":"退款与售后","domain":"OL","kind":"经营对象","r":20,"text":"将退款原因关联到商品、体验和成熟订单贡献，为下一轮改进提供事实。","degree":6},{"id":"obj-settlement","name":"结算单","label":"结算单","domain":"TP","kind":"经营对象","r":20,"text":"订单、平台账单与银行到账相互核对，识别差异并验证真实回款。","degree":5},{"id":"obj-profit","name":"贡献利润","label":"贡献利润","domain":"TP","kind":"经营对象","r":20,"text":"把收入、货品、投放、履约与退款放在同一口径下，判断增长是否创造贡献。","degree":6},{"id":"obj-budget","name":"现金与预算","label":"现金与预算","domain":"TP","kind":"经营对象","r":20,"text":"用现金约束连接目标、资源承诺与投入节奏，让方案拥有明确边界。","degree":6},{"id":"obj-goal","name":"经营目标","label":"经营目标","domain":"SP","kind":"经营对象","r":20,"text":"将目标、责任与停止条件写进业务逻辑，连接每个决策与行动的理由。","degree":7},{"id":"obj-rules","name":"规则与 SOP","label":"规则与 SOP","domain":"SP","kind":"业务逻辑","r":20,"text":"把经营约束与经过验证的经验沉淀为可审查的业务逻辑，持续支持下一轮判断。","degree":7},{"id":"obj-action","name":"授权行动","label":"授权行动","domain":"CO","kind":"授权行动","r":20,"text":"动作绑定经营对象、版本、预算与有效期，在批准范围内推进真实业务变化。","degree":9},{"id":"obj-receipt","name":"外部回执","label":"外部回执","domain":"TP","kind":"回执与进化","r":20,"text":"从目标系统读回受理与实际生效状态，再关联经营结果，更新对象与企业经验。","degree":9}],"edges":[{"source":"brand","target":"SP","kind":"经营目标"},{"source":"brand","target":"IO","kind":"经营目标"},{"source":"brand","target":"SA","kind":"经营目标"},{"source":"brand","target":"AD","kind":"经营目标"},{"source":"brand","target":"CO","kind":"经营目标"},{"source":"brand","target":"OL","kind":"经营目标"},{"source":"brand","target":"TP","kind":"经营目标"},{"source":"SP","target":"SP-01","kind":"业务场景"},{"source":"SP","target":"SP-02","kind":"业务场景"},{"source":"SP","target":"SP-03","kind":"业务场景"},{"source":"SP","target":"SP-04","kind":"业务场景"},{"source":"SP","target":"SP-05","kind":"业务场景"},{"source":"IO","target":"IO-01","kind":"业务场景"},{"source":"IO","target":"IO-02","kind":"业务场景"},{"source":"IO","target":"IO-03","kind":"业务场景"},{"source":"IO","target":"IO-04","kind":"业务场景"},{"source":"IO","target":"IO-05","kind":"业务场景"},{"source":"IO","target":"IO-06","kind":"业务场景"},{"source":"IO","target":"IO-07","kind":"业务场景"},{"source":"IO","target":"IO-08","kind":"业务场景"},{"source":"SA","target":"SA-01","kind":"业务场景"},{"source":"SA","target":"SA-02","kind":"业务场景"},{"source":"SA","target":"SA-03","kind":"业务场景"},{"source":"SA","target":"SA-04","kind":"业务场景"},{"source":"SA","target":"SA-05","kind":"业务场景"},{"source":"SA","target":"SA-06","kind":"业务场景"},{"source":"SA","target":"SA-07","kind":"业务场景"},{"source":"SA","target":"SA-08","kind":"业务场景"},{"source":"SA","target":"SA-09","kind":"业务场景"},{"source":"SA","target":"SA-10","kind":"业务场景"},{"source":"AD","target":"AD-01","kind":"业务场景"},{"source":"AD","target":"AD-02","kind":"业务场景"},{"source":"AD","target":"AD-03","kind":"业务场景"},{"source":"AD","target":"AD-04","kind":"业务场景"},{"source":"AD","target":"AD-05","kind":"业务场景"},{"source":"AD","target":"AD-06","kind":"业务场景"},{"source":"AD","target":"AD-07","kind":"业务场景"},{"source":"AD","target":"AD-08","kind":"业务场景"},{"source":"AD","target":"AD-09","kind":"业务场景"},{"source":"CO","target":"CO-01","kind":"业务场景"},{"source":"CO","target":"CO-02","kind":"业务场景"},{"source":"CO","target":"CO-03","kind":"业务场景"},{"source":"CO","target":"CO-04","kind":"业务场景"},{"source":"CO","target":"CO-05","kind":"业务场景"},{"source":"CO","target":"CO-06","kind":"业务场景"},{"source":"CO","target":"CO-07","kind":"业务场景"},{"source":"CO","target":"CO-08","kind":"业务场景"},{"source":"CO","target":"CO-09","kind":"业务场景"},{"source":"CO","target":"CO-10","kind":"业务场景"},{"source":"OL","target":"OL-01","kind":"业务场景"},{"source":"OL","target":"OL-02","kind":"业务场景"},{"source":"OL","target":"OL-03","kind":"业务场景"},{"source":"OL","target":"OL-04","kind":"业务场景"},{"source":"OL","target":"OL-05","kind":"业务场景"},{"source":"OL","target":"OL-06","kind":"业务场景"},{"source":"OL","target":"OL-07","kind":"业务场景"},{"source":"OL","target":"OL-08","kind":"业务场景"},{"source":"OL","target":"OL-09","kind":"业务场景"},{"source":"TP","target":"TP-01","kind":"业务场景"},{"source":"TP","target":"TP-02","kind":"业务场景"},{"source":"TP","target":"TP-03","kind":"业务场景"},{"source":"TP","target":"TP-04","kind":"业务场景"},{"source":"TP","target":"TP-05","kind":"业务场景"},{"source":"TP","target":"TP-06","kind":"业务场景"},{"source":"TP","target":"TP-07","kind":"业务场景"},{"source":"TP","target":"TP-08","kind":"业务场景"},{"source":"SP-01","target":"AGT-001","kind":"专业协作"},{"source":"SP-02","target":"AGT-001","kind":"牵头交付"},{"source":"SP-03","target":"AGT-001","kind":"牵头交付"},{"source":"SP-04","target":"AGT-001","kind":"牵头交付"},{"source":"SP-05","target":"AGT-001","kind":"牵头交付"},{"source":"TP-05","target":"AGT-001","kind":"专业协作"},{"source":"TP-08","target":"AGT-001","kind":"专业协作"},{"source":"SP-03","target":"AGT-003","kind":"专业协作"},{"source":"SP-05","target":"AGT-003","kind":"专业协作"},{"source":"IO-01","target":"AGT-003","kind":"专业协作"},{"source":"SA-01","target":"AGT-003","kind":"专业协作"},{"source":"AD-07","target":"AGT-003","kind":"专业协作"},{"source":"TP-06","target":"AGT-003","kind":"牵头交付"},{"source":"TP-08","target":"AGT-003","kind":"专业协作"},{"source":"SP-03","target":"AGT-004","kind":"专业协作"},{"source":"SP-04","target":"AGT-004","kind":"专业协作"},{"source":"SP-01","target":"AGT-041","kind":"专业协作"},{"source":"SP-03","target":"AGT-041","kind":"专业协作"},{"source":"SP-04","target":"AGT-041","kind":"专业协作"},{"source":"SP-05","target":"AGT-041","kind":"专业协作"},{"source":"IO-03","target":"AGT-041","kind":"专业协作"},{"source":"SA-01","target":"AGT-041","kind":"专业协作"},{"source":"SA-02","target":"AGT-041","kind":"专业协作"},{"source":"SA-05","target":"AGT-041","kind":"专业协作"},{"source":"CO-04","target":"AGT-041","kind":"专业协作"},{"source":"CO-08","target":"AGT-041","kind":"专业协作"},{"source":"TP-02","target":"AGT-041","kind":"专业协作"},{"source":"TP-03","target":"AGT-041","kind":"专业协作"},{"source":"TP-05","target":"AGT-041","kind":"牵头交付"},{"source":"TP-06","target":"AGT-041","kind":"专业协作"},{"source":"TP-08","target":"AGT-041","kind":"牵头交付"},{"source":"IO-02","target":"AGT-006","kind":"牵头交付"},{"source":"AD-01","target":"AGT-006","kind":"专业协作"},{"source":"AD-02","target":"AGT-006","kind":"牵头交付"},{"source":"SP-01","target":"AGT-007","kind":"专业协作"},{"source":"IO-01","target":"AGT-007","kind":"牵头交付"},{"source":"IO-03","target":"AGT-007","kind":"专业协作"},{"source":"SP-02","target":"AGT-008","kind":"专业协作"},{"source":"IO-03","target":"AGT-008","kind":"牵头交付"},{"source":"IO-06","target":"AGT-008","kind":"牵头交付"},{"source":"IO-03","target":"AGT-009","kind":"专业协作"},{"source":"IO-04","target":"AGT-009","kind":"牵头交付"},{"source":"IO-05","target":"AGT-009","kind":"专业协作"},{"source":"IO-06","target":"AGT-009","kind":"专业协作"},{"source":"IO-07","target":"AGT-009","kind":"专业协作"},{"source":"IO-04","target":"AGT-010","kind":"专业协作"},{"source":"CO-06","target":"AGT-010","kind":"专业协作"},{"source":"IO-04","target":"AGT-011","kind":"专业协作"},{"source":"SA-06","target":"AGT-011","kind":"专业协作"},{"source":"IO-04","target":"AGT-012","kind":"专业协作"},{"source":"IO-04","target":"AGT-013","kind":"专业协作"},{"source":"IO-05","target":"AGT-013","kind":"牵头交付"},{"source":"SA-07","target":"AGT-013","kind":"专业协作"},{"source":"OL-07","target":"AGT-013","kind":"专业协作"},{"source":"IO-08","target":"AGT-013","kind":"专业协作"},{"source":"SA-03","target":"AGT-014","kind":"牵头交付"},{"source":"SA-04","target":"AGT-014","kind":"牵头交付"},{"source":"SA-05","target":"AGT-014","kind":"专业协作"},{"source":"SA-06","target":"AGT-014","kind":"专业协作"},{"source":"SA-03","target":"AGT-015","kind":"专业协作"},{"source":"SA-04","target":"AGT-015","kind":"专业协作"},{"source":"SA-05","target":"AGT-015","kind":"牵头交付"},{"source":"SA-06","target":"AGT-015","kind":"专业协作"},{"source":"SA-08","target":"AGT-015","kind":"专业协作"},{"source":"CO-08","target":"AGT-015","kind":"专业协作"},{"source":"TP-03","target":"AGT-015","kind":"专业协作"},{"source":"SA-10","target":"AGT-015","kind":"专业协作"},{"source":"SP-04","target":"AGT-016","kind":"专业协作"},{"source":"SA-01","target":"AGT-016","kind":"牵头交付"},{"source":"SA-02","target":"AGT-016","kind":"专业协作"},{"source":"SA-05","target":"AGT-016","kind":"专业协作"},{"source":"SA-06","target":"AGT-016","kind":"专业协作"},{"source":"AD-05","target":"AGT-016","kind":"专业协作"},{"source":"TP-08","target":"AGT-016","kind":"专业协作"},{"source":"IO-06","target":"AGT-017","kind":"专业协作"},{"source":"SA-02","target":"AGT-017","kind":"牵头交付"},{"source":"SA-09","target":"AGT-017","kind":"专业协作"},{"source":"CO-05","target":"AGT-017","kind":"专业协作"},{"source":"OL-01","target":"AGT-017","kind":"专业协作"},{"source":"OL-02","target":"AGT-017","kind":"专业协作"},{"source":"IO-05","target":"AGT-018","kind":"专业协作"},{"source":"SA-04","target":"AGT-018","kind":"专业协作"},{"source":"SA-05","target":"AGT-018","kind":"专业协作"},{"source":"SA-06","target":"AGT-018","kind":"牵头交付"},{"source":"SA-07","target":"AGT-018","kind":"牵头交付"},{"source":"OL-06","target":"AGT-018","kind":"专业协作"},{"source":"OL-07","target":"AGT-018","kind":"牵头交付"},{"source":"TP-03","target":"AGT-018","kind":"专业协作"},{"source":"IO-08","target":"AGT-018","kind":"专业协作"},{"source":"SA-03","target":"AGT-019","kind":"专业协作"},{"source":"SA-08","target":"AGT-019","kind":"牵头交付"},{"source":"SA-09","target":"AGT-019","kind":"专业协作"},{"source":"OL-02","target":"AGT-019","kind":"专业协作"},{"source":"OL-03","target":"AGT-019","kind":"牵头交付"},{"source":"TP-04","target":"AGT-019","kind":"专业协作"},{"source":"SA-10","target":"AGT-019","kind":"牵头交付"},{"source":"SA-02","target":"AGT-020","kind":"专业协作"},{"source":"SA-08","target":"AGT-020","kind":"专业协作"},{"source":"SA-09","target":"AGT-020","kind":"牵头交付"},{"source":"CO-08","target":"AGT-020","kind":"专业协作"},{"source":"OL-01","target":"AGT-020","kind":"牵头交付"},{"source":"OL-02","target":"AGT-020","kind":"牵头交付"},{"source":"OL-03","target":"AGT-020","kind":"专业协作"},{"source":"OL-05","target":"AGT-020","kind":"专业协作"},{"source":"OL-06","target":"AGT-020","kind":"牵头交付"},{"source":"OL-07","target":"AGT-020","kind":"专业协作"},{"source":"TP-01","target":"AGT-020","kind":"专业协作"},{"source":"OL-09","target":"AGT-020","kind":"专业协作"},{"source":"SP-02","target":"AGT-021","kind":"专业协作"},{"source":"SA-01","target":"AGT-021","kind":"专业协作"},{"source":"AD-05","target":"AGT-021","kind":"专业协作"},{"source":"CO-01","target":"AGT-021","kind":"专业协作"},{"source":"CO-04","target":"AGT-021","kind":"专业协作"},{"source":"CO-05","target":"AGT-021","kind":"专业协作"},{"source":"CO-07","target":"AGT-021","kind":"专业协作"},{"source":"CO-09","target":"AGT-021","kind":"专业协作"},{"source":"OL-01","target":"AGT-021","kind":"专业协作"},{"source":"TP-01","target":"AGT-021","kind":"专业协作"},{"source":"IO-07","target":"AGT-022","kind":"专业协作"},{"source":"CO-02","target":"AGT-022","kind":"牵头交付"},{"source":"CO-03","target":"AGT-022","kind":"牵头交付"},{"source":"CO-06","target":"AGT-022","kind":"专业协作"},{"source":"CO-10","target":"AGT-022","kind":"专业协作"},{"source":"SP-02","target":"AGT-023","kind":"专业协作"},{"source":"CO-01","target":"AGT-023","kind":"专业协作"},{"source":"CO-03","target":"AGT-023","kind":"专业协作"},{"source":"CO-04","target":"AGT-023","kind":"专业协作"},{"source":"CO-05","target":"AGT-023","kind":"专业协作"},{"source":"CO-06","target":"AGT-023","kind":"牵头交付"},{"source":"CO-09","target":"AGT-023","kind":"牵头交付"},{"source":"OL-01","target":"AGT-023","kind":"专业协作"},{"source":"TP-01","target":"AGT-023","kind":"专业协作"},{"source":"CO-10","target":"AGT-023","kind":"牵头交付"},{"source":"SP-01","target":"AGT-024","kind":"牵头交付"},{"source":"SP-02","target":"AGT-024","kind":"专业协作"},{"source":"IO-01","target":"AGT-024","kind":"专业协作"},{"source":"CO-01","target":"AGT-024","kind":"牵头交付"},{"source":"CO-09","target":"AGT-024","kind":"专业协作"},{"source":"SP-02","target":"AGT-025","kind":"专业协作"},{"source":"CO-01","target":"AGT-025","kind":"专业协作"},{"source":"CO-04","target":"AGT-025","kind":"专业协作"},{"source":"CO-08","target":"AGT-025","kind":"牵头交付"},{"source":"TP-02","target":"AGT-025","kind":"专业协作"},{"source":"IO-06","target":"AGT-026","kind":"专业协作"},{"source":"SA-02","target":"AGT-026","kind":"专业协作"},{"source":"AD-05","target":"AGT-026","kind":"专业协作"},{"source":"CO-03","target":"AGT-026","kind":"专业协作"},{"source":"CO-04","target":"AGT-026","kind":"牵头交付"},{"source":"CO-05","target":"AGT-026","kind":"牵头交付"},{"source":"OL-08","target":"AGT-026","kind":"专业协作"},{"source":"CO-07","target":"AGT-027","kind":"牵头交付"},{"source":"OL-02","target":"AGT-027","kind":"专业协作"},{"source":"IO-08","target":"AGT-027","kind":"专业协作"},{"source":"AD-08","target":"AGT-027","kind":"专业协作"},{"source":"IO-07","target":"AGT-028","kind":"专业协作"},{"source":"AD-01","target":"AGT-028","kind":"专业协作"},{"source":"AD-03","target":"AGT-028","kind":"专业协作"},{"source":"CO-02","target":"AGT-028","kind":"专业协作"},{"source":"CO-10","target":"AGT-028","kind":"专业协作"},{"source":"IO-01","target":"AGT-029","kind":"专业协作"},{"source":"AD-01","target":"AGT-029","kind":"牵头交付"},{"source":"AD-02","target":"AGT-029","kind":"专业协作"},{"source":"AD-03","target":"AGT-029","kind":"专业协作"},{"source":"AD-04","target":"AGT-029","kind":"专业协作"},{"source":"AD-08","target":"AGT-029","kind":"专业协作"},{"source":"AD-01","target":"AGT-030","kind":"专业协作"},{"source":"AD-03","target":"AGT-030","kind":"牵头交付"},{"source":"AD-04","target":"AGT-030","kind":"专业协作"},{"source":"CO-03","target":"AGT-030","kind":"专业协作"},{"source":"IO-07","target":"AGT-031","kind":"专业协作"},{"source":"AD-03","target":"AGT-031","kind":"专业协作"},{"source":"CO-02","target":"AGT-031","kind":"专业协作"},{"source":"AD-08","target":"AGT-031","kind":"专业协作"},{"source":"SP-04","target":"AGT-032","kind":"专业协作"},{"source":"SA-01","target":"AGT-032","kind":"专业协作"},{"source":"AD-05","target":"AGT-032","kind":"牵头交付"},{"source":"AD-07","target":"AGT-032","kind":"专业协作"},{"source":"CO-05","target":"AGT-032","kind":"专业协作"},{"source":"AD-09","target":"AGT-032","kind":"专业协作"},{"source":"AD-04","target":"AGT-033","kind":"牵头交付"},{"source":"AD-02","target":"AGT-034","kind":"专业协作"},{"source":"AD-06","target":"AGT-034","kind":"牵头交付"},{"source":"OL-08","target":"AGT-034","kind":"牵头交付"},{"source":"SP-05","target":"AGT-035","kind":"专业协作"},{"source":"IO-03","target":"AGT-035","kind":"专业协作"},{"source":"AD-02","target":"AGT-035","kind":"专业协作"},{"source":"AD-05","target":"AGT-035","kind":"专业协作"},{"source":"AD-07","target":"AGT-035","kind":"牵头交付"},{"source":"CO-06","target":"AGT-035","kind":"专业协作"},{"source":"AD-09","target":"AGT-035","kind":"专业协作"},{"source":"CO-10","target":"AGT-035","kind":"专业协作"},{"source":"IO-02","target":"AGT-036","kind":"专业协作"},{"source":"AD-06","target":"AGT-036","kind":"专业协作"},{"source":"OL-04","target":"AGT-036","kind":"专业协作"},{"source":"SA-07","target":"AGT-037","kind":"专业协作"},{"source":"OL-03","target":"AGT-037","kind":"专业协作"},{"source":"OL-04","target":"AGT-037","kind":"牵头交付"},{"source":"OL-05","target":"AGT-037","kind":"牵头交付"},{"source":"OL-06","target":"AGT-037","kind":"专业协作"},{"source":"OL-07","target":"AGT-037","kind":"专业协作"},{"source":"OL-08","target":"AGT-037","kind":"专业协作"},{"source":"OL-09","target":"AGT-037","kind":"专业协作"},{"source":"IO-02","target":"AGT-038","kind":"专业协作"},{"source":"SA-07","target":"AGT-038","kind":"专业协作"},{"source":"IO-02","target":"AGT-039","kind":"专业协作"},{"source":"AD-06","target":"AGT-039","kind":"专业协作"},{"source":"OL-04","target":"AGT-039","kind":"专业协作"},{"source":"OL-08","target":"AGT-039","kind":"专业协作"},{"source":"AD-04","target":"AGT-040","kind":"专业协作"},{"source":"AD-07","target":"AGT-040","kind":"专业协作"},{"source":"CO-09","target":"AGT-040","kind":"专业协作"},{"source":"OL-03","target":"AGT-040","kind":"专业协作"},{"source":"OL-05","target":"AGT-040","kind":"专业协作"},{"source":"OL-06","target":"AGT-040","kind":"专业协作"},{"source":"TP-01","target":"AGT-040","kind":"牵头交付"},{"source":"TP-02","target":"AGT-040","kind":"牵头交付"},{"source":"TP-03","target":"AGT-040","kind":"牵头交付"},{"source":"TP-04","target":"AGT-040","kind":"专业协作"},{"source":"TP-05","target":"AGT-040","kind":"专业协作"},{"source":"TP-06","target":"AGT-040","kind":"专业协作"},{"source":"TP-07","target":"AGT-040","kind":"牵头交付"},{"source":"OL-09","target":"AGT-040","kind":"牵头交付"},{"source":"SP-05","target":"AGT-005","kind":"专业协作"},{"source":"OL-05","target":"AGT-005","kind":"专业协作"},{"source":"TP-07","target":"AGT-005","kind":"专业协作"},{"source":"AD-08","target":"AGT-005","kind":"专业协作"},{"source":"OL-09","target":"AGT-005","kind":"专业协作"},{"source":"SP-01","target":"AGT-042","kind":"专业协作"},{"source":"SA-08","target":"AGT-042","kind":"专业协作"},{"source":"TP-04","target":"AGT-042","kind":"牵头交付"},{"source":"TP-05","target":"AGT-042","kind":"专业协作"},{"source":"TP-07","target":"AGT-042","kind":"专业协作"},{"source":"SA-10","target":"AGT-042","kind":"专业协作"},{"source":"CO-10","target":"AGT-042","kind":"专业协作"},{"source":"SA-03","target":"AGT-043","kind":"专业协作"},{"source":"SA-04","target":"AGT-043","kind":"专业协作"},{"source":"AD-04","target":"AGT-043","kind":"专业协作"},{"source":"CO-07","target":"AGT-043","kind":"专业协作"},{"source":"CO-08","target":"AGT-043","kind":"专业协作"},{"source":"TP-02","target":"AGT-043","kind":"专业协作"},{"source":"TP-04","target":"AGT-043","kind":"专业协作"},{"source":"IO-08","target":"AGT-043","kind":"专业协作"},{"source":"SA-10","target":"AGT-043","kind":"专业协作"},{"source":"AD-08","target":"AGT-043","kind":"牵头交付"},{"source":"OL-09","target":"AGT-043","kind":"专业协作"},{"source":"SP-01","target":"AGT-044","kind":"专业协作"},{"source":"IO-05","target":"AGT-044","kind":"专业协作"},{"source":"SA-07","target":"AGT-044","kind":"专业协作"},{"source":"SA-08","target":"AGT-044","kind":"专业协作"},{"source":"AD-03","target":"AGT-044","kind":"专业协作"},{"source":"AD-06","target":"AGT-044","kind":"专业协作"},{"source":"CO-02","target":"AGT-044","kind":"专业协作"},{"source":"CO-07","target":"AGT-044","kind":"专业协作"},{"source":"IO-08","target":"AGT-044","kind":"牵头交付"},{"source":"SA-10","target":"AGT-044","kind":"专业协作"},{"source":"CO-09","target":"AGT-050","kind":"专业协作"},{"source":"AD-09","target":"AGT-050","kind":"专业协作"},{"source":"CO-10","target":"AGT-050","kind":"专业协作"},{"source":"OL-09","target":"AGT-050","kind":"专业协作"},{"source":"IO-07","target":"AGT-045","kind":"牵头交付"},{"source":"AD-07","target":"AGT-045","kind":"专业协作"},{"source":"CO-02","target":"AGT-045","kind":"专业协作"},{"source":"OL-04","target":"AGT-045","kind":"专业协作"},{"source":"TP-01","target":"AGT-045","kind":"专业协作"},{"source":"TP-06","target":"AGT-045","kind":"专业协作"},{"source":"TP-07","target":"AGT-045","kind":"专业协作"},{"source":"AD-09","target":"AGT-045","kind":"专业协作"},{"source":"SA-09","target":"AGT-046","kind":"专业协作"},{"source":"AD-09","target":"AGT-046","kind":"牵头交付"},{"source":"CO-01","target":"AGT-047","kind":"专业协作"},{"source":"OL-01","target":"AGT-047","kind":"专业协作"},{"source":"AD-09","target":"AGT-047","kind":"专业协作"},{"source":"CO-10","target":"AGT-047","kind":"专业协作"},{"source":"CO-07","target":"AGT-049","kind":"专业协作"},{"source":"J-01","target":"IO-01","kind":"跨场景协同"},{"source":"J-01","target":"IO-02","kind":"跨场景协同"},{"source":"J-01","target":"IO-03","kind":"跨场景协同"},{"source":"J-01","target":"SP-03","kind":"跨场景协同"},{"source":"J-01","target":"SP-04","kind":"跨场景协同"},{"source":"J-01","target":"IO-04","kind":"跨场景协同"},{"source":"J-01","target":"IO-05","kind":"跨场景协同"},{"source":"J-01","target":"IO-08","kind":"跨场景协同"},{"source":"J-01","target":"SA-03","kind":"跨场景协同"},{"source":"J-01","target":"SA-04","kind":"跨场景协同"},{"source":"J-01","target":"SA-05","kind":"跨场景协同"},{"source":"J-01","target":"SA-06","kind":"跨场景协同"},{"source":"J-01","target":"SA-07","kind":"跨场景协同"},{"source":"J-01","target":"SA-08","kind":"跨场景协同"},{"source":"J-01","target":"SA-09","kind":"跨场景协同"},{"source":"J-01","target":"SA-10","kind":"跨场景协同"},{"source":"J-01","target":"IO-07","kind":"跨场景协同"},{"source":"J-01","target":"AD-01","kind":"跨场景协同"},{"source":"J-01","target":"AD-03","kind":"跨场景协同"},{"source":"J-01","target":"AD-05","kind":"跨场景协同"},{"source":"J-01","target":"CO-02","kind":"跨场景协同"},{"source":"J-01","target":"CO-04","kind":"跨场景协同"},{"source":"J-01","target":"CO-09","kind":"跨场景协同"},{"source":"J-01","target":"OL-01","kind":"跨场景协同"},{"source":"J-01","target":"OL-02","kind":"跨场景协同"},{"source":"J-01","target":"OL-04","kind":"跨场景协同"},{"source":"J-01","target":"TP-01","kind":"跨场景协同"},{"source":"J-01","target":"TP-06","kind":"跨场景协同"},{"source":"J-01","target":"SA-02","kind":"跨场景协同"},{"source":"J-02","target":"SP-01","kind":"跨场景协同"},{"source":"J-02","target":"IO-01","kind":"跨场景协同"},{"source":"J-02","target":"IO-03","kind":"跨场景协同"},{"source":"J-02","target":"IO-08","kind":"跨场景协同"},{"source":"J-02","target":"SA-10","kind":"跨场景协同"},{"source":"J-02","target":"TP-04","kind":"跨场景协同"},{"source":"J-02","target":"CO-01","kind":"跨场景协同"},{"source":"J-02","target":"SA-08","kind":"跨场景协同"},{"source":"J-02","target":"SA-09","kind":"跨场景协同"},{"source":"J-02","target":"AD-03","kind":"跨场景协同"},{"source":"J-02","target":"IO-07","kind":"跨场景协同"},{"source":"J-02","target":"CO-02","kind":"跨场景协同"},{"source":"J-02","target":"CO-10","kind":"跨场景协同"},{"source":"J-02","target":"CO-09","kind":"跨场景协同"},{"source":"J-02","target":"OL-01","kind":"跨场景协同"},{"source":"J-02","target":"OL-02","kind":"跨场景协同"},{"source":"J-02","target":"OL-03","kind":"跨场景协同"},{"source":"J-02","target":"TP-01","kind":"跨场景协同"},{"source":"J-02","target":"TP-06","kind":"跨场景协同"},{"source":"J-02","target":"TP-08","kind":"跨场景协同"},{"source":"J-02","target":"SP-05","kind":"跨场景协同"},{"source":"J-03","target":"SA-01","kind":"跨场景协同"},{"source":"J-03","target":"AD-09","kind":"跨场景协同"},{"source":"J-03","target":"TP-06","kind":"跨场景协同"},{"source":"J-03","target":"SA-02","kind":"跨场景协同"},{"source":"J-03","target":"SA-05","kind":"跨场景协同"},{"source":"J-03","target":"AD-05","kind":"跨场景协同"},{"source":"J-03","target":"CO-04","kind":"跨场景协同"},{"source":"J-03","target":"CO-05","kind":"跨场景协同"},{"source":"J-03","target":"TP-05","kind":"跨场景协同"},{"source":"J-03","target":"TP-08","kind":"跨场景协同"},{"source":"J-03","target":"SP-04","kind":"跨场景协同"},{"source":"J-04","target":"IO-06","kind":"跨场景协同"},{"source":"J-04","target":"IO-07","kind":"跨场景协同"},{"source":"J-04","target":"IO-08","kind":"跨场景协同"},{"source":"J-04","target":"AD-08","kind":"跨场景协同"},{"source":"J-04","target":"CO-02","kind":"跨场景协同"},{"source":"J-04","target":"SA-09","kind":"跨场景协同"},{"source":"J-04","target":"CO-03","kind":"跨场景协同"},{"source":"J-04","target":"CO-04","kind":"跨场景协同"},{"source":"J-04","target":"CO-05","kind":"跨场景协同"},{"source":"J-04","target":"CO-06","kind":"跨场景协同"},{"source":"J-04","target":"TP-06","kind":"跨场景协同"},{"source":"J-04","target":"AD-07","kind":"跨场景协同"},{"source":"J-05","target":"AD-01","kind":"跨场景协同"},{"source":"J-05","target":"AD-02","kind":"跨场景协同"},{"source":"J-05","target":"AD-03","kind":"跨场景协同"},{"source":"J-05","target":"AD-04","kind":"跨场景协同"},{"source":"J-05","target":"AD-08","kind":"跨场景协同"},{"source":"J-05","target":"AD-05","kind":"跨场景协同"},{"source":"J-05","target":"AD-06","kind":"跨场景协同"},{"source":"J-05","target":"SA-02","kind":"跨场景协同"},{"source":"J-05","target":"CO-09","kind":"跨场景协同"},{"source":"J-05","target":"OL-05","kind":"跨场景协同"},{"source":"J-05","target":"TP-03","kind":"跨场景协同"},{"source":"J-05","target":"TP-06","kind":"跨场景协同"},{"source":"J-05","target":"AD-07","kind":"跨场景协同"},{"source":"J-05","target":"AD-09","kind":"跨场景协同"},{"source":"J-06","target":"CO-09","kind":"跨场景协同"},{"source":"J-06","target":"OL-01","kind":"跨场景协同"},{"source":"J-06","target":"OL-03","kind":"跨场景协同"},{"source":"J-06","target":"OL-05","kind":"跨场景协同"},{"source":"J-06","target":"TP-01","kind":"跨场景协同"},{"source":"J-06","target":"TP-06","kind":"跨场景协同"},{"source":"J-06","target":"TP-07","kind":"跨场景协同"},{"source":"J-07","target":"SA-03","kind":"跨场景协同"},{"source":"J-07","target":"SA-04","kind":"跨场景协同"},{"source":"J-07","target":"SA-05","kind":"跨场景协同"},{"source":"J-07","target":"SA-06","kind":"跨场景协同"},{"source":"J-07","target":"SA-07","kind":"跨场景协同"},{"source":"J-07","target":"TP-03","kind":"跨场景协同"},{"source":"J-07","target":"SA-08","kind":"跨场景协同"},{"source":"J-07","target":"SA-09","kind":"跨场景协同"},{"source":"J-07","target":"SA-10","kind":"跨场景协同"},{"source":"J-07","target":"OL-02","kind":"跨场景协同"},{"source":"J-07","target":"OL-03","kind":"跨场景协同"},{"source":"J-07","target":"TP-06","kind":"跨场景协同"},{"source":"J-08","target":"OL-01","kind":"跨场景协同"},{"source":"J-08","target":"OL-02","kind":"跨场景协同"},{"source":"J-08","target":"OL-03","kind":"跨场景协同"},{"source":"J-08","target":"OL-04","kind":"跨场景协同"},{"source":"J-08","target":"OL-05","kind":"跨场景协同"},{"source":"J-08","target":"OL-06","kind":"跨场景协同"},{"source":"J-08","target":"OL-07","kind":"跨场景协同"},{"source":"J-08","target":"TP-01","kind":"跨场景协同"},{"source":"J-08","target":"TP-06","kind":"跨场景协同"},{"source":"J-08","target":"OL-08","kind":"跨场景协同"},{"source":"J-08","target":"AD-06","kind":"跨场景协同"},{"source":"J-09","target":"IO-02","kind":"跨场景协同"},{"source":"J-09","target":"OL-04","kind":"跨场景协同"},{"source":"J-09","target":"OL-06","kind":"跨场景协同"},{"source":"J-09","target":"SA-07","kind":"跨场景协同"},{"source":"J-09","target":"OL-01","kind":"跨场景协同"},{"source":"J-09","target":"OL-03","kind":"跨场景协同"},{"source":"J-09","target":"IO-08","kind":"跨场景协同"},{"source":"J-09","target":"SA-04","kind":"跨场景协同"},{"source":"J-09","target":"TP-03","kind":"跨场景协同"},{"source":"J-09","target":"TP-07","kind":"跨场景协同"},{"source":"J-09","target":"OL-05","kind":"跨场景协同"},{"source":"J-09","target":"IO-07","kind":"跨场景协同"},{"source":"J-09","target":"AD-03","kind":"跨场景协同"},{"source":"J-10","target":"CO-07","kind":"跨场景协同"},{"source":"J-10","target":"IO-08","kind":"跨场景协同"},{"source":"J-10","target":"AD-08","kind":"跨场景协同"},{"source":"J-10","target":"CO-02","kind":"跨场景协同"},{"source":"J-10","target":"OL-04","kind":"跨场景协同"},{"source":"J-10","target":"AD-05","kind":"跨场景协同"},{"source":"J-10","target":"SA-02","kind":"跨场景协同"},{"source":"J-10","target":"TP-05","kind":"跨场景协同"},{"source":"J-10","target":"CO-09","kind":"跨场景协同"},{"source":"J-10","target":"TP-01","kind":"跨场景协同"},{"source":"J-11","target":"CO-08","kind":"跨场景协同"},{"source":"J-11","target":"TP-02","kind":"跨场景协同"},{"source":"J-11","target":"TP-06","kind":"跨场景协同"},{"source":"J-11","target":"SA-02","kind":"跨场景协同"},{"source":"J-11","target":"OL-01","kind":"跨场景协同"},{"source":"J-11","target":"OL-02","kind":"跨场景协同"},{"source":"J-11","target":"OL-03","kind":"跨场景协同"},{"source":"J-11","target":"TP-04","kind":"跨场景协同"},{"source":"J-11","target":"TP-01","kind":"跨场景协同"},{"source":"J-11","target":"OL-08","kind":"跨场景协同"},{"source":"J-12","target":"IO-08","kind":"跨场景协同"},{"source":"J-12","target":"SA-10","kind":"跨场景协同"},{"source":"J-12","target":"TP-04","kind":"跨场景协同"},{"source":"J-12","target":"IO-07","kind":"跨场景协同"},{"source":"J-12","target":"SA-07","kind":"跨场景协同"},{"source":"J-12","target":"SA-08","kind":"跨场景协同"},{"source":"J-12","target":"CO-02","kind":"跨场景协同"},{"source":"J-12","target":"CO-07","kind":"跨场景协同"},{"source":"J-12","target":"SA-09","kind":"跨场景协同"},{"source":"J-12","target":"OL-04","kind":"跨场景协同"},{"source":"J-12","target":"IO-04","kind":"跨场景协同"},{"source":"J-12","target":"IO-05","kind":"跨场景协同"},{"source":"J-12","target":"AD-03","kind":"跨场景协同"},{"source":"J-12","target":"TP-07","kind":"跨场景协同"},{"source":"J-12","target":"SP-05","kind":"跨场景协同"},{"source":"J-13","target":"TP-01","kind":"跨场景协同"},{"source":"J-13","target":"TP-06","kind":"跨场景协同"},{"source":"J-13","target":"TP-07","kind":"跨场景协同"},{"source":"J-13","target":"AD-07","kind":"跨场景协同"},{"source":"J-13","target":"TP-08","kind":"跨场景协同"},{"source":"J-13","target":"SP-05","kind":"跨场景协同"},{"source":"J-13","target":"SP-02","kind":"跨场景协同"},{"source":"J-13","target":"SP-04","kind":"跨场景协同"},{"source":"J-13","target":"TP-05","kind":"跨场景协同"},{"source":"J-13","target":"SP-03","kind":"跨场景协同"},{"source":"J-13","target":"SA-02","kind":"跨场景协同"},{"source":"J-13","target":"AD-05","kind":"跨场景协同"},{"source":"J-14","target":"CO-01","kind":"跨场景协同"},{"source":"J-14","target":"CO-10","kind":"跨场景协同"},{"source":"J-14","target":"TP-04","kind":"跨场景协同"},{"source":"J-14","target":"IO-07","kind":"跨场景协同"},{"source":"J-14","target":"CO-02","kind":"跨场景协同"},{"source":"J-14","target":"AD-03","kind":"跨场景协同"},{"source":"J-14","target":"AD-09","kind":"跨场景协同"},{"source":"J-14","target":"CO-09","kind":"跨场景协同"},{"source":"J-14","target":"CO-06","kind":"跨场景协同"},{"source":"J-14","target":"AD-07","kind":"跨场景协同"},{"source":"J-14","target":"TP-06","kind":"跨场景协同"},{"source":"J-15","target":"AD-04","kind":"跨场景协同"},{"source":"J-15","target":"AD-05","kind":"跨场景协同"},{"source":"J-15","target":"AD-09","kind":"跨场景协同"},{"source":"J-15","target":"CO-09","kind":"跨场景协同"},{"source":"J-15","target":"SA-01","kind":"跨场景协同"},{"source":"J-15","target":"SA-02","kind":"跨场景协同"},{"source":"J-15","target":"SA-09","kind":"跨场景协同"},{"source":"J-15","target":"OL-01","kind":"跨场景协同"},{"source":"J-15","target":"OL-02","kind":"跨场景协同"},{"source":"J-15","target":"TP-05","kind":"跨场景协同"},{"source":"J-15","target":"TP-08","kind":"跨场景协同"},{"source":"J-15","target":"SP-04","kind":"跨场景协同"},{"source":"J-15","target":"CO-05","kind":"跨场景协同"},{"source":"J-15","target":"SA-05","kind":"跨场景协同"},{"source":"J-15","target":"OL-03","kind":"跨场景协同"},{"source":"J-15","target":"OL-04","kind":"跨场景协同"},{"source":"J-15","target":"TP-06","kind":"跨场景协同"},{"source":"J-16","target":"IO-08","kind":"跨场景协同"},{"source":"J-16","target":"IO-02","kind":"跨场景协同"},{"source":"J-16","target":"SA-07","kind":"跨场景协同"},{"source":"J-16","target":"SA-09","kind":"跨场景协同"},{"source":"J-16","target":"OL-01","kind":"跨场景协同"},{"source":"J-16","target":"CO-02","kind":"跨场景协同"},{"source":"J-16","target":"CO-07","kind":"跨场景协同"},{"source":"J-16","target":"OL-04","kind":"跨场景协同"},{"source":"J-16","target":"OL-05","kind":"跨场景协同"},{"source":"J-16","target":"OL-06","kind":"跨场景协同"},{"source":"J-16","target":"OL-07","kind":"跨场景协同"},{"source":"J-16","target":"TP-01","kind":"跨场景协同"},{"source":"J-16","target":"IO-05","kind":"跨场景协同"},{"source":"J-17","target":"AD-08","kind":"跨场景协同"},{"source":"J-17","target":"CO-02","kind":"跨场景协同"},{"source":"J-17","target":"CO-07","kind":"跨场景协同"},{"source":"J-17","target":"AD-01","kind":"跨场景协同"},{"source":"J-17","target":"SP-05","kind":"跨场景协同"},{"source":"J-17","target":"AD-03","kind":"跨场景协同"},{"source":"J-17","target":"IO-07","kind":"跨场景协同"},{"source":"J-17","target":"TP-06","kind":"跨场景协同"},{"source":"J-18","target":"OL-09","kind":"跨场景协同"},{"source":"J-18","target":"TP-01","kind":"跨场景协同"},{"source":"J-18","target":"CO-09","kind":"跨场景协同"},{"source":"J-18","target":"OL-03","kind":"跨场景协同"},{"source":"J-18","target":"OL-04","kind":"跨场景协同"},{"source":"J-18","target":"TP-06","kind":"跨场景协同"},{"source":"J-18","target":"TP-07","kind":"跨场景协同"},{"source":"J-19","target":"SA-10","kind":"跨场景协同"},{"source":"J-19","target":"TP-05","kind":"跨场景协同"},{"source":"J-19","target":"IO-01","kind":"跨场景协同"},{"source":"J-19","target":"TP-06","kind":"跨场景协同"},{"source":"J-19","target":"SA-02","kind":"跨场景协同"},{"source":"J-19","target":"SA-08","kind":"跨场景协同"},{"source":"J-19","target":"SP-02","kind":"跨场景协同"},{"source":"J-19","target":"SP-04","kind":"跨场景协同"},{"source":"J-19","target":"CO-04","kind":"跨场景协同"},{"source":"J-19","target":"CO-05","kind":"跨场景协同"},{"source":"J-19","target":"TP-08","kind":"跨场景协同"},{"source":"J-19","target":"SA-05","kind":"跨场景协同"},{"source":"J-19","target":"SP-05","kind":"跨场景协同"},{"source":"J-20","target":"AD-09","kind":"跨场景协同"},{"source":"J-20","target":"AD-05","kind":"跨场景协同"},{"source":"J-20","target":"TP-06","kind":"跨场景协同"},{"source":"J-20","target":"CO-10","kind":"跨场景协同"},{"source":"J-20","target":"TP-01","kind":"跨场景协同"},{"source":"J-20","target":"AD-07","kind":"跨场景协同"},{"source":"J-20","target":"SA-01","kind":"跨场景协同"},{"source":"J-21","target":"TP-01","kind":"跨场景协同"},{"source":"J-21","target":"TP-03","kind":"跨场景协同"},{"source":"J-21","target":"OL-05","kind":"跨场景协同"},{"source":"J-21","target":"TP-06","kind":"跨场景协同"},{"source":"J-21","target":"TP-05","kind":"跨场景协同"},{"source":"J-21","target":"TP-07","kind":"跨场景协同"},{"source":"IO","target":"obj-sku","kind":"对象关系"},{"source":"obj-sku","target":"IO-04","kind":"业务关联"},{"source":"obj-sku","target":"IO-07","kind":"业务关联"},{"source":"obj-sku","target":"SA-02","kind":"业务关联"},{"source":"obj-sku","target":"CO-02","kind":"业务关联"},{"source":"obj-sku","target":"TP-06","kind":"业务关联"},{"source":"SP","target":"obj-market","kind":"对象关系"},{"source":"obj-market","target":"SP-01","kind":"业务关联"},{"source":"obj-market","target":"IO-01","kind":"业务关联"},{"source":"IO","target":"obj-customer","kind":"对象关系"},{"source":"obj-customer","target":"IO-02","kind":"业务关联"},{"source":"obj-customer","target":"IO-03","kind":"业务关联"},{"source":"obj-customer","target":"OL-04","kind":"业务关联"},{"source":"SA","target":"obj-supplier","kind":"对象关系"},{"source":"obj-supplier","target":"SA-03","kind":"业务关联"},{"source":"obj-supplier","target":"SA-04","kind":"业务关联"},{"source":"SA","target":"obj-purchase","kind":"对象关系"},{"source":"obj-purchase","target":"SA-05","kind":"业务关联"},{"source":"obj-purchase","target":"SA-06","kind":"业务关联"},{"source":"SA","target":"obj-inventory","kind":"对象关系"},{"source":"obj-inventory","target":"SA-02","kind":"业务关联"},{"source":"obj-inventory","target":"SA-07","kind":"业务关联"},{"source":"obj-inventory","target":"SA-08","kind":"业务关联"},{"source":"OL","target":"obj-warehouse","kind":"对象关系"},{"source":"obj-warehouse","target":"SA-09","kind":"业务关联"},{"source":"obj-warehouse","target":"OL-01","kind":"业务关联"},{"source":"CO","target":"obj-listing","kind":"对象关系"},{"source":"obj-listing","target":"IO-07","kind":"业务关联"},{"source":"obj-listing","target":"CO-02","kind":"业务关联"},{"source":"CO","target":"obj-store","kind":"对象关系"},{"source":"obj-store","target":"CO-01","kind":"业务关联"},{"source":"obj-store","target":"CO-02","kind":"业务关联"},{"source":"obj-store","target":"CO-04","kind":"业务关联"},{"source":"AD","target":"obj-campaign","kind":"对象关系"},{"source":"obj-campaign","target":"AD-01","kind":"业务关联"},{"source":"obj-campaign","target":"AD-03","kind":"业务关联"},{"source":"obj-campaign","target":"AD-05","kind":"业务关联"},{"source":"OL","target":"obj-order","kind":"对象关系"},{"source":"obj-order","target":"CO-09","kind":"业务关联"},{"source":"obj-order","target":"OL-01","kind":"业务关联"},{"source":"obj-order","target":"OL-02","kind":"业务关联"},{"source":"OL","target":"obj-logistics","kind":"对象关系"},{"source":"obj-logistics","target":"OL-01","kind":"业务关联"},{"source":"obj-logistics","target":"OL-02","kind":"业务关联"},{"source":"OL","target":"obj-refund","kind":"对象关系"},{"source":"obj-refund","target":"OL-03","kind":"业务关联"},{"source":"obj-refund","target":"OL-04","kind":"业务关联"},{"source":"obj-refund","target":"TP-06","kind":"业务关联"},{"source":"TP","target":"obj-settlement","kind":"对象关系"},{"source":"obj-settlement","target":"TP-01","kind":"业务关联"},{"source":"obj-settlement","target":"TP-02","kind":"业务关联"},{"source":"TP","target":"obj-profit","kind":"对象关系"},{"source":"obj-profit","target":"TP-06","kind":"业务关联"},{"source":"obj-profit","target":"TP-08","kind":"业务关联"},{"source":"TP","target":"obj-budget","kind":"对象关系"},{"source":"obj-budget","target":"SP-03","kind":"业务关联"},{"source":"obj-budget","target":"SP-04","kind":"业务关联"},{"source":"obj-budget","target":"TP-08","kind":"业务关联"},{"source":"SP","target":"obj-goal","kind":"对象关系"},{"source":"obj-goal","target":"SP-03","kind":"业务关联"},{"source":"obj-goal","target":"SP-04","kind":"业务关联"},{"source":"obj-goal","target":"SP-05","kind":"业务关联"},{"source":"SP","target":"obj-rules","kind":"对象关系"},{"source":"obj-rules","target":"SP-05","kind":"业务关联"},{"source":"obj-rules","target":"IO-08","kind":"业务关联"},{"source":"CO","target":"obj-action","kind":"对象关系"},{"source":"obj-action","target":"CO-02","kind":"业务关联"},{"source":"obj-action","target":"AD-05","kind":"业务关联"},{"source":"obj-action","target":"SA-05","kind":"业务关联"},{"source":"TP","target":"obj-receipt","kind":"对象关系"},{"source":"obj-receipt","target":"TP-01","kind":"业务关联"},{"source":"obj-receipt","target":"OL-02","kind":"业务关联"},{"source":"obj-receipt","target":"SP-05","kind":"业务关联"},{"source":"obj-market","target":"obj-customer","kind":"需求证据"},{"source":"obj-customer","target":"obj-sku","kind":"需求定义"},{"source":"obj-sku","target":"obj-supplier","kind":"供给关系"},{"source":"obj-supplier","target":"obj-purchase","kind":"采购承诺"},{"source":"obj-purchase","target":"obj-inventory","kind":"入仓"},{"source":"obj-inventory","target":"obj-warehouse","kind":"库存分布"},{"source":"obj-sku","target":"obj-listing","kind":"渠道呈现"},{"source":"obj-listing","target":"obj-store","kind":"刊登"},{"source":"obj-store","target":"obj-order","kind":"交易"},{"source":"obj-campaign","target":"obj-listing","kind":"引流"},{"source":"obj-campaign","target":"obj-budget","kind":"预算边界"},{"source":"obj-order","target":"obj-inventory","kind":"库存分配"},{"source":"obj-order","target":"obj-logistics","kind":"交付"},{"source":"obj-logistics","target":"obj-warehouse","kind":"出库"},{"source":"obj-order","target":"obj-refund","kind":"售后"},{"source":"obj-order","target":"obj-settlement","kind":"结算"},{"source":"obj-refund","target":"obj-profit","kind":"结果归因"},{"source":"obj-settlement","target":"obj-profit","kind":"贡献核算"},{"source":"obj-profit","target":"obj-sku","kind":"商品贡献"},{"source":"obj-budget","target":"obj-goal","kind":"资源配置"},{"source":"obj-goal","target":"obj-rules","kind":"业务逻辑"},{"source":"obj-rules","target":"obj-action","kind":"授权约束"},{"source":"obj-action","target":"obj-listing","kind":"批准变更"},{"source":"obj-action","target":"obj-purchase","kind":"批准变更"},{"source":"obj-action","target":"obj-receipt","kind":"状态读回"},{"source":"obj-receipt","target":"obj-order","kind":"结果观察"},{"source":"obj-receipt","target":"obj-rules","kind":"持续进化"},{"source":"obj-receipt","target":"obj-sku","kind":"事实更新"},{"source":"brand","target":"obj-sku","kind":"经营对象"},{"source":"brand","target":"obj-goal","kind":"经营目标"},{"source":"brand","target":"obj-action","kind":"授权行动"},{"source":"AGT-002","target":"SP","kind":"场景编排与异常协调"},{"source":"AGT-002","target":"IO","kind":"场景编排与异常协调"},{"source":"AGT-002","target":"SA","kind":"场景编排与异常协调"},{"source":"AGT-002","target":"AD","kind":"场景编排与异常协调"},{"source":"AGT-002","target":"CO","kind":"场景编排与异常协调"},{"source":"AGT-002","target":"OL","kind":"场景编排与异常协调"},{"source":"AGT-002","target":"TP","kind":"场景编排与异常协调"},{"source":"AGT-048","target":"obj-rules","kind":"知识与 Playbook 治理"},{"source":"AGT-048","target":"obj-receipt","kind":"能力版本与评估"}],"domains":[{"id":"SP","name":"战略与经营规划"},{"id":"IO","name":"洞察到产品创新"},{"id":"SA","name":"供应到可售库存"},{"id":"AD","name":"认知到需求"},{"id":"CO","name":"渠道到订单"},{"id":"OL","name":"订单到忠诚"},{"id":"TP","name":"交易到利润与现金"}],"desktop":{"w":1080,"h":800,"pos":{"brand":{"x":540,"y":400,"r":32,"label":"出海品牌","dy":47,"show":true},"SA":{"x":834.8,"y":453.4,"r":25,"label":"供应到可售库存","dy":43,"show":true},"CO":{"x":408.8,"y":616.2,"r":25,"label":"渠道到订单","dy":43,"show":true},"OL":{"x":245.2,"y":453.4,"r":25,"label":"订单到忠诚","dy":43,"show":true},"TP":{"x":303.6,"y":250.4,"r":25,"label":"交易到利润与现金","dy":43,"show":true},"IO":{"x":776.4,"y":250.4,"r":25,"label":"洞察到产品创新","dy":43,"show":true},"AD":{"x":671.2,"y":616.2,"r":25,"label":"认知到需求","dy":43,"show":true},"SP":{"x":540,"y":160,"r":25,"label":"战略与经营规划","dy":43,"show":true},"obj-sku":{"x":664.1,"y":255.5,"r":20,"label":"商品 / SKU","dy":36.5,"show":true},"obj-order":{"x":235.8,"y":505.7,"r":20,"label":"订单","dy":36.5,"show":true},"obj-action":{"x":458.5,"y":597.8,"r":20,"label":"授权行动","dy":36.5,"show":true},"obj-receipt":{"x":254.2,"y":269.7,"r":20,"label":"外部回执","dy":-27,"show":true},"obj-inventory":{"x":807.2,"y":512.1,"r":20,"label":"库存批次","dy":36.5,"show":true},"obj-listing":{"x":493.2,"y":647.5,"r":20,"label":"Listing","dy":36.5,"show":true},"obj-goal":{"x":538.2,"y":82.5,"r":20,"label":"经营目标","dy":36.5,"show":true},"obj-rules":{"x":481.9,"y":133.6,"r":20,"label":"规则与 SOP","dy":36.5,"show":true},"obj-customer":{"x":779.4,"y":166.3,"r":20,"label":"客户与需求","dy":36.5,"show":true},"obj-purchase":{"x":907.4,"y":523.6,"r":20,"label":"采购单","dy":36.5,"show":true},"obj-store":{"x":323.6,"y":662.3,"r":20,"label":"店铺与渠道","dy":36.5,"show":true},"obj-campaign":{"x":626.4,"y":688.2,"r":20,"label":"营销计划","dy":36.5,"show":true},"obj-refund":{"x":159.3,"y":438.7,"r":20,"label":"退款与售后","dy":36.5,"show":true},"obj-profit":{"x":254.5,"y":187.2,"r":20,"label":"贡献利润","dy":36.5,"show":true},"obj-budget":{"x":338.2,"y":168.1,"r":20,"label":"现金与预算","dy":36.5,"show":true},"obj-supplier":{"x":957.4,"y":420.8,"r":20,"label":"供应商","dy":36.5,"show":true},"obj-warehouse":{"x":322,"y":470.9,"r":20,"label":"仓库与履约","dy":36.5,"show":true},"obj-logistics":{"x":144.5,"y":487.8,"r":20,"label":"物流单","dy":36.5,"show":true},"obj-settlement":{"x":188.3,"y":225.4,"r":20,"label":"结算单","dy":36.5,"show":true},"obj-market":{"x":603.7,"y":58,"r":20,"label":"国家与市场","dy":36.5,"show":true},"J-01":{"x":677.5,"y":323.6,"r":14,"label":"新品机会到规模化经营","dy":29,"show":true},"J-02":{"x":531.5,"y":290.1,"r":14,"label":"新市场机会到首单与持续…","dy":29,"show":true},"J-15":{"x":575.9,"y":503.6,"r":14,"label":"社媒与直播爆量到供给、…","dy":29,"show":true},"J-12":{"x":698.2,"y":279.9,"r":14,"label":"法规变化到合规恢复与持…","dy":29,"show":true},"J-05":{"x":596.1,"y":594,"r":14,"label":"品牌主张到内容、投放与…","dy":29,"show":true},"J-09":{"x":628.5,"y":284.9,"r":14,"label":"客户声音到质量纠正、追…","dy":-21,"show":true},"J-16":{"x":615,"y":318.2,"r":14,"label":"产品安全信号到停售、召…","dy":29,"show":false},"J-19":{"x":692.2,"y":378.2,"r":14,"label":"关税、汇率与运费冲击到…","dy":29,"show":true},"J-04":{"x":661,"y":360.2,"r":14,"label":"商品组合到多渠道可售与…","dy":29,"show":true},"J-07":{"x":751.4,"y":456.3,"r":14,"label":"采购承诺到全球交付与到…","dy":-21,"show":true},"J-13":{"x":395.5,"y":229.3,"r":14,"label":"经营复盘到资源重配与结…","dy":29,"show":true},"J-03":{"x":670.7,"y":434,"r":14,"label":"需求变化到库存、投放与…","dy":29,"show":true},"J-08":{"x":208.7,"y":423.8,"r":14,"label":"订单履约到服务恢复与客…","dy":29,"show":true},"J-14":{"x":494.7,"y":576.6,"r":14,"label":"独立站上线到稳定运营与…","dy":29,"show":true},"J-10":{"x":472.7,"y":525.1,"r":14,"label":"账户风险到停权预防与经…","dy":29,"show":true},"J-11":{"x":365.5,"y":525.2,"r":14,"label":"企业商机到履约、回款与…","dy":29,"show":false},"J-17":{"x":635.8,"y":534.7,"r":14,"label":"知识产权事件到渠道处置…","dy":29,"show":true},"J-06":{"x":306.7,"y":547.2,"r":14,"label":"下单支付到异常恢复、结…","dy":29,"show":true},"J-18":{"x":208,"y":384.8,"r":14,"label":"欺诈与拒付到证据提交和…","dy":29,"show":true},"J-20":{"x":584.1,"y":627.9,"r":14,"label":"测量故障到预算保护与决…","dy":29,"show":false},"J-21":{"x":230.4,"y":229.7,"r":14,"label":"结算差异到追索、回款与…","dy":29,"show":false},"TP-06":{"x":410.7,"y":336.9,"r":12,"label":"商品渠道订单级成本利润…","dy":27,"show":true},"TP-01":{"x":324.7,"y":318.9,"r":12,"label":"支付平台结算回款费用与…","dy":27,"show":true},"CO-02":{"x":503.9,"y":501,"r":12,"label":"商品刊登映射与数字货架…","dy":-19,"show":true},"OL-01":{"x":340.7,"y":429.7,"r":12,"label":"订单编排分配保留与释放","dy":27,"show":true},"SA-02":{"x":697.5,"y":454.9,"r":12,"label":"库存策略分配调拨与补货","dy":27,"show":true},"IO-07":{"x":725,"y":317.9,"r":12,"label":"商品主数据数字资产与渠…","dy":27,"show":false},"AD-05":{"x":629.7,"y":598.8,"r":12,"label":"付费媒体计划投放与优化","dy":-19,"show":true},"CO-09":{"x":403.4,"y":532,"r":12,"label":"结账订单捕获支付授权与…","dy":27,"show":false},"OL-04":{"x":368.4,"y":396.9,"r":12,"label":"客户咨询服务与问题解决","dy":27,"show":true},"AGT-041":{"x":438.5,"y":247.8,"r":10.5,"label":"守金","dy":-17.5,"show":true},"SP-05":{"x":499.9,"y":180.4,"r":12,"label":"经营复盘与组合再配置","dy":27,"show":false},"IO-08":{"x":741.3,"y":278.4,"r":12,"label":"产品准入、合规与上市后…","dy":27,"show":false},"AD-03":{"x":691.6,"y":542.7,"r":12,"label":"内容创意本地化审核与发布","dy":27,"show":false},"OL-02":{"x":333.1,"y":509.4,"r":12,"label":"拣配发运平台仓与直发履约","dy":27,"show":true},"OL-03":{"x":320.5,"y":404.8,"r":12,"label":"末端配送追踪与交付异常","dy":-19,"show":true},"AGT-040":{"x":278.7,"y":302.3,"r":10.5,"label":"清账","dy":25.5,"show":true},"SP-04":{"x":579.3,"y":203.9,"r":12,"label":"资金、人力、库存与能力配置","dy":27,"show":true},"SA-05":{"x":807.7,"y":417.5,"r":12,"label":"采购订单与交付承诺协同","dy":27,"show":false},"SA-09":{"x":775.6,"y":432.4,"r":12,"label":"仓储三方物流与可售库存","dy":27,"show":false},"SA-07":{"x":843,"y":396.2,"r":12,"label":"质量检验追溯纠正与召回","dy":-19,"show":true},"SA-08":{"x":793.8,"y":387.3,"r":12,"label":"国际运输、清关执行与入仓","dy":27,"show":false},"AD-09":{"x":657.5,"y":713.4,"r":12,"label":"测量、事件质量与 Ca…","dy":27,"show":true},"TP-08":{"x":386.6,"y":283.3,"r":12,"label":"财务预测营运资本与经营…","dy":27,"show":true},"AGT-020":{"x":357.2,"y":455.3,"r":10.5,"label":"行舟","dy":25.5,"show":true},"SA-10":{"x":823.4,"y":370.9,"r":12,"label":"国际贸易合规与关务决策","dy":-19,"show":true},"AD-07":{"x":586.7,"y":535.8,"r":12,"label":"增长实验、归因与增量评估","dy":-19,"show":true},"CO-04":{"x":439.7,"y":517,"r":12,"label":"定价价格表与渠道冲突管理","dy":-19,"show":true},"CO-10":{"x":403.4,"y":660.9,"r":12,"label":"DTC 独立站建设与持…","dy":27,"show":false},"OL-05":{"x":200.3,"y":456.7,"r":12,"label":"取消退款补偿与争议前处置","dy":-19,"show":true},"TP-05":{"x":346.4,"y":264.1,"r":12,"label":"外汇资金流动性与现金调度","dy":27,"show":false},"TP-07":{"x":320.8,"y":208.8,"r":12,"label":"关账合并管理报告与审计…","dy":27,"show":false},"AGT-043":{"x":723.8,"y":439.3,"r":10.5,"label":"律衡","dy":25.5,"show":false},"AD-08":{"x":695.8,"y":578.5,"r":12,"label":"品牌资产、知识产权与反…","dy":27,"show":true},"CO-05":{"x":466,"y":558.5,"r":12,"label":"促销优惠组合与清货管理","dy":27,"show":true},"CO-07":{"x":518.8,"y":552.6,"r":12,"label":"平台市场日常经营与账户…","dy":27,"show":false},"AGT-021":{"x":395.1,"y":575,"r":10.5,"label":"北辰","dy":25.5,"show":false},"AGT-023":{"x":335,"y":606.4,"r":10.5,"label":"自航","dy":25.5,"show":true},"AGT-044":{"x":773.7,"y":308.5,"r":10.5,"label":"安界","dy":25.5,"show":true},"SP-01":{"x":569.7,"y":107.2,"r":12,"label":"国家与市场进入、加码与退出","dy":27,"show":true},"SP-02":{"x":521,"y":218.6,"r":12,"label":"品牌、产品线与渠道组合设计","dy":27,"show":false},"SP-03":{"x":511,"y":53.1,"r":12,"label":"年度季度战略与目标体系","dy":-19,"show":true},"IO-01":{"x":713.3,"y":210.8,"r":12,"label":"宏观市场品类与竞争情报","dy":27,"show":true},"IO-02":{"x":809.1,"y":219.4,"r":12,"label":"客户声音需求与问题发现","dy":27,"show":false},"IO-03":{"x":737.9,"y":190.3,"r":12,"label":"商品机会评估与商业论证","dy":-19,"show":true},"IO-04":{"x":817.3,"y":153.8,"r":12,"label":"产品概念规格与技术资料","dy":-19,"show":true},"SA-01":{"x":759.6,"y":489.3,"r":12,"label":"需求预测与供需计划","dy":27,"show":true},"SA-04":{"x":886,"y":436.5,"r":12,"label":"供应商准入合同与绩效管理","dy":-19,"show":false},"SA-06":{"x":926.8,"y":448.6,"r":12,"label":"产能物料与生产执行协同","dy":27,"show":false},"AD-01":{"x":756.1,"y":670.5,"r":12,"label":"品牌定位表达与治理","dy":27,"show":false},"CO-01":{"x":363.4,"y":642.1,"r":12,"label":"渠道店铺与交易模式接入","dy":27,"show":false},"TP-03":{"x":423.4,"y":305.2,"r":12,"label":"采购应付发票匹配与付款","dy":27,"show":false},"TP-04":{"x":412.1,"y":263.9,"r":12,"label":"间接税电子发票申报与法…","dy":27,"show":false},"AGT-018":{"x":767.1,"y":402,"r":10.5,"label":"质守","dy":25.5,"show":false},"IO-05":{"x":740.1,"y":158.4,"r":12,"label":"样品、测试与产品验证","dy":27,"show":false},"SA-03":{"x":910,"y":415.4,"r":12,"label":"供应商发现询价与谈判","dy":-19,"show":false},"AD-04":{"x":714.9,"y":605.7,"r":12,"label":"达人、联盟、直播与 P…","dy":27,"show":false},"OL-06":{"x":293.2,"y":421.5,"r":12,"label":"退货换货与逆向物流","dy":27,"show":false},"OL-09":{"x":180.5,"y":404.8,"r":12,"label":"支付争议、拒付与资金恢复","dy":-19,"show":false},"AGT-015":{"x":847,"y":499.6,"r":10.5,"label":"契约","dy":25.5,"show":false},"AGT-035":{"x":651.5,"y":577.4,"r":10.5,"label":"试真","dy":25.5,"show":false},"AGT-037":{"x":202,"y":487.2,"r":10.5,"label":"解忧","dy":25.5,"show":false},"AGT-045":{"x":372.3,"y":318.3,"r":10.5,"label":"同尺","dy":25.5,"show":false},"AD-06":{"x":710.6,"y":638,"r":12,"label":"自有渠道私域社区与生命…","dy":27,"show":false},"CO-06":{"x":451.1,"y":693.6,"r":12,"label":"店面商品页转化与结账体验","dy":27,"show":false},"CO-08":{"x":430.2,"y":569.4,"r":12,"label":"企业客户批发分销报价到…","dy":27,"show":false},"OL-07":{"x":288.7,"y":389.9,"r":12,"label":"保修维修替换翻新与再流通","dy":27,"show":false},"OL-08":{"x":180.9,"y":543.8,"r":12,"label":"忠诚会员订阅补充购买与…","dy":27,"show":false},"TP-02":{"x":288.8,"y":207.9,"r":12,"label":"企业应收信用催收与坏账…","dy":27,"show":false},"AGT-001":{"x":482.1,"y":86.5,"r":10.5,"label":"衡远","dy":25.5,"show":false},"AGT-002":{"x":540.5,"y":258.8,"r":10.5,"label":"枢衡","dy":25.5,"show":false},"AGT-003":{"x":388.8,"y":197.5,"r":10.5,"label":"明镜","dy":25.5,"show":false},"AGT-016":{"x":868.9,"y":480.5,"r":10.5,"label":"知量","dy":25.5,"show":false},"AGT-019":{"x":728,"y":410.6,"r":10.5,"label":"通途","dy":25.5,"show":false},"AGT-026":{"x":446.8,"y":637.4,"r":10.5,"label":"衡价","dy":25.5,"show":false},"AGT-042":{"x":375.5,"y":254.9,"r":10.5,"label":"合账","dy":25.5,"show":false},"IO-06":{"x":833.7,"y":288.4,"r":12,"label":"品类商品组合与生命周期","dy":27,"show":false},"AD-02":{"x":679.3,"y":690,"r":12,"label":"受众细分洞察与沟通策略","dy":27,"show":false},"CO-03":{"x":420.2,"y":712.9,"r":12,"label":"品类陈列站内搜索推荐与…","dy":27,"show":false},"AGT-017":{"x":729.3,"y":494.4,"r":10.5,"label":"衡仓","dy":25.5,"show":false},"AGT-029":{"x":782.4,"y":638,"r":10.5,"label":"立言","dy":25.5,"show":false},"AGT-032":{"x":686.7,"y":656.9,"r":10.5,"label":"点火","dy":25.5,"show":false},"AGT-009":{"x":869.1,"y":183,"r":10.5,"label":"定形","dy":25.5,"show":false},"AGT-013":{"x":777.9,"y":206.2,"r":10.5,"label":"求证","dy":25.5,"show":false},"AGT-022":{"x":495.3,"y":609.1,"r":10.5,"label":"觅位","dy":25.5,"show":false},"AGT-024":{"x":491.8,"y":209.8,"r":10.5,"label":"拓域","dy":25.5,"show":false},"AGT-025":{"x":338.9,"y":577.6,"r":10.5,"label":"联商","dy":25.5,"show":false},"AGT-028":{"x":640.8,"y":652.5,"r":10.5,"label":"译境","dy":25.5,"show":false},"AGT-005":{"x":244.2,"y":392.3,"r":10.5,"label":"守衡","dy":25.5,"show":false},"AGT-014":{"x":975.1,"y":480.5,"r":10.5,"label":"择源","dy":25.5,"show":false},"AGT-027":{"x":458.4,"y":664,"r":10.5,"label":"守店","dy":25.5,"show":false},"AGT-030":{"x":693.4,"y":743,"r":10.5,"label":"叙事","dy":25.5,"show":false},"AGT-031":{"x":745.6,"y":618.4,"r":10.5,"label":"绘影","dy":25.5,"show":false},"AGT-039":{"x":288.6,"y":451.7,"r":10.5,"label":"同行","dy":25.5,"show":false},"AGT-050":{"x":336.3,"y":698.7,"r":10.5,"label":"门卫","dy":25.5,"show":false},"AGT-047":{"x":369.6,"y":715,"r":10.5,"label":"接桥","dy":25.5,"show":false},"AGT-006":{"x":725.7,"y":669.3,"r":10.5,"label":"听澜","dy":25.5,"show":false},"AGT-007":{"x":798.6,"y":109.7,"r":10.5,"label":"望野","dy":-17.5,"show":false},"AGT-008":{"x":844.4,"y":167.9,"r":10.5,"label":"拓新","dy":25.5,"show":false},"AGT-034":{"x":605.2,"y":738,"r":10.5,"label":"续缘","dy":25.5,"show":false},"AGT-036":{"x":732.9,"y":249.1,"r":10.5,"label":"安心","dy":25.5,"show":false},"AGT-004":{"x":514.2,"y":112.6,"r":10.5,"label":"知人","dy":-17.5,"show":false},"AGT-010":{"x":831.4,"y":258,"r":10.5,"label":"映物","dy":-17.5,"show":false},"AGT-011":{"x":919.8,"y":199.6,"r":10.5,"label":"砺器","dy":25.5,"show":false},"AGT-038":{"x":906.2,"y":225.2,"r":10.5,"label":"回声","dy":25.5,"show":false},"AGT-046":{"x":778.6,"y":701.4,"r":10.5,"label":"清源","dy":25.5,"show":false},"AGT-048":{"x":453.3,"y":48.5,"r":10.5,"label":"积知","dy":25.5,"show":false},"AGT-012":{"x":890.5,"y":126.2,"r":10.5,"label":"灵枢","dy":25.5,"show":false},"AGT-033":{"x":765.1,"y":747.2,"r":10.5,"label":"结伴","dy":25.5,"show":false},"AGT-049":{"x":370.8,"y":747.5,"r":10.5,"label":"稳行","dy":25.5,"show":false}}},"mobile":{"w":620,"h":910,"pos":{"brand":{"x":310,"y":455,"r":25.92,"label":"出海品牌","dy":43.9,"show":true},"SA":{"x":479.2,"y":515.7,"r":20.25,"label":"供应到可售库存","dy":42.3,"show":true},"CO":{"x":234.7,"y":701,"r":20.25,"label":"渠道到订单","dy":42.3,"show":true},"OL":{"x":140.8,"y":515.7,"r":20.25,"label":"订单到忠诚","dy":42.3,"show":true},"TP":{"x":174.3,"y":284.8,"r":20.25,"label":"交易到利润与现金","dy":42.3,"show":true},"IO":{"x":445.7,"y":284.8,"r":20.25,"label":"洞察到产品创新","dy":42.3,"show":true},"AD":{"x":385.3,"y":701,"r":20.25,"label":"认知到需求","dy":42.3,"show":true},"SP":{"x":310,"y":182,"r":20.25,"label":"战略与经营规划","dy":42.3,"show":true},"obj-sku":{"x":385.8,"y":300.7,"r":16.200000000000003,"label":"商品 / SKU","dy":-23.2,"show":true},"obj-order":{"x":179.9,"y":494.7,"r":16.200000000000003,"label":"订单","dy":37.2,"show":true},"obj-action":{"x":227.1,"y":636.1,"r":16.200000000000003,"label":"授权行动","dy":37.2,"show":true},"obj-receipt":{"x":118.6,"y":279.6,"r":16.200000000000003,"label":"外部回执","dy":-23.2,"show":true},"obj-inventory":{"x":513.6,"y":487.5,"r":16.200000000000003,"label":"库存批次","dy":37.2,"show":true},"obj-listing":{"x":289.2,"y":716.1,"r":16.200000000000003,"label":"Listing","dy":37.2,"show":false},"obj-goal":{"x":289.4,"y":93,"r":16.200000000000003,"label":"经营目标","dy":37.2,"show":true},"obj-rules":{"x":263.8,"y":145.1,"r":16.200000000000003,"label":"规则与 SOP","dy":37.2,"show":true},"obj-customer":{"x":442.6,"y":180.4,"r":16.200000000000003,"label":"客户与需求","dy":37.2,"show":true},"obj-purchase":{"x":562,"y":593.6,"r":16.200000000000003,"label":"采购单","dy":37.2,"show":true},"obj-store":{"x":210.4,"y":790.8,"r":16.200000000000003,"label":"店铺与渠道","dy":37.2,"show":true},"obj-campaign":{"x":405.2,"y":778.8,"r":16.200000000000003,"label":"营销计划","dy":37.2,"show":true},"obj-refund":{"x":77.9,"y":540.1,"r":16.200000000000003,"label":"退款与售后","dy":-23.2,"show":true},"obj-profit":{"x":103.8,"y":213.2,"r":16.200000000000003,"label":"贡献利润","dy":-23.2,"show":true},"obj-budget":{"x":208.3,"y":256.2,"r":16.200000000000003,"label":"现金与预算","dy":37.2,"show":true},"obj-supplier":{"x":562,"y":470.3,"r":16.200000000000003,"label":"供应商","dy":-23.2,"show":true},"obj-warehouse":{"x":118.4,"y":474.4,"r":16.200000000000003,"label":"仓库与履约","dy":-23.2,"show":true},"obj-logistics":{"x":58,"y":504.9,"r":16.200000000000003,"label":"物流单","dy":37.2,"show":true},"obj-settlement":{"x":58,"y":264.6,"r":16.200000000000003,"label":"结算单","dy":37.2,"show":true},"obj-market":{"x":357.4,"y":58.6,"r":16.200000000000003,"label":"国家与市场","dy":37.2,"show":true},"J-01":{"x":407.9,"y":367.6,"r":11.34,"label":"新品机会到规模化经营","dy":29.3,"show":true},"J-02":{"x":302.5,"y":319.3,"r":11.34,"label":"新市场机会到首单与持续…","dy":29.3,"show":true},"J-15":{"x":337.2,"y":580.9,"r":11.34,"label":"社媒与直播爆量到供给、…","dy":29.3,"show":true},"J-12":{"x":418,"y":319.8,"r":11.34,"label":"法规变化到合规恢复与持…","dy":-18.3,"show":true},"J-05":{"x":349.2,"y":684.8,"r":11.34,"label":"品牌主张到内容、投放与…","dy":29.3,"show":true},"J-09":{"x":370.1,"y":333.1,"r":11.34,"label":"客户声音到质量纠正、追…","dy":29.3,"show":false},"J-16":{"x":362.4,"y":362.7,"r":11.34,"label":"产品安全信号到停售、召…","dy":29.3,"show":false},"J-19":{"x":398.2,"y":435.4,"r":11.34,"label":"关税、汇率与运费冲击到…","dy":29.3,"show":true},"J-04":{"x":385.6,"y":407.4,"r":11.34,"label":"商品组合到多渠道可售与…","dy":29.3,"show":true},"J-07":{"x":471.5,"y":554.6,"r":11.34,"label":"采购承诺到全球交付与到…","dy":29.3,"show":true},"J-13":{"x":146.1,"y":257,"r":11.34,"label":"经营复盘到资源重配与结…","dy":29.3,"show":false},"J-03":{"x":392.5,"y":485.7,"r":11.34,"label":"需求变化到库存、投放与…","dy":29.3,"show":false},"J-08":{"x":52,"y":469.9,"r":11.34,"label":"订单履约到服务恢复与客…","dy":29.3,"show":false},"J-14":{"x":269.4,"y":681.9,"r":11.34,"label":"独立站上线到稳定运营与…","dy":29.3,"show":false},"J-10":{"x":255.4,"y":605.9,"r":11.34,"label":"账户风险到停权预防与经…","dy":29.3,"show":true},"J-11":{"x":157.7,"y":608.1,"r":11.34,"label":"企业商机到履约、回款与…","dy":-18.3,"show":true},"J-17":{"x":394.3,"y":617.6,"r":11.34,"label":"知识产权事件到渠道处置…","dy":29.3,"show":false},"J-06":{"x":113.3,"y":617.1,"r":11.34,"label":"下单支付到异常恢复、结…","dy":29.3,"show":false},"J-18":{"x":52,"y":439.2,"r":11.34,"label":"欺诈与拒付到证据提交和…","dy":29.3,"show":false},"J-20":{"x":323.4,"y":701.4,"r":11.34,"label":"测量故障到预算保护与决…","dy":29.3,"show":false},"J-21":{"x":74.3,"y":233.1,"r":11.34,"label":"结算差异到追索、回款与…","dy":29.3,"show":false},"TP-06":{"x":206.6,"y":383.1,"r":9.72,"label":"商品渠道订单级成本利润…","dy":27.7,"show":true},"TP-01":{"x":118.3,"y":354.8,"r":9.72,"label":"支付平台结算回款费用与…","dy":27.7,"show":true},"CO-02":{"x":291.7,"y":581.1,"r":9.72,"label":"商品刊登映射与数字货架…","dy":-16.7,"show":true},"OL-01":{"x":213.2,"y":488.4,"r":9.72,"label":"订单编排分配保留与释放","dy":-16.7,"show":true},"SA-02":{"x":385.6,"y":513.9,"r":9.72,"label":"库存策略分配调拨与补货","dy":27.7,"show":false},"IO-07":{"x":454.9,"y":370,"r":9.72,"label":"商品主数据数字资产与渠…","dy":27.7,"show":false},"AD-05":{"x":377.2,"y":654.4,"r":9.72,"label":"付费媒体计划投放与优化","dy":27.7,"show":true},"CO-09":{"x":195,"y":619.9,"r":9.72,"label":"结账订单捕获支付授权与…","dy":27.7,"show":false},"OL-04":{"x":204.9,"y":441.4,"r":9.72,"label":"客户咨询服务与问题解决","dy":27.7,"show":false},"AGT-041":{"x":221,"y":300.1,"r":8.505,"label":"守金","dy":26.5,"show":false},"SP-05":{"x":275.9,"y":198.6,"r":9.72,"label":"经营复盘与组合再配置","dy":27.7,"show":false},"IO-08":{"x":480.3,"y":300.4,"r":9.72,"label":"产品准入、合规与上市后…","dy":27.7,"show":false},"AD-03":{"x":443.9,"y":625.9,"r":9.72,"label":"内容创意本地化审核与发布","dy":27.7,"show":true},"OL-02":{"x":186.1,"y":461.4,"r":9.72,"label":"拣配发运平台仓与直发履约","dy":27.7,"show":false},"OL-03":{"x":136.9,"y":553.5,"r":9.72,"label":"末端配送追踪与交付异常","dy":27.7,"show":false},"AGT-040":{"x":137.3,"y":372.8,"r":8.505,"label":"清账","dy":-15.5,"show":true},"SP-04":{"x":335.7,"y":232.5,"r":9.72,"label":"资金、人力、库存与能力配置","dy":27.7,"show":false},"SA-05":{"x":517.1,"y":521.3,"r":9.72,"label":"采购订单与交付承诺协同","dy":27.7,"show":false},"SA-09":{"x":493.9,"y":455.8,"r":9.72,"label":"仓储三方物流与可售库存","dy":27.7,"show":false},"SA-07":{"x":534.7,"y":445.6,"r":9.72,"label":"质量检验追溯纠正与召回","dy":27.7,"show":false},"SA-08":{"x":497,"y":421.9,"r":9.72,"label":"国际运输、清关执行与入仓","dy":27.7,"show":false},"AD-09":{"x":368.4,"y":771,"r":9.72,"label":"测量、事件质量与 Ca…","dy":27.7,"show":false},"TP-08":{"x":236.8,"y":237.8,"r":9.72,"label":"财务预测营运资本与经营…","dy":27.7,"show":false},"AGT-020":{"x":111.1,"y":537.5,"r":8.505,"label":"行舟","dy":26.5,"show":false},"SA-10":{"x":474,"y":436.9,"r":9.72,"label":"国际贸易合规与关务决策","dy":27.7,"show":false},"AD-07":{"x":335.9,"y":611.3,"r":9.72,"label":"增长实验、归因与增量评估","dy":27.7,"show":false},"CO-04":{"x":226.5,"y":602.2,"r":9.72,"label":"定价价格表与渠道冲突管理","dy":27.7,"show":false},"CO-10":{"x":176.5,"y":697.5,"r":9.72,"label":"DTC 独立站建设与持…","dy":27.7,"show":false},"OL-05":{"x":89.3,"y":491.8,"r":9.72,"label":"取消退款补偿与争议前处置","dy":27.7,"show":false},"TP-05":{"x":154.5,"y":317.2,"r":9.72,"label":"外汇资金流动性与现金调度","dy":27.7,"show":false},"TP-07":{"x":132.4,"y":231.4,"r":9.72,"label":"关账合并管理报告与审计…","dy":-16.7,"show":false},"AGT-043":{"x":424,"y":521.1,"r":8.505,"label":"律衡","dy":-15.5,"show":false},"AD-08":{"x":444.7,"y":691.1,"r":9.72,"label":"品牌资产、知识产权与反…","dy":27.7,"show":false},"CO-05":{"x":246,"y":664.7,"r":9.72,"label":"促销优惠组合与清货管理","dy":27.7,"show":false},"CO-07":{"x":302.7,"y":644,"r":9.72,"label":"平台市场日常经营与账户…","dy":27.7,"show":false},"AGT-021":{"x":259.3,"y":642.1,"r":8.505,"label":"北辰","dy":26.5,"show":false},"AGT-023":{"x":121.6,"y":682.3,"r":8.505,"label":"自航","dy":26.5,"show":false},"AGT-044":{"x":485.9,"y":352.2,"r":8.505,"label":"安界","dy":26.5,"show":false},"SP-01":{"x":330.6,"y":114.9,"r":9.72,"label":"国家与市场进入、加码与退出","dy":27.7,"show":false},"SP-02":{"x":268.1,"y":240,"r":9.72,"label":"品牌、产品线与渠道组合设计","dy":27.7,"show":false},"SP-03":{"x":293.2,"y":128.3,"r":9.72,"label":"年度季度战略与目标体系","dy":27.7,"show":false},"IO-01":{"x":437.1,"y":247.7,"r":9.72,"label":"宏观市场品类与竞争情报","dy":27.7,"show":false},"IO-02":{"x":484.1,"y":256.3,"r":9.72,"label":"客户声音需求与问题发现","dy":-16.7,"show":false},"IO-03":{"x":431.3,"y":220.9,"r":9.72,"label":"商品机会评估与商业论证","dy":27.7,"show":false},"IO-04":{"x":494.6,"y":191.3,"r":9.72,"label":"产品概念规格与技术资料","dy":-16.7,"show":false},"SA-01":{"x":443.6,"y":562.6,"r":9.72,"label":"需求预测与供需计划","dy":27.7,"show":false},"SA-04":{"x":570,"y":530.7,"r":9.72,"label":"供应商准入合同与绩效管理","dy":27.7,"show":false},"SA-06":{"x":570,"y":503.3,"r":9.72,"label":"产能物料与生产执行协同","dy":27.7,"show":false},"AD-01":{"x":473.4,"y":747.5,"r":9.72,"label":"品牌定位表达与治理","dy":27.7,"show":false},"CO-01":{"x":155.1,"y":717.7,"r":9.72,"label":"渠道店铺与交易模式接入","dy":27.7,"show":false},"TP-03":{"x":208.9,"y":340.5,"r":9.72,"label":"采购应付发票匹配与付款","dy":27.7,"show":false},"TP-04":{"x":233.8,"y":328.9,"r":9.72,"label":"间接税电子发票申报与法…","dy":27.7,"show":false},"AGT-018":{"x":453.2,"y":476.3,"r":8.505,"label":"质守","dy":26.5,"show":false},"IO-05":{"x":493.8,"y":227.5,"r":9.72,"label":"样品、测试与产品验证","dy":27.7,"show":false},"SA-03":{"x":570,"y":437.4,"r":9.72,"label":"供应商发现询价与谈判","dy":27.7,"show":false},"AD-04":{"x":439,"y":730.8,"r":9.72,"label":"达人、联盟、直播与 P…","dy":27.7,"show":false},"OL-06":{"x":193.3,"y":525.9,"r":9.72,"label":"退货换货与逆向物流","dy":-16.7,"show":false},"OL-09":{"x":50,"y":559.4,"r":9.72,"label":"支付争议、拒付与资金恢复","dy":27.7,"show":false},"AGT-015":{"x":481.8,"y":479.1,"r":8.505,"label":"契约","dy":26.5,"show":false},"AGT-035":{"x":405.9,"y":664.5,"r":8.505,"label":"试真","dy":26.5,"show":false},"AGT-037":{"x":161.9,"y":545.8,"r":8.505,"label":"解忧","dy":26.5,"show":false},"AGT-045":{"x":223.4,"y":362.3,"r":8.505,"label":"同尺","dy":26.5,"show":false},"AD-06":{"x":411.7,"y":728.3,"r":9.72,"label":"自有渠道私域社区与生命…","dy":27.7,"show":false},"CO-06":{"x":211.2,"y":756.9,"r":9.72,"label":"店面商品页转化与结账体验","dy":27.7,"show":false},"CO-08":{"x":197.1,"y":679,"r":9.72,"label":"企业客户批发分销报价到…","dy":27.7,"show":false},"OL-07":{"x":134.1,"y":443,"r":9.72,"label":"保修维修替换翻新与再流通","dy":27.7,"show":false},"OL-08":{"x":50,"y":595.8,"r":9.72,"label":"忠诚会员订阅补充购买与…","dy":27.7,"show":false},"TP-02":{"x":89.2,"y":311.5,"r":9.72,"label":"企业应收信用催收与坏账…","dy":27.7,"show":false},"AGT-001":{"x":248.1,"y":97.9,"r":8.505,"label":"衡远","dy":-15.5,"show":false},"AGT-002":{"x":308.9,"y":287.2,"r":8.505,"label":"枢衡","dy":26.5,"show":false},"AGT-003":{"x":176.6,"y":248.1,"r":8.505,"label":"明镜","dy":26.5,"show":false},"AGT-016":{"x":540.5,"y":507.9,"r":8.505,"label":"知量","dy":26.5,"show":false},"AGT-019":{"x":502.4,"y":544.3,"r":8.505,"label":"通途","dy":26.5,"show":false},"AGT-026":{"x":213.2,"y":730.8,"r":8.505,"label":"衡价","dy":-15.5,"show":false},"AGT-042":{"x":193.8,"y":226.8,"r":8.505,"label":"合账","dy":26.5,"show":false},"IO-06":{"x":528.2,"y":320,"r":9.72,"label":"品类商品组合与生命周期","dy":27.7,"show":false},"AD-02":{"x":406.2,"y":830.7,"r":9.72,"label":"受众细分洞察与沟通策略","dy":27.7,"show":false},"CO-03":{"x":174.8,"y":783.8,"r":9.72,"label":"品类陈列站内搜索推荐与…","dy":27.7,"show":false},"AGT-017":{"x":447.8,"y":534.7,"r":8.505,"label":"衡仓","dy":26.5,"show":false},"AGT-029":{"x":518.4,"y":724.5,"r":8.505,"label":"立言","dy":26.5,"show":false},"AGT-032":{"x":377.6,"y":736.9,"r":8.505,"label":"点火","dy":26.5,"show":false},"AGT-009":{"x":554.5,"y":218.3,"r":8.505,"label":"定形","dy":-15.5,"show":false},"AGT-013":{"x":523.9,"y":249.8,"r":8.505,"label":"求证","dy":26.5,"show":false},"AGT-022":{"x":254,"y":770.3,"r":8.505,"label":"觅位","dy":26.5,"show":false},"AGT-024":{"x":296.1,"y":216.2,"r":8.505,"label":"拓域","dy":26.5,"show":false},"AGT-025":{"x":126.8,"y":657.8,"r":8.505,"label":"联商","dy":26.5,"show":false},"AGT-028":{"x":421.9,"y":704.1,"r":8.505,"label":"译境","dy":26.5,"show":false},"AGT-005":{"x":85.4,"y":440.9,"r":8.505,"label":"守衡","dy":-15.5,"show":false},"AGT-014":{"x":571.5,"y":562.3,"r":8.505,"label":"择源","dy":-15.5,"show":false},"AGT-027":{"x":258.9,"y":728.6,"r":8.505,"label":"守店","dy":26.5,"show":false},"AGT-030":{"x":432.1,"y":835.3,"r":8.505,"label":"叙事","dy":26.5,"show":false},"AGT-031":{"x":483.7,"y":712.6,"r":8.505,"label":"绘影","dy":26.5,"show":false},"AGT-039":{"x":150.5,"y":480.3,"r":8.505,"label":"同行","dy":26.5,"show":false},"AGT-050":{"x":134.6,"y":780.7,"r":8.505,"label":"门卫","dy":26.5,"show":false},"AGT-047":{"x":183.1,"y":808.7,"r":8.505,"label":"接桥","dy":26.5,"show":false},"AGT-006":{"x":470.5,"y":775.1,"r":8.505,"label":"听澜","dy":26.5,"show":false},"AGT-007":{"x":479.6,"y":133.2,"r":8.505,"label":"望野","dy":-15.5,"show":false},"AGT-008":{"x":513.3,"y":168.3,"r":8.505,"label":"拓新","dy":26.5,"show":false},"AGT-034":{"x":341.9,"y":833.4,"r":8.505,"label":"续缘","dy":-15.5,"show":false},"AGT-036":{"x":463.4,"y":320.5,"r":8.505,"label":"安心","dy":26.5,"show":false},"AGT-004":{"x":304.9,"y":48.5,"r":8.505,"label":"知人","dy":-15.5,"show":false},"AGT-010":{"x":533.6,"y":294.4,"r":8.505,"label":"映物","dy":26.5,"show":false},"AGT-011":{"x":571.5,"y":200,"r":8.505,"label":"砺器","dy":26.5,"show":false},"AGT-038":{"x":571.5,"y":247.7,"r":8.505,"label":"回声","dy":26.5,"show":false},"AGT-046":{"x":506,"y":777.1,"r":8.505,"label":"清源","dy":26.5,"show":false},"AGT-048":{"x":232.4,"y":59.6,"r":8.505,"label":"积知","dy":-15.5,"show":false},"AGT-012":{"x":551.1,"y":135.4,"r":8.505,"label":"灵枢","dy":-15.5,"show":false},"AGT-033":{"x":482.2,"y":844.5,"r":8.505,"label":"结伴","dy":-15.5,"show":false},"AGT-049":{"x":198.5,"y":848,"r":8.505,"label":"稳行","dy":26.5,"show":false}}}};
function initKnowledgeMotion(cfg) {
 const {root,svg,space,data,nodeEls,edgeEls}=cfg,ns='http://www.w3.org/2000/svg';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),domains=[...new Set(data.nodes.map(n=>n.domain))];
 const make=(tag,attrs)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));return el;};
 let visible=cfg.visible,raf=0,lastPaint=0,clock=0,driftClock=0,hover=false,pageHidden=false,entered=false,entranceTimer=0;
 const nodes=data.nodes.map((node,i)=>{
  const el=nodeEls.get(node.id),aura=make('circle',{'class':'kg-aura','aria-hidden':'true'});
  el.insertBefore(aura,el.querySelector('.kg-hit'));
  el.classList.toggle('kg-hub',node.kind==='价值流'||node.kind==='经营对象'||node.id==='brand');
  el.style.setProperty('--kg-breath-delay',`${-(i%11)*.57}s`);
  el.style.setProperty('--kg-breath-time',`${5.8+(i%5)*.45}s`);
  el.style.setProperty('--kg-arrival-delay',`${domains.indexOf(node.domain)*32+(i%4)*22}ms`);
  return {id:node.id,el,aura,domain:domains.indexOf(node.domain),phase:i*2.39996,x:0,y:0,transform:''};
 });
 const byId=new Map(nodes.map(n=>[n.id,n]));
 const edges=data.edges.map((edge,i)=>({...edge,el:edgeEls[i],a:byId.get(edge.source),b:byId.get(edge.target),path:''}));
 const signalsLayer=make('g',{'class':'kg-signals','aria-hidden':'true'});
 space.insertBefore(signalsLayer,space.querySelector('.kg-nodes'));
 const signals=Array.from({length:24},(_,i)=>{
  const el=make('g',{'class':'kg-signal'}),glow=make('circle',{'class':'kg-signal-glow'}),dot=make('circle',{'class':'kg-signal-dot'});
  el.append(glow,dot);signalsLayer.append(el);return {el,glow,dot,edge:null,phase:(i*.381966)%1,duration:3.6+(i%7)*.42};
 });
 const mobile=()=>cfg.getLayout()===data.mobile;
 const position=id=>byId.get(id)||cfg.getLayout().pos[id];
 function paintEdges(){
  edges.forEach(edge=>{
   const path=`M${edge.a.x} ${edge.a.y}L${edge.b.x} ${edge.b.y}`;
   if(path!==edge.path){edge.el.setAttribute('d',path);edge.path=path;}
  });
 }
 function paintGeometry(){
  const layout=cfg.getLayout(),settle=Math.min(1,driftClock/1.8),small=mobile();
  nodes.forEach(node=>{
   const base=layout.pos[node.id],groupPhase=node.domain*.8976;
   const amplitude=node.id==='brand'?1.6:small?3.2:5.0;
   const dx=(Math.sin(driftClock*.43+groupPhase)*amplitude+Math.sin(driftClock*.71+node.phase)*amplitude*.72)*settle;
   const dy=(Math.cos(driftClock*.37+groupPhase)*amplitude*.65+Math.sin(driftClock*.57+node.phase)*amplitude*.62)*settle;
   node.x=Number((base.x+dx).toFixed(1));node.y=Number((base.y+dy).toFixed(1));
   const transform=`translate(${node.x} ${node.y})`;
   if(transform!==node.transform){node.el.setAttribute('transform',transform);node.transform=transform;}
  });
  paintEdges();
 }
 function paintSignals(){
  signals.forEach(signal=>{
   if(!signal.edge)return;
   const t=(clock/signal.duration+signal.phase)%1,{a,b}=signal.edge;
   signal.el.setAttribute('transform',`translate(${(a.x+(b.x-a.x)*t).toFixed(1)} ${(a.y+(b.y-a.y)*t).toFixed(1)})`);
   signal.el.style.opacity=String(Math.min(1,t/.13,(1-t)/.16)*.85);
  });
 }
 function updateScale(scale=(svg.getBoundingClientRect().width||cfg.getLayout().w)/cfg.getLayout().w*cfg.getZoom()){
  const radius=Math.max(1.1,Math.min(3.7,1.8/scale));
  signals.forEach(signal=>{signal.dot.setAttribute('r',radius);signal.glow.setAttribute('r',radius*3.1);});
 }
 function refreshRoutes(){
  const filter=cfg.getFilter(),selected=cfg.getSelected(),engaged=cfg.isEngaged();
  // Select only existing links. In the idle view spread signals across all seven domains.
  const eligible=!engaged?edges:edges.filter(edge=>filter
   ?edge.a.el.dataset.domain===filter&&edge.b.el.dataset.domain===filter
   :edge.source===selected||edge.target===selected);
  const limit=Math.min(mobile()?14:24,eligible.length),chosen=[];
  if(engaged){for(let i=0;i<limit;i++)chosen.push(eligible[Math.floor(i*eligible.length/limit)]);root.classList.remove('kg-arriving');}
  else{
   const buckets=domains.map(domain=>eligible.filter(edge=>edge.a.el.dataset.domain===domain));
   for(let i=0;i<limit;i++){
    const bucket=buckets[i%domains.length],pass=Math.floor(i/domains.length);
    chosen.push(bucket[(pass*11+(i%domains.length)*3)%bucket.length]||eligible[i]);
   }
  }
  signals.forEach((signal,i)=>{
   signal.edge=chosen[i]||null;signal.el.toggleAttribute('hidden',!signal.edge);
   if(signal.edge){signal.el.dataset.source=signal.edge.source;signal.el.dataset.target=signal.edge.target;signal.el.dataset.domain=signal.edge.a.el.dataset.domain;}
  });
  paintSignals();
 }
 function resetLayout(){
  const layout=cfg.getLayout();driftClock=0;
  nodes.forEach(node=>{const p=layout.pos[node.id];node.x=p.x;node.y=p.y;node.transform=`translate(${p.x} ${p.y})`;node.el.setAttribute('transform',node.transform);node.aura.setAttribute('r',p.r+7);});
  edges.forEach(edge=>edge.path='');paintEdges();refreshRoutes();updateScale();
 }
 const active=()=>visible&&!document.hidden&&!pageHidden&&!reduced.matches;
 const geometryHeld=()=>hover||(root.contains(document.activeElement)&&document.activeElement.matches(':focus-visible'))||cfg.getZoom()>1||cfg.isManipulating();
 function draw(now){
  raf=0;if(!active()){sync();return;}
  const interval=mobile()?1000/24:1000/30;
  if(!lastPaint||now-lastPaint>=interval){
   const dt=lastPaint?Math.min(.08,(now-lastPaint)/1000):0;lastPaint=now;
   clock+=dt;
   if(!geometryHeld()){driftClock+=dt;paintGeometry();}
   paintSignals();
  }
  raf=requestAnimationFrame(draw);
 }
 function sync(){
  const playing=active();root.classList.toggle('kg-motion-running',playing);root.classList.toggle('kg-motion-paused',!playing);
  if(!playing){cancelAnimationFrame(raf);raf=0;lastPaint=0;return;}
  if(!entered){entered=true;root.classList.add('kg-arriving');entranceTimer=setTimeout(()=>root.classList.remove('kg-arriving'),1300);}
  if(!raf)raf=requestAnimationFrame(draw);
 }
 function setVisible(value){visible=value;sync();}
 svg.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hover=true;});
 svg.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hover=false;});
 document.addEventListener('visibilitychange',sync);
 reduced.addEventListener('change',sync);
 window.addEventListener('pagehide',()=>{pageHidden=true;clearTimeout(entranceTimer);root.classList.remove('kg-arriving');sync();});
 window.addEventListener('pageshow',()=>{pageHidden=false;sync();});
 root.classList.add('kg-motion-ready');resetLayout();sync();
 return {position,resetLayout,refreshRoutes,updateScale,setVisible};
}

function initKnowledgeGraph() {
 const root=$('#knowledge-graph'),svg=$('#kg-svg'),space=$('#kg-space'),map=new Map(kgData.nodes.map(n=>[n.id,n]));
 const adjacency=new Map(kgData.nodes.map(n=>[n.id,new Set()]));
 kgData.edges.forEach(e=>{adjacency.get(e.source).add(e.target);adjacency.get(e.target).add(e.source);});
 let selected='obj-sku',filter='',engaged=false,zoom=1,offset={x:0,y:0},layout,inView=!('IntersectionObserver'in window),frame=0,motion=null;
 let drag=null,pinch=null,suppressUntil=0;
 const pointers=new Map(),ns='http://www.w3.org/2000/svg';
 const make=(tag,attrs)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;};
 const edgeLayer=make('g',{'class':'kg-edges','aria-hidden':'true'}),nodeLayer=make('g',{'class':'kg-nodes'});
 space.append(edgeLayer,nodeLayer);
 const edgeEls=kgData.edges.map(e=>{const path=make('path',{'class':'kg-edge','data-source':e.source,'data-target':e.target,'data-domain':map.get(e.source).domain});edgeLayer.append(path);return path;});
 const nodeEls=new Map(kgData.nodes.map(n=>{
  const g=make('g',{'class':'kg-node','data-node':n.id,'data-domain':n.domain,'data-kind':n.kind,'role':'button','aria-label':n.kind+'：'+n.name,'aria-pressed':'false',tabindex:n.id===selected?'0':'-1'});
  const title=make('title',{});title.textContent=n.name+' · '+n.kind;
  g.append(title,make('circle',{'class':'kg-hit'}),make('circle',{'class':'kg-ring'}),make('circle',{'class':'kg-dot'}));
  g.append(make('text',{'class':'kg-label','text-anchor':'middle','aria-hidden':'true'}));nodeLayer.append(g);return[n.id,g];
 }));
 const bounds=()=>{
  const x=(zoom-1)*layout.w/2,y=(zoom-1)*layout.h/2;
  offset.x=Math.max(-x,Math.min(x,offset.x));offset.y=Math.max(-y,Math.min(y,offset.y));
 };
 function updateNodeSize(){
  const scale=(svg.getBoundingClientRect().width||layout.w)/layout.w;
  svg.style.setProperty('--kg-selected-font',`${Math.min(30,14/(scale*zoom))}px`);
  nodeEls.forEach((el,id)=>el.querySelector('.kg-hit').setAttribute('r',Math.max(layout.pos[id].r,9/(scale*zoom))));
  motion?.updateScale(scale*zoom);
 }
 function transform(){
  if(frame){cancelAnimationFrame(frame);frame=0;}
  bounds();
  space.setAttribute('transform',`translate(${offset.x} ${offset.y}) translate(${layout.w/2} ${layout.h/2}) scale(${zoom}) translate(${-layout.w/2} ${-layout.h/2})`);
  $('#kg-reset').disabled=zoom===1&&offset.x===0&&offset.y===0;
  $('#kg-out').disabled=zoom<=1;$('#kg-in').disabled=zoom>=2.4;
  svg.style.touchAction=zoom>1?'none':'pan-y';
  svg.classList.toggle('ux-zoomed',zoom>1);root.dataset.zoom=String(zoom);
  updateNodeSize();
 }
 const scheduleTransform=()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;transform();});};
 function localPoint(x,y){const r=svg.getBoundingClientRect(),scale=layout.w/(r.width||layout.w);return{x:(x-r.left)*scale,y:(y-r.top)*scale};}
 function setZoom(value,anchor={x:layout.w/2,y:layout.h/2}){
  const next=Math.max(1,Math.min(2.4,Math.round(value*100)/100)),ratio=next/zoom;
  offset={x:(1-ratio)*(anchor.x-layout.w/2)+offset.x*ratio,y:(1-ratio)*(anchor.y-layout.h/2)+offset.y*ratio};
  zoom=next;transform();
 }
 function revealSelected(){
  if(zoom<=1)return;
  const p=motion?.position(selected)||layout.pos[selected],margin=Math.min(layout.w*.16,70),x=(p.x-layout.w/2)*zoom+layout.w/2+offset.x,y=(p.y-layout.h/2)*zoom+layout.h/2+offset.y;
  if(x<margin)offset.x+=margin-x;else if(x>layout.w-margin)offset.x-=x-(layout.w-margin);
  if(y<margin)offset.y+=margin-y;else if(y>layout.h-margin)offset.y-=y-(layout.h-margin);
  transform();
 }
 function resize(){
  layout=matchMedia('(max-width:760px)').matches?kgData.mobile:kgData.desktop;
  svg.setAttribute('viewBox',`0 0 ${layout.w} ${layout.h}`);root.dataset.layout=layout===kgData.mobile?'mobile':'desktop';
  zoom=1;offset={x:0,y:0};drag=null;pinch=null;pointers.clear();svg.classList.remove('ux-panning');
  kgData.edges.forEach((e,i)=>{const a=layout.pos[e.source],b=layout.pos[e.target];edgeEls[i].setAttribute('d',`M${a.x} ${a.y}L${b.x} ${b.y}`);});
  kgData.nodes.forEach(n=>{
   const p=layout.pos[n.id],el=nodeEls.get(n.id);el.setAttribute('transform',`translate(${p.x} ${p.y})`);
   el.querySelector('.kg-dot').setAttribute('r',p.r);el.querySelector('.kg-ring').setAttribute('r',p.r+5);
   const label=el.querySelector('text');label.setAttribute('y',p.dy);label.textContent=p.label;el.classList.toggle('has-label',p.show);
  });
  transform();
  motion?.resetLayout();
 }
 function highlight(){
  const near=adjacency.get(selected);
  nodeEls.forEach((el,id)=>{
   const n=map.get(id),included=filter?n.domain===filter:id===selected||near.has(id);
   el.classList.toggle('is-muted',engaged&&!included);el.classList.toggle('is-related',engaged&&included);el.classList.toggle('is-selected',id===selected);
   el.setAttribute('aria-pressed',String(id===selected));el.setAttribute('tabindex',id===selected?'0':'-1');
  });
  kgData.edges.forEach((e,i)=>{
   const match=filter?map.get(e.source).domain===filter&&map.get(e.target).domain===filter:e.source===selected||e.target===selected;
   edgeEls[i].classList.toggle('is-highlight',engaged&&match);edgeEls[i].classList.toggle('is-muted',engaged&&!match);
  });
  $$('[data-kg-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.kgFilter===filter)));
  root.classList.toggle('ux-graph-active',engaged&&inView);
  motion?.refreshRoutes();
 }
 function detail(id){selected=id;highlight();revealSelected();}
 root.addEventListener('click',e=>{
  if(performance.now()<suppressUntil&&e.target.closest('#kg-svg')){e.preventDefault();e.stopPropagation();return;}
  const node=e.target.closest('[data-node]');
  if(node){filter='';engaged=true;detail(node.dataset.node);return;}
  const chip=e.target.closest('[data-kg-filter]');
  if(chip){filter=chip.dataset.kgFilter;engaged=!!filter;detail(filter||'obj-sku');return;}
  const control=e.target.closest('[data-kg-zoom]');
  if(control){if(control.dataset.kgZoom==='reset'){zoom=1;offset={x:0,y:0};transform();}else setZoom(zoom+Number(control.dataset.kgZoom));}
 });
 nodeLayer.addEventListener('keydown',e=>{
  const id=e.target.closest('[data-node]')?.dataset.node;if(!id)return;
  if(e.key==='Enter'||e.key===' '){e.preventDefault();filter='';engaged=true;detail(id);}
  else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
   e.preventDefault();const p=layout.pos[id],horizontal=e.key==='ArrowLeft'||e.key==='ArrowRight',sign=e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1;
   const candidate=kgData.nodes.filter(n=>n.id!==id&&(layout.pos[n.id][horizontal?'x':'y']-p[horizontal?'x':'y'])*sign>0).sort((a,b)=>{
    const distance=n=>{const q=layout.pos[n.id];return Math.hypot(q.x-p.x,q.y-p.y)+Math.abs(q[horizontal?'y':'x']-p[horizontal?'y':'x'])*1.4;};return distance(a)-distance(b);
   })[0];
   if(candidate){filter='';engaged=true;detail(candidate.id);nodeEls.get(candidate.id).focus({preventScroll:true});}
  }
 });
 function startPinch(){
  const [a,b]=[...pointers.values()],center=localPoint((a.x+b.x)/2,(a.y+b.y)/2);
  pinch={distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),zoom,offset:{...offset},center};drag=null;
  suppressUntil=performance.now()+500;svg.classList.add('ux-panning');
 }
 svg.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===2){startPinch();svg.setPointerCapture?.(e.pointerId);return;}
  if(zoom<=1)return;
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,offset:{...offset},moved:false};
 });
 svg.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId))return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pinch&&pointers.size>=2){
   e.preventDefault();const [a,b]=[...pointers.values()],center=localPoint((a.x+b.x)/2,(a.y+b.y)/2);
   zoom=Math.max(1,Math.min(2.4,Math.round(pinch.zoom*Math.hypot(a.x-b.x,a.y-b.y)/pinch.distance*100)/100));
   const ratio=zoom/pinch.zoom;
   offset={x:center.x-layout.w/2-(pinch.center.x-layout.w/2-pinch.offset.x)*ratio,y:center.y-layout.h/2-(pinch.center.y-layout.h/2-pinch.offset.y)*ratio};
   suppressUntil=performance.now()+500;scheduleTransform();return;
  }
  if(!drag||drag.id!==e.pointerId)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.moved&&Math.abs(dx)+Math.abs(dy)>5){drag.moved=true;svg.setPointerCapture?.(e.pointerId);svg.classList.add('ux-panning');}
  if(!drag.moved)return;
  e.preventDefault();const scale=layout.w/(svg.getBoundingClientRect().width||layout.w);
  offset={x:drag.offset.x+dx*scale,y:drag.offset.y+dy*scale};suppressUntil=performance.now()+400;scheduleTransform();
 });
 const endPointer=e=>{
  if(!pointers.has(e.pointerId))return;
  const moved=drag?.moved||!!pinch;pointers.delete(e.pointerId);drag=null;pinch=null;
  if(svg.hasPointerCapture?.(e.pointerId))svg.releasePointerCapture(e.pointerId);
  if(moved)suppressUntil=performance.now()+400;
  if(pointers.size===1&&zoom>1){const [id,p]=[...pointers.entries()][0];drag={id,x:p.x,y:p.y,offset:{...offset},moved:false};}
  else svg.classList.remove('ux-panning');
  transform();
 };
 window.addEventListener('pointerup',endPointer);window.addEventListener('pointercancel',endPointer);
 svg.addEventListener('lostpointercapture',e=>{if(pointers.has(e.pointerId))endPointer(e);});
 svg.addEventListener('dblclick',e=>{e.preventDefault();setZoom(zoom>1?1:2,localPoint(e.clientX,e.clientY));});
 svg.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();setZoom(zoom*Math.exp(-e.deltaY*.002),localPoint(e.clientX,e.clientY));},{passive:false});
 matchMedia('(max-width:760px)').addEventListener('change',resize);
 if('ResizeObserver'in window)new ResizeObserver(()=>{if(layout)updateNodeSize();}).observe(svg);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;root.classList.toggle('ux-graph-active',engaged&&inView);motion?.setVisible(inView);}).observe(root);
 window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));
 resize();detail(selected);
 motion=initKnowledgeMotion({root,svg,space,data:kgData,nodeEls,edgeEls,visible:inView,getLayout:()=>layout,getZoom:()=>zoom,getSelected:()=>selected,getFilter:()=>filter,isEngaged:()=>engaged,isManipulating:()=>pointers.size>0});
}



initV1();
initKnowledgeGraph();
initUXMotion();
initLocale();
})();
