import React, { useState } from 'react';
import { Icon } from '../components/Controls';

type MarketDetailProps = {
  kind: 'skill' | 'connector';
  onNavigate: (id: string) => void;
  onNotice: (message: string) => void;
};

function CodePreview({ title, children, expandable = false, onNotice }: { title: string; children: string; expandable?: boolean; onNotice: (message: string) => void }) {
  const pending = (action: string) => onNotice(`“${action}”的原生结果尚未采集；保留代码展示，未写入剪贴板或执行代码。`);
  return <div className="market-detail-code" role="group" aria-label={`${title}代码示例`}>
    <div className="market-detail-code-toolbar"><span>code.txt</span><div>
      <button type="button" aria-label={`开启代码换行：${title}`} aria-pressed={false} title="开启代码换行" onClick={() => pending('开启代码换行')}><Icon name="code" size={14} /></button>
      {expandable && <button type="button" aria-label={`展开代码：${title}`} title="展开代码" onClick={() => pending('展开代码')}><Icon name="plus" size={14} /></button>}
      <button type="button" aria-label={`复制代码：${title}`} title="复制代码" onClick={() => pending('复制代码')}><Icon name="copy" size={14} /></button>
    </div></div>
    <pre tabIndex={0} aria-label={`${title}代码内容`}><code>{children}</code></pre>
  </div>;
}

// The observed headings are retained; body text, role summaries and examples are
// local paraphrases. Third-party skill instructions are display content only.
function ResearchDescription({ onNotice }: { onNotice: (message: string) => void }) {
  return <section className="extension-detail-section market-detail-skill-section" aria-labelledby="market-skill-description">
    <h2 id="market-skill-description">Skill 说明</h2>
    <article className="extension-detail-document market-detail-research" aria-label="深入研究说明正文">
      <h3>Deep Research</h3>
      <h4>Core Purpose</h4>
      <p>This skill describes a structured approach to technical research: gather useful sources, compare independent evidence, and produce a report with traceable citations.</p>
      <p><strong>Autonomy Principle</strong> — The description connects research stages into a continuous workflow, while preserving the question, scope, and evidence requirements.</p>
      <blockquote className="market-detail-autonomy">The proposed workflow develops a research question into an evidence-based report. Sources are compared, uncertainty stays visible, and conclusions are linked to supporting material. Each stage builds on the evidence gathered so far and keeps unresolved questions in view.</blockquote>
      <p className="market-detail-provenance">正文为本地改写与结构摘要；后部只有部分 AX 依据，未逐屏校准，也不代表完整尾部。</p>
      <h4>Decision Tree</h4>
      <CodePreview title="Decision Tree" onNotice={onNotice}>{'Research question\n├─ Define scope and evidence needs\n├─ Gather and cross-check sources\n└─ Synthesize findings with citations'}</CodePreview>

      <h4>Agent Architecture</h4>
      <p>The description separates collection, comparison, and synthesis. The roles below summarize those responsibilities.</p>
      <h4>Agent Roles</h4>
      <div className="market-detail-table-wrap"><table aria-label="研究角色摘要"><thead><tr><th scope="col">Role</th><th scope="col">Agent</th><th scope="col">Purpose</th></tr></thead><tbody><tr><th scope="row">Orchestrator</th><td>Planning agent</td><td>Coordinate the research scope.</td></tr><tr><th scope="row">Retrieval</th><td>Source researcher</td><td>Collect relevant material.</td></tr><tr><th scope="row">Gap-Fill</th><td>Follow-up researcher</td><td>Investigate missing evidence.</td></tr><tr><th scope="row">Verification</th><td>Evidence reviewer</td><td>Cross-check important claims.</td></tr><tr><th scope="row">Synthesis</th><td>Report writer</td><td>Connect findings and references.</td></tr></tbody></table></div>
      <h4>Agent Assignment per Phase</h4>
      <div className="market-detail-table-wrap"><table aria-label="阶段分工摘要"><thead><tr><th scope="col">Phase</th><th scope="col">Standard</th><th scope="col">Deep</th></tr></thead><tbody><tr><th scope="row">Scoping</th><td>Define the question.</td><td>Map related questions and boundaries.</td></tr><tr><th scope="row">Research</th><td>Collect and compare sources.</td><td>Investigate gaps and competing evidence.</td></tr><tr><th scope="row">Synthesis</th><td>Summarize findings with citations.</td><td>Review conclusions and limitations.</td></tr></tbody></table></div>
      <h4>Source Credibility</h4>
      <div className="market-detail-table-wrap"><table aria-label="来源可信度摘要"><thead><tr><th scope="col">Source</th><th scope="col">Assessment</th></tr></thead><tbody><tr><th scope="row">Primary material</th><td>Check origin, context, and recency.</td></tr><tr><th scope="row">Independent analysis</th><td>Compare evidence and competing explanations.</td></tr><tr><th scope="row">Unverified claims</th><td>Keep uncertainty explicit until corroborated.</td></tr></tbody></table></div>
      <h4>Tool Constraints</h4><p>Available tools and source access limit what can be checked. Missing evidence remains a stated limitation rather than a completed finding.</p>
      <h4>Scaling</h4><div className="market-detail-table-wrap"><table aria-label="研究规模摘要"><thead><tr><th scope="col">Scope</th><th scope="col">Approach</th></tr></thead><tbody><tr><th scope="row">Focused question</th><td>Prioritize directly relevant sources and checks.</td></tr><tr><th scope="row">Broader investigation</th><td>Expand source coverage and compare alternatives.</td></tr><tr><th scope="row">Conflicting evidence</th><td>Add verification and preserve uncertainty.</td></tr></tbody></table></div>
      <h4>Research Phases</h4><ol><li>Clarify the question and define the scope.</li><li>Collect sources and compare supporting evidence.</li><li>Review competing explanations and open questions.</li><li>Write a cited report with explicit limitations.</li></ol>
      <h4>Report Template</h4>
      <CodePreview title="Report Template" expandable onNotice={onNotice}>{'# Research report\n\n## Question and scope\n## Findings and supporting evidence\n## Alternative explanations\n## Limitations\n## References'}</CodePreview>
      <p className="market-detail-tail">以上阶段和模板仅作已识别结构的本地摘要；不会启动研究、调用模型或生成报告。</p>
    </article>
  </section>;
}

function ConnectorDescription() {
  return <>
    <section className="extension-detail-section market-detail-service-section" aria-labelledby="market-connector-service">
      <h2 id="market-connector-service">MCP 服务 <span>1</span></h2>
      <div className="market-detail-service"><h3>GitHub</h3>
        <dl className="market-detail-service-properties"><div><dt>传输协议</dt><dd>HTTP</dd></div><div><dt>认证方式</dt><dd>OAuth</dd></div></dl>
        <dl className="market-detail-service-address"><dt>服务地址</dt><dd>https://api.githubcopilot.com/mcp/</dd></dl>
        <p className="market-detail-service-note">安装并启用 Connector 后可查看工具。</p>
      </div>
    </section>
    <section className="extension-detail-section market-detail-connector-description" aria-labelledby="market-connector-description"><h2 id="market-connector-description">Connector 说明</h2><p>这个市场条目暂时没有提供详细说明。</p></section>
  </>;
}

export function MarketDetailPage({ kind, onNavigate, onNotice }: MarketDetailProps) {
  const isSkill = kind === 'skill';
  const title = isSkill ? '深入研究' : 'GitHub';
  const typeLabel = isSkill ? '技能' : '连接器';
  const back = () => {
    if (!isSkill) onNotice('返回连接器市场为本地导航；目的页已有原生观察，不代表其他详情路径均已核验。');
    onNavigate(`QDR.P04.market.${isSkill ? 'skills' : 'connectors'}.default`);
  };
  return <section className={`extension-detail market-content-detail market-content-${kind}`} aria-label={`${title}${typeLabel}详情`} tabIndex={0}>
    <nav className="extension-detail-breadcrumb" aria-label="市场详情导航"><button type="button" onClick={back}>{typeLabel}</button><Icon name="chevron" size={11} /><span aria-current="page">{title}</span></nav>
    <div className="extension-detail-content">
      <header className="extension-detail-header">
        <span className="extension-detail-icon market-detail-icon" role="img" aria-label={`原创 ${title} 图标占位`}><Icon name={isSkill ? 'search' : 'code'} size={23} /></span>
        <div className="extension-detail-identity"><div className="extension-detail-title"><h1>{title}</h1><span>{isSkill ? 'v1.0.0' : 'v1.0.1'}</span></div><div className="extension-detail-meta"><span>{isSkill ? '@Jose-Luis-Nunez' : '@GitHub'}</span><span title="本次采集快照，非实时指标">{isSkill ? '33872' : '1326'} 次安装</span><span>{isSkill ? 'Knowledge' : 'Coding'}</span></div></div>
        <button type="button" className="extensions-primary extension-detail-install" aria-label={`安装 ${title}`} onClick={() => onNotice(`“安装 ${title}”的结果尚未采集；未安装扩展、请求服务、授权账户或启动模型。`)}>安装</button>
      </header>
      <p className="extension-detail-intro">{isSkill ? '围绕技术主题收集资料，验证来源并进行交叉比对，整理为有引用支持的研究报告。' : '通过 MCP 汇集 GitHub 仓库、Issue、Pull Request 与评论等研发上下文，使智能体能围绕项目资料理解开发过程。仓库内容、问题讨论、提交与审阅记录可以为分析需求、梳理变更和协作评审提供相关信息。连接器介绍还涉及按任务查找并关联这些资料，将代码背景与讨论中的决策联系起来；实际可用工具取决于安装、启用及账户授权后的服务配置。'}</p>
      {isSkill ? <ResearchDescription onNotice={onNotice} /> : <ConnectorDescription />}
    </div>
  </section>;
}

const SUPERPOWERS_SKILLS = [
  ['brainstorming', 'Explore a goal, compare options, and clarify the intended design.'],
  ['dispatching-parallel-agents', 'Organize independent tasks for parallel investigation.'],
  ['executing-plans', 'Follow an implementation plan with review points.'],
  ['finishing-a-development-branch', 'Review completed work and prepare the next integration step.'],
  ['receiving-code-review', 'Understand review feedback and check its supporting evidence.'],
  ['requesting-code-review', 'Prepare a focused review of implementation changes.'],
  ['subagent-driven-development', 'Divide implementation work into bounded responsibilities.'],
  ['systematic-debugging', 'Investigate a failure and verify its underlying cause.'],
  ['test-driven-development', 'Connect expected behavior with implementation checks.'],
  ['using-git-worktrees', 'Organize isolated working directories for development.'],
  ['using-superpowers', 'Introduce the suite and its available workflow guidance.'],
  ['verification-before-completion', 'Check the evidence before reporting completion.'],
  ['writing-plans', 'Describe the steps and checks for a development task.'],
  ['writing-skills', 'Organize reusable instructions and examples.'],
];
const SUPERPOWERS_DETAIL = 'QDR.P04.market.plugins.superpowers.detail';
const SUPERPOWERS_EXPANDED = 'QDR.P04.market.plugins.superpowers.expanded';
const CONTEXT7_DETAIL = 'QDR.P04.market.plugins.context7.detail';
const CONTEXT7_ERROR = 'QDR.P04.market.connectors.context7.error';

export function PluginMarketDetailPage({ initialVariant, onNavigate, onNotice }: {
  initialVariant: string; onNavigate: (id: string) => void; onNotice: (message: string) => void;
}) {
  const superpowers = initialVariant.startsWith('plugins-superpowers-');
  const expanded = initialVariant === 'plugins-superpowers-expanded';
  const failed = initialVariant === 'connectors-context7-error';
  const title = superpowers ? 'Superpowers' : failed ? 'context7' : 'Context7';
  const [retries, setRetries] = useState(0);
  const pending = (action: string) => onNotice(`“${action}”的结果尚未采集；未安装扩展、请求服务、授权账户或执行技能。`);
  const skills = superpowers ? SUPERPOWERS_SKILLS.slice(0, expanded ? 14 : 6) : [['context7-mcp', 'Find current library documentation and examples through the Context7 MCP service.']];
  const outline = (label: string) => <a href="#superpowers-summary" onClick={event => { event.preventDefault(); onNotice(`“${label}”目录链接的跳转尚未采集；当前保留本地结构摘要。`); }}>{label}</a>;
  return <section className="extension-detail market-expanded-detail" aria-label={`${title}${failed ? '连接器读取失败' : '插件详情'}`}>
    <nav className="extension-detail-breadcrumb" aria-label="插件详情导航"><button type="button" onClick={() => onNavigate(failed ? CONTEXT7_DETAIL : 'QDR.P04.market.plugins.default')}>{failed ? 'Context7' : '插件'}</button><Icon name="chevron" size={11} /><span aria-current="page">{title}</span></nav>
    <div className="market-expanded-scroll" role="region" aria-label={`${title}详情正文`} tabIndex={0}>
      <div className="extension-detail-content">
        <header className="extension-detail-header">
          <span className={`extension-detail-icon ${superpowers ? 'market-superpowers-icon' : failed ? 'market-context7-error-icon' : 'market-context7-icon'}`} role="img" aria-label={`原创 ${title} 图标占位`}><Icon name={superpowers ? 'bolt' : failed ? 'code' : 'book'} size={23} /></span>
          <div className="extension-detail-identity"><div className="extension-detail-title"><h1>{title}</h1><span>{superpowers ? 'v6.3.0' : 'v1.0.0'}</span></div><div className="extension-detail-meta"><span>{superpowers ? '@Jesse Vincent' : '@Upstash'}</span><span title="本次采集快照，非实时指标">{superpowers ? '27109' : failed ? '0' : '16786'} 次安装</span><span>{superpowers ? 'Workflow' : 'Coding'}</span></div></div>
          <button type="button" className="extensions-primary extension-detail-install" aria-label={`安装 ${title}`} onClick={() => pending(`安装 ${title}`)}>安装</button>
        </header>
        {failed ? <div className="market-detail-failure-content"><div className="market-detail-failure">
          <span className="market-detail-failure-icon" aria-hidden="true"><Icon name="file" size={18} /></span>
          <h2>暂时无法读取详情</h2><p>市场条目的说明没有加载成功。你可以重试，已安装内容不会被改动。</p>
        </div><div className="market-detail-failure-actions">
          <button type="button" className="extensions-secondary" onClick={() => setRetries(value => value + 1)}>重试</button>
          {retries > 0 && <p className="market-detail-retry-status" role="status">第 {retries} 次本地重试演示：仍无法读取详情，未请求市场服务。</p>}
        </div></div> : <>
          <p className="extension-detail-intro">{superpowers ? '由 14 项技能组成的开发方法套件，串联需求梳理、计划、实施、调试与审阅，帮助组织开发过程中的工作与检查。' : '为开发任务提供版本相关的库文档与示例，将文档查找、命令入口和 Context7 连接器放在同一个套件中，便于围绕具体技术问题组织参考资料。'}</p>
          <section className="extension-detail-section market-plugin-skills" aria-labelledby="market-plugin-skills-heading">
            <div className="market-plugin-section-heading"><h2 id="market-plugin-skills-heading">技能 <span>{superpowers ? '14' : '1'}</span></h2>{superpowers && <button type="button" aria-expanded={expanded} aria-controls="market-plugin-skill-list" onClick={() => onNavigate(expanded ? SUPERPOWERS_DETAIL : SUPERPOWERS_EXPANDED)}>{expanded ? '收起' : '展开全部'}<Icon name="down" size={12} /></button>}</div>
            <div id="market-plugin-skill-list">{skills.map(([name, summary]) => <div className="extension-detail-skill-row" key={name}><span className="extension-detail-small-icon" aria-hidden="true"><Icon name="file" size={18} /></span><div><h3>{name}</h3><p title={`本地摘要：${summary}`}>{summary}</p></div></div>)}</div>
          </section>
          {!superpowers && <>
            <section className="extension-detail-section market-plugin-commands" aria-labelledby="market-plugin-commands-heading"><h2 id="market-plugin-commands-heading">命令 <span>1</span></h2><div className="market-plugin-command"><h3>docs</h3><p>Look up documentation for any library</p></div></section>
            <section className="extension-detail-section" aria-labelledby="market-plugin-connectors-heading"><h2 id="market-plugin-connectors-heading">连接器 <span>1</span></h2><div className="extension-detail-connector-row"><button type="button" className="extension-detail-connector" aria-label="context7 连接器" onClick={() => onNavigate(CONTEXT7_ERROR)}><Icon name="grid" size={15} />context7</button></div></section>
          </>}
          <section className="extension-detail-section" aria-labelledby="market-plugin-description-heading"><h2 id="market-plugin-description-heading">套件说明</h2>
            <article className="extension-detail-document" aria-label={`${title}套件说明正文`}>
              <h3>{superpowers ? title : 'Context7 Plugin for Claude Code'}</h3>
              <p>{superpowers ? 'Superpowers brings together guidance for planning, implementation, review, and verification. Its skills describe a connected development workflow.' : 'Context7 connects documentation lookup with a library-focused development workflow. The package description introduces its skill, command, and connector.'}</p>
              <p className="extension-detail-source-note">正文与条目说明为本地摘要，图标为原创占位；仅保留所见结构，未覆盖完整说明，不会执行其中的技能或安装步骤。</p>
              {superpowers && <><h4>Table of Contents</h4><ul className="market-plugin-outline"><li>{outline('Overview')}<ul><li>{outline('Skills and workflow')}</li></ul></li><li>{outline('Development guidance')}</li></ul><p className="market-detail-provenance">目录条目为本地概括；原生目录链接尚未逐项核验。</p></>}
              {!superpowers && <><h4>What's Included</h4><p>The package groups a documentation skill, a lookup command, and a Context7 connector.</p><h4>Installation</h4><p>The source description includes installation guidance. This local summary does not perform those steps or configure a service.</p><h4>Available Tools</h4><p>The description discusses identifying a library and finding relevant documentation. Availability depends on the installed and configured connector.</p><pre className="market-plugin-example" tabIndex={0} aria-label="Context7 本地示例结构"><code>{'Library: example-library\nTopic: configuration\nReference: version-matched documentation'}</code></pre></>}
            </article>
          </section>
        </>}
      </div>
    </div>
  </section>;
}
