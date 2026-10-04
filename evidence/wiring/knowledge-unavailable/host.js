// 证据：负控壳 stub——有壳但未提供 readKnowledge（缺能力点按如实句，绝不 fixture 冒充）。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () {
    return { state: 'read', name: 'sanbao-live-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' };
  },
  startRequirement: async function () {
    return { state: 'opened', sessionRef: 'session-knowledge-000' };
  }
};
