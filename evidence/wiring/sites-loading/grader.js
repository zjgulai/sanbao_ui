// 证据：OBS03 加载态直接接线 grader——驱动到 loading 态（慢读壳），两姿态同场景证 loading→read 直连过渡：
// 1) 骨架期：骨架 6 卡＋自述“等待壳侧站点名册读取…”（非本地计时口径），读数 fail-closed=unavailable；
// 2) 读成后：骨架消失、读数=read＋壳侧站点名册文本出现；必须见到骨架期在先才判 READY。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var expect = window.__SMOKE_EXPECT__ || 'sites-loading-read';
  var expectedTitles = ['壳侧落地页站点', '壳侧活动页 B 站'];
  var sawLoading = false;
  var timer = setInterval(function () {
    var pg = document.querySelector('.sites-page[data-sites-wiring]');
    if (!pg) return;
    var wiring = pg.getAttribute('data-sites-wiring');
    var facts = { expect: expect, rootWiring: document.documentElement.dataset.sanbaoWiring, wiring: wiring, sawLoading: sawLoading, sitesCalls: window.__SITES_CALLS__ || 0 };
    if (pg.querySelector('.sites-loading')) {
      var note = pg.querySelector('.sites-loading .collection-local-note');
      var noteText = note ? note.textContent : '';
      var skeleton = pg.querySelectorAll('.sites-skeleton-card').length;
      facts.posture = 'loading';
      facts.note = noteText;
      facts.skeleton = skeleton;
      var noteHonest = noteText.indexOf('等待壳侧站点名册读取') !== -1 && noteText.indexOf('恢复我的站点空态') === -1;
      if (!noteHonest || skeleton !== 6 || wiring !== 'unavailable') {
        document.title = 'FAIL-LOADING-PENDING ' + JSON.stringify(facts);
        clearInterval(timer);
        return;
      }
      sawLoading = true;
      return;
    }
    if (wiring !== 'read') return;
    var items = pg.querySelectorAll('[data-site-item]');
    var titles = Array.prototype.map.call(items, function (n) { return n.textContent; });
    var joined = titles.join('|');
    var missing = expectedTitles.filter(function (t) { return joined.indexOf(t) === -1; });
    facts.posture = 'read';
    facts.items = items.length;
    facts.titles = titles;
    facts.missing = missing;
    if (!sawLoading || missing.length || !facts.sitesCalls) {
      document.title = 'FAIL-LOADING-TRANSITION ' + JSON.stringify(facts);
      clearInterval(timer);
      return;
    }
    document.title = 'READY ' + JSON.stringify(facts);
    clearInterval(timer);
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      var pg = document.querySelector('.sites-page[data-sites-wiring]');
      document.title = 'TIMEOUT ' + JSON.stringify({ stage: 'await-transition', sawLoading: sawLoading, wiring: pg ? pg.getAttribute('data-sites-wiring') : null });
      clearInterval(timer);
    }
  }, 13000);
})();
