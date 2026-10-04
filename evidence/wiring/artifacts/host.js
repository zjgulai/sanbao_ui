// 证据：产物面场景壳 stub——会话读附 artifacts 名单；openArtifact 记录打开请求。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () { return { state: 'read', name: 'sanbao-live-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' }; },
  startRequirement: async function () { return { state: 'opened', sessionRef: 'session-art-001' }; },
  readSession: async function (ref) {
    return {
      state: 'read', sessionRef: ref, streaming: false, pendingClarification: null,
      messages: [
        { role: 'user', text: '把 206 个页面的接线落到 QDR.P01 首页' },
        { role: 'assistant', text: '输出完成：本轮创建了 demo.html。' }
      ],
      artifacts: [
        { name: 'demo.html', kind: 'output', additions: 67, deletions: 0 },
        { name: 'demo.html', kind: 'diff-modified', additions: 4, deletions: 4 }
      ]
    };
  },
  openArtifact: async function (ref, name) {
    window.__OPEN_CALLS__ = (window.__OPEN_CALLS__ || []).concat(name);
    return { state: 'opened' };
  }
};
