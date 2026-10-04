// 证据：共享态 fixture 控制组——无壳时共享视图与接线前逐字一致：读数=fixture、原共享空态文字与插图原样、
// “我的站点”空态文字不出现、无任何壳读面板。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var timer = setInterval(function () {
    var pg = document.querySelector('.sites-page[data-sites-wiring]');
    if (!pg) return;
    var wiring = pg.getAttribute('data-sites-wiring');
    if (wiring !== 'fixture') return;
    var text = pg.textContent;
    var sharedEmpty = text.indexOf('暂时没有分享给你的站点') !== -1;
    var mineEmpty = text.indexOf('还没有站点') !== -1;
    var artLabel = text.indexOf('原创示意插图') !== -1;
    var roster = pg.querySelectorAll('[data-site-item]').length;
    var notice = !!pg.querySelector('[data-sites-notice]');
    var rootWiring = document.documentElement.dataset.sanbaoWiring;
    var facts = { wiring: wiring, rootWiring: rootWiring, sharedEmpty: sharedEmpty, mineEmpty: mineEmpty, artLabel: artLabel, roster: roster, hostNotice: notice };
    if (!sharedEmpty || mineEmpty || !artLabel || roster || notice || rootWiring !== 'fixture') {
      document.title = 'FAIL-FIXTURE-DRIFT ' + JSON.stringify(facts);
      clearInterval(timer);
      return;
    }
    document.title = 'READY ' + JSON.stringify(facts);
    clearInterval(timer);
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      document.title = 'TIMEOUT stage=await-fixture';
      clearInterval(timer);
    }
  }, 13000);
})();
