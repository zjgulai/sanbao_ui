// 证据：OBS03 站点主场景壳 stub——readSites 返回 2 条真结构站点名册（含 kind 标签）。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () {
    return { state: 'read', name: 'sanbao-live-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' };
  },
  startRequirement: async function () {
    return { state: 'opened', sessionRef: 'session-sites-000' };
  },
  readSites: async function () {
    window.__SITES_CALLS__ = (window.__SITES_CALLS__ || 0) + 1;
    return {
      state: 'read',
      sites: [
        { title: '壳侧着陆页站点' },
        { title: '壳侧活动页 A 站', kind: 'team' }
      ]
    };
  }
};
