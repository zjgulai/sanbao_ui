// 负控 grader：壳已连接但缺 readCapabilities——已装页必须如实显示未接线句，不得用本地空态冒充。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var stage = 0;
  var timer = setInterval(function () {
    var installed = document.querySelector('.installed-extensions');
    if (stage === 0) {
      if (!installed) return;
      var w = installed.getAttribute('data-extensions-wiring');
      if (w === 'fixture' || w === 'read') {
        document.title = 'FAIL-INSTALLED-NOT-UNAVAILABLE ' + JSON.stringify({ wiring: w });
        clearInterval(timer);
        return;
      }
      if (w !== 'unavailable') return;
      var notice = installed.querySelector('[data-capability-unavailable]');
      var text = notice ? notice.textContent : '';
      var emptyStateShown = installed.textContent.indexOf('暂无已安装扩展') !== -1;
      var entries = installed.querySelectorAll('[data-capability-entry]').length;
      if (!notice || text.indexOf('壳已连接但能力名册读取未接线') === -1 || text.indexOf('壳未提供 readCapabilities') === -1 || emptyStateShown || entries !== 0) {
        document.title = 'FAIL-UNAVAILABLE-NOTICE ' + JSON.stringify({ hasNotice: !!notice, emptyStateShown: emptyStateShown, entries: entries, text: text.slice(0, 90) });
        clearInterval(timer);
        return;
      }
      document.title = 'READY ' + JSON.stringify({ wiring: 'unavailable', notice: text.replace(/\s+/g, ' ').trim(), emptyStateShown: emptyStateShown, entries: entries });
      clearInterval(timer);
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
