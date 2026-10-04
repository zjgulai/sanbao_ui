// 证据：P03 自动化名册场景壳 stub。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () { return { state: 'read', name: 'sanbao-live-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' }; },
  startRequirement: async function () { return { state: 'opened', sessionRef: 'session-auto-000' }; },
  readAutomations: async function () {
    window.__AUTOMATION_CALLS__ = (window.__AUTOMATION_CALLS__ || 0) + 1;
    return {
      state: 'read',
      items: [
        { title: '晨间简报', schedule: '每天 09:00 · Asia/Shanghai', enabled: true },
        { title: '每周回顾草稿', schedule: '每周一 10:00 · Asia/Shanghai', enabled: false }
      ]
    };
  }
};
