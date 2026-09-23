# Sanbao UI Prototype

一个可独立运行的桌面端 UI/UX 原型。它以 Qoder 已观察到的页面结构为参考，并为 Sanbao 的 DeepSeek Harness（DSH）接入保留页面、状态和动作边界。

当前基线为 `B24-FAST-W8`：目录有 **59 个页面组、206 条可直达状态**；其中 **123 条**提供本地可运行页面，另外 **83 条**保留为带来源标识的研究详情。页面覆盖优先于交互精修：所有输入、创建、停止、审批和保存均为本地 fixture，不调用模型、账户、工作区、网络服务或 DSH Host。

## 运行

需要 Node.js 22、pnpm 和 Python 3。

```sh
pnpm install --ignore-workspace --frozen-lockfile
pnpm build
pnpm preview
```

打开 <http://127.0.0.1:4173>。静态预览仅监听本机；源码改动后重新执行 `pnpm build`。

## 页面目录与直达路由

每一页都可通过查询参数直达，例如：

```text
/?state=QDR.M01.reply.completed
/?state=QDR.P03.list.empty
/?state=QDR.P14.preview.html
```

目录和来源标签由 [src/catalog-data.json](src/catalog-data.json) 维护。`src/app.tsx` 按状态选择具体页面；每个工作面都能从 URL 刷新恢复，便于评审、截图和后续 Figma/DSH 映射。

## 现有工作面

- 首页、会话、搜索、工作区、预览和 diff 审阅
- 自动化、任务搜索、执行状态、协作集合与审批计划
- 扩展、插件市场、连接器/MCP、知识库与站点
- 设置页：外观、通用、模式、模型、快捷键、语音、移动协作和扩展
- 移动协作端：任务发起、进度、审批、补充指令与验收结果
- 会话韧性状态：流式回复、主动停止、继续对话、澄清、锚点、任务回顾、用量浮层和工具结果
- 尚未取得完整原产品证据的候选，以研究详情呈现，不伪装为已验证的原生页面

## 验证

```sh
pnpm build
```

构建会运行 TypeScript、状态目录和交互合同检查，再生成 `dist/` 静态预览文件。`dist/`、`node_modules/`、浏览器截图和运行日志都不纳入版本库。

## 接入边界

本仓库是 UI 原型源代码，不是 DSH Host、模型服务或发布产物。它不证明原产品像素一致、Figma 同步、DSH 壳内兼容、iOS 打包或 DMG 发布。接入时应保持页面渲染、状态契约和实际服务调用分离，并以目标 DSH 版本的运行验证为准。
