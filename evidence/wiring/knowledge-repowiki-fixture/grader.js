// 证据：Repo Wiki fixture 控制组——无壳时与接线前逐字一致，两种姿态自判：
// 1) 主体态（repo-wiki 等）：读数=fixture、本地演示项目卡（含“未生成”与“去生成”）原样、无壳读面板；
// 2) 配置页目录态（repo-wiki-setup 等）：读数=fixture、目录空态原样（尚未生成 Repo Wiki / 还没有知识卡片）、无壳读面板。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var timer = setInterval(function () {
    var pg = document.querySelector('.knowledge-page[data-knowledge-wiring]');
    if (!pg) return;
    var wiring = pg.getAttribute('data-knowledge-wiring');
    if (wiring !== 'fixture') return;
    var setup = pg.classList.contains('repo-wiki-setup');
    var text = pg.textContent;
    var roster = pg.querySelectorAll('[data-repowiki-item]').length;
    var notice = !!pg.querySelector('[data-knowledge-notice]');
    var rootWiring = document.documentElement.dataset.sanbaoWiring;
    var facts = { wiring: wiring, rootWiring: rootWiring, posture: setup ? 'directory' : 'content', roster: roster, hostNotice: notice };
    if (setup) {
      var directoryFixture = text.indexOf('尚未生成 Repo Wiki') !== -1 || text.indexOf('还没有知识卡片') !== -1;
      facts.directoryFixture = directoryFixture;
      if (!directoryFixture || roster || notice || rootWiring !== 'fixture') {
        document.title = 'FAIL-FIXTURE-DRIFT ' + JSON.stringify(facts);
        clearInterval(timer);
        return;
      }
      document.title = 'READY ' + JSON.stringify(facts);
      clearInterval(timer);
      return;
    }
    var projectCard = !!pg.querySelector('.repo-wiki-project');
    var generate = text.indexOf('去生成') !== -1;
    var status = text.indexOf('未生成') !== -1;
    var plain = text.indexOf('壳侧') === -1;
    facts.projectCard = projectCard;
    facts.generate = generate;
    facts.status = status;
    facts.plain = plain;
    if (!projectCard || !generate || !status || !plain || roster || notice || rootWiring !== 'fixture') {
      document.title = 'FAIL-FIXTURE-DRIFT ' + JSON.stringify(facts);
      clearInterval(timer);
      return;
    }
    document.title = 'READY ' + JSON.stringify(facts);
    clearInterval(timer);
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      var pg = document.querySelector('.knowledge-page[data-knowledge-wiring]');
      document.title = 'TIMEOUT ' + JSON.stringify({ stage: 'await-fixture', wiring: pg ? pg.getAttribute('data-knowledge-wiring') : null });
      clearInterval(timer);
    }
  }, 13000);
})();
