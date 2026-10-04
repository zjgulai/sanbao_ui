// 证据：产物面主场景——会话页读壳侧 artifacts（含变更计数），查看走壳。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
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
    var card = document.querySelector('[data-artifacts-wiring]');
    if (stage === 3) { if (card) stage = 4; return; }
    if (stage === 4) {
      var text = card.textContent || '';
      if (text.indexOf('demo.html') === -1 || text.indexOf('+67') === -1 || text.indexOf('−4') === -1 || text.indexOf('修改') === -1) {
        document.title = 'FAIL-WRONG-ARTIFACTS ' + JSON.stringify({ text: text.slice(0, 160) });
        clearInterval(timer);
        return;
      }
      stage = 5;
      return;
    }
    if (stage === 5) {
      var viewBtn = card.querySelector('button');
      if (viewBtn) { viewBtn.click(); stage = 6; }
      return;
    }
    if (stage === 6) {
      var toastEl = document.querySelector('.prototype-toast span');
      var toast = toastEl ? toastEl.textContent : '';
      var calls = window.__OPEN_CALLS__ || [];
      if (calls.length >= 1 && toast.indexOf('已请求壳打开') !== -1) {
        document.title = 'READY ' + JSON.stringify({ artifactsWiring: 'read', openCalls: calls, toast: toast });
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
