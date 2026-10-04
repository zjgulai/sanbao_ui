// 逐状态探针 grader：对扩展族任意 stateId 断言接缝读数 data-extensions-wiring=read，
// 且 live 标记存在（列表/已装页＝名册块含 3 条；详情页＝名册条）。深度交互断言见 extensions/ 场景。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var timer = setInterval(function () {
    var root = document.querySelector('.installed-extensions[data-extensions-wiring], .extension-market[data-extensions-wiring], .extension-detail[data-extensions-wiring]');
    var anyRoot = document.querySelector('.installed-extensions, .extension-market, .extension-detail');
    if (!root) {
      if (anyRoot) {
        document.title = 'FAIL-NO-ATTR ' + String(anyRoot.className).slice(0, 60);
        clearInterval(timer);
      }
      return;
    }
    var w = root.getAttribute('data-extensions-wiring');
    if (w === 'fixture' || w === 'unavailable') {
      document.title = 'FAIL-WIRING ' + w;
      clearInterval(timer);
      return;
    }
    if (w !== 'read') return;
    var entries = root.querySelectorAll('[data-capability-entry]').length;
    var strip = !!root.querySelector('[data-capability-strip]');
    var isDetail = root.classList.contains('extension-detail');
    if (isDetail ? !strip : entries !== 3) {
      document.title = 'FAIL-MARKER ' + JSON.stringify({ entries: entries, strip: strip });
      clearInterval(timer);
      return;
    }
    document.title = 'READY ' + JSON.stringify({ wiring: 'read', root: String(root.className).split(' ')[0], entries: entries, strip: strip, capReadCalls: window.__CAP_READ_CALLS__ || 0 });
    clearInterval(timer);
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      document.title = 'TIMEOUT';
      clearInterval(timer);
    }
  }, 13000);
})();
