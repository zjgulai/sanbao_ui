// 负控场景：壳存在但未提供 readSettings —— models 面必须如实显示“未接线”，不用 fixture 内容冒充。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () {
    return { state: 'read', name: 'sanbao-settings-workspace', mode: 'local' };
  },
  startRequirement: async function () {
    return { state: 'opened', sessionRef: 'session-settings-001' };
  }
};
