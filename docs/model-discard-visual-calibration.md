# B24-VIS-W11 · 模型弃稿确认层的局部深色校准

日期：2026-09-23

## 目标

校准 `QDR.P06.settings.models.discard.open` 的确认层。已保存的 Batch21 深色确认图与本地状态具有相同的标题、说明、继续编辑与放弃更改层级；本批只将该局部确认层纳入深色参考条件。

## 改动与边界

- `src/app.tsx` 为 `models.discard.open` 增加独立的 `batch21DiscardReferenceVariants`，使该状态得到 `data-reference-theme="dark-discard"`，不与默认或兼容供应商表单混同。
- `src/styles/zz-settings-models-batch21-reference.css` 让深色遮罩和弃稿确认框同时支持 `dark`、`dark-discard`。`dark-discard` 不会给下层 DeepSeek 表单字段、供应商或模型菜单赋予深色表单规格。
- 参考范围限于确认框约 505×240px、深色表面、说明文字、继续编辑按钮、红色放弃更改按钮及遮罩。没有显示、读取或保存真实模型、API Key 或配置。

## 验收

直达：

```text
/?state=QDR.P06.settings.models.discard.open&build=B24-VIS-W11
```

核对确认框使用 `data-reference-theme="dark-discard"`、宽 505px、高 240px、背景 `rgb(32, 37, 32)`，且红色放弃按钮存在。继续编辑返回浅色 DeepSeek 本地表单；放弃更改返回浅色模型空列表，不携带参考主题。

结果：已在内置浏览器核对上述几何与颜色。确认层打开时有两个本地对话框，底层 DeepSeek 表单仍为 `rgb(255, 255, 255)`，因此没有把兼容供应商表单主题外推给它；继续编辑后只剩一张浅色 DeepSeek 草稿表单，放弃后没有残留对话框或参考主题。

## 不构成的结论

该确认框的局部视觉参考不证明 DeepSeek 表单、模型列表、全局深色主题、保存、校验、真实供应商连接、Figma、DSH Host、iOS 或 DMG 已完成。
