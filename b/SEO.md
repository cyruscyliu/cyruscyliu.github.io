# 55AA Security Lab SEO 改进建议

本文记录实验室主页当前的 SEO 分析和后续建议。建议按优先级逐项实施。

## 当前完成状态（2026-09-15）

以下项目已经在代码中完成并通过 `npm run build` 验证：

- [x] 唯一品牌主标题与语义化结构（首页保留 `55AA Security Lab`，子页面不再重复显示与 tab 相同的标题）。
- [x] 页面 title 与 meta description。
- [x] 共享 SEO head：全站页面统一输出 title、description、canonical、双语 hreflang、Open Graph 和 Twitter Card。
- [x] robots.txt 和构建时自动生成的 sitemap.xml；当前覆盖全部 24 个静态 URL，并为每个双语页面声明 alternate。
- [x] Open Graph、Twitter Card 和 `public/logo-lockup.svg`。
- [x] 首页 `ResearchOrganization` 和博客文章 `Article` JSON-LD。
- [x] News/Blog 列表页和博客文章独立 URL。
- [x] People、Teaching、Projects、Publications、Tools、Consultation、Sponsorship 独立 URL。
- [x] 导航 tab 使用真实链接，并根据当前 URL 显示选中状态。
- [x] Tools 的 GitHub metadata fallback、浏览器缓存和定期 metadata 检查工作流。

## 尚未完成的工作

以下项目按建议实施顺序排列。带“外部操作”的项目需要站点所有者提供域名、账号或真实资料，代码本身不能独立完成。

### P0：正式发布与效果监测

- [ ] 确定长期正式域名。首选向学校申请 `55aa.gbu.edu.cn`；若暂时无法申请，再选择实验室独立域名。域名确定前不要在多个临时域名之间反复迁移。
- [ ] 将站点 URL 集中为单一配置来源。目前 Astro 页面优先使用 `Astro.site`，但 sitemap 生成脚本和部分 JSON-LD 仍含 `https://cyruscyliu.github.io`。正式域名确定后需要统一移除硬编码。
- [ ] 配置 GitHub Pages custom domain、DNS、HTTPS 和 `CNAME`，并验证旧 `cyruscyliu.github.io` URL 是否按原路径永久跳转到新域名。
- [ ] 在 Google Search Console 验证正式站点并提交 `/sitemap.xml`。（外部操作）
- [ ] 在 Bing Webmaster Tools 验证或从 Search Console 导入站点，并提交同一个 sitemap。（外部操作）
- [ ] 使用 URL Inspection 抽查首页、中英文页、People、Tools、Publications 和博客文章，确认 Google-selected canonical 与站点声明一致。（外部操作）
- [ ] 建立月度 SEO 记录：收录页面数、展示、点击、CTR、主要查询、主要落地页、404 和 Core Web Vitals。

### P1：可索引内容与结构化数据

- [ ] 将 DBLP RSS 在构建或定时工作流中解析为静态论文 HTML，并保留最近一次成功缓存；当前按要求暂时跳过该问题。
- [ ] 为静态论文数据增加真实的 `ScholarlyArticle` JSON-LD，包括标题、作者、venue、年份、DOI/URL；不得在 DBLP 数据不可用时编造。
- [ ] 为 People 页面中的成员增加 `Person` JSON-LD，并使用真实的职务、所属机构和 `sameAs` 链接。
- [ ] 为每条 News 建立独立、稳定的中英文详情 URL；目前只有 News 列表页。
- [ ] 新闻详情页增加 `NewsArticle` JSON-LD、canonical、hreflang、发布日期和独立描述。
- [ ] 为 Mermaid 课程依赖图提供等价的可索引文本关系，确保不执行图形脚本时仍能理解课程先修关系。

### P2：内容质量与转化

- [ ] 用真实项目介绍替换 Projects 中的 `TBD/待定`，至少说明目标、阶段、适用学生、先修知识、预计开始时间和招募状态。
- [ ] 为课程补充真实简介、先修课、预计开课时间和课程网站；CTA 必须是每个课程 item 自己的 metadata，而不是 section metadata。
- [ ] 为每个 Tool 补充适用场景、文档、论文、许可证和维护状态；GitHub metadata 只能作为补充，不能代替实验室自己的说明。
- [ ] 为三个 Consultation item 补充各自真实的预约入口、适用对象和交付范围；CTA 必须属于具体 item。
- [ ] 扩充首页实验室简介，明确所在地、合作/学生咨询方式以及论文、工具和研究资产入口，同时保持克制、避免口号式文案。
- [ ] 建立并执行中英文术语表，重点保持 `system security` 等核心术语一致。

### P3：真实入口与发布质量

- [ ] 用真实交流群、Bilibili、小红书和 infosec.exchange 二维码替换 placeholder，并同时提供可点击链接和准确 alt 文本。（需要真实账号/二维码）
- [ ] 部署后执行一次全站线上审计：状态码、404、资源路径、robots、sitemap、canonical、hreflang、结构化数据和移动端表现。
- [ ] 使用 PageSpeed Insights 或 Lighthouse 记录性能基线，重点观察 Three.js hero 的 JavaScript 体积、LCP、INP 和 CLS。
- [ ] 根据 Search Console 中真实出现的查询优化 title、description 和正文，不使用臆测关键词或 `meta keywords`。

仍待完成或需要外部服务支持的项目见下方各节；以上清单是当前唯一的执行状态摘要，下方章节保留背景、验收标准和实现说明。

## 一、最高优先级

### 1. [已完成] 增加唯一的页面主标题 `h1`

首页保留唯一的品牌 `<h1>` `55AA Security Lab`；各独立 section 页面隐藏与导航重复的视觉标题，避免页面内容重复。

建议增加唯一的主标题：

- English: `55AA Security Lab`
- 中文：`55AA 安全实验室`

视觉上不需要制作成大型 hero 标题，可以保持现有朴素排版。

### 2. [已完成] 优化页面 title

页面已使用包含站点品牌和页面主题的独立 title；后续新增页面应继续遵循相同规则。

建议：

```text
55AA Security Lab — System Security Research at Great Bay University
55AA 安全实验室｜大湾区大学系统安全研究
```

以后建立独立页面时，每个页面应有自己的 title，例如 `Teaching · 55AA Security Lab`。

### 3. [已完成] 优化 meta description

当前 description 过短。建议自然地说明机构、所在地和研究主题。

中文示例：

```text
55AA 安全实验室位于大湾区大学，开展系统安全、软件安全、人工智能智能体、程序分析和安全工程研究。
```

英文示例：

```text
55AA Security Lab at Great Bay University conducts research in system security, software security, program analysis, AI agents, and security engineering.
```

### 4. [已完成] 增加 canonical、hreflang 和 sitemap

目前 `/en/` 与 `/zh/` 页面缺少 canonical 和 `hreflang`。建议为每种语言页面加入：

```html
<link rel="canonical" href="https://cyruscyliu.github.io/en/" />
<link rel="alternate" hreflang="en" href="https://cyruscyliu.github.io/en/" />
<link rel="alternate" hreflang="zh" href="https://cyruscyliu.github.io/zh/" />
<link rel="alternate" hreflang="x-default" href="https://cyruscyliu.github.io/en/" />
```

如果正式站点使用自定义域名，应先将 `astro.config.mjs` 中的 `site` 改成正式域名。

已增加 `robots.txt`，并由 `scripts/generate-sitemap.mjs` 在每次构建前自动生成 `sitemap.xml`。Google Search Console 和 Bing Webmaster Tools 的站点验证与提交由站点所有者上线后完成。

## 二、页面结构

### 5. [已完成] 为主要内容建立独立 URL

当前内容主要通过 hash tab 访问：

```text
/en/#people
/en/#teaching
/en/#projects
```

建议逐步建立独立路径：

```text
/en/people/
/en/teaching/
/en/projects/
/en/publications/
/en/tools/
/en/blog/
/en/consultation/
/en/sponsorship/
```

首页可以保留摘要和 `Read more`，完整内容放在独立页面中。独立页面更适合收录、分享和外部引用。

### 6. [已完成] 导航使用链接

当前 tab 使用 `<button>` 加 JavaScript 切换。建议最终使用带真实 `href` 的 `<a>`，至少应能直接访问对应内容页面。

### 7. [已完成] 减少对客户端 JavaScript 的依赖

当前 panel 默认 `display: none`，完整内容依赖 tab 状态切换。独立页面可以让主要内容直接出现在 HTML 中，降低抓取和可访问性风险。

## 三、动态内容

### 8. [已完成] GitHub Tools 在构建时解析

Tools 当前通过浏览器请求 GitHub API。API 请求可能限流或失败，搜索引擎也不一定执行客户端 JavaScript。

建议在构建阶段读取仓库 metadata 并生成静态 HTML，同时保留浏览器缓存作为更新机制。每个仓库最好有静态 fallback 名称和简介，保证 API 不可用时仍有可抓取内容。

### 9. DBLP Publications 应在构建时生成

DBLP 当前通过浏览器请求 RSS，搜索引擎可能只看到 `Loading DBLP publications…`。

建议构建时读取 RSS，生成论文标题、作者、会议和年份的静态 HTML；可以通过定期构建任务每日或每周更新，并保留最近一次成功缓存。

## 四、多语言和结构化数据

### 10. [已完成] 增加 Open Graph 和 Twitter Card

建议增加：

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="55AA Security Lab" />
<meta property="og:description" content="..." />
<meta property="og:url" content="..." />
<meta property="og:image" content="..." />
<meta name="twitter:card" content="summary" />
```

建议制作尺寸为 `1200×630` 的统一分享图。

### 11. [部分完成] 增加 JSON-LD

建议加入以下 Schema.org 类型：

- `ResearchOrganization`：实验室、所属大学、地址和邮编
- `Person`：成员、职务、所属机构和 `sameAs` 链接
- `ScholarlyArticle`：论文标题、作者、会议或期刊、年份和 DOI
- `Article` 或 `NewsArticle`：博客和新闻

实验室地址信息：

```text
广东省东莞市松山湖大学路 16 号大湾区大学（松山湖校区）
邮编 523808
```

## 五、内容质量

### 12. [部分完成] News 和 Blog 使用独立文章页面

博客文章已有独立详情页；News 当前只有独立列表页，每条新闻仍需建立详情页。每篇新闻和博客建议有独立 slug、日期、`<article>` 和合理的标题层级。日期应使用：

```html
<time datetime="YYYY-MM-DD">...</time>
```

### 13. [部分完成] 增加清晰的实验室简介

首页应回答以下问题：

- 55AA Security Lab 是什么
- 隶属于哪个机构
- 位于哪里
- 研究哪些问题
- 是否接受合作或学生咨询
- 代码、论文和研究资产在哪里

自然语言介绍比单独罗列关键词更有助于搜索引擎理解站点主题。

### 14. 统一英文术语

建议建立术语表并保持全站一致，例如：

- `system security` / `system security`
- `software security` / `software assurance`
- `AI agents` / `agentic systems`
- `POC generation`
- `security engineering`

### 15. [已完成] 避免空简介和空链接

项目或工具暂时没有简介时，页面显示本地化的 `TBD` / `待定`，不会渲染空段落。暂时没有链接的项目也应明确显示状态，避免产生空链接。

## 六、图片、二维码和可访问性

### 16. [已完成] 补充有意义的 alt 文本

装饰性 55AA logo 使用 `alt=""` 并由相邻文字提供名称；GBU logo 使用准确的品牌 alt；人物照片使用数据中的双语描述性 alt；Hero 的 Canvas/SVG 视觉层置于 `aria-hidden="true"`，不会干扰读屏内容。

### 17. 用真实二维码替换 placeholder

正式发布时应使用真实二维码，并添加说明性 alt，例如：

```html
<img src="/qr/mastodon.png" alt="55AA Security Lab on infosec.exchange" />
```

同时为社交媒体提供实际链接。

## 七、部署和验证

上线后应检查：

- `/en/` 和 `/zh/` 返回 200
- 主要静态资源没有 404
- robots.txt 和 sitemap 可访问
- 没有误加 `noindex`
- canonical 和 hreflang 指向正确域名
- GitHub Pages 的路径与 Astro `base` 配置一致
- Google Search Console 中没有重复页面或结构化数据错误

## 推荐实施顺序

1. 确定正式域名并完成域名迁移。
2. 在 Google Search Console 和 Bing Webmaster Tools 验证站点、提交 sitemap。
3. 部署后检查 24 个现有 URL、重定向、canonical、hreflang 和结构化数据。
4. 为 News 建立独立详情页并增加 `NewsArticle` JSON-LD。
5. 补齐 Projects、Teaching、Tools 和 Consultation 的真实 item metadata 与正文。
6. 为 People 增加真实 `Person` JSON-LD。
7. 在 DBLP 获取链路稳定后，将论文列表静态化并增加 `ScholarlyArticle` JSON-LD。
8. 替换真实二维码和社交入口。
9. 建立性能基线和月度 SEO 效果记录。
10. 根据 Search Console 的真实查询和落地页数据持续调整内容。
