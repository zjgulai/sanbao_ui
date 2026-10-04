// 场景：T-S 设置族 —— models 面壳读取 grader（分级交互 + document.title 读数通道）。
// 断言总数：18 项（read 态 / 调用 / 2 行命名空间 / 结构文本 ×8 / fixture 文案缺席 / 容器属性 /
// canary 缺席 / 密钥样串缺席 / 路径样串缺席），README 读数含 checks 总数。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var done = false;
  var checks = 0;
  var failures = [];
  function expect(name, ok) { checks += 1; if (!ok) failures.push(name); }
  var stage = 0;
  var timer = setInterval(function () {
    if (done) return;
    var root = document.querySelector('.settings-models[data-settings-wiring]');
    if (!root) return;
    var state = root.getAttribute('data-settings-wiring');
    if (stage === 0) {
      if (state === 'loading' || state === 'fixture') return;
      if (state !== 'read') { document.title = 'FAIL-WIRING ' + state; done = true; clearInterval(timer); return; }
      stage = 1;
    }
    var text = root.textContent || '';
    var page = document.documentElement.innerHTML;
    expect('wiring-read', root.getAttribute('data-settings-wiring') === 'read');
    expect('read-called', (window.__SETTINGS_READ_CALLS__ || 0) >= 1);
    expect('ns-llm.deepseek-row', !!root.querySelector('[data-settings-ns="llm.deepseek"]'));
    expect('ns-voice-row', !!root.querySelector('[data-settings-ns="voice"]'));
    expect('ns-rows-count', root.querySelectorAll('[data-settings-ns]').length === 2);
    expect('struct-revision-12', text.indexOf('revision 12') !== -1);
    expect('struct-revision-4', text.indexOf('revision 4') !== -1);
    expect('struct-secrets-1-2', text.indexOf('密钥 1/2') !== -1);
    expect('struct-secrets-0-1', text.indexOf('密钥 0/1') !== -1);
    expect('struct-applies-live', text.indexOf('即时生效') !== -1);
    expect('struct-applies-restart', text.indexOf('重启后生效') !== -1);
    expect('struct-layer-user', text.indexOf('层 user') !== -1);
    expect('struct-layer-base', text.indexOf('层 base') !== -1);
    expect('fixture-empty-text-absent', text.indexOf('暂无自定义模型') === -1);
    expect('namespaces-container-attr', !!root.querySelector('[data-settings-namespaces]'));
    expect('canary-absent-in-serialized-text', page.indexOf('CANARY') === -1);
    expect('secret-shape-absent', !/sk-[A-Za-z0-9_-]{8,}/.test(page));
    expect('path-shape-absent', page.indexOf('/Users/') === -1 && page.indexOf('file://') === -1);
    done = true;
    clearInterval(timer);
    if (failures.length) { document.title = 'FAIL ' + JSON.stringify({ checks: checks, failures: failures }); return; }
    document.title = 'READY ' + JSON.stringify({
      wiring: 'read',
      readCalls: window.__SETTINGS_READ_CALLS__ || 0,
      nsRows: root.querySelectorAll('[data-settings-ns]').length,
      checks: checks,
      canaryAbsent: true,
      secretShapeAbsent: true,
      pathShapeAbsent: true
    });
  }, 120);
  setTimeout(function () {
    if (!done && document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      document.title = 'TIMEOUT stage=' + stage + ' checks=' + checks + ' expect=' + (window.__SMOKE_EXPECT__ || '');
      clearInterval(timer);
    }
  }, 13000);
})();
