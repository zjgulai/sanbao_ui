// 证据：OBS03 站点诚实面 grader——两种姿态自判：
// 1) 加载态（短虚拟时间预算下运行）：本地计时演示自述改为“计时结束后显示壳侧站点名册”；
// 2) 共享态：读数=unavailable＋“共享站点读取未接线”如实句，本地演示空态不得出现。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var timer = setInterval(function () {
    var pg = document.querySelector('.sites-page[data-sites-wiring]');
    if (!pg) return;
    var wiring = pg.getAttribute('data-sites-wiring');
    var facts = { wiring: wiring, sitesCalls: window.__SITES_CALLS__ || 0 };
    if (pg.querySelector('.sites-loading')) {
      var note = pg.querySelector('.sites-loading .collection-local-note');
      var noteText = note ? note.textContent : '';
      facts.posture = 'loading';
      facts.note = noteText;
      var noteHonest = noteText.indexOf('计时结束后显示壳侧站点名册') !== -1;
      if (!noteHonest || wiring !== 'read') {
        document.title = 'FAIL-LOADING-NOTE ' + JSON.stringify(facts);
        clearInterval(timer);
        return;
      }
      document.title = 'READY ' + JSON.stringify(facts);
      clearInterval(timer);
      return;
    }
    if (wiring !== 'unavailable') return;
    var text = pg.textContent;
    var honest = text.indexOf('壳已连接但共享站点读取未接线') !== -1;
    var fixtureShared = text.indexOf('暂时没有分享给你的站点') !== -1;
    var roster = pg.querySelectorAll('[data-site-item]').length;
    facts.posture = 'shared';
    facts.honest = honest;
    facts.fixtureShared = fixtureShared;
    facts.roster = roster;
    if (!honest || fixtureShared || roster) {
      document.title = 'FAIL-SHARED-HONEST ' + JSON.stringify(facts);
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
