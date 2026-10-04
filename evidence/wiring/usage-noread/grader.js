// 负控：缺用量能力→如实 unavailable，不漏 canned 数值。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
  var timer = setInterval(function () {
    var body = document.querySelector('[data-usage-wiring]');
    if (!body) return;
    var wiring = body.getAttribute('data-usage-wiring');
    if (stage === 0) { if (wiring === 'unavailable') stage = 1; return; }
    if (stage === 1) {
      var text = body.textContent || '';
      if (text.indexOf('未提供该能力') === -1) { document.title = 'FAIL-WRONG-NOTICE ' + JSON.stringify({ text: text.slice(0, 120) }); clearInterval(timer); return; }
      if (text.indexOf('292') !== -1) { document.title = 'FAIL-FIXTURE-LEAK'; clearInterval(timer); return; }
      document.title = 'READY ' + JSON.stringify({ wiring: wiring, notice: '未提供该能力' });
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
