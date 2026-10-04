// 证据：OBS03 加载态直接接线壳 stub——readSites 延迟 900ms 返回：骨架期＝壳读挂起（无固定本地计时），读成转壳侧名册。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () {
    return { state: 'read', name: 'sanbao-live-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' };
  },
  startRequirement: async function () {
    return { state: 'opened', sessionRef: 'session-sites-000' };
  },
  readSites: function () {
    window.__SITES_CALLS__ = (window.__SITES_CALLS__ || 0) + 1;
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        resolve({
          state: 'read',
          sites: [
            { title: '壳侧落地页站点' },
            { title: '壳侧活动页 B 站', kind: 'team' }
          ]
        });
      }, 900);
    });
  }
};
