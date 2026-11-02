# 项目协作规范

## 目标与操作边界

这是 Hunt it down 的公开个人主页。目标是让作者通过 Markdown 独立维护公开内容。
使用 Astro 静态构建、Content Collections、原生 CSS 和 GitHub Pages；保持最小可用实现。
未经明确要求，不添加 React、数据库、登录、CMS、统计追踪、付费服务或第三方博客模板。
阅读、分析、建议不等于授权修改。实施、提交、推送、合并、发布分别遵循本轮用户授权，不自动扩展操作范围。
开发在 feature 分支进行；本次迁移分支为 `feature/20261030`。不要直接在 `main` 修改或部署。

## 内容与架构

数据流：`src/content/<collection>/*.md` → `src/content.config.ts` 校验 → `src/lib/content.ts` 查询/排序 → Astro 页面与模板 → `dist/` 静态页面 → GitHub Pages。

- `src/pages/index.astro`：首页介绍、项目卡片、最新笔记/随笔、近况。
- `src/pages/[collection]/index.astro`：Projects / Notes / Essays 共用列表。
- `src/pages/[collection]/[...id].astro`：共用文章详情，调用 `render(entry)`。
- `src/pages/tags/`：所有标签与每个标签的公开文章。
- `src/components/Header.astro`、`Footer.astro`：所有页面共享。
- `src/layouts/BaseLayout.astro`：文档结构、元数据、公共样式、页头页脚。
- `src/layouts/ArticleLayout.astro`：标题、日期、标签、正文与返回入口。
- `src/styles/global.css`：设计 token、原首页样式、响应式与阅读排版。
- `public/images/avatar.jpg`：由旧首页 data URL 无损提取；其他公开图片也放此目录。
- `scripts/check-site.mjs`：生产产物、必要页面、站内链接、资源和锚点检查。
- `.github/workflows/deploy.yml`：feature / PR 只检查；只有 main 可上传并部署。
- 根目录 `index.html`：迁移前页面，保留以便比对，不是 Astro 入口，也不进入 dist；不要继续维护两份主页。

文件路径决定文章 URL，使用小写英文、数字、连字符，支持子目录。不要无理由改已公开 URL。
三类内容共享字段：title、description、public、date、updated、tags、status、eyebrow、order。
`public: true` 必填；Notes / Essays 必须有日期；原有项目允许没有日期，不能编造日期。
Notes / Essays 按日期倒序，Projects 按 order 排序。标签按原文字面匹配，URL 编码不能丢失中文或特殊符号。
新增栏目需同时更新内容配置与栏目元信息；不得假设动态 URL 自动创建了集合。

## 设计规范

延续现有手工设计，不换第三方模板：

| 用途 | 值 |
| --- | --- |
| 主背景 | `#0c1119`，深灰黑，保留柔和蓝色径向渐变 |
| 卡片表面 | `#141c26` / `#19232e` |
| 主文字 | `#eff4f9` |
| 次级文字 | `#b1c0cf` |
| 弱提示文字 | `#8294a7` |
| 主强调 | `#95c5f0`，浅色强调 `#c3e1fb` |
| 少量金色点缀 | `#d7b774` / `#f0d7a2` |
| 边线 | `#283746` / `#33495c` |

- 原首页最大宽度 1100px；列表最大 900px；阅读区最大 800px。
- 字体使用系统中文字体与系统无衬线字体；代码用等宽字体，不引入外部字体下载。
- 保留左上角圆形头像、品牌、首屏双栏、细边线、克制的渐变和卡片圆角。
- 原响应式断点为 950px 和 600px。至少检查桌面与窄屏；代码、表格只能在自身区域横向滚动。
- 保留原首页已有个人介绍和项目概述，不擅自改写经历、夸大成果或补充内部细节。
- 金色用于编号与少量状态提示，冰蓝用于链接和主要强调。不要增加大量高饱和色。
- 使用语义化 main/article/nav、单个 h1、可见键盘焦点、跳转正文链接和图片替代文本。
- 遵循 prefers-reduced-motion；内容站默认不增加客户端 JavaScript。

## 公开内容限制

所有提交到公开仓库的内容都视为公开，包括 Markdown 源文和历史。
私人草稿、公司源码、业务数据、账号密钥、个人隐私必须留在仓库之外。
`public: true` 仅是作者确认标记，不是权限保护；不得把 draft 标记或构建过滤当作保密措施。
新增内容必须有用户提供的公开来源或明确授权。验证可以临时生成中性测试文章，但最终源码和构建产物必须清除测试内容。
public/ 下文件会直接复制到站点，不能存放未经检查的文件。

## 开发与验证

先检查现有实现、工作区与分支，再解释计划，然后执行已授权的修改。
优先解决当前任务；对复杂问题区分已验证事实、推断、假设与未知，不把代码自洽当成线上验证。
使用 `npm ci` 和锁文件；依赖升级需核实官方版本与兼容性，避免顺手扩大依赖范围。
变更后运行 `npm run verify`。修改页面设计后预览桌面和移动布局；内容链路变化需检查列表 → 详情 → 标签 → 返回。
涉及内容 schema 时验证非法字段/日期会失败。检查仅用于静态站，不需要引入大型测试框架。
报告已完成、验证结果、未验证范围与下一步；本地构建成功不等于 GitHub Actions 或线上部署成功。
需要修改发布行为时检查分支条件、权限与 Pages 设置；不得让 feature 分支触发正式部署。
新增使用步骤、字段或架构变化，同步 README 和本文件；避免额外维护文档。
