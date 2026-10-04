// 证据：OBS01 主场景——用量浮层读到壳侧额度（128/160、5/10），且不含 canned 数值。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
  var timer = setInterval(function () {
    var body = document.querySelector('[data-usage-wiring]');
    if (!body) return;
    var wiring = body.getAttribute('data-usage-wiring');
    if (stage === 0) { if (wiring === 'read') stage = 1; return; }
    if (stage === 1) {
      var text = body.textContent || '';
      if (text.indexOf('128') === -1 || text.indexOf('160') === -1 || text.indexOf('5 / 10') === -1) { document.title = 'FAIL-WRONG-QUOTA ' + JSON.stringify({ text: text.slice(0, 160) }); clearInterval(timer); return; }
      if (text.indexOf('292') !== -1) { document.title = 'FAIL-FIXTURE-LEAK'; clearInterval(timer); return; }
      document.title = 'READY ' + JSON.stringify({ wiring: wiring, has128x160: true, has5x10: true, calls: window.__USAGE_CALLS__ || 0 });
      clearInterval(timer);
    }
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      document.title = 'TIMEOUT stage=' + stage;
      clearInterval(timer);
    }
  }, 13000);
})();
