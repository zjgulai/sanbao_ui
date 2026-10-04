// 证据：S1.streaming 场景壳 stub——readSession 报 streaming 并按次增长；stopSession 记录并停流。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () {
    return { state: 'read', name: 'sanbao-live-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' };
  },
  startRequirement: async function () {
    return { state: 'opened', sessionRef: 'session-stream-900' };
  },
  readSession: async function (ref) {
    var calls = (window.__READ_CALLS__ || 0) + 1;
    window.__READ_CALLS__ = calls;
    var userMsg = { role: 'user', text: '把 206 个页面的接线落到 QDR.P01 首页' };
    var a1 = { role: 'assistant', text: '第一段：会话已建立，正在流式生成。' };
    var a2 = { role: 'assistant', text: '输出结束：本轮完成。' };
    if (window.__STOPPED__) return { state: 'read', sessionRef: ref, streaming: false, messages: [userMsg, a1, a2] };
    if (calls === 1) return { state: 'read', sessionRef: ref, streaming: true, messages: [userMsg] };
    return { state: 'read', sessionRef: ref, streaming: true, messages: [userMsg, a1] };
  },
  stopSession: async function (ref) {
    window.__STOP_CALLS__ = (window.__STOP_CALLS__ || []).concat(ref);
    window.__STOPPED__ = true;
    return { state: 'stopped' };
  }
};
