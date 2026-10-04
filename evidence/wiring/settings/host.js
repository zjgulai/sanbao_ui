// 场景：T-S 设置族 models 面 —— 壳 stub 按 host.ts 契约提供 readSettings 结构事实（2 个命名空间）。
// 负控：stub 故意在结构字段之外夹带 canary“值/密钥/路径”字段；页面必须只渲染结构计数，
// 绝不把任何值、密钥或路径渲染/序列化进 DOM（grader 会对序列化文本断言 CANARY 缺席）。
window.__SANBAO_HOST__ = {
  protocolVersion: 1,
  readWorkspace: async function () {
    return { state: 'read', name: 'sanbao-settings-workspace', mode: 'local', repo: 'SanBao UI', branch: 'main' };
  },
  startRequirement: async function () {
    return { state: 'opened', sessionRef: 'session-settings-001' };
  },
  readSettings: async function () {
    window.__SETTINGS_READ_CALLS__ = (window.__SETTINGS_READ_CALLS__ || 0) + 1;
    return {
      state: 'read',
      namespaces: [
        {
          ns: 'llm.deepseek', revision: 12, applies: 'live', saved: 'user',
          secrets: { set: 1, total: 2 },
          value: 'CANARY-SETTINGS-VALUE-8f3a',
          apiKey: 'CANARY-SETTINGS-KEY-9b2c'
        },
        {
          ns: 'voice', revision: 4, applies: 'restart', saved: 'base',
          secrets: { set: 0, total: 1 },
          raw: ['CANARY-SETTINGS-PATH-1d7e']
        }
      ]
    };
  }
};
