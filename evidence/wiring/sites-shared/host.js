// 证据：OBS03 共享范围直接接线壳 stub——readSites 同时返回“我的站点”名册与 shared 共享范围名册（真结构）。
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
      ],
      shared: [
        { title: '壳侧共享站点 B 站', kind: 'shared' },
        { title: '壳侧共享站点 C 站' }
      ]
    };
  }
};
