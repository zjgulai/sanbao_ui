# SanBao 官网

这是 SanBao 的公开静态官网源代码与生成制品。它不依赖前端包管理器、后端服务或环境变量；页面的样式、脚本、业务数据和图像都会内嵌到最终的 `index.html`。

## 打开与构建

- 直接打开根目录的 `index.html` 即可预览。
- 修改 `src/` 下的源代码或 `assets/` 图片后，先运行 `python3 verify_business_i18n.py`，再运行 `python3 build.py`，重新生成独立的 `index.html`。需要 Python 3，不使用第三方库。
- 如需通过本地网页地址预览，在本目录运行 `python3 -m http.server 8000`，然后访问 `http://localhost:8000`。
- GitHub Pages 工作流会先执行上述校验与构建，再仅上传生成的 `index.html`；不会上传原型的 `dist/`、研究资料或 Qoder 证据。

## GitHub Pages 发布

- 发布工作流位于仓库根目录的 `.github/workflows/deploy-pages.yml`。
- 只有 `website/**` 或该工作流本身变动时，推送到 `main` 才会触发部署；可在 Actions 中手动运行 `workflow_dispatch` 重新部署同一站点。
- GitHub Actions 在独立的 `_site/` 目录中只组装 `index.html` 作为 Pages artifact。官网所需资源已全部内嵌，因此项目站点路径 `/sanbao_ui/` 与将来的自定义域名均不依赖根路径静态资源。
- 这是公开网站源代码。不要把凭据、用户数据、Qoder 研究材料、原型截图、未公开规划或任何本不应公开的文件放进此目录。

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `index.html` | 可直接打开、分享或静态部署的最终单文件网页 |
| `src/index.template.html` | 页面结构及构建占位符 |
| `src/styles.css` | 页面样式、响应式布局与动效 |
| `src/app.js` | 语言、明暗模式、图谱、员工轮播及弹窗交互 |
| `src/data/business.json` | 业务场景与数字员工等原始业务数据 |
| `src/data/en.json` | 英文界面译文 |
| `verify_business_i18n.py` | 检查场景目录 59 条记录的名称、范围、问题、交付、业务责任和验收文案是否都有英文映射，并与知识图谱中的同一场景副本保持一致 |
| `assets/favicon.svg` | 星帆网站图标，跟随系统明暗模式 |
| `assets/sanbao-logo.svg` | 已应用的方案 A 星帆图形（纯 SVG 路径） |
| `assets/dsh-reference.jpg` | 原版 DSH 内嵌图片 |
| `assets/earth-texture.png` | 原版地球纹理图片 |
| `build.py` | 将独立源文件与图片重新内嵌到最终 HTML |

## 本版设计与行为

- 固定钛银主色，已移除主色筛选入口及蓝、绿两套品牌主色。
- 明暗模式独立切换，保留简体中文与 English。
- 保留原来的彩色网状知识图谱和动效；图谱中的业务分类颜色不属于品牌主色选项。
- 保留 50 位数字员工的自动轮播、交互与详情展示。
- 保留已有业务内容与功能边界；代码包没有新增后端服务或安装包。

请编辑 `src/` 与 `assets/` 后再构建，避免直接修改 `index.html` 后被下一次构建覆盖。模板中的 `{{WORLD_PILOT_...}}` 是构建占位符，应保留。

## 品牌命名更新

- 中文与英文界面的公开品牌名均为 `SanBao`，包括导航、标题、描述、下载入口和弹窗。
- StarRaft 仅作为 Logo 的星辰与方舟设计灵感；导航与网站图标已应用方案 A「星帆」，公开品牌文字均为 `SanBao`。
- 导航 Logo 为内嵌 SVG，随页面深浅主题使用现有文字色；favicon 使用相同路径，并通过 `prefers-color-scheme` 跟随系统深浅模式。
- 保留内部 `worldpilot-v1-language`、`worldpilot-v1-appearance` 存储键和 `worldpilot:languagechange` 事件名，以延续现有语言、明暗偏好和事件订阅；这些标识不显示在界面。
- `wp-data`、`wp-locale-en`、`wp-icon-*` 及 `{{WORLD_PILOT_...}}` 构建占位符属于内部关联标识，继续保留。
- 本次仅应用已选定的品牌图形；原有 50 人官网目录、业务内容、彩色网状图谱与自动轮播保持不变。
