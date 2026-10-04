// 证据：OBS01 用量场景壳 stub（数值刻意与 fixture 不同以证真读）。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () { return { state: 'read', name: 'sanbao-live-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' }; },
  startRequirement: async function () { return { state: 'opened', sessionRef: 'session-usage-000' }; },
  readUsage: async function () {
    window.__USAGE_CALLS__ = (window.__USAGE_CALLS__ || 0) + 1;
    return { state: 'read', plan: { remaining: 128, total: 160 }, resources: { remaining: 5, total: 10 } };
  }
};
