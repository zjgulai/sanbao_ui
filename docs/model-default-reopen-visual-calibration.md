# B24-VIS-W10 · 默认模型重开表单的深色参考校准

日期：2026-09-23

## 目标

修复一个已经由同状态 PNG 确认的主题差异：`QDR.P06.settings.models.add.default` 在原产品“放弃草稿后重新打开默认表单”的截图中为深色条件，本地 fixture 此前仍使用浅色表单。

## 证据与改动

- 原产品参考：`repository-snapshot/docs/research/qoder/batch21-evidence/reopen-default.png`。
- 可见结构：阿里云百炼 - 中国、`Token plan`、模型选择和 API Key 默认表单。此次没有录入或读取凭据，也没有选择模型或保存配置。
- `src/app.tsx` 只把 `models.add.default` 放入 `batch21DefaultModelReferenceVariants`。这个独立标识使默认供应商表单不会被混同为兼容供应商状态。
- 页面复用已经针对同一 Batch21 深色截图条件校准的遮罩、约 736px 表单、字段、按钮和局部菜单样式；深色属性仅挂在当前 `.product-window`，离开参考路由后立即回到浅色原型基线。

## 本地验收

在原型目录执行：

```bash
pnpm build
python3 output/playwright/batch24/run-today-all-state-routes.py
```

再直达：

```text
/?state=QDR.P06.settings.models.add.default&build=B24-VIS-W10
```

核对 `.product-window[data-reference-theme="dark"]`、深色遮罩和深色默认表单均存在；跳转到非参考状态后不应保留深色属性。

结果：`pnpm build` 已通过 TypeScript、目录、交互合同和静态导出；全量路由回归为 206 / 206、0 页面异常。内置浏览器实测默认表单的参考属性为 `dark`、弹窗宽度为 736px、弹窗背景为 `rgb(34, 39, 34)`、遮罩为 `rgba(8, 11, 9, 0.84)`；“取消 → 模型默认页 → 添加模型”会先清理深色属性，再回到深色默认表单。API Key 输入继续为只读。

## 边界

本批只解决已保存 PNG 对应的局部主题差异。原产品字体、缩放、窗口尺寸和内容区裁切没有固定，因此不作逐像素或全产品深色主题通过结论。动态模型、API Key、校验、保存、供应商连接、DSH Host、Figma、iOS 和 DMG 均未触发或验收。
