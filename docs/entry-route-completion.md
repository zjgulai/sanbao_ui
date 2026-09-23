# B24-ENTRY-W9 目录入口页面承接

日期：2026-09-23

## 本批目标

消除目录中以通用 `ResearchDetail` 代替真实页面结构的入口路由，优先补齐页面完整性，不扩写真实服务交互。

## 已完成

- 24 条 `QDR.P06.settings.*.entry` 直达 URL：保留原始 review state 与 `entry-observed` 来源，进入对应设置页或 15 个设置叶工作面，并激活匹配的设置侧栏项。
- `QDR.P14.terminal.entry` 与 `QDR.P14.sidepanel.entry`：新增独立会话工作台页面，分别显示终端占位与可切换侧面板。两页不会启动 Shell、读取文件或连接运行环境。
- `QDR.P03.scope.unexpanded`：复用自动化总览的列表、模板和运行记录入口。
- `QDR.OBS02.knowledge.entry` 与 `QDR.OBS03.sites.entry`：复用知识中心和站点默认页，仍保留入口证据等级。
- 所有产品内容区增加 `data-source-kind`，供路由回归区分来源等级和页面承接状态。

## 验证

在原型目录执行：

```sh
pnpm build
python3 output/playwright/batch24/run-today-all-state-routes.py
```

结果：TypeScript、59 组／206 状态目录、交互合同和静态导出通过；全量 206 条路由无页面异常。回归还会断言上述 29 条入口 URL 不出现 `.research-detail`，且保留原状态的来源等级。

## 仍需独立验收

本批没有新增 Qoder 实机取证，没有访问 Figma，也没有执行 DSH Host、模型、文件、终端、网络、iOS 或 DMG 操作。页面承接完成不等同于原产品视觉一致、原生交互完整或任何运行时兼容结论。
