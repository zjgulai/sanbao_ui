// 证据：S1.streaming——流式态给停止键；跟随轮询增长（1→2→3 条消息）；停止走壳并收尾。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
  var m1 = 0;
  var sawRunLabel = false;
  function fact() {
    var page = document.querySelector('.session-page[data-session-wiring]');
    var toastEl = document.querySelector('.prototype-toast span');
    return {
      sessionWiring: page ? page.getAttribute('data-session-wiring') : null,
      stopVisible: !!document.querySelector('.send-button.stop'),
      readCalls: window.__READ_CALLS__ || 0,
      stopCalls: (window.__STOP_CALLS__ || []).length,
      totalMsgs: page ? page.querySelectorAll('.user-message, .assistant-message').length : 0,
      runLabel: !!(page && page.querySelector('.run-label')),
      toast: toastEl ? toastEl.textContent : ''
    };
  }
  function done(prefix, extra) {
    var f = fact();
    for (var k in extra) f[k] = extra[k];
    document.title = prefix + ' ' + JSON.stringify(f);
    clearInterval(timer);
  }
  var timer = setInterval(function () {
    var ta = document.querySelector('.home-composer textarea');
    var btn = document.querySelector('.home-composer button.send-button:not(.stop)');
    if (stage === 0) { if (ta && btn) stage = 1; return; }
    if (stage === 1) {
      var setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(ta, '把 206 个页面的接线落到 QDR.P01 首页');
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      stage = 2;
      return;
    }
    if (stage === 2) {
      var fresh = document.querySelector('.home-composer button.send-button:not(.stop)');
      if (fresh && !fresh.disabled) { fresh.click(); stage = 3; }
      return;
    }
    var f0 = fact();
    if (stage === 3) { if (f0.sessionWiring === 'read' && f0.stopVisible) { m1 = f0.totalMsgs; stage = 4; } return; }
    if (stage === 4) { if (f0.totalMsgs >= 2) { sawRunLabel = f0.runLabel; stage = 5; } return; }
    if (stage === 5) {
      var stopBtn = document.querySelector('.send-button.stop');
      if (stopBtn) { stopBtn.click(); stage = 6; }
      return;
    }
    if (stage === 6) {
      if (f0.stopCalls >= 1 && f0.toast.indexOf('已请求停止') !== -1 && !f0.stopVisible) {
        if (m1 !== 1 || !sawRunLabel) { done('FAIL-FLOW', { firstCount: m1, sawRunLabel: sawRunLabel }); return; }
        done('READY', { firstCount: m1, finalCount: f0.totalMsgs });
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
