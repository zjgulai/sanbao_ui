// 逐状态探针用壳 stub：与 extensions/ 同一名册（3 条，覆盖 configured/enabled 各组合）。取证脚本。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () {
    return { state: 'read', name: 'sanbao-live-workspace', mode: 'local' };
  },
  startRequirement: async function () {
    return { state: 'opened', sessionRef: 'session-ext-states' };
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
