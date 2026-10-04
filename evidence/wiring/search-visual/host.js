// 证据：P02 搜索场景壳 stub——searchSessions 返回 2 条命中；readSession 支撑打开会话。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () {
    return { state: 'read', name: 'sanbao-live-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' };
  },
  startRequirement: async function () {
    return { state: 'opened', sessionRef: 'session-search-000' };
  },
  searchSessions: async function (query) {
    window.__SEARCH_CALLS__ = (window.__SEARCH_CALLS__ || []).concat(query);
    return {
      state: 'read',
      results: [
        { sessionRef: 'session-hit-001', title: '接证据来源的会话', subtitle: '纸飞机 · 今天' },
        { sessionRef: 'session-hit-002', title: '第二条壳侧命中', subtitle: 'shell · 昨天' }
      ]
    };
  },
  readSession: async function (ref) {
    return {
      state: 'read', sessionRef: ref, streaming: false,
      messages: [{ role: 'assistant', text: '已打开 ' + ref + '：这是壳侧会话读数。' }]
    };
  }
};
