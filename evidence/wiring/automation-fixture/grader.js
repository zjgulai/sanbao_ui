// 控制组：无壳时产品自动化页 canned 空态原样、无名册行。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
  var timer = setInterval(function () {
    var section = document.querySelector('[data-automation-wiring]');
    if (stage === 0) { if (section && section.getAttribute('data-automation-wiring') === 'fixture') stage = 1; return; }
    if (stage === 1) {
      var rows = section.querySelectorAll('.automation-list article');
      var canned = section.textContent.indexOf('本地演示') !== -1;
      if (rows.length || !canned) { document.title = 'FAIL-FIXTURE-DRIFT ' + JSON.stringify({ rows: rows.length, canned: canned }); clearInterval(timer); return; }
      document.title = 'READY ' + JSON.stringify({ wiring: 'fixture', rows: rows.length, canned: canned });
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
