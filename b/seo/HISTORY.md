# SEO 历史存档（自 SEO.md 拆出，2026-11-02 冻结）

> 本文件是 2026-09-21 审计与 2026-10-23 完成状态的历史记录，不再更新；当前状态看 STATUS.md，行动台账看 ACTIONS.md。

## 一、最高优先级

### 1. [已完成] 增加唯一的页面主标题 `h1`

早期版本曾计划在首页保留唯一的品牌 `<h1>`，但 2026-10-23 线上检查确认当时双语首页均无 `<h1>`，页面标题层级从 `<h2>` 开始。同日已恢复以下唯一文本主标题：

- English: `55AA Security Lab`
- 中文：`55AA 安全实验室`

标题采用克制的可见 hero 排版，研究简介保持为普通段落，后续 section 从 `<h2>` 展开。

### 2. [已完成] 优化页面 title

页面已使用包含站点品牌和页面主题的独立 title；后续新增页面应继续遵循相同规则。

建议：

```text
55AA Security Lab — System Security Research at Great Bay University
55AA 安全实验室｜大湾区大学系统安全研究
```

以后建立独立页面时，每个页面应有自己的 title，例如 `Teaching · 55AA Security Lab`。

### 3. [已完成] 优化 meta description

改造前的 description 过短。后续仍应自然地说明机构、所在地和研究主题。

中文示例：

```text
55AA 安全实验室位于大湾区大学，开展系统安全、软件安全、人工智能智能体、程序分析和安全工程研究。
```

英文示例：

```text
55AA Security Lab at Great Bay University conducts research in system security, software security, program analysis, AI agents, and security engineering.
```

### 4. [已完成] 增加 canonical、hreflang 和 sitemap

改造前 `/en/` 与 `/zh/` 页面缺少 canonical 和 `hreflang`；当前已经加入。实现形式如下：

```html
<link rel="canonical" href="https://www.55aaseclab.com/en/" />
<link rel="alternate" hreflang="en" href="https://www.55aaseclab.com/en/" />
<link rel="alternate" hreflang="zh" href="https://www.55aaseclab.com/zh/" />
<link rel="alternate" hreflang="x-default" href="https://www.55aaseclab.com/en/" />
```

如果正式站点使用自定义域名，应先将 `astro.config.mjs` 中的 `site` 改成正式域名。

已增加 `robots.txt`，并由 `scripts/generate-sitemap.mjs` 在每次构建前自动生成 `sitemap.xml`。Google Search Console 的站点验证与 sitemap 提交由站点所有者上线后完成。

## 二、页面结构

### 5. [已完成] 为主要内容建立独立 URL

改造前内容主要通过 hash tab 访问：

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

改造前 tab 使用 `<button>` 加 JavaScript 切换；当前导航已经使用带真实 `href` 的 `<a>`，主要内容可通过独立 URL 访问。

### 7. [已完成] 减少对客户端 JavaScript 的依赖

改造前首页 panel 默认 `display: none`，完整内容依赖 tab 状态切换；当前主要 section 已有独立页面，内容可以直接出现在静态 HTML 中。

## 三、动态内容

### 8. [已完成] GitHub Tools 在构建时解析

改造前 Tools 通过浏览器请求 GitHub API。API 请求可能限流或失败，搜索引擎也不一定执行客户端 JavaScript。

建议在构建阶段读取仓库 metadata 并生成静态 HTML，同时保留浏览器缓存作为更新机制。每个仓库最好有静态 fallback 名称和简介，保证 API 不可用时仍有可抓取内容。

### 9. [基础项已完成] DBLP Publications 在构建时生成

构建流程已将本地 DBLP XML 转换为 `src/data/dblp.json`，当前 16 条论文以静态 HTML 输出，搜索引擎不再依赖浏览器请求 RSS 才能看到论文。

剩余工作是稳定定时更新和失败缓存，补齐 DOI/论文 URL、代码与 artifact 链接，并为真实数据增加 `ScholarlyArticle` JSON-LD；DBLP 获取失败时不得编造论文信息或覆盖最后一次成功缓存。

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

### 15. [部分完成] 避免空简介和空链接

15 个 Projects 已有中英文介绍，但大多数尚未建立独立详情页或真实联系入口。Tools 仍有一项缺少 fallback description。对于暂时不完整的内容，应明确显示状态并避免空链接；`TBD` / `待定` 只能用于非索引草稿页，不应成为可索引页面的主要内容。

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

## 八、Search Console 首次收录记录（历史基线：2026-09-21）

截至 2026-09-21，Google 已收录以下核心页面：

```text
https://www.55aaseclab.com/en/
https://www.55aaseclab.com/zh/
https://www.55aaseclab.com/en/projects/
https://www.55aaseclab.com/zh/projects/
https://www.55aaseclab.com/en/publications/
https://www.55aaseclab.com/zh/publications/
```

这确认 sitemap、robots.txt、canonical、hreflang 和页面的 `index, follow` 配置已经能够支持 Google 抓取和收录。根地址 `/` 继续作为语言选择入口使用 `noindex`，不需要收录。

当时确定的下一项工作是：

1. 在 Google Search Console 继续观察 Page indexing 和 Search results，不再重复请求已收录 URL。
2. 一周后根据真实的展示、点击、查询和落地页数据，决定是否调整页面标题、描述或内容。

上述观察期现已完成，结果见文档开头的“首月 Search Console 基线”。当前行动以“当前行动清单”为准。

## 九、线上审计结果（2026-09-21）

已对 `https://www.55aaseclab.com/sitemap.xml` 中的 1482 个 URL 进行线上检查：

- Sitemap 返回 `200`，内容类型为 `application/xml`，全部 URL 使用正式 `https://www.55aaseclab.com/` 主机名。
- 1482 个 URL 首轮检查中唯一出现的 `503` 是临时响应；重试该课程页面三次均返回 `200`。
- 1482 个 URL 逐页检查均有 `<title>`、`meta description`、`meta robots="index, follow"` 和与当前 URL 一致的 canonical。
- `/en/`、`/zh/`、项目页和论文页的 canonical、`hreflang` 和 JSON-LD 均符合当前双语结构。
- `https://www.55aaseclab.com/` 返回 `200`；`http://www.55aaseclab.com/` 和旧的 `https://cyruscyliu.github.io/` 均跳转到正式 HTTPS 地址。
- 裸域 DNS 记录现已添加两条 GitHub Pages A 记录（`185.199.108.153`、`185.199.109.153`）；权威 DNS 和公共解析器已经返回记录，但部分本地递归 DNS 仍在缓存旧的 NXDOMAIN。裸域 HTTP 已由 GitHub 返回跳转到正式 HTTPS `www` 地址；裸域 HTTPS 证书仍等待 GitHub Pages 完成签发。由于 DNS 服务商只能添加两条记录，当前可用性正常但冗余低于 GitHub 推荐的四条 A 记录。
- 移动端 Lighthouse（`/en/`，2026-09-21）基线为：Performance 96、Accessibility 95、SEO 100；FCP 0.9 s、LCP 1.8 s、TBT 140 ms、CLS 0。此前发现的 `#777` 灰色标签对比度问题已改为 `#666`，重新测试的 color-contrast 审计通过。

除裸域 DNS 外，本次只读审计没有发现状态码、canonical、robots、sitemap 或页面 head 的系统性问题。

这是一个时间点审计，不代表这些结论永久有效。2026-10-23 已发现后续发布引入的 sitemap 博客 `404`、两个英文博客旧 URL 仍被 Search Console 记录、建设中课程占据约 98% sitemap，以及首页缺少 `<h1>` 等情况；sitemap 回归、课程索引供给和首页标题层级均已在同日修复，两个旧 URL 已确认永久弃用并保持 `404`，其余问题详见文档开头。

## 十、执行与复查规则

1. 严格按文档开头的“当前行动清单”逐项推进；完成一项、验证一项、记录一项。
2. 每次部署前运行完整构建；构建已自动验证所有 sitemap URL 与实际生成路由、canonical 和索引指令一致，失败时不得绕过检查上传 artifact。
3. 每次部署后抽查正式线上状态码、canonical、robots、hreflang、结构化数据和 sitemap；不得只检查本地 `dist`。
4. 修复技术问题后等待 Search Console 重新抓取，不反复提交已经正常收录的 URL。
5. 每月使用相同日期窗口导出 Search results、Page indexing、Sitemaps 和 Core Web Vitals，以保证数据可以环比。
6. 页面获得足够展示且已取得页面级查询数据后，再调整 title、description 和正文；避免在小样本下频繁改动。
