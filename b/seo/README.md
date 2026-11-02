# SEO 运营（55aaseclab.com）

目标：同等质量下，更多有效曝光与点击。衡量：impressions 增长、CTR、平均排名、索引覆盖率。
立场：判断挂数据，不猜；修复走源码，不走产物；一切留痕。

## 目录

- `data/` — GSC 快照（`gsc-YYYY-MM-DD.json`）、GSC UI 导出（如 404 列表 CSV：`404-YYYY-MM-DD.csv`）
- `reports/` — 周报 `gsc-YYYY-MM-DD.md`（数据 → 对比 → 原因 → 行动 → 待用户）
- `ACTIONS.md` — 修复台账：日期 | 发现 | 原因 | 修复 | commit | 验证结果
- `../scripts/gsc_pull.py` — 拉取工具（`--days N --site auto`；快照自动存 `data/`，与上一份自动对比）

## 周循环（每次执行）

1. **拉数据**：`python3 scripts/gsc_pull.py`（快照落 `data/`，自动输出与上一次的 diff）
2. **对比分析**：新出现查询、排名变化 >5 位、曝光/CTR 异动、索引异常（404 / soft-404 / 被排除）
3. **找原因**：每个异动定位到页面/查询，区分内容原因、技术原因（404/索引/部署）、噪声
4. **修复**：改 `src/` 源码（标题、描述、内容、链接、重定向、404 恢复）——不在产物上改
5. **留痕**：`ACTIONS.md` 记一条（发现 → 原因 → 修复 → commit hash → 验证结果）；周报落 `reports/`
6. **push → 部署 → 验证**：push 后等 GitHub Actions，验证线上 URL 200；需要重爬的可调 URL Inspection API
7. **待用户**：需要账号权限/人工导出的（如 GSC 404 列表 CSV），写进周报"待用户"一节

## 404 处理

- 来源：GSC"页面索引"通知/导出（**无 API**，CSV 放 `data/404-*.csv`）；或自检（sitemap 全 URL 状态检查 + dist 内链扫描）
- 修复三选一：恢复页面 / 301 重定向 / 删除死链来源
- 每条 404 单独记台账、单独验证

## 纪律

- 一次一个主题一个 commit；commit message 前缀 `seo:` 
- 数据快照与报告**提交进 git**（审计痕迹），密钥文件绝不入库（已在 .gitignore）
- 无法用数据解释的结论不写进报告
