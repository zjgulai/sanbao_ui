import React, { useId, useRef, useState } from 'react';

const CATEGORIES = ['落地页', '作品集', '博客与内容', '数据看板', '内部工具', '其他'];
const LANDING_TEMPLATES = [
  ['数字粒子', '企业官网'], ['Orbit', 'SaaS 产品官网'], ['山间来信', '咖啡馆'],
  ['Lattice', 'AI 产品官网'], ['Meridian', 'AI 研究官网'], ['Korva', '电商产品详情'],
  ['Popcorn', '产品营销卡片'], ['Signal Conference', '活动大会'],
  ['Maison Aubel', '餐厅预约'], ['Wander', '旅行目的地'],
];

export function SiteTemplates({ onCollapse }: { onCollapse: () => void }) {
  const [category, setCategory] = useState('落地页');
  const [notice, setNotice] = useState('');
  const [edge, setEdge] = useState({ start: true, end: false });
  const track = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const id = useId();
  const selectCategory = (value: string) => {
    setCategory(value); setNotice(''); setEdge({ start: true, end: false });
    if (track.current) track.current.scrollLeft = 0;
  };
  const move = (direction: number) => {
    const element = track.current;
    if (element) element.scrollBy({ left: direction * element.clientWidth * .86, behavior: 'auto' });
  };
  const unavailable = (name: string, action: string) => setNotice(`“${name}”的“${action}”行为尚未采集；当前仅展示模板入口，没有插入提示词或打开外部页面。`);

  return <section className="composer-site-templates" aria-label="站点起步模板" onKeyDown={event => {
    if (event.key === 'Escape' && !event.nativeEvent.isComposing) { event.preventDefault(); event.stopPropagation(); onCollapse(); }
  }}>
    <header><strong>站点起步模板</strong><button type="button" onClick={onCollapse} aria-label="收起模板">收起模板 <span aria-hidden="true">⌄</span></button></header>
    <div className="composer-site-category-row"><div className="composer-site-tabs" ref={tabs} role="tablist" aria-label="站点模板分类" onKeyDown={event => {
      if (event.nativeEvent.isComposing || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const current = CATEGORIES.indexOf(category);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? CATEGORIES.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + CATEGORIES.length) % CATEGORIES.length;
      selectCategory(CATEGORIES[next]); tabs.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
    }}>{CATEGORIES.map((item, index) => <button type="button" key={item} role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel`} aria-selected={category === item} tabIndex={category === item ? 0 : -1} onClick={() => selectCategory(item)}>{item}</button>)}</div>
      <div className="composer-site-paging"><button type="button" aria-label="上一组模板" disabled={category !== '落地页' || edge.start} onClick={() => move(-1)}>‹</button><button type="button" aria-label="下一组模板" disabled={category !== '落地页' || edge.end} onClick={() => move(1)}>›</button></div>
    </div>
    <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${CATEGORIES.indexOf(category)}`}>
      {category === '落地页' ? <div className="composer-site-track" ref={track} onScroll={event => {
        const element = event.currentTarget;
        setEdge({ start: element.scrollLeft <= 1, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 1 });
      }}>{LANDING_TEMPLATES.map(([name, description], index) => <article className="composer-site-card" key={name}>
        <div className={`composer-site-thumb tone-${index % 5}`} role="img" aria-label={`${name}原创占位缩略图`}><span className="composer-site-thumb-nav"><i /><i /><i /></span><span className="composer-site-thumb-title">{name}</span><span className="composer-site-thumb-lines"><i /><i /></span><span className="composer-site-thumb-shape" /><small>原创占位</small></div>
        <h3>{name} <span>· {description}</span></h3><div className="composer-site-card-actions"><button type="button" aria-label={`使用提示词 ${name}`} onClick={() => unavailable(name, '使用提示词')}>使用提示词</button><button type="button" aria-label={`预览 ${name}`} onClick={() => unavailable(name, '预览')}>预览 ↗</button></div>
      </article>)}</div> : <p className="composer-site-unobserved" role="status">“{category}”分类的模板内容尚未采集。</p>}
    </div>
    <p className="composer-site-evidence">缩略图为原创占位；模板入口来自界面观察，非原产品效果预览。</p>
    {notice && <p className="composer-site-notice" role="status">{notice}</p>}
  </section>;
}
