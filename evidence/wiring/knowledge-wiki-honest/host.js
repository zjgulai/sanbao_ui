// 证据：OBS02 Repo Wiki 面壳 stub——本批读形状只承载知识库集合，不提供 Repo Wiki 名册读取。
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
    return { state: 'read', collections: [{ title: '壳侧工程手册', kind: 'user' }] };
  }
};
