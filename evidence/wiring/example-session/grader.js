// 样例：S02 澄清场景 grader（分级交互 + document.title 读数通道）。
// READY {...facts} / FAIL-* / DIAG —— 照抄本文件改断言即可复用到其他族。
(function () {
  window.addEventListener('error', function (e) {
    document.title = 'DIAG ' + String(e.message).slice(0, 140);
  });
  var expect = window.__SMOKE_EXPECT__ || 'clarify';
  var stage = 0;
  var question = '';
  var optionCount = 0;
  var timer = setInterval(function () {
    function card() { return document.querySelector('[data-clarification]'); }
    function page() { return document.querySelector('.session-page[data-session-wiring]'); }
    function primary() { return document.querySelector('.clarification-footer .primary-button'); }
    function fact() {
      var pg = page();
      var toastEl = document.querySelector('.prototype-toast span');
      return {
        wiring: document.documentElement.dataset.sanbaoWiring,
        sessionWiring: pg ? pg.getAttribute('data-session-wiring') : null,
        cardPresent: !!card(),
        readCalls: window.__READ_CALLS__ || 0,
        answerCalls: (window.__ANSWER_CALLS__ || []),
        userMsgs: pg ? Array.prototype.map.call(pg.querySelectorAll('.user-message span'), function (n) { return n.textContent; }) : [],
        toast: toastEl ? toastEl.textContent : ''
      };
    }
    function done(prefix, extra) {
      var f = fact();
      for (var k in extra) f[k] = extra[k];
      document.title = prefix + ' ' + JSON.stringify(f);
      clearInterval(timer);
    }
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
    if (stage === 3) {
      if (f0.sessionWiring === 'read' && f0.cardPresent) {
        var q = card().querySelector('p');
        question = q ? q.textContent : '';
        optionCount = card().querySelectorAll('.clarification-options button').length;
        stage = 4;
      }
      return;
    }
    if (stage === 4) {
      var opt = card() && card().querySelector('.clarification-options button');
      if (opt) { opt.click(); stage = 5; }
      return;
    }
    if (stage === 5) {
      var prim = primary();
      if (prim && !prim.disabled) { prim.click(); stage = 6; }
      return;
    }
    if (stage === 6) {
      var wanted = '以壳侧会话与任务记录为准';
      if (f0.answerCalls.length >= 1 && !f0.cardPresent && f0.userMsgs.indexOf(wanted) !== -1 && f0.toast.indexOf('已把澄清答案发回壳') !== -1) {
        done('READY', { question: question, optionCount: optionCount, wanted: wanted });
      }
      return;
    }
  }, 120);
  setTimeout(function () {
    if (document.title.indexOf('READY') !== 0 && document.title.indexOf('FAIL') !== 0 && document.title.indexOf('DIAG') !== 0) {
      document.title = 'TIMEOUT stage=' + stage + ' expect=' + expect + ' prev=' + document.title.slice(0, 40);
      clearInterval(timer);
    }
  }, 13000);
})();
