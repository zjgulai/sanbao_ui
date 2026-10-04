// fixture 控制组：无壳时搜索保持本地示例（输入「原型」→ 命中 UI 原型规划）。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
  var timer = setInterval(function () {
    var input = document.querySelector('input[aria-label="搜索任务名称"]');
    var results = document.querySelector('[data-search-wiring]');
    if (stage === 0) { if (input && results && results.getAttribute('data-search-wiring') === 'fixture') stage = 1; return; }
    if (stage === 1) {
      var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, '原型');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      stage = 2;
      return;
    }
    if (stage === 2) {
      var rows = document.querySelectorAll('[data-search-wiring] .search-results button, [data-search-wiring] button');
      if (rows.length >= 1) {
        var text = rows[0].textContent || '';
        if (text.indexOf('UI 原型规划') === -1) { document.title = 'FAIL-FIXTURE-DRIFT ' + JSON.stringify({ first: text }); clearInterval(timer); return; }
        document.title = 'READY ' + JSON.stringify({ searchWiring: 'fixture', firstRow: text, rowCount: rows.length });
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
