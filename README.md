# Hunt it down · 个人主页

用 Astro + Markdown 维护的静态个人网站，发布到 <https://hunt-it-down.github.io>。
保留原主页的深灰黑背景、冰蓝强调色、少量香槟金、头像和响应式布局。

日常流程：**在仓库外记录 → 整理并确认可公开 → 放入内容目录 → 本地预览 → 提交并合入 main → GitHub 自动发布。**
新增文章只需要 Markdown；修改导航、个人介绍或整体设计时才需要编辑 Astro/CSS。

## 1. 本地启动

需要 Node.js（最低 `22.23.4`，建议使用最新 Node.js 24 LTS）和随附的 npm。
本项目锁定 Astro `7.4.4`，具体依赖版本由 `package-lock.json` 固定。无需数据库、React、管理后台或额外付费服务。

在实际仓库目录打开终端，而不是仓库的上级文件夹：

```powershell
cd D:\Tianyujia\hunt-it-down\hunt-it-down.github.io
node --version
npm ci
npm run dev
```

打开终端输出的本地地址（通常为 <http://localhost:4321>）。保存 Markdown 后页面会更新。按 `Ctrl+C` 停止。
首次使用或拉取依赖变更后运行 `npm ci`；平时写文章直接运行 `npm run dev`。
不要双击根目录 `index.html` 来预览 Astro 网站。

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 写作时预览，自动刷新 |
| `npm run check` | 检查 Astro / TypeScript / 内容结构 |
| `npm run build` | 生成生产站点到 `dist/` |
| `npm run test:site` | 检查已构建站点的必要页面、站内链接、图片与锚点 |
| `npm run verify` | 按顺序执行检查、构建、站点检查；发布前运行 |
| `npm run preview` | 预览最近一次 `dist/` 构建（通常为 <http://localhost:4321>） |

`preview` 不会自动重新构建，修改内容后请先重新运行 `npm run verify`。

## 2. 新增文章

按内容选择目录：

| 目录 | 网站入口 | 内容 |
| --- | --- | --- |
| `src/content/projects/` | `/projects/` | 实际工程经历、个人实验、可公开的成果 |
| `src/content/notes/` | `/notes/` | 技术笔记、学习过程 |
| `src/content/essays/` | `/essays/` | 生活观察、阅读、随笔 |

例如新建 `src/content/notes/my-first-note.md`，复制下面的结构，然后将标题、日期、摘要、标签和正文换成自己的内容：

````markdown
---
title: "我的第一篇笔记"
description: "用一两句话介绍本文讨论的问题。"
public: true
date: "2026-10-30"
tags: ["学习", "Java"]
---

这里写正文。标题已经由页面模板生成，正文从二级标题开始。

## 问题从哪里开始

支持 **加粗**、*斜体*、[外部链接](https://example.com) 和 `行内代码`。

- 一个观察
- 一个仍需验证的问题

> 保留适用条件和不确定性。

```java
System.out.println("Hello, notes!");
```

| 项目 | 说明 |
| --- | --- |
| 观察 | 已确认的现象 |
| 假设 | 尚待验证的解释 |
````

保存后自动得到 `/notes/my-first-note/`，无需手工添加路由、列表或标签页面。
首页自动显示最近三篇笔记、最近三篇随笔；项目区显示项目集合的卡片。

### 文件名与文章地址

- 使用小写英文、数字和连字符，如 `how-indexes-work.md`；中文标题写在 `title` 中。
- 可以使用子目录，如 `notes/java/collections.md`，地址为 `/notes/java/collections/`。
- 文件路径决定 URL。发布后尽量不改文件名或栏目；改动后旧地址会失效，本版本不自动重定向。
- 不支持 MDX，不需要在文章内写 React 或导入组件。

### 文件头字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题，非空 |
| `description` | 是 | 列表摘要与页面描述，非空 |
| `public` | 是 | 只能为 `true`；表示作者已确认内容可公开 |
| `date` | Notes / Essays 必填 | 带引号的 `"YYYY-MM-DD"`；用于显示和倒序排列 |
| `updated` | 否 | 修改日期，同样格式；必须不早于 `date` |
| `tags` | 否 | 字符串数组，单个标签最多 40 字符；支持中文、空格、`C++` 等，按原文字面匹配 |
| `status` | 否 | 如 `"实践经历"`、`"探索中"`；仅展示，不控制发布 |
| `eyebrow` | 否 | 项目卡片上方的小标题，如 `"ENGINEERING / 04"` |
| `order` | 否 | 项目显示顺序，小数字在前，默认 100 |

**日期不会触发定时发布。** 填未来日期的文章也会随下次构建公开；请等准备公开时再加入仓库。
原有三个项目只迁移已有公开简介，没有可核实的发布日期，因此允许项目不填 `date`。

### 图片与链接

图片放入 `public/images/`，例如 `public/images/index-example.png`。文章内写：

```markdown
![描述图片内容，便于理解和无障碍阅读](/images/index-example.png)

[另一篇笔记](/notes/my-first-note/)
```

链接中的路径从 `/` 开始，不写 `public/` 或 `src/content/`。
代码块在三个反引号后写语言，如 `java`、`python`、`sql`、`bash`，即可使用 Astro 内置 Shiki 高亮。
表格与长代码在窄屏内横向滚动，不撑宽整页。

## 3. 修改与删除

- 修改：直接编辑对应 `.md`；标题和摘要可自由更改。必要时填写 `updated`，保留原 `date`。
- 删除：删除对应 `.md`；重新构建后列表、详情和无剩余文章的标签页面随之消失。旧链接返回 404。
- 删除文章后，确认图片没有被其他文章引用，再删除不再使用的图片。
- 只是暂时不想发布的文字，应放回仓库之外。这里没有私人草稿区。

## 4. 公开内容边界

此仓库是公开仓库。**不在网页显示，不等于没有公开：提交到 GitHub 的源码和历史也可以被访问。**

只将明确允许公开的内容复制进本仓库。不要加入私人草稿、个人隐私、公司内部资料、源码、业务数据、账号密码或密钥。截图和图片也要检查。
`public: true` 是必填确认字段，不是权限系统或隐私扫描器；缺失或为 false 会使构建失败。
`.gitignore` 排除常见 `drafts/`、`private/`、`.env*` 等路径，但不能识别所有敏感信息，也不能保护已经跟踪的文件。
最稳妥的方式仍是将原始笔记保存在本仓库之外，公开前再整理复制。

本次迁移仅复用原主页已有的公开项目简介，没有代写公司项目细节或虚构技术文章。

## 5. 首次迁移到 GitHub Pages

迁移先在 `feature/20261030` 本地完成。本地构建不会更新线上网站。
根目录原始 `index.html` 保留用于比对旧设计；新站源码为 `src/pages/index.astro`。Astro 构建不会将根目录旧页面复制到 `dist/`。

准备上线时：

1. 在开发分支运行 `npm run verify`，然后 `npm run preview` 检查首页、栏目、文章与手机宽度。
2. 检查 `git status` 和要提交的文件，确认都允许公开。提交源码与 `package-lock.json`，不要提交 `node_modules/`、`.astro/`、`dist/` 或本机缓存。
3. 将开发分支推送到 GitHub 并创建合入 `main` 的 PR。`feature/**` 分支推送和 PR 会运行检查，**不会部署**。
4. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。这是从旧版分支发布切换到 Astro 构建发布所需的一次性设置；准备正式上线时再改。
5. 若仓库的 `github-pages` Environment 设置了部署分支限制，确认允许 `main`。
6. 合并 PR 到 `main`。工作流先 `npm ci`，再 `npm run verify`，成功后上传 `dist/` 并部署。
7. 查看 Actions 的 `build` 和 `deploy` 都成功，再访问 <https://hunt-it-down.github.io> 核对上线结果。

工作流也支持手动运行；只有选择 `main` 才会部署。主分支检查失败不会执行部署。
不要把 feature 分支设为 Pages 发布源。首次切换 Pages Source 后若需重试，在 `main` 手动运行工作流。
本次本地迁移不自动提交、推送、合并，也不修改 GitHub 仓库设置。

## 6. 以后的发布流程

1. 在本地开发分支编辑 Markdown 和公开图片。
2. `npm run dev` 预览，`npm run verify` 检查。
3. 确认要提交的文件，提交并推送开发分支。
4. PR 检查通过后合入 `main`；GitHub 自动更新网站。

如果线上异常，优先回退引入问题的提交并重新运行 `main` 部署。不要直接修改 `dist/`。
删除已公开内容只能移除当前网站页面，不会自动抹掉 Git 历史或外部缓存。

## 7. 项目结构

```text
public/images/avatar.jpg          原首页头像，无损提取
src/
  content/{projects,notes,essays}  可公开 Markdown
  content.config.ts              Content Collections 与字段校验
  lib/content.ts                 栏目配置、排序、URL 与标签
  components/                    页头、页脚、文章列表
  layouts/                       通用页面、文章阅读模板
  pages/
    index.astro                  首页
    [collection]/index.astro     三类栏目共用列表路由
    [collection]/[...id].astro    三类栏目共用详情路由
    tags/                        标签索引与标签详情
    404.astro                    未找到页面
  styles/global.css              原站样式与阅读排版
scripts/check-site.mjs           构建产物与链接检查
.github/workflows/deploy.yml     检查与 main 部署
AGENTS.md                        后续开发约束与设计规范
index.html                       保留的迁移前页面，不作为新站入口
```

采用共用动态路由避免为三类文章重复维护页面模板；最终生成的仍是普通静态 HTML。
增加第四个栏目时，需要同时更新 `src/content.config.ts`、`src/lib/content.ts`，并按需要增加导航入口；写现有栏目文章不需要这些步骤。

## 8. 常见问题

- **看不到新文章**：确认在 `src/content/notes/` 等目录内、扩展名 `.md`，并检查终端的字段报错；生产预览需重新构建。
- **构建提示日期错误**：使用双引号包裹日期，如 `date: "2026-10-30"`，不要填不存在的日期。
- **图片本地可见，线上没有**：检查文件是否提交、路径大小写是否一致。GitHub 的 Linux 构建区分大小写。
- **提交后网站仍是旧主页**：检查 Pages Source 是否为 GitHub Actions、代码是否已合入 `main`、部署是否成功；再排除浏览器缓存。
- **依赖安装失败**：检查 Node 版本、网络和 npm 官方源访问。不要绕过锁文件随意升级全部依赖。
- **检查报 h1 重复**：模板已经生成文章标题；正文从 `##` 开始，不再添加 `#` 一级标题。

参考：[Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)、[GitHub Pages 部署](https://docs.astro.build/en/guides/deploy/github/)。
