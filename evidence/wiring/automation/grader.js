// 证据：P03 主场景——产品自动化页读到壳侧真名册（含已启用/未启用两态分开）。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
  var timer = setInterval(function () {
    var section = document.querySelector('[data-automation-wiring]');
    if (!section) return;
    var wiring = section.getAttribute('data-automation-wiring');
    if (stage === 0) { if (wiring === 'loading' || wiring === 'read') stage = 1; return; }
    if (stage === 1 && wiring === 'read') {
      var titles = Array.prototype.map.call(section.querySelectorAll('.automation-list article h3'), function (n) { return n.textContent; });
      var pills = Array.prototype.map.call(section.querySelectorAll('.automation-list .status-pill'), function (n) { return n.textContent; });
      if (titles.indexOf('晨间简报') === -1 || titles.indexOf('每周回顾草稿') === -1) { document.title = 'FAIL-WRONG-ROSTER ' + JSON.stringify({ titles: titles }); clearInterval(timer); return; }
      if (pills.indexOf('已启用') === -1 || pills.indexOf('未启用') === -1) { document.title = 'FAIL-WRONG-FLAGS ' + JSON.stringify({ pills: pills }); clearInterval(timer); return; }
      document.title = 'READY ' + JSON.stringify({ wiring: wiring, titles: titles, pills: pills, calls: window.__AUTOMATION_CALLS__ || 0 });
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
