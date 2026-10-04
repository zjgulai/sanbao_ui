// 控制组：无壳时工作区对话框原文案原样。
(function () {
  window.addEventListener('error', function (e) { document.title = 'DIAG ' + String(e.message).slice(0, 140); });
  var stage = 0;
  var timer = setInterval(function () {
    var hint = document.querySelector('[data-workspace-dialog-wiring]');
    if (stage === 0) { if (hint && hint.getAttribute('data-workspace-dialog-wiring') === 'fixture') stage = 1; return; }
    if (stage === 1) {
      var text = hint.textContent || '';
      if (text.indexOf('不访问本机文件夹') === -1) { document.title = 'FAIL-FIXTURE-DRIFT ' + JSON.stringify({ text: text }); clearInterval(timer); return; }
      document.title = 'READY ' + JSON.stringify({ wiring: 'fixture', hint: text });
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
