# SEO 运营（55aaseclab.com）

目标：同等质量下，更多有效曝光与点击。衡量：impressions 增长、CTR、平均排名、索引覆盖率。
立场：判断挂数据，不猜；修复走源码，不走产物；一切留痕。

## 目录

- `data/` — GSC 快照（`gsc-YYYY-MM-DD.json`）、GSC UI 导出（CSV：`YYYY-MM-DD.csv`）
- `reports/` — 周报 `gsc-YYYY-MM-DD.md`（数据 → 对比 → 原因 → 行动 → 待用户）
- `ACTIONS.md` — 修复台账：日期 | 发现 | 原因 | 修复 | commit | 验证结果
- `../scripts/gsc_pull.py` — GSC 拉取工具（`--days N --site auto`；快照自动存 `data/`，与上一份自动对比）
- `../scripts/bing_pull.py` — Bing QueryStats 拉取（快照 `data/bing-*.json`）
- `../scripts/bing_push.py` — IndexNow 推送（部署后把 sitemap/变更 URL 推给 Bing 等）
- `../seo/keys.env` — 各平台 key（**gitignore**，绝不入库）

## 周循环（每次执行）

1. **拉数据**：`python3 scripts/gsc_pull.py`（快照落 `data/`，自动输出与上一次的 diff）
2. **对比分析**：新出现查询、排名变化 >5 位、曝光/CTR 异动、索引异常（被排除、未收录等）
3. **找原因**：每个异动定位到页面/查询，区分内容原因、技术原因（索引/部署/链接）、噪声
4. **修复**：改 `src/` 源码（标题、描述、内容、链接、重定向）——不在产物上改
5. **留痕**：`ACTIONS.md` 记一条（发现 → 原因 → 修复 → commit hash → 验证结果）；周报落 `reports/`
6. **push → 部署 → 验证**：push 后等 GitHub Actions，验证线上 URL 200；需要重爬的可调 URL Inspection API
7. **待用户**：需要账号权限/人工导出的（如 GSC 报告导出 CSV），写进周报"待用户"一节

## 纪律

- 一次一个主题一个 commit；commit message 前缀 `seo:` 
- 数据快照与报告**提交进 git**（审计痕迹），密钥文件绝不入库（已在 .gitignore）
- 无法用数据解释的结论不写进报告
