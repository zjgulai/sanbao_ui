// 证据：fixture 控制组——无壳时知识页与接线前逐字一致：读数=fixture、原空态与创建入口原样、无任何壳读面板。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var timer = setInterval(function () {
    var pg = document.querySelector('.knowledge-page[data-knowledge-wiring]');
    if (!pg) return;
    var wiring = pg.getAttribute('data-knowledge-wiring');
    if (wiring !== 'fixture') return;
    var emptyText = pg.textContent.indexOf('还没有知识库') !== -1;
    var createButton = !!document.getElementById('knowledge-create-trigger');
    var roster = pg.querySelectorAll('[data-knowledge-item]').length;
    var notice = !!pg.querySelector('[data-knowledge-notice]');
    var rootWiring = document.documentElement.dataset.sanbaoWiring;
    var facts = { wiring: wiring, rootWiring: rootWiring, emptyText: emptyText, createButton: createButton, roster: roster, hostNotice: notice };
    if (!emptyText || !createButton || roster || notice || rootWiring !== 'fixture') {
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
