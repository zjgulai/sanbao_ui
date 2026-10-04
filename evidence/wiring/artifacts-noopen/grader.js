// 负控：缺打开能力→查看按钮如实说明，不假装已打开。
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
      var viewBtn = card.querySelector('button');
      if (viewBtn) { viewBtn.click(); stage = 5; }
      return;
    }
    if (stage === 5) {
      var toastEl = document.querySelector('.prototype-toast span');
      var toast = toastEl ? toastEl.textContent : '';
      if (toast.indexOf('未提供该能力') !== -1) {
        if ((window.__OPEN_CALLS__ || []).length) { document.title = 'FAIL-FAKE-OPEN'; clearInterval(timer); return; }
        if (!document.querySelector('[data-artifacts-wiring]')) { document.title = 'FAIL-CARD-VANISHED'; clearInterval(timer); return; }
        document.title = 'READY ' + JSON.stringify({ artifactsWiring: 'read', toast: toast });
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
