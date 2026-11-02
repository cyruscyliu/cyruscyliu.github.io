# 周定时任务（Paseo schedule）

- **ID**：`fba0c777`
- **Cron**：`0 9 * * 1`（每周一 09:00，Asia/Shanghai）
- **工作目录**：`/home/ubuntu/all-in-one-repo/third_party/cyruscyliu.github.io`
- **状态**：active，创建于 2026-11-02

## Prompt（当前版本）

```text
执行 55aaseclab.com 的周度 SEO 管理。先读 b/seo/README.md（流程与纪律）、b/seo/STATUS.md（当前状态）、b/seo/ACTIONS.md（台账，勿重复已做项）。

步骤：
1) 拉数据：python3 b/scripts/gsc_pull.py（快照存 b/seo/data/，与上次自动对比）
2) 对比分析：与上一份快照和 reports/ 最近周报对比，找出所有异动与异常
3) 找原因并修复：需要改的直接改 b/src/ 源码
4) 留痕：b/seo/ACTIONS.md 记台账（发现|原因|修复|commit|验证），周报写 b/seo/reports/gsc-YYYY-MM-DD.md（数据→对比→原因→行动→待用户）
5) commit（前缀 seo:）并 push，部署完成后验证线上 200；需要重新收录的用 URL Inspection API
6) 需要账号权限或人工导出的，写进周报"待用户"一节，不要卡住

纪律：判断挂数据不猜；一次一个主题一个 commit；密钥文件绝不入库；报告只写能用数据支撑的结论。
```

## 变更记录

- 2026-11-02：创建；prompt 修订一版（去掉针对特定问题的特设机制，保持通用）。
