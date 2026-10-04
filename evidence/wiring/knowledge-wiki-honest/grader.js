// 证据：OBS02 Repo Wiki 面 grader——有壳但 Repo Wiki 名册未接线：如实句出现、本地演示项目卡与目录空态不得出现。
// 覆盖 repo-wiki.default（内容区）与 repo-wiki.setup（目录区）两种承载。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var timer = setInterval(function () {
    var pg = document.querySelector('.knowledge-page[data-knowledge-wiring]');
    if (!pg) return;
    var wiring = pg.getAttribute('data-knowledge-wiring');
    if (wiring !== 'unavailable') return;
    var text = pg.textContent;
    var honest = text.indexOf('壳已连接但 Repo Wiki 读取未接线') !== -1;
    var projectCard = !!document.querySelector('.repo-wiki-project');
    var generateLink = text.indexOf('去生成') !== -1;
    var directoryFixture = text.indexOf('尚未生成 Repo Wiki') !== -1 || text.indexOf('还没有知识卡片') !== -1;
    var facts = { wiring: wiring, honest: honest, projectCard: projectCard, generateLink: generateLink, directoryFixture: directoryFixture };
    if (!honest || projectCard || generateLink || directoryFixture) {
      document.title = 'FAIL-WIKI-HONEST ' + JSON.stringify(facts);
      clearInterval(timer);
      return;
    }
    document.title = 'READY ' + JSON.stringify(facts);
    clearInterval(timer);
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      var pg = document.querySelector('.knowledge-page[data-knowledge-wiring]');
      document.title = 'TIMEOUT ' + JSON.stringify({ wiring: pg ? pg.getAttribute('data-knowledge-wiring') : null });
      clearInterval(timer);
    }
  }, 13000);
})();
