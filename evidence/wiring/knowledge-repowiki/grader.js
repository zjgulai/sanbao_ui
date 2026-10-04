// 证据：OBS02 Repo Wiki 直接接线 grader——有壳读过且壳提供 repoWiki 名册：读数=read＋壳侧名册文本出现；
// 旧如实句、fixture 项目卡/目录空态/空结果句都不得出现。两种姿态自判（同一 grader 跑全部 repo-wiki 态）：
// 1) 主体态（repo-wiki / repo-wiki-list / repo-wiki-generated / repo-wiki-search-empty）；
// 2) 配置页目录态（repo-wiki-setup / repo-wiki-knowledge-cards / repo-wiki-knowledge-cards-wide）。
// READY {...facts} / FAIL-* / DIAG —— 断言计数覆盖全部 [data-repowiki-item] 节点。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var expect = window.__SMOKE_EXPECT__ || 'repo-wiki-read';
  var expectedTitles = ['壳侧 Wiki 项目 alpha', '壳侧 Wiki 项目 beta'];
  var timer = setInterval(function () {
    var pg = document.querySelector('.knowledge-page[data-knowledge-wiring]');
    if (!pg) return;
    var wiring = pg.getAttribute('data-knowledge-wiring');
    var items = pg.querySelectorAll('[data-repowiki-item]');
    var titles = Array.prototype.map.call(items, function (n) { return n.textContent; });
    var facts = {
      expect: expect,
      rootWiring: document.documentElement.dataset.sanbaoWiring,
      wiring: wiring,
      posture: pg.classList.contains('repo-wiki-setup') ? 'directory' : 'content',
      items: items.length,
      titles: titles,
      collectionsItems: pg.querySelectorAll('[data-knowledge-item]').length,
      knowledgeCalls: window.__KNOWLEDGE_CALLS__ || 0
    };
    if (wiring !== 'read') return;
    var text = pg.textContent;
    var honestVisible = text.indexOf('壳已连接但 Repo Wiki 读取未接线') !== -1;
    var fixtureArtifacts = !!pg.querySelector('.repo-wiki-project') || text.indexOf('去生成') !== -1 ||
      text.indexOf('尚未生成 Repo Wiki') !== -1 || text.indexOf('还没有知识卡片') !== -1 ||
      text.indexOf('没有匹配的 Repo Wiki 项目') !== -1;
    var rosterShell = !!pg.querySelector('[data-repowiki-roster="shell"]');
    var joined = titles.join('|');
    var missing = expectedTitles.filter(function (t) { return joined.indexOf(t) === -1; });
    if (missing.length || honestVisible || fixtureArtifacts || !rosterShell || facts.collectionsItems || !facts.knowledgeCalls) {
      document.title = 'FAIL-REPOWIKI ' + JSON.stringify(Object.assign(facts, { honestVisible: honestVisible, fixtureArtifacts: fixtureArtifacts, rosterShell: rosterShell, missing: missing }));
      clearInterval(timer);
      return;
    }
    document.title = 'READY ' + JSON.stringify(Object.assign(facts, { honestVisible: honestVisible, fixtureArtifacts: fixtureArtifacts, rosterShell: rosterShell, missing: missing }));
    clearInterval(timer);
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      var pg = document.querySelector('.knowledge-page[data-knowledge-wiring]');
      document.title = 'TIMEOUT ' + JSON.stringify({ stage: 'await-read', wiring: pg ? pg.getAttribute('data-knowledge-wiring') : null, prev: document.title.slice(0, 40) });
      clearInterval(timer);
    }
  }, 13000);
})();
