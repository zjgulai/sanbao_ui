// 证据：OBS02 知识中心主场景 grader——驱动到知识页→等待读数=read→断言壳侧集合名册出现、fixture 空态不出现。
// READY {...facts} / FAIL-* / DIAG —— 照抄本文件改断言即可复用到其他族。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var expect = window.__SMOKE_EXPECT__ || 'knowledge-read';
  var expectedTitles = ['壳侧工程手册', 'paper-plane 工作区知识库', '壳侧只读候选集合'];
  var timer = setInterval(function () {
    function page() { return document.querySelector('.knowledge-page[data-knowledge-wiring]'); }
    var pg = page();
    if (!pg) return;
    var wiring = pg.getAttribute('data-knowledge-wiring');
    var items = pg.querySelectorAll('[data-knowledge-item]');
    var titles = Array.prototype.map.call(items, function (n) { return n.textContent; });
    var facts = {
      expect: expect,
      rootWiring: document.documentElement.dataset.sanbaoWiring,
      wiring: wiring,
      items: items.length,
      titles: titles,
      knowledgeCalls: window.__KNOWLEDGE_CALLS__ || 0
    };
    if (wiring === 'read') {
      var fixtureEmptyVisible = pg.textContent.indexOf('还没有知识库') !== -1;
      var noticeVisible = !!pg.querySelector('[data-knowledge-notice]');
      var joined = titles.join('|');
      var missing = expectedTitles.filter(function (t) { return joined.indexOf(t) === -1; });
      if (missing.length || fixtureEmptyVisible || noticeVisible) {
        document.title = 'FAIL-KNOWLEDGE ' + JSON.stringify(Object.assign(facts, { fixtureEmptyVisible: fixtureEmptyVisible, noticeVisible: noticeVisible, missing: missing }));
        clearInterval(timer);
        return;
      }
      if (!facts.knowledgeCalls) {
        document.title = 'FAIL-NO-CALLS ' + JSON.stringify(facts);
        clearInterval(timer);
        return;
      }
      document.title = 'READY ' + JSON.stringify(Object.assign(facts, { fixtureEmptyVisible: fixtureEmptyVisible, noticeVisible: noticeVisible, missing: missing }));
      clearInterval(timer);
    }
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      var pg = document.querySelector('.knowledge-page[data-knowledge-wiring]');
      document.title = 'TIMEOUT ' + JSON.stringify({ stage: 'await-read', wiring: pg ? pg.getAttribute('data-knowledge-wiring') : null, prev: document.title.slice(0, 40) });
      clearInterval(timer);
    }
  }, 13000);
})();
