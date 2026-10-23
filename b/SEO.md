# 55AA Security Lab SEO 改进建议

本文记录实验室主页的 SEO 基线、首月效果、当前问题和后续行动。最上方的执行摘要与清单代表当前状态；后面的章节保留实现背景与 2026-09-21 历史审计，不能替代当前线上复核。

## 执行摘要（2026-10-23）

网站上线首月已经完成技术 SEO 冷启动：Google 能够发现页面、产生排名并带来少量真实点击。当前尚未完成业务 SEO 冷启动：所有点击仍集中在英文首页和 Qiang Liu 的 CV，课程、博客、项目、论文和工具还没有产生点击。

当前判断：

- **技术基础有效**：正式域名、HTTPS、robots、canonical、hreflang、独立 URL、静态内容和 Search Console 提交已经让站点进入搜索结果。
- **增长方向正常**：后 16 天展示量较前 16 天增长约 107%，点击由 3 增至 7。
- **主题权威尚未建立**：目前唯一得到充分验证的查询需求是 `Qiang Liu` 相关个人姓名词，而不是实验室品牌词或系统安全主题词。
- **索引供给失衡**：线上 sitemap 约 98% 是尚在建设中的课程和课次页面，它们取得了大量展示但没有点击。
- **首个发布回归已经修复**：2026-10-23 发现线上 sitemap 中 9 个博客详情 URL 重复包含语言目录并返回 `404`；同日已修复、部署并完成线上验收。
- **旧博客 URL 仍待处理**：两个已在 Search Console 获得展示的英文博客旧 URL 仍返回 `404`，需要恢复或配置真正的 `301`。
- **首页标题层级发生回归**：2026-10-23 线上检查确认 `/en/` 和 `/zh/` 都没有 `<h1>`，页面标题层级从多个 `<h2>` 开始。

## 首月 Search Console 基线

数据来源为 2026-10-23 导出的 Google Search Console Web 搜索效果。导出筛选器显示“最近 3 个月”，图表从 2026-09-20 开始但当日为零数据，实际展示从 2026-09-21 开始，最后一个数据日为 2026-10-21；10 月 22 日及之后的数据尚未进入导出。

### 全站结果

| 指标 | 首月结果 | 解释 |
| --- | ---: | --- |
| 点击 | 10 | 已有真实自然搜索访问，但样本仍很小 |
| 展示 | 501 | 已完成零曝光阶段 |
| CTR | 2.00% | 暂不单独评价；查询结构和排名仍在快速变化 |
| 平均排名 | 10.22 | 处于第一页末端至第二页开头，页面与查询之间差异很大 |
| 出现过展示的 URL | 252 | 说明 Google 已发现较多页面；不等于实际收录页面数 |
| 有点击的 URL | 2 | 英文首页与 CV |

### 前后半月趋势

| 时间段 | 点击 | 展示 | CTR | 平均排名 | 日均展示 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 2026-09-20 至 2026-10-05 | 3 | 163 | 1.84% | 8.77 | 10.19 |
| 2026-10-06 至 2026-10-21 | 7 | 338 | 2.07% | 10.92 | 21.12 |

后半月平均排名变低不应直接解释为已有页面退步。Google 后半月开始测试更多课程、课次和长尾查询，新进入统计的低位排名会拉低全站平均值。现阶段更重要的信号是展示和点击同时增长。

### 主要落地页

| 页面 | 点击 | 展示 | CTR | 平均排名 |
| --- | ---: | ---: | ---: | ---: |
| `/en/` | 8 | 63 | 12.70% | 7.98 |
| `/Qiang_s_CV.pdf` | 2 | 39 | 5.13% | 10.10 |
| `/zh/blog/gbu-hit-2027-joint-phd-admissions/` | 0 | 40 | 0% | 8.65 |
| `/en/publications/` | 0 | 37 | 0% | 13.27 |
| `/en/tools/` | 0 | 20 | 0% | 6.70 |
| `/zh/blog/gbu-sustech-2027-joint-master-admissions/` | 0 | 13 | 0% | 5.69 |
| `/zh/` | 0 | 13 | 0% | 7.85 |
| `/zh/blog/55aa-technology-readiness-levels/` | 0 | 12 | 0% | 3.50 |
| `/zh/projects/` | 0 | 9 | 0% | 2.44 |

### 查询、语言和设备信号

- `qiang liu epfl`：3 次点击、13 次展示、CTR 23.08%、平均排名 2.85。
- `qiang liu meta`：0 次点击、15 次展示、平均排名 5.27。
- 查询表只披露了 41/501，即约 8.2% 的展示；其余查询因低频或隐私限制未显示，因此不能把已披露查询当成全部需求。
- 页面维度中，英文页面获得 318 次展示和 8 次点击，中文页面获得 364 次展示但尚无点击，PDF 获得 39 次展示和 2 次点击。
- 桌面端获得 441 次展示和全部 10 次点击；移动端只有 57 次展示。样本不足，不能据此认定移动端体验存在问题。
- Search appearance 导出为空，尚未出现 Search Console 可报告的富结果类型；这不等于结构化数据无效。
- 页面维度展示合计为 721，高于全站 501，属于 Search Console 的正常统计口径：一次搜索可能同时展示同一站点的多个 URL，按页面拆分时会分别计数。

## 本轮发现的问题与处理状态（2026-10-23）

### P0-1：[已修复并上线] sitemap 中的博客详情 URL 全部错误

2026-10-23 修复前的线上只读检查显示：

- 线上 sitemap 含 1485 个 URL。
- 其中课程相关 URL 1454 个，课次 URL 1408 个。
- sitemap 含 11 个博客 URL；2 个博客列表页返回 `200`，9 个博客详情 URL 全部返回 `404`。
- 错误 URL 重复包含语言目录，例如 `/zh/blog/zh/.../` 和 `/en/blog/en/.../`。
- 正确博客 URL 本身返回 `200`，并且部分页面已经通过内部链接获得 Search Console 展示。

根因位于 `scripts/generate-sitemap.mjs`：`src/data/blog.json` 中的条目已经带有 `zh/` 或 `en/`，生成器又在前面拼接了一次语言代码。

同日已通过 commit `a90954d` 修复并由 GitHub Pages workflow `39960040584` 部署。线上复查确认：标准 `/sitemap.xml` 返回 `200` 和 `application/xml`，内容与构建产物完全一致；1485 个 URL 全部唯一，不再包含重复语言目录；9 个正确博客详情页全部返回 `200`，canonical 指向自身并输出 `index, follow`。原错误路径仍返回 `404`，但已不再被 sitemap 引用。

### P0-2：两个已有展示的英文博客旧 URL 失效

Search Console 已记录以下旧 URL 的展示：

```text
/en/blog/55aa-member-process-management-en/
/en/blog/55aa-research-project-process-management-en/
```

它们目前返回 `404`；新的无 `-en` URL 返回 `200`。必须恢复旧 URL，或将旧 URL 以真正的 `301` 重定向至新 URL。以后公开 URL 一旦被搜索引擎发现，不得在没有重定向的情况下改名。

### P0-3：课程页面数量与成熟度不匹配

- 22 门课程中，21 门状态为 `Under development`，1 门为 `Placeholder`，没有正式发布课程。
- sitemap 中 1454/1485，即约 97.9% 的 URL 是课程相关页面；1408/1485，即约 94.8% 是课次页面。
- Search Console 中出现过展示的课程与课次 URL 共 221 个，获得 383 次页面级展示和 0 次点击。
- 非课程页面只有 31 个，却获得 338 次页面级展示和全部 10 次点击。

这不是典型的抓取预算问题，而是索引质量和优先级问题。建设中页面可以继续对直接访问者开放，但在达到发布标准前不应占据几乎全部 sitemap，也不应全部输出 `index, follow`。

### P0-4：个人搜索需求没有落到最合适的页面

`/en/people/qiang-liu/` 和 `/zh/people/qiang-liu/` 已经存在，但不在当前 sitemap 中，也没有出现在本次 Search Console 页面数据里。个人详情页 description 目前只有 `Principal Investigator`，不足以承接已经出现的姓名、EPFL 和研究方向查询。CV 已产生流量，但 PDF 缺少 Title、Author、Subject 等文档元数据。

### P1-1：首页缺少一级标题

2026-10-23 线上检查确认英文和中文首页均没有 `<h1>`，页面从多个 `<h2>` 开始。`55AA Security Lab` 目前只出现在带 alt 的 logo 和页面 title 中。应在首页恢复一个真实的文本 `<h1>`；可以保持克制的视觉尺寸或使用可靠的 visually-hidden 样式，但不能用图片 alt 完全替代文档主标题。

## 当前完成状态（2026-10-23）

以下工作已经完成：

- [x] 确定长期正式域名 `https://www.55aaseclab.com/`，配置 DNS、HTTPS、GitHub Pages custom domain 和 `CNAME`。
- [x] 在 Google Search Console 验证 Domain property 和正式 HTTPS URL-prefix property，并提交 sitemap。
- [x] 全站共享 title、description、canonical、双语 hreflang、Open Graph、Twitter Card 和 `index, follow`。
- [x] 配置 robots.txt 和构建时自动生成的 sitemap.xml。
- [x] sitemap 自动验收已接入 `npm run build`：逐项检查 URL 唯一性、正式域名、生成文件、canonical 和 `noindex`，失败会阻止 Pages artifact 上传。
- [x] 项目和 GitHub Pages 工作流已统一到 Node.js 24；官方 Actions 已升级到原生 Node 24 的稳定主版本。
- [x] 为 People、Courses、Projects、Publications、Tools、Blog、Consultation 和 Sponsorship 建立独立 URL。
- [x] 导航使用真实链接，主要内容可以在静态 HTML 中抓取。
- [x] 首页 `ResearchOrganization`、People `Person`、课程 `Course`、课次 `LearningResource` 和博客 `Article` JSON-LD。
- [x] GitHub Tools metadata 在构建时解析，并有静态 fallback 和缓存。
- [x] DBLP XML 已在构建时转换为 16 条静态论文 HTML；浏览器不再需要动态请求 DBLP 才能看到论文。
- [x] 15 个 Projects 已有中英文项目介绍；仍需补齐详情页、阶段、先修要求、时间、联系人和 CTA。
- [x] 已记录首月 Search Console 基线：501 次展示、10 次点击、CTR 2.00%、平均排名 10.22。
- [x] 已记录 2026-09-21 移动端 Lighthouse 基线：Performance 96、Accessibility 95、SEO 100、LCP 1.8 秒、CLS 0。

## 当前行动清单

以下清单是当前唯一的执行顺序。完成一项并验证后再进入下一项。

### P0：立即处理

- [x] **步骤 1：修复 sitemap 博客路径生成逻辑。** 2026-10-23 已修复、部署并通过本地与线上验收：sitemap 的 1485 个 URL 全部唯一且对应生成页面，canonical 全部一致；9 个博客详情 URL 与 Markdown frontmatter 完全一致、线上均返回 `200`，不再出现重复语言目录。
- [x] **步骤 2：加入 sitemap 自动验收。** 2026-10-23 已将 `scripts/validate-sitemap.mjs` 接入生产构建：所有 `<loc>` 必须唯一、使用正式域名、不含 query/fragment、对应 `dist` 中的生成文件；HTML 页面必须只有一个与 `<loc>` 一致的 canonical，且不得声明 `noindex`。4 个自动测试覆盖正常页面、重复 URL、缺少生成文件、canonical 不一致和 `noindex`；Node.js 24.22.1 下的完整构建已验证 1485/1485 个 URL。代码待推送后还需确认 GitHub Actions 实际运行成功。
- [ ] **步骤 3：处理两个英文博客旧 URL。** 恢复原 URL，或配置旧 URL 到新 URL 的 `301`；同步 canonical、sitemap 和内部链接。
- [ ] **步骤 4：定义课程索引门槛。** 只有正式发布、没有 TBD/placeholder、具有真实课程材料且能满足独立搜索意图的课程和课次才进入 sitemap。
- [ ] **步骤 5：为共享 SEO head 增加可配置 robots。** 建设中课程与课次输出 `noindex, follow` 并从 sitemap 移除；不要用 robots.txt 阻止 Google 读取 `noindex`。
- [ ] **步骤 6：把双语 Qiang Liu 个人详情页加入 sitemap。** 优化个人页 title、description、`Person` JSON-LD、内部链接和 CV 元数据；姓名中文写法、当前/未来机构身份必须由本人确认。
- [ ] **步骤 7：恢复首页唯一文本 `<h1>`。** 英文使用 `55AA Security Lab`；中文名称使用经过确认的正式表述，后续 section 继续使用 `<h2>`。
- [ ] **步骤 8：取得 Search Console Page indexing 和 Sitemaps 数据。** 记录实际索引数，以及 `Crawled - currently not indexed`、`Discovered - currently not indexed`、重复网页和 404 等原因。

### P1：未来 2 至 4 周

- [ ] 分别筛选并导出重点页面的 Queries：英文首页、CV、中文博士招生、中文硕士招生、英文 Publications、英文 Tools、中文技术成熟度文章和中文 Projects。
- [ ] 根据真实页面级查询优化 title、description 和正文；不得根据想象添加关键词，也不使用 `meta keywords`。
- [ ] 建立长期有效的实验室招生/加入页面，将已截止的年度招生文章标明状态并导向长期页面。
- [ ] 优化 Tools：补充适用场景、文档、关联论文、许可证、维护状态、示例和截图；当前仍有一个工具缺少 fallback description。
- [ ] 优化 Publications：增加代表作、研究主题、获奖、代码与 artifact 链接，并为真实论文增加 `ScholarlyArticle` JSON-LD。
- [ ] 优化 Projects：优先为实际招募或已有成果的项目建立详情页，补充适用学生、先修要求、阶段、开始时间、招募状态、联系人和 CTA。
- [ ] 为确实互为翻译的博客建立显式映射并输出 hreflang；单一语言文章不得虚构 alternate。
- [ ] 为 News 建立独立、稳定的详情 URL，并增加 `NewsArticle` JSON-LD、canonical、发布日期和独立描述。
- [ ] 为课程依赖图提供等价的可索引文本关系。

### P2：持续建设

- [ ] 建立三类内容集群：个人与实验室实体、论文与工具资产、招生与研究项目。
- [ ] 争取正式机构页、EPFL/HexHive、DBLP、ORCID、Google Scholar、GitHub、论文与 artifact 页的高质量外链。
- [ ] 为 Consultation 补充真实预约入口、适用对象、交付范围和 CTA。
- [ ] 扩充首页实验室简介，明确所在地、合作/学生咨询方式以及论文、工具和研究资产入口；涉及机构隶属和未来身份的表述必须有公开授权。
- [ ] 建立并执行中英文术语表，重点统一 `system security`、`software security`、`software assurance`、`AI agents` 和 `agentic systems`。
- [ ] 用真实社交账号、链接和准确 alt 文本替换剩余 placeholder。
- [ ] 建立月度 SEO 记录和站内转化跟踪：索引、展示、点击、CTR、查询、落地页、404、Core Web Vitals、邮件点击、CV 下载、GitHub 出站、招生与合作咨询。

## 当前阶段的成功标准

下一阶段不以“继续增加 URL”或“全站平均排名上升”作为主要成功标准，而观察：

1. sitemap 中的 URL 全部返回 `200`，并且只包含希望被索引的 canonical 页面。
2. 建设中课程退出 sitemap，并在发布前保持 `noindex, follow`。
3. Qiang Liu 姓名查询开始由个人 HTML 页面承接，而不是主要落在通用首页或 PDF。
4. Tools、Publications、Projects 或招生页面获得首批非姓名词点击。
5. Search Console 中 sitemap 发现数、实际索引数和未索引原因可以按月对比。
6. 自然搜索开始带来可测量的 CV 下载、GitHub 出站、邮件、招生或合作行为。

后续章节保留背景、历史建议和验收说明；如与上方当前清单冲突，以当前清单为准。

## 一、最高优先级

### 1. [回归待修复] 增加唯一的页面主标题 `h1`

早期版本曾计划在首页保留唯一的品牌 `<h1>`，但 2026-10-23 线上检查确认当前双语首页均无 `<h1>`，页面标题层级从 `<h2>` 开始。应恢复唯一文本主标题：

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

这是一个时间点审计，不代表这些结论永久有效。2026-10-23 已发现后续发布引入的 sitemap 博客 `404`、英文博客旧 URL 失效和首页缺少 `<h1>` 等回归；其中 sitemap 回归已在同日修复并上线，其余问题详见文档开头。

## 十、执行与复查规则

1. 严格按文档开头的“当前行动清单”逐项推进；完成一项、验证一项、记录一项。
2. 每次部署前运行完整构建；构建已自动验证所有 sitemap URL 与实际生成路由、canonical 和索引指令一致，失败时不得绕过检查上传 artifact。
3. 每次部署后抽查正式线上状态码、canonical、robots、hreflang、结构化数据和 sitemap；不得只检查本地 `dist`。
4. 修复技术问题后等待 Search Console 重新抓取，不反复提交已经正常收录的 URL。
5. 每月使用相同日期窗口导出 Search results、Page indexing、Sitemaps 和 Core Web Vitals，以保证数据可以环比。
6. 页面获得足够展示且已取得页面级查询数据后，再调整 title、description 和正文；避免在小样本下频繁改动。
