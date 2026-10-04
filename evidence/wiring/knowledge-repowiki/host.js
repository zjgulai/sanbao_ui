// 证据：OBS02 Repo Wiki 直接接线壳 stub——readKnowledge 返回集合名册＋repoWiki 名册（真结构，含 kind 标签）。
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
        { title: '壳侧工程手册', kind: 'user' }
      ],
      repoWiki: [
        { title: '壳侧 Wiki 项目 alpha' },
        { title: '壳侧 Wiki 项目 beta', kind: 'repo' }
      ]
    };
  }
};
