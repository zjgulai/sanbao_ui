// 证据：OBS02 知识中心主场景壳 stub——readKnowledge 返回 3 条真结构集合名册（含 kind 标签）。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () {
    return { state: 'read', name: 'sanbao-live-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' };
  },
  startRequirement: async function () {
    return { state: 'opened', sessionRef: 'session-knowledge-000' };
  },
  readKnowledge: async function () {
    window.__KNOWLEDGE_CALLS__ = (window.__KNOWLEDGE_CALLS__ || 0) + 1;
    return {
      state: 'read',
      collections: [
        { title: '壳侧工程手册', kind: 'user' },
        { title: 'paper-plane 工作区知识库', kind: 'workspace' },
        { title: '壳侧只读候选集合' }
      ]
    };
  }
};
