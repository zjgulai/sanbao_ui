// 负控：真删 searchSessions，模拟壳缺检索能力。
window.__SMOKE_EXPECT__ = 'nosearch';
delete window.__SANBAO_HOST__.searchSessions;
