// 负控（可选能力缺席）：host 有壳但无 readSettings —— 断言 unavailable 如实句 + 无 fixture 冒充。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var done = false;
  var timer = setInterval(function () {
    if (done) return;
    var root = document.querySelector('.settings-models[data-settings-wiring]');
    if (!root) return;
    var state = root.getAttribute('data-settings-wiring');
    if (state === 'loading') return;
    var text = root.textContent || '';
    var facts = {
      wiring: state,
      honestCopy: text.indexOf('壳已连接但设置读取未接线') !== -1,
      honestReason: text.indexOf('readSettings') !== -1,
      noFixtureSubstitute: text.indexOf('不显示本地演示内容代替') !== -1,
      fixtureText: text.indexOf('暂无自定义模型') !== -1,
      nsRows: root.querySelectorAll('[data-settings-ns]').length
    };
    done = true;
    clearInterval(timer);
    if (state !== 'unavailable' || !facts.honestCopy || !facts.honestReason || !facts.noFixtureSubstitute || facts.fixtureText || facts.nsRows !== 0) {
      document.title = 'FAIL-NEGATIVE-CONTROL ' + JSON.stringify(facts);
      return;
    }
    document.title = 'READY ' + JSON.stringify({ wiring: 'unavailable', honest: true, fixtureSubstitute: false });
  }, 120);
  setTimeout(function () {
    if (!done && document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      document.title = 'TIMEOUT negative-control';
      clearInterval(timer);
    }
  }, 13000);
})();
