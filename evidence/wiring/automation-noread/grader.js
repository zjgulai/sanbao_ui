// 负控：缺名册能力→如实 unavailable 句，不伪造名册。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
  var timer = setInterval(function () {
    var section = document.querySelector('[data-automation-wiring]');
    if (!section) return;
    var wiring = section.getAttribute('data-automation-wiring');
    if (stage === 0) { if (wiring === 'unavailable') stage = 1; return; }
    if (stage === 1) {
      var text = section.textContent || '';
      if (text.indexOf('未提供读取能力') === -1) { document.title = 'FAIL-WRONG-NOTICE ' + JSON.stringify({ text: text.slice(0, 120) }); clearInterval(timer); return; }
      if (section.querySelectorAll('.automation-list article').length) { document.title = 'FAIL-FAKE-ROSTER'; clearInterval(timer); return; }
      document.title = 'READY ' + JSON.stringify({ wiring: wiring, notice: '未提供读取能力' });
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
