# SEO 修复台账

格式：日期 | 发现 | 原因 | 修复 | commit | 验证结果

---

| 日期 | 发现 | 原因 | 修复 | commit | 验证 |
|---|---|---|---|---|---|
| 2026-11-02 | sitemap 37 个 URL 全量状态检查 | 主动自检 | 检查结果：0 broken | — | 全部 200 |
| 2026-11-03 | GSC 404 清单 11 条（Coverage Drilldown 导出，存 `data/404-drilldown-2026-11-03.csv`） | 分类：9 条重复语言段（`/zh/blog/zh/` 等）来自 10-21/22 坏 sitemap 窗口期的爬取，内链已零残留（dist 扫描验证），预期自然衰减；1 条旧博客 URL 为既定弃用；1 条 asset-management 博文为故意 draft（commit `4d3dd76`，draft 不构建→404 是预期行为） | **零代码修复**——三类均为已决策状态的自然结果 | d06c417 后续 | 复核：下轮 drilldown 数量应从 11 趋向 2–3；可选在 GSC 404 报告点"验证修复"加速复核 |

| 2026-11-02 | `qiang liu epfl` 为唯一验证需求（49 impr/7 clicks/pos 3.3）；query×page 拆分显示个人页承接 28 impr 仅 2 clicks（CTR 7.1%，pos 5.0），个人页 title 无 EPFL，与首页（48 impr/5 clicks）相比查询词匹配弱；`qiang liu meta`（20 impr/0 clicks）全部落在 /en/ 首页，SERP 无法区分本人与 Meta 同名者 | profile seo title 只有 "System Security Researcher"，缺少 EPFL 实体信号 | 双语个人页 title 显式加入 EPFL（en: "…Researcher at EPFL…"；zh: "EPFL 系统安全研究者"）；description 已含 EPFL/GBU 不动；首页不改（该页 CTR 10.4% 已最优，且不适合承载人名） | 042d110 | 本地 build：26 tests + 37 项 sitemap + 课程索引 + 首页标题验收全过；dist title 已含 EPFL；URL Inspection：页面 PASS "Submitted and indexed"（lastCrawl 2026-10-23）；部署后线上 200 复查通过 |
| 2026-11-02 | `/en|zh/blog/syssec-not-hard-anymore/` 合计 72 impr（en 18 pos 6.2 / zh 54 pos 7.1）、0 clicks；query×page 显示该页没有任何可披露查询（展示全部来自匿名查询），上期周报"把用户实际搜索词放进 title"的前提被数据推翻 | meta description 为模糊单句（"How coding agents lower the barrier…"），snippet 未说明文章回答什么；title 过长（+模板后缀 80 字符）但无可定位查询词，改 title 有排名风险 | 仅重写双语 meta description（按文章实际内容：变快的部分、不稳的部分、Morpheus 工作流框架），title 保持不动 | eae2843 | 本地 build 验收全过；dist description 已更新；URL Inspection：en/zh 页均 PASS "Submitted and indexed"（lastCrawl 2026-11-01 / 10-30）；部署后线上 200 复查通过 |
