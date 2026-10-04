// 负控：壳存在但未提供 readCapabilities（可选能力缺省）。页面应如实说“壳已连接但能力名册读取未接线”。
// 照 host.ts 契约，仅实现必填方法；readCapabilities 故意缺省。取证脚本，供 wire-smoke.mjs 注入。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () {
    return { state: 'read', name: 'sanbao-live-workspace', mode: 'local' };
  },
  startRequirement: async function () {
    return { state: 'opened', sessionRef: 'session-ext-nocap' };
  }
};
