// fixture 控制组 grader：无壳（不装 host.js）——扩展市场与已装页保持接线前原样。
// 断言 data-extensions-wiring=fixture、无任何 live 标记、市场 24 项名称快照与源注记原样、已装页空态原样。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var LIVE = '[data-capability-roster],[data-capability-entry],[data-capability-strip],[data-capability-unavailable],[data-capability-reading]';
  var stage = 0;
  var facts = {};
  function fail(prefix, extra) {
    var f = { stage: stage };
    for (var k in extra) f[k] = extra[k];
    document.title = prefix + ' ' + JSON.stringify(f);
    clearInterval(timer);
  }
  var timer = setInterval(function () {
    var market = document.querySelector('.extension-market');
    if (stage === 0) {
      if (!market) return;
      var w = market.getAttribute('data-extensions-wiring');
      if (w === null) { fail('FAIL-MARKET-NO-ATTR', {}); return; }
      if (w !== 'fixture') { fail('FAIL-MARKET-NOT-FIXTURE', { wiring: w }); return; }
      var items = market.querySelectorAll('.extension-market-item').length;
      var note = market.querySelector('.extension-market-source-note');
      var liveMarkers = market.querySelectorAll(LIVE).length;
      if (items !== 24 || !note || note.textContent.indexOf('名称来自本次 24 项可读快照') === -1 || liveMarkers !== 0 || market.textContent.indexOf('壳侧能力名册') !== -1) {
        fail('FAIL-MARKET-DRIFT', { items: items, liveMarkers: liveMarkers, hasNote: !!note });
        return;
      }
      facts.marketItems = items;
      facts.marketLiveMarkers = liveMarkers;
      stage = 1;
      return;
    }
    if (stage === 1) {
      var installedBtn = market.querySelector('.extension-market-tools button.extensions-secondary');
      if (installedBtn) { installedBtn.click(); stage = 2; }
      return;
    }
    if (stage === 2) {
      var installed = document.querySelector('.installed-extensions');
      if (!installed) return;
      var w2 = installed.getAttribute('data-extensions-wiring');
      if (w2 === null) { fail('FAIL-INSTALLED-NO-ATTR', {}); return; }
      if (w2 !== 'fixture') { fail('FAIL-INSTALLED-NOT-FIXTURE', { wiring: w2 }); return; }
      var empty = installed.textContent.indexOf('暂无已安装扩展') !== -1;
      var liveMarkers2 = installed.querySelectorAll(LIVE).length;
      var shellText = installed.textContent.indexOf('壳侧能力名册') !== -1;
      if (!empty || liveMarkers2 !== 0 || shellText) {
        fail('FAIL-INSTALLED-DRIFT', { empty: empty, liveMarkers: liveMarkers2, shellText: shellText });
        return;
      }
      facts.installedEmpty = empty;
      facts.installedLiveMarkers = liveMarkers2;
      document.title = 'READY ' + JSON.stringify(facts);
      clearInterval(timer);
      return;
    }
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      document.title = 'TIMEOUT stage=' + stage + ' facts=' + JSON.stringify(facts);
      clearInterval(timer);
    }
  }, 13000);
})();
