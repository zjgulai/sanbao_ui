// 证据：OBS03 站点诚实面 grader（缺 shared 字段负控）——两种姿态自判：
// 1) 加载态（仅慢读壳下可观察到；本 stub 为快读，loading→read 直连证据见 sites-loading/）：
//    骨架期＝壳读挂起，自述“等待壳侧站点名册读取…”，读数 fail-closed=unavailable；
// 2) 共享态：读数=unavailable＋“共享站点读取未接线”如实句（壳未提供 shared 字段），本地演示空态不得出现。
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
      var noteHonest = noteText.indexOf('等待壳侧站点名册读取') !== -1;
      if (!noteHonest || wiring !== 'unavailable') {
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
