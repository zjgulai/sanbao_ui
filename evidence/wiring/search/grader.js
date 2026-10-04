// 证据：P02 搜索主场景——输入→回车检索走壳→点命中→打开壳侧会话。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
  var firstRow = '';
  var timer = setInterval(function () {
    var input = document.querySelector('input[aria-label="搜索任务名称"]');
    var results = document.querySelector('[data-search-wiring]');
    if (stage === 0) {
      if (input && results && results.getAttribute('data-search-wiring') === 'live') stage = 1;
      return;
    }
    if (stage === 1) {
      var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, '证据');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      stage = 2;
      return;
    }
    if (stage === 2) {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      stage = 3;
      return;
    }
    if (stage === 3) {
      var wiring = results && results.getAttribute('data-search-wiring');
      var rows = results ? results.querySelectorAll('button') : [];
      if (wiring === 'read' && rows.length >= 2) {
        firstRow = rows[0].textContent || '';
        if (firstRow.indexOf('接证据来源的会话') === -1) { document.title = 'FAIL-WRONG-HITS ' + JSON.stringify({ firstRow: firstRow }); clearInterval(timer); return; }
        stage = 4;
      } else if (wiring === 'unavailable') {
        document.title = 'FAIL-UNEXPECTED-UNAVAILABLE ' + JSON.stringify({ notice: results.textContent });
        clearInterval(timer);
      }
      return;
    }
    if (stage === 4) {
      var rows2 = results ? results.querySelectorAll('button') : [];
      if (rows2.length >= 1) { rows2[0].click(); stage = 5; }
      return;
    }
    if (stage === 5) {
      var page = document.querySelector('.session-page[data-session-wiring]');
      var mode = page && page.querySelector('.session-mode');
      var msgs = page ? Array.prototype.map.call(page.querySelectorAll('.assistant-message .reply-body p'), function (n) { return n.textContent; }) : [];
      if (page && page.getAttribute('data-session-wiring') === 'read' && mode && mode.textContent.indexOf('session-hit-001') !== -1 && msgs.join('').indexOf('已打开 session-hit-001') !== -1) {
        document.title = 'READY ' + JSON.stringify({
          searchWiring: 'read',
          firstRow: firstRow,
          openedRef: 'session-hit-001',
          sessionWiring: 'read',
          searchCalls: window.__SEARCH_CALLS__ || []
        });
        clearInterval(timer);
      }
      return;
    }
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      document.title = 'TIMEOUT stage=' + stage + ' prev=' + document.title.slice(0, 40);
      clearInterval(timer);
    }
  }, 13000);
})();
