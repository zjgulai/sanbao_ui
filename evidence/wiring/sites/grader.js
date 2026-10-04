// 证据：OBS03 站点主场景 grader——驱动到站点页→等待读数=read→断言壳侧站点名册出现、fixture 空态与占位插图不出现。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var expect = window.__SMOKE_EXPECT__ || 'sites-read';
  var expectedTitles = ['壳侧着陆页站点', '壳侧活动页 A 站'];
  var timer = setInterval(function () {
    function page() { return document.querySelector('.sites-page[data-sites-wiring]'); }
    var pg = page();
    if (!pg) return;
    var wiring = pg.getAttribute('data-sites-wiring');
    var items = pg.querySelectorAll('[data-site-item]');
    var titles = Array.prototype.map.call(items, function (n) { return n.textContent; });
    var facts = {
      expect: expect,
      rootWiring: document.documentElement.dataset.sanbaoWiring,
      wiring: wiring,
      items: items.length,
      titles: titles,
      sitesCalls: window.__SITES_CALLS__ || 0
    };
    if (wiring === 'read') {
      var fixtureEmptyVisible = pg.textContent.indexOf('还没有站点') !== -1 || pg.textContent.indexOf('原创示意插图') !== -1;
      var noticeVisible = !!pg.querySelector('[data-sites-notice]');
      var joined = titles.join('|');
      var missing = expectedTitles.filter(function (t) { return joined.indexOf(t) === -1; });
      if (missing.length || fixtureEmptyVisible || noticeVisible || !facts.sitesCalls) {
        document.title = 'FAIL-SITES ' + JSON.stringify(Object.assign(facts, { fixtureEmptyVisible: fixtureEmptyVisible, noticeVisible: noticeVisible, missing: missing }));
        clearInterval(timer);
        return;
      }
      document.title = 'READY ' + JSON.stringify(Object.assign(facts, { fixtureEmptyVisible: fixtureEmptyVisible, noticeVisible: noticeVisible, missing: missing }));
      clearInterval(timer);
    }
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      var pg = document.querySelector('.sites-page[data-sites-wiring]');
      document.title = 'TIMEOUT ' + JSON.stringify({ stage: 'await-read', wiring: pg ? pg.getAttribute('data-sites-wiring') : null });
      clearInterval(timer);
    }
  }, 13000);
})();
