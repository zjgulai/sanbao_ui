// 证据：OBS03 站点缺能力负控 grader——壳已连接但无 readSites：读数=unavailable＋如实句，fixture 空态/名册都不得出现。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var timer = setInterval(function () {
    var pg = document.querySelector('.sites-page[data-sites-wiring]');
    if (!pg) return;
    var wiring = pg.getAttribute('data-sites-wiring');
    if (wiring !== 'unavailable') return;
    var text = pg.textContent;
    var honest = text.indexOf('壳已连接但站点读取未接线') !== -1 && text.indexOf('壳未提供站点读取') !== -1;
    var fixtureEmptyVisible = text.indexOf('还没有站点') !== -1 || text.indexOf('原创示意插图') !== -1;
    var roster = pg.querySelectorAll('[data-site-item]').length;
    var facts = { wiring: wiring, honest: honest, fixtureEmptyVisible: fixtureEmptyVisible, roster: roster };
    if (!honest || fixtureEmptyVisible || roster) {
      document.title = 'FAIL-UNAVAILABLE ' + JSON.stringify(facts);
      clearInterval(timer);
      return;
    }
    document.title = 'READY ' + JSON.stringify(facts);
    clearInterval(timer);
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      var pg = document.querySelector('.sites-page[data-sites-wiring]');
      document.title = 'TIMEOUT ' + JSON.stringify({ wiring: pg ? pg.getAttribute('data-sites-wiring') : null });
      clearInterval(timer);
    }
  }, 13000);
})();
