// 控制组：无壳时用量浮层 canned 数值原样（292/300）。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
  var timer = setInterval(function () {
    var body = document.querySelector('[data-usage-wiring]');
    if (stage === 0) { if (body && body.getAttribute('data-usage-wiring') === 'fixture') stage = 1; return; }
    if (stage === 1) {
      var text = body.textContent || '';
      if (text.indexOf('292') === -1 || text.indexOf('100') === -1) { document.title = 'FAIL-FIXTURE-DRIFT ' + JSON.stringify({ text: text.slice(0, 120) }); clearInterval(timer); return; }
      document.title = 'READY ' + JSON.stringify({ wiring: 'fixture', canned292: true });
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
