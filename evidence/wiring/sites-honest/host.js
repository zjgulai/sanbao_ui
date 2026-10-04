// 证据：OBS03 站点诚实面壳 stub——readSites 读到名册，但共享范围不随名册承载。加载态复用同一 stub。
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
    return { state: 'read', sites: [{ title: '壳侧着陆页站点' }] };
  }
};
