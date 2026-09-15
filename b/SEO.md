# 55AA Security Lab SEO 改进建议

本文记录实验室主页当前的 SEO 分析和后续建议。建议按优先级逐项实施。

## 当前完成状态（2026-09-15）

以下项目已经在代码中完成并通过 `npm run build` 验证：

- [x] 唯一品牌主标题与语义化结构（首页保留 `55AA Security Lab`，子页面不再重复显示与 tab 相同的标题）。
- [x] 页面 title 与 meta description。
- [x] canonical、hreflang、robots.txt 和 sitemap.xml。
- [x] Open Graph、Twitter Card 和 `public/og-image.svg`。
- [x] ResearchOrganization、Article 等 JSON-LD 结构化数据。
- [x] News/Blog 独立 URL 和博客文章页面。
- [x] People、Teaching、Projects、Publications、Tools、Consultation、Sponsorship 独立 URL。
- [x] 导航 tab 使用真实链接，并根据当前 URL 显示选中状态。
- [x] Tools 的 GitHub metadata fallback、浏览器缓存和定期 metadata 检查工作流。

仍待完成或需要外部服务支持的项目见下方各节，尤其是 DBLP 构建时抓取、真实二维码、Search Console/Bing 提交，以及正式部署后的线上验证。

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

同时增加 `robots.txt` 和自动生成的 `sitemap.xml`，并提交到 Google Search Console 和 Bing Webmaster Tools。

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

### 8. GitHub Tools 应在构建时解析

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

### 11. [已完成] 增加 JSON-LD

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

### 12. [已完成] News 和 Blog 使用独立文章页面

每篇新闻和博客建议有独立 slug、日期、`<article>` 和合理的标题层级。日期应使用：

```html
<time datetime="YYYY-MM-DD">...</time>
```

### 13. 增加清晰的实验室简介

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

### 16. 补充有意义的 alt 文本

装饰性 Logo 可以使用 `alt=""`，独立品牌 Logo 和人物照片应有准确描述性 alt 文本。

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

1. 增加 `h1`
2. 优化 title 和 meta description
3. 增加 canonical、hreflang、Open Graph
4. 增加 robots.txt 和 sitemap
5. 将 GitHub Tools 改为构建时静态解析，并保留 fallback
6. 将 DBLP 论文改为构建时静态生成
7. 为 Projects、Publications、Blog 建立独立页面
8. 增加 Organization、Person、ScholarlyArticle JSON-LD
9. 补齐项目简介、图片 alt 和真实二维码
10. 部署后使用 Search Console 验证收录情况
