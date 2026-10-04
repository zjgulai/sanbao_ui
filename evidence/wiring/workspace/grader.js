// 证据：有壳时工作区对话框如实标注（绑定由壳完成；本页仅本地演示）。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
  var timer = setInterval(function () {
    var hint = document.querySelector('[data-workspace-dialog-wiring]');
    if (!hint) return;
    var wiring = hint.getAttribute('data-workspace-dialog-wiring');
    if (stage === 0) { if (wiring === 'host-present') stage = 1; return; }
    if (stage === 1) {
      var text = hint.textContent || '';
      if (text.indexOf('由壳完成') === -1 || text.indexOf('不写入壳') === -1) { document.title = 'FAIL-WRONG-NOTE ' + JSON.stringify({ text: text }); clearInterval(timer); return; }
      document.title = 'READY ' + JSON.stringify({ wiring: wiring, hint: text });
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
