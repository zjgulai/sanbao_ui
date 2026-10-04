// 场景：T-S 设置族 fixture 控制组 —— 无壳时 models 面逐字不动（DOM 断言，不装 host）。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var done = false;
  var checks = 0;
  var timer = setInterval(function () {
    if (done) return;
    var root = document.querySelector('.settings-models[data-settings-wiring]');
    if (!root) return;
    var state = root.getAttribute('data-settings-wiring');
    if (state === 'loading') return;
    var text = root.textContent || '';
    var facts = {
      checks: ++checks,
      wiring: state,
      emptyText: text.indexOf('暂无自定义模型，点击添加模型开始使用') !== -1,
      nsRows: root.querySelectorAll('[data-settings-ns]').length,
      namespacesAttr: !!root.querySelector('[data-settings-namespaces]'),
      shellCopy: text.indexOf('壳侧设置命名空间') !== -1 || text.indexOf('壳已连接') !== -1,
      addButton: !!root.querySelector('#models-add-trigger')
    };
    done = true;
    clearInterval(timer);
    if (state !== 'fixture' || !facts.emptyText || facts.nsRows !== 0 || facts.namespacesAttr || facts.shellCopy || !facts.addButton) {
      document.title = 'FAIL-FIXTURE-DRIFT ' + JSON.stringify(facts);
      return;
    }
    document.title = 'READY ' + JSON.stringify({ settingsWiring: 'fixture', emptyText: true, nsRows: 0, checks: facts.checks });
  }, 120);
  setTimeout(function () {
    if (!done && document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      document.title = 'TIMEOUT fixture-control';
      clearInterval(timer);
    }
  }, 13000);
})();
