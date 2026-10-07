---
title: "55AA实验室科技转化技术成熟度指南"
description: "覆盖论文投稿、artifact evaluation、产品化与商业回报的技术成熟度指南。"
date: "2026-10-07"
language: "zh"
slug: "55aa-technology-readiness-levels"
tags:
  - "科技转化"
  - "论文投稿"
  - "artifact evaluation"
  - "产品化与商业回报"
  - "版本 0.1"
draft: false
---

<style>
table td:nth-child(1) { white-space: nowrap; }
table td:nth-child(2) { white-space: nowrap; }
tr.stage-row td { background: #eef2ff; font-weight: 600; text-align: center; }
span.row-note { display: block; font-size: .85em; color: #6b7280; }
</style>

本指南以青岛市《科技计划项目技术成熟度立项评价工作规程》附件的技术成熟度等级划分[^1]为主标准，共 13 级，覆盖从报告到投资回报的完整转化链条：第 1–7 级由实验室完成，第 8–13 级由工程团队和市场团队负责。

<table>
  <thead>
    <tr>
      <th>等级</th>
      <th>名称</th>
      <th>评价标准</th>
      <th>举证要素/技术凭证</th>
    </tr>
  </thead>
  <tbody>
    <tr class="stage-row">
      <td colspan="4">第 1–7 级 · 实验室完成（研究与验证）<span class="row-note">第 1–6 级加起来对应论文投稿，第 7 级对应 artifact evaluation</span></td>
    </tr>
    <tr>
      <td>第 1 级</td>
      <td>报告级</td>
      <td>发现新现象、新问题、新需求并提出报告（问题导向/技术推动/需求牵引＋灵感创意）</td>
      <td>调研报告、需求报告、产业发展、市场前景等分析报告等</td>
    </tr>
    <tr>
      <td>第 2 级</td>
      <td>方案级</td>
      <td>提出了满足需求或解决问题的技术方案</td>
      <td>研究方案、实施方案等</td>
    </tr>
    <tr>
      <td>第 3 级</td>
      <td>仿真级</td>
      <td>核心技术概念模型仿真验证成功</td>
      <td>虚拟或实物仿真概念模型等</td>
    </tr>
    <tr>
      <td>第 4 级</td>
      <td>功能级</td>
      <td>实验室内关键功能指标测试达到预期目标</td>
      <td>实验室、实物功能模型等</td>
    </tr>
    <tr>
      <td>第 5 级</td>
      <td>初样级</td>
      <td>功能样品、图纸＋工艺设计、测试通过</td>
      <td>提出功能测试的指标、测试报告等</td>
    </tr>
    <tr>
      <td>第 6 级</td>
      <td>正样级</td>
      <td>功能样机演示测试合格、工艺验证可行</td>
      <td>提出性能测试指标、测试报告等</td>
    </tr>
    <tr>
      <td>第 7 级</td>
      <td>环境级</td>
      <td>工程样机系统运行、例行环境试验合格</td>
      <td>现场实验或例行试验报告等</td>
    </tr>
    <tr class="stage-row">
      <td colspan="4">第 8–13 级 · 工程团队和市场团队负责（产品化与商业回报）</td>
    </tr>
    <tr>
      <td>第 8 级</td>
      <td>产品级</td>
      <td>小批试产合格、生产条件完备、工艺成熟</td>
      <td>可以交付使用的产品等</td>
    </tr>
    <tr>
      <td>第 9 级</td>
      <td>系统级</td>
      <td>实现大批量商业化生产，产品质量合格</td>
      <td>产品第一次实际应用等</td>
    </tr>
    <tr>
      <td>第 10 级</td>
      <td>销售级</td>
      <td>取得第一笔销售收入，销量≥盈亏平衡点数量的 30%</td>
      <td>合同、发票等</td>
    </tr>
    <tr>
      <td>第 11 级</td>
      <td>盈亏级</td>
      <td>项目年度总收益 − 项目年度运营成本≥0，开始年度盈利</td>
      <td>合同、发票、收款凭证等</td>
    </tr>
    <tr>
      <td>第 12 级</td>
      <td>利润级</td>
      <td>项目累计总收益≥项目全部累计总投入的 30% 到 50%</td>
      <td>合同、发票、财报等</td>
    </tr>
    <tr>
      <td>第 13 级</td>
      <td>回报级</td>
      <td>项目累计总收益 − 项目全部累计总投入（研发投入+生产投入+运营投入）≥0</td>
      <td>合同、发票、财报、统计等</td>
    </tr>
  </tbody>
</table>

## 参考资料：TRL（Technology Readiness Level）

TRL 共 9 个等级，源自 NASA 航天工程实践，详见 [Technology readiness level - Wikipedia](https://en.wikipedia.org/wiki/Technology_readiness_level)。

### TRL 不适用科技转化的理由

1. **论文发表的时候原理样机已经有了**：论文发表时，TRL 1–3（原理发现、概念形成、原理验证）就已完成——原理样机在投稿前就做出来了。
2. **MVP 直接能给到用户**：软件 MVP 上线即交付真实用户，TRL 4–6 的"实验室→相关环境→演示"逐级验证被一次交付合并，分级设卡失去意义；青岛标准第 8 级（产品级，可以交付使用的产品）恰好补上了这一段。
3. **不符合当前计算机软件交付节奏**：TRL 按硬件工程节奏设计，以年为周期；软件按周迭代、CI/CD 持续交付，看重利润和回报，青岛标准第 9–13 级（系统、销售、盈亏、利润、回报）直接对应这些目标。

[^1]: 来源：《青岛市科技计划项目技术成熟度立项评价工作规程》附件（技术成熟度等级划分）。现行版：[青科资字〔2025〕2号](http://www.qingdao.gov.cn/zwgk/xxgk/kjj/gkml/gwfg/tnull_8817958.shtml)（2025-01-13）；试行版：[青科资字〔2022〕14号](http://qdstc.qingdao.gov.cn/kjdt/tzgg/202207/P020220721613355617444.pdf)（2022-07-21，PDF 原文含等级表）。
