// 视觉快照变体：停在检索命中态，供截图（不发点击）。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
  var timer = setInterval(function () {
    var input = document.querySelector('input[aria-label="搜索任务名称"]');
    var results = document.querySelector('[data-search-wiring]');
    if (stage === 0) { if (input && results && results.getAttribute('data-search-wiring') === 'live') stage = 1; return; }
    if (stage === 1) {
      var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, '证据');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      stage = 2;
      return;
    }
    if (stage === 2) { input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); stage = 3; return; }
    if (stage === 3) {
      var wiring = results && results.getAttribute('data-search-wiring');
      var rows = results ? results.querySelectorAll('button') : [];
      if (wiring === 'read' && rows.length >= 2) {
        document.title = 'READY ' + JSON.stringify({ searchWiring: 'read', rowCount: rows.length });
        clearInterval(timer);
      }
      return;
    }
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      document.title = 'TIMEOUT stage=' + stage;
      clearInterval(timer);
    }
  }, 13000);
})();
