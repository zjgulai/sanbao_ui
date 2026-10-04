// 证据：OBS03 共享范围直接接线 grader——驱动到共享态：读数=read＋壳侧共享名册文本出现；
// 旧如实句、fixture 共享空态、以及“我的站点”名册都不得出现（两个视图不混用名册）。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var expect = window.__SMOKE_EXPECT__ || 'sites-shared-read';
  var expectedShared = ['壳侧共享站点 B 站', '壳侧共享站点 C 站'];
  var forbiddenMine = ['壳侧着陆页站点', '壳侧活动页 A 站'];
  var timer = setInterval(function () {
    var pg = document.querySelector('.sites-page[data-sites-wiring]');
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
    if (wiring !== 'read') return;
    var text = pg.textContent;
    var joined = titles.join('|');
    var missing = expectedShared.filter(function (t) { return joined.indexOf(t) === -1; });
    var leakedMine = forbiddenMine.filter(function (t) { return joined.indexOf(t) !== -1; });
    var honestVisible = text.indexOf('壳已连接但共享站点读取未接线') !== -1;
    var fixtureShared = text.indexOf('暂时没有分享给你的站点') !== -1;
    var rosterShell = !!pg.querySelector('[data-sites-roster="shell"]');
    if (missing.length || leakedMine.length || honestVisible || fixtureShared || !rosterShell || !facts.sitesCalls) {
      document.title = 'FAIL-SITES-SHARED ' + JSON.stringify(Object.assign(facts, { honestVisible: honestVisible, fixtureShared: fixtureShared, rosterShell: rosterShell, missing: missing, leakedMine: leakedMine }));
      clearInterval(timer);
      return;
    }
    document.title = 'READY ' + JSON.stringify(Object.assign(facts, { honestVisible: honestVisible, fixtureShared: fixtureShared, rosterShell: rosterShell, missing: missing, leakedMine: leakedMine }));
    clearInterval(timer);
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      var pg = document.querySelector('.sites-page[data-sites-wiring]');
      document.title = 'TIMEOUT ' + JSON.stringify({ stage: 'await-read', wiring: pg ? pg.getAttribute('data-sites-wiring') : null });
      clearInterval(timer);
    }
  }, 13000);
})();
