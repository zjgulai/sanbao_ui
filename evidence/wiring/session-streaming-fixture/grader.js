// 控制组：无壳会话页 canned 原样、无停止键（流式 UI 只在有壳分支出现）。
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
    if (stage === 3) {
      var pg = document.querySelector('.session-page[data-session-wiring="fixture"]');
      if (pg) {
        var canned = pg.textContent.indexOf('先把下一步说清楚') !== -1;
        var stop = !!document.querySelector('.send-button.stop');
        var runLabel = !!pg.querySelector('.run-label');
        if (!canned || stop || runLabel) { document.title = 'FAIL-FIXTURE-DRIFT ' + JSON.stringify({ canned: canned, stop: stop, runLabel: runLabel }); clearInterval(timer); return; }
        document.title = 'READY ' + JSON.stringify({ sessionWiring: 'fixture', canned: canned, stop: stop });
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
