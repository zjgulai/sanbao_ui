// 样例：壳 stub（照 host.ts 契约，含 P04 扩展族 readCapabilities）。取证脚本，供 wire-smoke.mjs 注入。
// 名册 3 条覆盖 configured/enabled 各种组合：已配置·已启用 / 已配置·未启用 / 未配置·未启用。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () {
    return { state: 'read', name: 'sanbao-live-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' };
  },
  startRequirement: async function () {
    return { state: 'opened', sessionRef: 'session-ext-001' };
  },
  readCapabilities: async function () {
    window.__CAP_READ_CALLS__ = (window.__CAP_READ_CALLS__ || 0) + 1;
    return {
      state: 'read',
      entries: [
        { id: 'cap-docs', label: '壳侧文档助手', configured: true, enabled: true },
        { id: 'cap-data', label: '壳侧数据连接器', configured: true, enabled: false },
        { id: 'cap-later', label: '壳侧待配置插件', configured: false, enabled: false }
      ]
    };
  }
};
