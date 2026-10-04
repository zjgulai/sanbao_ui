// 样例：壳 stub（照 host.ts 契约）。取证脚本，供 wire-smoke.mjs 注入。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () {
    return { state: 'read', name: 'sanbao-live-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' };
  },
  startRequirement: async function () {
    return { state: 'opened', sessionRef: 'session-clarify-001' };
  },
  readSession: async function (ref) {
    window.__READ_CALLS__ = (window.__READ_CALLS__ || 0) + 1;
    var userMsg = { role: 'user', text: '把 206 个页面的接线落到 QDR.P01 首页' };
    if (window.__ANSWERED__) {
      return { state: 'read', sessionRef: ref, streaming: false, pendingClarification: null, messages: [userMsg, { role: 'user', text: window.__ANSWERED__ }] };
    }
    return {
      state: 'read', sessionRef: ref, streaming: false, pendingClarification: {
        question: '这条需求先确认证据来源：以哪类记录为准？',
        options: ['以壳侧会话与任务记录为准', '以本地示例数据为准', '按后续接线再定'],
        recommended: '以壳侧会话与任务记录为准'
      },
      messages: [userMsg]
    };
  },
  answerClarification: async function (ref, answer) {
    window.__ANSWER_CALLS__ = (window.__ANSWER_CALLS__ || []).concat(answer);
    window.__ANSWERED__ = answer;
    return { state: 'submitted' };
  }
};
