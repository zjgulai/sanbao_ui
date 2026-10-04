// Grader：P04 扩展族（batch T-X）——壳侧能力名册驱动。
// 从市场页出发：市场 live 区块 → Superpowers 详情 live 条 → 返回 → 已装页 live 名册。
// READY {...facts} / FAIL-* / DIAG；只断言总条数与精确徽记组合，不做像素/时间假设。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var EXPECTED = ['壳侧文档助手', '壳侧数据连接器', '壳侧待配置插件'];
  var stage = 0;
  var facts = {};
  function wiring(el) { return el ? el.getAttribute('data-extensions-wiring') : null; }
  function entryLabels(root) {
    return Array.prototype.map.call(root.querySelectorAll('[data-capability-entry] strong'), function (n) { return n.textContent; });
  }
  function badgeCounts(root) {
    var counts = { '已配置': 0, '未配置': 0, '已启用': 0, '未启用': 0 };
    Array.prototype.forEach.call(root.querySelectorAll('.extensions-live-badge'), function (n) {
      if (counts[n.textContent] !== undefined) counts[n.textContent] += 1;
    });
    return counts;
  }
  function labelsOk(labels) { return labels.join('|') === EXPECTED.join('|'); }
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
      var w = wiring(market);
      if (w === 'unavailable' || w === 'fixture') { fail('FAIL-MARKET-WIRING', { wiring: w }); return; }
      if (w !== 'read') return;
      var roster = market.querySelector('[data-capability-roster]');
      var count = market.querySelectorAll('[data-capability-entry]').length;
      var labels = entryLabels(market);
      if (!roster || count !== 3 || !labelsOk(labels)) { fail('FAIL-MARKET-ROSTER', { count: count, labels: labels }); return; }
      facts.marketEntries = count;
      facts.marketLabels = labels;
      stage = 1;
      return;
    }
    if (stage === 1) {
      var detailBtn = market.querySelector('button[aria-label="查看 Superpowers 详情"]');
      if (detailBtn) { detailBtn.click(); stage = 2; }
      return;
    }
    var detail = document.querySelector('.extension-detail.market-expanded-detail');
    if (stage === 2) {
      if (!detail) return;
      var w2 = wiring(detail);
      if (w2 === 'unavailable' || w2 === 'fixture') { fail('FAIL-DETAIL-WIRING', { wiring: w2 }); return; }
      var strip = detail.querySelector('[data-capability-strip]');
      if (w2 === 'read' && strip) {
        facts.detailStrip = strip.textContent.replace(/\s+/g, ' ').trim();
        stage = 3;
      }
      return;
    }
    if (stage === 3) {
      var back = detail.querySelector('.extension-detail-breadcrumb button');
      if (back) { back.click(); stage = 4; }
      return;
    }
    if (stage === 4) {
      if (!market) return;
      var installedBtn = market.querySelector('.extension-market-tools button.extensions-secondary');
      if (installedBtn) { installedBtn.click(); stage = 5; }
      return;
    }
    if (stage === 5) {
      var installed = document.querySelector('.installed-extensions');
      if (!installed) return;
      var w3 = wiring(installed);
      if (w3 === 'unavailable' || w3 === 'fixture') { fail('FAIL-INSTALLED-WIRING', { wiring: w3 }); return; }
      if (w3 !== 'read') return;
      var count3 = installed.querySelectorAll('[data-capability-entry]').length;
      var labels3 = entryLabels(installed);
      var badges = badgeCounts(installed);
      var emptyStateShown = installed.textContent.indexOf('暂无已安装扩展') !== -1;
      if (count3 !== 3 || !labelsOk(labels3) || emptyStateShown ||
        badges['已配置'] !== 2 || badges['未配置'] !== 1 || badges['已启用'] !== 1 || badges['未启用'] !== 2) {
        fail('FAIL-INSTALLED-ROSTER', { count: count3, labels: labels3, badges: badges, emptyStateShown: emptyStateShown });
        return;
      }
      facts.installedEntries = count3;
      facts.installedBadges = badges;
      facts.installedEmptyStateHidden = !emptyStateShown;
      facts.capReadCalls = window.__CAP_READ_CALLS__ || 0;
      if (facts.capReadCalls < 3) { fail('FAIL-READ-CALLS', { capReadCalls: facts.capReadCalls }); return; }
      if (facts.detailStrip.indexOf('壳侧能力名册已读：共 3 项') === -1) { fail('FAIL-DETAIL-STRIP', { detailStrip: facts.detailStrip }); return; }
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
