# 55AA Security Lab SEO 改进建议

本文记录实验室主页的 SEO 基线、首月效果、当前问题和后续行动。最上方的执行摘要与清单代表当前状态；后面的章节保留实现背景与 2026-09-21 历史审计，不能替代当前线上复核。

## 执行摘要（2026-10-23）

网站上线首月已经完成技术 SEO 冷启动：Google 能够发现页面、产生排名并带来少量真实点击。当前尚未完成业务 SEO 冷启动：所有点击仍集中在英文首页和 Qiang Liu 的 CV，课程、博客、项目、论文和工具还没有产生点击。

当前判断：

- **技术基础有效**：正式域名、HTTPS、robots、canonical、hreflang、独立 URL、静态内容和 Search Console 提交已经让站点进入搜索结果。
- **增长方向正常**：后 16 天展示量较前 16 天增长约 107%，点击由 3 增至 7。
- **主题权威尚未建立**：目前唯一得到充分验证的查询需求是 `Qiang Liu` 相关个人姓名词，而不是实验室品牌词或系统安全主题词。
- **课程索引供给已收敛**：上线首月 sitemap 约 98% 是尚在建设中的课程和课次页面，它们取得了大量展示但没有点击。2026-10-23 已将 Courses 整体标记为建设中：1,454 个双语课程相关页面继续开放访问，但全部输出 `noindex, follow` 并退出 sitemap；sitemap 从 1,485 个 URL 收敛为 31 个。
- **首个发布回归已经修复**：2026-10-23 发现线上 sitemap 中 9 个博客详情 URL 重复包含语言目录并返回 `404`；同日已修复、部署并完成线上验收。
- **旧博客 URL 已明确弃用**：两个曾在 Search Console 获得展示的英文博客旧 URL 没有外链，也不需要兼容；保持 `404`，不恢复页面、不配置 `301`，并只在 canonical、sitemap 和内部链接中使用新 URL。
- **个人姓名搜索入口已完成优化**：双语刘强（Qiang Liu）详情页已加入 sitemap；页面使用独立 title、description 和完整 `Person` JSON-LD，CV PDF 已补齐文档元数据。当前任职表述为 EPFL/HexHive 博士后，未来任职表述为 2027 年 1 月加入大湾区大学（Great Bay University，GBU）。
- **首页标题层级回归已修复**：双语首页已恢复可见且唯一的文本 `<h1>`；英文为 `55AA Security Lab`，中文为经过确认的“55AA 安全实验室”，后续 section 继续使用 `<h2>`。

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

### P0-2：两个已有展示的英文博客旧 URL 已弃用

Search Console 已记录以下旧 URL 的展示：

```text
/en/blog/55aa-member-process-management-en/
/en/blog/55aa-research-project-process-management-en/
```

它们目前返回 `404`；新的无 `-en` URL 返回 `200`。2026-10-23 已确认旧 URL 没有外链，且不考虑旧地址兼容，因此决定永久弃用旧 URL：不恢复页面、不配置 `301`，继续返回 `404`，由搜索引擎自然移除。canonical、sitemap 和内部链接只使用新 URL。以后只有旧 URL 已获得外链、真实用户访问或稳定搜索价值时，才将 URL 改名作为迁移处理并配置 `301`。

### P0-3：课程页面数量与成熟度不匹配

- 22 门课程中，21 门状态为 `Under development`，1 门为 `Placeholder`，没有正式发布课程。
- 调整前的 sitemap 中 1454/1485，即约 97.9% 的 URL 是课程相关页面；1408/1485，即约 94.8% 是课次页面。
- Search Console 中出现过展示的课程与课次 URL 共 221 个，获得 383 次页面级展示和 0 次点击。
- 非课程页面只有 31 个，却获得 338 次页面级展示和全部 10 次点击。

这不是典型的抓取预算问题，而是索引质量和优先级问题。建设中页面可以继续对直接访问者开放，但在达到发布标准前不应占据几乎全部 sitemap，也不应全部输出 `index, follow`。

2026-10-23 已按“整体建设中”处理：课程首页、22 门课程详情和 704 个课次的中英文页面仍然生成并可直接访问，但 1,454 个页面全部输出 `noindex, follow`，且不再出现在 sitemap。课程页面没有被 robots.txt 阻止，因此搜索引擎可以读取 `noindex` 并逐步移除已经发现的 URL。

课程索引采用显式白名单，未设置字段或字段不是布尔值 `true` 时一律视为未发布：

- 课程首页只有在 `courses.json` 的 `meta.indexable` 为 `true` 时才允许索引。
- 单门课程只有在课程对象的 `indexable` 为 `true` 时才允许索引。
- 单个课次必须同时满足父课程 `indexable: true` 和课次自身 `indexable: true`；发布课程不会自动发布其批量生成的课次。

以后发布单门课程时再逐门审核。课程页至少需要正式发布状态、完成中英文内容审核、移除 TBD/placeholder、提供完整大纲和真实课程材料，并能够满足独立搜索意图；课次页还必须经过逐页人工审核，移除占位 Slides、占位视频和模板化材料。审核通过后才设置显式索引标记并重新进入 sitemap。

### P0-4：[已修复并上线] 个人搜索需求没有落到最合适的页面

`/en/people/qiang-liu/` 和 `/zh/people/qiang-liu/` 原本已经存在，但不在 sitemap 中，也没有出现在本次 Search Console 页面数据里。个人详情页 description 原本只有 `Principal Investigator`，不足以承接已经出现的姓名、EPFL 和研究方向查询。CV 已产生流量，但 PDF 原本缺少 Title、Author、Subject 等文档元数据。

2026-10-23 已确认中文正式姓名为“刘强”，新单位的正式写法为“大湾区大学 / Great Bay University / GBU”。本次据此完成以下调整：

- 双语个人详情页加入 sitemap，sitemap 由 31 个 URL 增至 33 个；两页均保留自引用 canonical、双语 hreflang 和 `index, follow`。
- 英文页使用 `Qiang Liu`，中文页使用“刘强”，并以 `alternateName` 在 `Person` JSON-LD 中建立双语姓名关联。
- description 明确区分时间：当前为 EPFL/HexHive 博士后，计划于 2027 年 1 月加入大湾区大学（Great Bay University，GBU）任教；在到任前不把 GBU 错写为当前雇主。
- `Person` JSON-LD 增加稳定 `@id`、页面 `url`、`mainEntityOfPage`、研究领域 `knowsAbout`、当前任职单位 EPFL、55AA Security Lab affiliation、浙江大学教育背景，以及 Google Scholar、GitHub `sameAs`。
- 首页和 People 列表页继续使用可抓取的个人详情页链接，并同步显示本地化姓名；CV 链接使用具有含义的双语锚文本。
- `Qiang_s_CV.pdf` 补齐 Title、Author、Subject 和 Keywords；元数据源保存在 `scripts/Qiang_s_CV.metadata.txt`，便于以后重新生成 PDF 时复用。

本地已使用 Node.js 24.22.1 和 npm 11.19.1 完整构建：7 个测试全部通过，33/33 个 sitemap URL 均对应可索引 canonical 页面，课程区仍保持 0 个可索引和 1,454 个 `noindex` 页面。针对性验收确认双语个人页的 title、description、H1、canonical、robots、hreflang、`Person` JSON-LD 以及首页和 People 页内部链接均正确；`pdfinfo` 确认 CV 元数据存在、页数仍为 5，`pdftotext` 确认正文可读取。

GitHub Actions workflow `39971755351` 已完成相同构建和自动验收，并成功部署到 GitHub Pages。正式站复查确认：`/sitemap.xml` 返回 `200 application/xml` 且包含 33 个 URL，两个人详情 URL 各出现一次；双语个人页均返回 `200 text/html`，输出预期的 title、description、canonical、hreflang、`index, follow` 和 `Person` JSON-LD；首页和 People 列表页均保留详情页链接。线上 CV 返回 `200 application/pdf`，Title、Author、Subject、Keywords 均正确，仍为 5 页且正文可读取。

### P1-1：[已修复并上线] 首页缺少一级标题

2026-10-23 线上检查确认英文和中文首页均没有 `<h1>`，页面从多个 `<h2>` 开始。`55AA Security Lab` 当时只出现在带 alt 的 logo 和页面 title 中。

同日已确认中文正式名称为“55AA 安全实验室”，并完成修复：英文首页使用可见且唯一的 `<h1>55AA Security Lab</h1>`，中文首页使用可见且唯一的 `<h1>55AA 安全实验室</h1>`；原研究简介保留为 `<p>`，后续 section 继续使用 `<h2>`。Hero 的 `aria-labelledby="hero-title"` 指向 `<h1 id="hero-title">`，标题同时承担页面主标题和 Hero 无障碍名称。

新增 `scripts/validate-homepage-headings.mjs` 并接入 `npm run build`，构建会检查两个首页各自恰好有一个 `<h1>`、名称精确匹配、`id` 和 `aria-labelledby` 关联正确，并确认后续仍有 `<h2>`；失败会阻止部署。2 个正反测试覆盖正确结构、缺少 `<h1>`、重复 `<h1>`、名称错误和无障碍关联错误。Node.js 24.22.1 下共 9 个测试全部通过，完整构建生成 1,488 个页面，并通过 33 项 sitemap、1,454 项课程索引和 2 个首页标题验收。Chrome 桌面端与 390px 移动端渲染检查确认标题可见、布局正常且没有横向溢出。

GitHub Actions workflow `39974935404` 的首次 runner 在系统包安装阶段停滞，取消后对同一提交重新运行；重试完成 Graphviz 与依赖安装、9 个测试、完整构建、全部自动验收、artifact 上传和 Pages 部署。正式站复查确认中英文首页均返回 `200 text/html`、各自只有一个名称精确的 `<h1>`、Hero 的 `aria-labelledby` 正确、后续保留 `<h2>`，且 canonical 和 `index, follow` 没有回归。线上 Chrome 桌面端与 390px 移动端进一步确认标题实际可见、元素尺寸非零且页面没有横向溢出。

## 当前完成状态（2026-10-23）

以下工作已经完成：

- [x] 确定长期正式域名 `https://www.55aaseclab.com/`，配置 DNS、HTTPS、GitHub Pages custom domain 和 `CNAME`。
- [x] 在 Google Search Console 验证 Domain property 和正式 HTTPS URL-prefix property，并提交 sitemap。
- [x] 全站共享 title、description、canonical、双语 hreflang、Open Graph 和 Twitter Card；robots 默认为 `index, follow`，并可按页面切换为 `noindex, follow`。
- [x] 配置 robots.txt 和构建时自动生成的 sitemap.xml。
- [x] sitemap 与课程索引自动验收已接入 `npm run build`：逐项检查 URL 唯一性、正式域名、生成文件、canonical、sitemap 中不得出现 `noindex`，并反向检查所有课程相关页面的显式索引标记、robots 指令和 sitemap 收录状态；失败会阻止 Pages artifact 上传。
- [x] 双语首页标题结构自动验收已接入 `npm run build`：每页必须恰好包含一个名称正确的品牌 `<h1>`，Hero 无障碍关联正确，后续内容保留 `<h2>`；回归会阻止部署。标题可见性和响应式布局另由浏览器渲染验收。
- [x] 项目和 GitHub Pages 工作流已统一到 Node.js 24；官方 Actions 已升级到原生 Node 24 的稳定主版本。
- [x] 本地默认 Node.js 已升级为 24.22.1，npm 为 11.19.1。
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
- [x] **步骤 2：加入 sitemap 自动验收。** 2026-10-23 已将 `scripts/validate-sitemap.mjs` 接入生产构建：所有 `<loc>` 必须唯一、使用正式域名、不含 query/fragment、对应 `dist` 中的生成文件；HTML 页面必须只有一个与 `<loc>` 一致的 canonical，且不得声明 `noindex`。4 个自动测试覆盖正常页面、重复 URL、缺少生成文件、canonical 不一致和 `noindex`。本地 Node.js 24.22.1 完整构建已验证 1485/1485 个 URL；GitHub Actions workflow `39963643402` 使用 Node.js 24.21.0 再次通过 4 个测试、1485 项验收、artifact 上传和 Pages 部署，正式站复查同样通过。
- [x] **步骤 3：明确两个英文博客旧 URL 的弃用策略。** 2026-10-23 已确认旧 URL 没有外链，且不考虑兼容：旧 URL 保持 `404`，不恢复、不做 `301`；新 URL 均返回 `200`，canonical、sitemap 和内部链接只使用新 URL。
- [x] **步骤 4：定义课程索引门槛。** 2026-10-23 已确认当前没有认真建设并完成审核的课程，因此 Courses 整体按建设中处理。索引采用显式白名单：课程首页、单门课程和单个课次分别明确设置 `indexable: true` 后才有资格进入 sitemap；课次必须同时获得父课程和自身批准。未来课程页还需满足正式发布、中英文审核完成、无 TBD/placeholder、具有完整大纲和真实材料、能够满足独立搜索意图；课次还需逐页人工审核且不得含占位 Slides、视频或模板化材料。
- [x] **步骤 5：为共享 SEO head 增加可配置 robots 并执行课程区策略。** `SeoHead` 已支持按页面输出 `index, follow` 或 `noindex, follow`；课程首页、44 个双语课程详情页和 1,408 个双语课次页继续生成并可访问，但合计 1,454 个页面全部输出 `noindex, follow`，且从 sitemap 移除。sitemap 由 1,485 个 URL 减少为 31 个。新增课程索引策略与构建产物自动验收，7 个测试全部通过；完整本地构建确认 31/31 个 sitemap URL 均为可索引 canonical 页面，并确认课程区 0 个页面可索引、1,454 个页面为 `noindex`。GitHub Actions workflow `39969252535` 完成相同验收并成功部署；正式 sitemap 返回 `200 application/xml`、包含 31 个 URL 且不含课程 URL，抽查中英文课程首页、课程详情和课次详情均返回 `200`、输出 `noindex, follow` 并显示建设中提示。
- [x] **步骤 6：把双语刘强（Qiang Liu）个人详情页加入 sitemap。** 2026-10-23 已确认中文正式姓名为“刘强”，新单位为“大湾区大学 / Great Bay University / GBU”。sitemap 从 31 增至 33 个 URL；双语详情页已优化 title、description、H1 和 `Person` JSON-LD，当前 EPFL 博士后与 2027 年 1 月加入 GBU 的时间关系分开表述。首页和 People 页的内部链接已验收，CV 已补齐 Title、Author、Subject 和 Keywords。Node.js 24.22.1 完整构建及针对性本地验收均通过；GitHub Actions workflow `39971755351` 构建并部署成功，正式站的 33 项 sitemap、双语个人页、内部链接、结构化数据及 PDF 元数据均已复查通过。
- [x] **步骤 7：恢复首页唯一文本 `<h1>`。** 2026-10-23 已确认中文正式名称为“55AA 安全实验室”。英文首页使用 `55AA Security Lab`，中文首页使用“55AA 安全实验室”；标题可见且每页唯一，原研究简介保留为段落，后续 section 继续使用 `<h2>`。新增构建期自动验收及 2 个正反测试；Node.js 24.22.1 下 9 个测试、完整构建、桌面端和移动端渲染检查均通过。GitHub Actions workflow `39974935404` 重试后构建并部署成功，正式站的原始 HTML、canonical、robots、桌面端和移动端实际渲染均已复查通过。
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
2. 建设中课程退出 sitemap，并在发布前保持 `noindex, follow`；2026-10-23 已部署并完成正式站验收，后续通过 Search Console 观察移除过程。
3. Qiang Liu 姓名查询开始由个人 HTML 页面承接，而不是主要落在通用首页或 PDF。
4. Tools、Publications、Projects 或招生页面获得首批非姓名词点击。
5. Search Console 中 sitemap 发现数、实际索引数和未索引原因可以按月对比。
6. 自然搜索开始带来可测量的 CV 下载、GitHub 出站、邮件、招生或合作行为。

后续章节保留背景、历史建议和验收说明；如与上方当前清单冲突，以当前清单为准。

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
