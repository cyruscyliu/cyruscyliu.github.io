const t = (zh, en) => ({ zh, en });

const lessons = [
  {
    id: "week-01-session-01",
    courseCode: "55AA-002",
    week: 1,
    session: 1,
    durationMinutes: 90,
    title: t("软件漏洞模型与安全工程流程", "Vulnerability Models and Secure Engineering Workflow"),
    position: t(
      "这是软件安全课程的第一讲。目标不是马上进入漏洞利用，而是先建立语言：什么是缺陷、漏洞、利用、风险、资产、攻击面和信任边界。",
      "This is the first lecture in Software Security. It does not jump directly into exploitation; it establishes the vocabulary of defects, vulnerabilities, exploits, risk, assets, attack surfaces, and trust boundaries."
    ),
    objectives: {
      zh: [
        "区分 bug、vulnerability、exploit 和 risk，并能给出安全语境下的例子。",
        "用资产、入口点、信任边界和攻击者能力描述一个小型软件系统的攻击面。",
        "从一个漏洞公告中提取根因、影响、修复策略和回归测试需求。",
        "解释为什么软件安全必须进入需求、设计、实现、测试和发布流程。"
      ],
      en: [
        "Distinguish bug, vulnerability, exploit, and risk with security-specific examples.",
        "Describe the attack surface of a small software system using assets, entry points, trust boundaries, and attacker capabilities.",
        "Extract root cause, impact, remediation strategy, and regression-test needs from a vulnerability advisory.",
        "Explain why software security must enter requirements, design, implementation, testing, and release workflows."
      ]
    },
    prerequisites: {
      zh: ["软件工程中的质量属性。", "HTTP 请求、输入校验、后端服务和数据库的基本概念。", "Git、issue、pull request 和测试的基本使用。"],
      en: ["Quality attributes from software engineering.", "Basic concepts of HTTP requests, input validation, backend services, and databases.", "Basic use of Git, issues, pull requests, and tests."]
    },
    preparation: {
      zh: [
        "课前阅读：任意一篇简短 CVE 公告，标出受影响组件、攻击前提和修复版本。",
        "课前思考：一个会导致程序崩溃的 bug 一定是安全漏洞吗？",
        "准备环境：浏览器、文本编辑器，以及能打开课程仓库中的示例 advisory。"
      ],
      en: [
        "Pre-class reading: read one short CVE advisory and mark the affected component, attack preconditions, and fixed version.",
        "Pre-class prompt: is a crash bug always a security vulnerability?",
        "Environment: browser, text editor, and access to the sample advisory in the course repository."
      ]
    },
    flow: [
      {
        minutes: "0-8",
        type: "review",
        title: t("复习：软件工程里的质量属性", "Review: quality attributes in software engineering"),
        plan: t("用可靠性、可维护性和安全性三个词开场，让学生先说这些质量属性分别保护什么。", "Open with reliability, maintainability, and security; ask students what each quality attribute protects.")
      },
      {
        minutes: "8-18",
        type: "diagnostic",
        title: t("诊断问题：崩溃是否等于漏洞", "Diagnostic question: does crash imply vulnerability?"),
        plan: t("给出三个场景：本地 CLI 崩溃、公开 API 崩溃、认证服务崩溃。让学生判断风险是否相同。", "Give three scenarios: local CLI crash, public API crash, and authentication service crash. Ask whether the risk is the same.")
      },
      {
        minutes: "18-34",
        type: "concept",
        title: t("bug、漏洞、利用和风险", "Bug, vulnerability, exploit, and risk"),
        plan: t("建立四个概念的层次：实现偏差、可被攻击者利用、利用路径、资产影响与可能性。", "Build the hierarchy: implementation defect, attacker exploitability, exploitation path, and asset impact plus likelihood.")
      },
      {
        minutes: "34-48",
        type: "case",
        title: t("漏洞公告拆解", "Advisory dissection"),
        plan: t("共同阅读一份短 advisory，把 affected versions、root cause、impact、fixed versions、workaround 和 regression test 标出来。", "Read a short advisory together and mark affected versions, root cause, impact, fixed versions, workaround, and regression test.")
      },
      {
        minutes: "48-63",
        type: "concept",
        title: t("资产、入口点、信任边界和攻击面", "Assets, entry points, trust boundaries, and attack surface"),
        plan: t("用一个登录服务画出数据流，标出浏览器、API、数据库、第三方依赖和管理员后台之间的信任边界。", "Draw a login service data flow and mark trust boundaries among browser, API, database, dependencies, and admin console.")
      },
      {
        minutes: "63-75",
        type: "exercise",
        title: t("课堂练习：为一个上传接口建模", "In-class exercise: model an upload endpoint"),
        plan: t("学生两人一组，写出资产、入口点、攻击者能力、最可能的三个风险。", "Students work in pairs and list assets, entry points, attacker capabilities, and the three most likely risks.")
      },
      {
        minutes: "75-84",
        type: "discussion",
        title: t("安全进入工程流程", "Putting security into the engineering workflow"),
        plan: t("把刚才的风险转成 issue、测试、代码评审检查项和发布门禁。", "Turn the risks into issues, tests, code-review checks, and release gates.")
      },
      {
        minutes: "84-90",
        type: "summary",
        title: t("总结和下节课钩子", "Summary and hook for next class"),
        plan: t("总结本节课核心句：漏洞是攻击者可利用的工程缺陷。下节课把这个方法用于漏洞公告分析工作坊。", "Summarize the core sentence: a vulnerability is an attacker-exploitable engineering defect. Next class applies this method in an advisory-analysis workshop.")
      }
    ],
    questions: [
      {
        prompt: t("如果一个输入校验错误只能导致程序崩溃，它一定是安全漏洞吗？", "If an input-validation bug only crashes the program, is it always a security vulnerability?"),
        expectedAnswer: t("不一定。要看攻击者是否能触发、崩溃是否影响安全目标、是否能进一步利用。", "Not necessarily. It depends on attacker reachability, whether the crash affects a security goal, and whether it enables further exploitation."),
        followUp: t("如果它是认证服务呢？如果崩溃后自动重启但会丢失内存中的会话状态呢？", "What if it is an authentication service? What if it restarts automatically but loses in-memory session state?")
      },
      {
        prompt: t("漏洞公告中最重要的是 CVSS 分数，还是根因和攻击前提？", "In an advisory, is the CVSS score more important than root cause and attack preconditions?"),
        expectedAnswer: t("CVSS 有排序价值，但工程修复更依赖根因、攻击前提、受影响版本和可回归测试的条件。", "CVSS helps prioritization, but engineering remediation depends more on root cause, preconditions, affected versions, and regression-test conditions."),
        followUp: t("如果分数高但产品没有暴露对应入口点，优先级应该怎么调整？", "If the score is high but the product does not expose the relevant entry point, how should priority change?")
      },
      {
        prompt: t("信任边界和模块边界是不是同一件事？", "Are trust boundaries and module boundaries the same thing?"),
        expectedAnswer: t("不是。模块边界是代码组织方式，信任边界是不同权限、身份、控制权或数据可信度之间的边界。", "No. Module boundaries organize code; trust boundaries separate authority, identity, control, or data trustworthiness."),
        followUp: t("一个模块内部是否可能跨越信任边界？一个微服务边界是否一定是信任边界？", "Can one module cross a trust boundary? Is every microservice boundary necessarily a trust boundary?")
      }
    ],
    board: {
      zh: [
        "左侧画四层概念：bug -> vulnerability -> exploit -> risk。",
        "中间画登录服务数据流：browser -> API -> DB，旁边放 dependency 和 admin console。",
        "右侧列 advisory 六项：affected, root cause, impact, fixed, workaround, regression test。"
      ],
      en: [
        "Left: four-level concept stack: bug -> vulnerability -> exploit -> risk.",
        "Middle: login-service data flow: browser -> API -> DB, with dependency and admin console.",
        "Right: six advisory fields: affected, root cause, impact, fixed, workaround, regression test."
      ]
    },
    demo: {
      title: t("漏洞公告到工程任务", "From advisory to engineering tasks"),
      steps: {
        zh: [
          "打开示例 advisory。",
          "标出受影响版本和攻击前提。",
          "把根因改写成一个可分配给工程师的 issue。",
          "写出一个最小回归测试的输入、预期输出和失败条件。",
          "写出发布说明中的用户可理解影响描述。"
        ],
        en: [
          "Open the sample advisory.",
          "Mark affected versions and attack preconditions.",
          "Rewrite root cause as an issue assignable to an engineer.",
          "Write input, expected output, and failure condition for a minimal regression test.",
          "Write user-facing impact text for release notes."
        ]
      },
      fallback: t("如果网络不可用，使用课程仓库中离线保存的 advisory 摘要。", "If the network is unavailable, use the offline advisory summary in the course repository.")
    },
    exercise: {
      title: t("上传接口攻击面草图", "Attack-surface sketch for an upload endpoint"),
      prompt: t("假设系统允许用户上传头像。请列出至少 4 个资产、3 个入口点、3 条信任边界和 3 个安全测试。", "Assume the system lets users upload avatars. List at least 4 assets, 3 entry points, 3 trust boundaries, and 3 security tests."),
      rubric: {
        zh: ["资产不能只写服务器，要包括用户数据、账号、存储桶、处理队列等。", "入口点要包括直接 HTTP 上传、图片处理器、后台查看页面等。", "安全测试必须能进入 CI 或人工评审流程。"],
        en: ["Assets should include more than the server: user data, accounts, storage buckets, processing queues, and so on.", "Entry points should include direct HTTP upload, image processor, admin view, and related paths.", "Security tests must be actionable in CI or manual review."]
      }
    },
    homework: {
      zh: "选择一篇公开 CVE 公告，提交一页分析：资产、攻击者能力、根因、影响、修复策略、回归测试建议。",
      en: "Choose a public CVE advisory and submit a one-page analysis: assets, attacker capabilities, root cause, impact, remediation strategy, and regression-test recommendation."
    },
    script: {
      zh: [
        {
          section: "开场",
          text: "今天是软件安全的第一讲。我们先不写 exploit，也不急着看花哨的攻击。安全课最容易犯的错误，是把漏洞当成某种神秘技巧。我们这门课要反过来：漏洞首先是工程缺陷，只是这个缺陷刚好能被攻击者利用。今天我们要建立一套共同语言。"
        },
        {
          section: "复习",
          text: "上节软件工程课里我们说过质量属性。可靠性问的是系统在正常或异常条件下能不能持续工作；可维护性问的是未来的人能不能理解和修改；安全性多了一个主动对抗者。请先想一个问题：一个程序崩溃，什么时候只是可靠性问题，什么时候变成安全问题？"
        },
        {
          section: "提问引导",
          text: "我给三个场景。第一，一个本地命令行工具读到坏文件后崩溃。第二，一个公开 API 收到特殊请求后崩溃。第三，一个认证服务崩溃后所有用户都无法登录。三者都是 crash，但安全含义一样吗？这里不要急着回答 yes 或 no，先问：攻击者能不能触发？触发成本多高？影响哪个资产？有没有进一步利用的空间？"
        },
        {
          section: "概念讲解",
          text: "我们把四个词拆开。bug 是实现偏差。vulnerability 是攻击者可利用的缺陷。exploit 是利用路径或利用程序。risk 是资产影响和发生可能性的组合。所以不是每个 bug 都是漏洞，也不是每个漏洞都有稳定 exploit，更不是每个 exploit 都对应同样的业务风险。"
        },
        {
          section: "案例过渡",
          text: "接下来我们看一份漏洞公告。读公告不要只看标题和分数。我们要找六件事：受影响版本、攻击前提、根因、影响、修复版本、回归测试。以后你们做安全工程，看到公告后真正要交付的是这些工程动作，而不是转发一条链接。"
        },
        {
          section: "总结",
          text: "今天的核心句是：漏洞是攻击者可利用的工程缺陷。判断一个问题是不是安全问题，需要同时看攻击者、入口点、信任边界、资产和影响。下节课我们会进入工作坊，用同一套方法系统分析两篇公告，并把分析转成 issue、测试和修复计划。"
        }
      ],
      en: [
        {
          section: "Opening",
          text: "This is the first lecture in Software Security. We will not start by writing exploits or chasing spectacular attacks. The most common mistake in a security course is treating vulnerabilities as mysterious tricks. We will do the opposite: a vulnerability is first an engineering defect, with the special property that an attacker can use it."
        },
        {
          section: "Review",
          text: "From software engineering, you have seen quality attributes. Reliability asks whether a system keeps working under normal and abnormal conditions. Maintainability asks whether future engineers can understand and change it. Security adds an active adversary. So here is the first question: when is a crash merely a reliability problem, and when is it a security problem?"
        },
        {
          section: "Guided question",
          text: "Consider three cases: a local CLI crashes on a malformed file; a public API crashes on a special request; an authentication service crashes and no one can log in. All three are crashes. Do they carry the same security meaning? Do not answer only yes or no. Ask whether the attacker can trigger it, how costly it is, which asset is affected, and whether it enables further exploitation."
        },
        {
          section: "Concept",
          text: "Separate four words. A bug is an implementation defect. A vulnerability is an attacker-exploitable defect. An exploit is the path or program that exercises it. Risk combines asset impact and likelihood. Not every bug is a vulnerability; not every vulnerability has a stable exploit; and not every exploit carries the same business risk."
        },
        {
          section: "Transition",
          text: "Now we read an advisory. Do not read only the title and score. Extract six things: affected versions, attack preconditions, root cause, impact, fixed versions, and regression tests. In security engineering, your deliverable is not a forwarded link; it is a set of engineering actions."
        },
        {
          section: "Summary",
          text: "The core sentence today is: a vulnerability is an attacker-exploitable engineering defect. To judge whether something is a security issue, inspect the attacker, entry point, trust boundary, asset, and impact. Next class turns this method into a workshop: advisory analysis that becomes issues, tests, and a remediation plan."
        }
      ]
    },
    slides: [
      { title: t("今天的问题", "Today's Question"), bullets: { zh: ["什么时候 bug 变成漏洞？", "安全为什么必须进入工程流程？"], en: ["When does a bug become a vulnerability?", "Why must security enter the engineering workflow?"] } },
      { title: t("四个词", "Four Words"), bullets: { zh: ["Bug：实现偏差", "Vulnerability：攻击者可利用的缺陷", "Exploit：利用路径", "Risk：资产影响 x 可能性"], en: ["Bug: implementation defect", "Vulnerability: attacker-exploitable defect", "Exploit: exploitation path", "Risk: asset impact x likelihood"] } },
      { title: t("判断漏洞的五个问题", "Five Questions for Vulnerability Judgment"), bullets: { zh: ["谁能触发？", "入口点在哪里？", "跨过什么信任边界？", "影响什么资产？", "能否复现和回归测试？"], en: ["Who can trigger it?", "Where is the entry point?", "Which trust boundary is crossed?", "Which asset is affected?", "Can it be reproduced and regression-tested?"] } },
      { title: t("公告阅读清单", "Advisory Reading Checklist"), bullets: { zh: ["Affected versions", "Root cause", "Impact", "Fixed version", "Workaround", "Regression test"], en: ["Affected versions", "Root cause", "Impact", "Fixed version", "Workaround", "Regression test"] } },
      { title: t("从风险到工程任务", "From Risk to Engineering Tasks"), bullets: { zh: ["Issue", "Patch", "Regression test", "Release note", "Monitoring signal"], en: ["Issue", "Patch", "Regression test", "Release note", "Monitoring signal"] } }
    ],
    media: {
      videoSegments: [
        { title: t("Bug、漏洞、利用和风险", "Bug, Vulnerability, Exploit, and Risk"), durationMinutes: 9, visualStyle: "concept diagram", source: "script sections 1-4" },
        { title: t("如何读漏洞公告", "How to Read a Vulnerability Advisory"), durationMinutes: 11, visualStyle: "document annotation", source: "demo and slides 4-5" }
      ]
    }
  },
  {
    id: "week-01-session-02",
    courseCode: "55AA-002",
    week: 1,
    session: 2,
    durationMinutes: 90,
    title: t("漏洞公告分析工作坊", "Vulnerability Advisory Analysis Workshop"),
    position: t(
      "这是第一周第二次课，把第一讲的概念转化为可执行流程。学生需要从公告走到 issue、测试、修复计划和披露沟通。",
      "This second meeting of week one turns the first lecture's concepts into an executable workflow. Students move from advisory to issue, tests, remediation plan, and disclosure communication."
    ),
    objectives: {
      zh: [
        "独立拆解一篇漏洞公告，识别事实、推断和未知项。",
        "把根因转化为一个可复现的最小测试用例。",
        "把安全风险转化为工程 issue、优先级和修复验收标准。",
        "写出一段面向用户和维护者都能理解的安全说明。"
      ],
      en: [
        "Independently dissect an advisory and separate facts, inferences, and unknowns.",
        "Translate root cause into a minimal reproducible test case.",
        "Turn security risk into engineering issues, priority, and remediation acceptance criteria.",
        "Write security communication understandable to users and maintainers."
      ]
    },
    prerequisites: {
      zh: ["第一讲的四个概念：bug、vulnerability、exploit、risk。", "能阅读 GitHub issue 或安全公告。", "能写出简单测试用例描述。"],
      en: ["The four concepts from lecture one: bug, vulnerability, exploit, risk.", "Ability to read GitHub issues or security advisories.", "Ability to describe simple test cases."]
    },
    preparation: {
      zh: [
        "完成第一次课作业草稿：任选一篇 CVE 公告并做一页分析。",
        "带来一个你不确定如何判断严重性的点。",
        "阅读课程仓库中的两个示例公告：一个输入验证漏洞，一个依赖漏洞。"
      ],
      en: [
        "Bring a draft of the first homework: one-page analysis of a CVE advisory.",
        "Bring one point whose severity you are unsure how to judge.",
        "Read the two sample advisories in the course repository: one input-validation vulnerability and one dependency vulnerability."
      ]
    },
    flow: [
      {
        minutes: "0-10",
        type: "review",
        title: t("复习：四词和五问", "Review: four words and five questions"),
        plan: t("用冷启动小测复习 bug、vulnerability、exploit、risk，以及谁能触发、入口点、信任边界、资产、回归测试五问。", "Use a cold-start quiz to review bug, vulnerability, exploit, risk, and the five questions: who can trigger, entry point, trust boundary, asset, regression test.")
      },
      {
        minutes: "10-22",
        type: "modeling",
        title: t("教师示范：公告到证据表", "Instructor model: advisory to evidence table"),
        plan: t("教师把一篇短公告拆成事实、推断和未知项三列，示范不要把猜测写成事实。", "Instructor splits a short advisory into facts, inferences, and unknowns, modeling how not to write guesses as facts.")
      },
      {
        minutes: "22-38",
        type: "group-work",
        title: t("小组分析 1：输入验证漏洞", "Group analysis 1: input-validation vulnerability"),
        plan: t("学生小组填写模板：受影响版本、攻击前提、根因、影响、测试、修复验收标准。", "Student groups fill the template: affected versions, preconditions, root cause, impact, tests, and fix acceptance criteria.")
      },
      {
        minutes: "38-50",
        type: "review",
        title: t("全班评审：严重性和优先级", "Whole-class review: severity and priority"),
        plan: t("比较两个小组的优先级判断，强调环境暴露、资产价值和可利用性会改变排序。", "Compare priority judgments from two groups and stress that exposure, asset value, and exploitability change ordering.")
      },
      {
        minutes: "50-65",
        type: "group-work",
        title: t("小组分析 2：依赖漏洞", "Group analysis 2: dependency vulnerability"),
        plan: t("切换到依赖漏洞，要求学生判断升级、缓解、锁版本和 SBOM 更新如何进入修复计划。", "Switch to a dependency vulnerability and ask students to decide how upgrade, mitigation, pinning, and SBOM update enter the plan.")
      },
      {
        minutes: "65-76",
        type: "writing",
        title: t("安全说明写作", "Security communication writing"),
        plan: t("每组写三段话：给用户的影响说明、给维护者的技术说明、给管理者的风险说明。", "Each group writes three paragraphs: impact note for users, technical note for maintainers, and risk note for managers.")
      },
      {
        minutes: "76-85",
        type: "synthesis",
        title: t("把公告转成工程流程", "Turning advisories into workflow"),
        plan: t("教师总结一个完整闭环：triage -> reproduce -> patch -> test -> release -> monitor。", "Instructor summarizes the loop: triage -> reproduce -> patch -> test -> release -> monitor.")
      },
      {
        minutes: "85-90",
        type: "summary",
        title: t("总结和下节课钩子", "Summary and hook for next class"),
        plan: t("总结公告分析模板。下节课进入内存安全，观察一个具体 bug 如何变成控制流风险。", "Summarize the advisory-analysis template. Next class enters memory safety and observes how a concrete bug becomes control-flow risk.")
      }
    ],
    questions: [
      {
        prompt: t("事实、推断和未知项为什么要分开写？", "Why separate facts, inferences, and unknowns?"),
        expectedAnswer: t("因为安全响应需要可审计证据。事实支撑行动，推断需要置信度，未知项决定下一步调查。", "Because security response needs auditable evidence. Facts support action, inferences need confidence, and unknowns drive investigation."),
        followUp: t("如果你把推断写成事实，会对修复优先级和披露造成什么影响？", "What happens to remediation priority and disclosure if inferences are written as facts?")
      },
      {
        prompt: t("升级依赖总是最好的修复吗？", "Is upgrading a dependency always the best fix?"),
        expectedAnswer: t("不总是。升级可能带来兼容性风险，但长期通常需要升级；短期可能需要配置缓解、禁用入口点或隔离暴露面。", "Not always. Upgrades can introduce compatibility risk, though they are often needed long term; short-term action may require configuration mitigation, disabling entry points, or isolating exposure."),
        followUp: t("如果升级会破坏生产系统，你如何设计临时缓解和验收时间线？", "If upgrading breaks production, how would you design temporary mitigation and an acceptance timeline?")
      },
      {
        prompt: t("回归测试应该证明漏洞已经不存在，还是证明 exploit 失效？", "Should a regression test prove the vulnerability is gone, or that the exploit no longer works?"),
        expectedAnswer: t("最好覆盖根因，而不是只覆盖一个 exploit 样本。只证明一个 exploit 失效可能漏掉同类变体。", "It should preferably cover the root cause, not only one exploit sample. Proving one exploit fails may miss variants."),
        followUp: t("如果根因还不清楚，第一版测试该怎么写？", "If root cause is unclear, how should the first test be written?")
      }
    ],
    board: {
      zh: [
        "画三列表：Fact / Inference / Unknown。",
        "画安全响应闭环：triage -> reproduce -> patch -> test -> release -> monitor。",
        "写优先级公式：Exposure + Asset value + Exploitability + Existing controls。"
      ],
      en: [
        "Draw three columns: Fact / Inference / Unknown.",
        "Draw the response loop: triage -> reproduce -> patch -> test -> release -> monitor.",
        "Write priority formula: Exposure + Asset value + Exploitability + Existing controls."
      ]
    },
    demo: {
      title: t("公告分析模板", "Advisory analysis template"),
      steps: {
        zh: [
          "把公告复制到模板。",
          "高亮事实，不确定内容必须放入 Unknown。",
          "写出一个最小复现输入或复现条件。",
          "生成 issue 标题、严重性、验收标准和 owner。",
          "写出 release note 中的一句话影响说明。"
        ],
        en: [
          "Copy the advisory into the template.",
          "Highlight facts; uncertain items must go into Unknown.",
          "Write a minimal reproducer input or reproduction condition.",
          "Generate issue title, severity, acceptance criteria, and owner.",
          "Write one sentence of impact text for release notes."
        ]
      },
      fallback: t("如果学生选择的公告过于复杂，换用课程提供的输入验证漏洞样例。", "If a student's advisory is too complex, switch to the provided input-validation sample.")
    },
    exercise: {
      title: t("从公告到 issue", "From advisory to issue"),
      prompt: t("以小组为单位提交一个安全 issue：标题、影响、攻击前提、复现步骤、验收标准、回归测试。", "As a group, submit one security issue: title, impact, attack preconditions, reproduction steps, acceptance criteria, and regression test."),
      rubric: {
        zh: ["标题必须包含组件和风险，不要只写 CVE 编号。", "复现步骤必须能被助教执行。", "验收标准必须能判断修复是否完成。"],
        en: ["Title must include component and risk, not only a CVE number.", "Reproduction steps must be executable by staff.", "Acceptance criteria must decide whether the fix is complete."]
      }
    },
    homework: {
      zh: "把自己的 CVE 分析扩展成一个工程 issue 和一个回归测试设计，下次课前提交。",
      en: "Expand your CVE analysis into an engineering issue and a regression-test design before next class."
    },
    script: {
      zh: [
        {
          section: "开场复习",
          text: "上节课我们建立了四个词：bug、vulnerability、exploit、risk。今天我们不再停留在定义，而是做一件安全工程师每天都会做的事：读公告，然后把公告转成行动。注意，行动不是‘知道了’，行动是 issue、测试、补丁、发布和监控。"
        },
        {
          section: "示范",
          text: "我先示范如何读。第一遍只标事实：公告明确说了哪些版本受影响，明确说了什么入口点，明确说了修复版本。第二遍才写推断：如果它影响上传接口，我们推断头像上传也可能受影响，但这不是事实。第三栏写未知项：是否暴露在公网？是否启用了相关功能？是否有 WAF 或其他控制？"
        },
        {
          section: "小组任务说明",
          text: "现在每组拿到一个输入验证漏洞。你们的目标不是复述公告，而是把它变成工程任务。请写出一个 issue，里面必须有攻击前提、影响、复现步骤、验收标准和回归测试。十六分钟后我们比较两个组的结果。"
        },
        {
          section: "评审",
          text: "我们看两个组的优先级判断。一个组给 P0，一个组给 P2。谁对？这取决于环境。安全优先级不是公告分数的机械复制。公网暴露、认证要求、资产价值、是否有现有控制，都会改变排序。你们以后做安全响应，必须把环境写进判断里。"
        },
        {
          section: "总结",
          text: "今天的闭环是 triage、reproduce、patch、test、release、monitor。只完成其中一步，都不算完整安全工程。下节课我们进入内存安全，会看到一个看似普通的边界错误，如何沿着机器模型变成控制流风险。"
        }
      ],
      en: [
        {
          section: "Opening review",
          text: "Last class established four words: bug, vulnerability, exploit, and risk. Today we stop defining and start doing something security engineers do constantly: read an advisory and turn it into action. Action does not mean 'we know about it'; action means issue, test, patch, release, and monitoring."
        },
        {
          section: "Modeling",
          text: "I will model the reading process. First pass: mark facts only. Which versions are affected, which entry point is named, which version is fixed? Second pass: write inferences. If it affects upload, avatar upload may be affected, but that is not yet a fact. Third column: unknowns. Is it Internet-facing? Is the feature enabled? Is there a WAF or another control?"
        },
        {
          section: "Group task",
          text: "Each group now receives an input-validation vulnerability. Your goal is not to restate the advisory; it is to turn it into an engineering task. Write an issue with attack preconditions, impact, reproduction steps, acceptance criteria, and regression test. In sixteen minutes we compare two group outputs."
        },
        {
          section: "Review",
          text: "Now compare priority judgments. One group says P0, another says P2. Who is right? It depends on environment. Security priority is not a mechanical copy of an advisory score. Internet exposure, authentication requirement, asset value, and existing controls all change ordering. Security response must write those assumptions down."
        },
        {
          section: "Summary",
          text: "Today's loop is triage, reproduce, patch, test, release, monitor. Completing only one step is not complete security engineering. Next class moves into memory safety and shows how a normal boundary error can become control-flow risk through the machine model."
        }
      ]
    },
    slides: [
      { title: t("今天产出什么", "Today's Deliverable"), bullets: { zh: ["不是复述公告", "而是 issue + 测试 + 修复计划 + 安全说明"], en: ["Not a summary of the advisory", "But issue + test + remediation plan + security note"] } },
      { title: t("事实 / 推断 / 未知", "Fact / Inference / Unknown"), bullets: { zh: ["事实：公告明确给出", "推断：基于系统环境判断", "未知：需要调查才能行动"], en: ["Fact: explicitly stated", "Inference: judged from system context", "Unknown: requires investigation before action"] } },
      { title: t("安全 issue 模板", "Security Issue Template"), bullets: { zh: ["组件和风险", "攻击前提", "复现步骤", "验收标准", "回归测试"], en: ["Component and risk", "Attack preconditions", "Reproduction steps", "Acceptance criteria", "Regression test"] } },
      { title: t("优先级不是分数复制", "Priority Is Not Score Copying"), bullets: { zh: ["暴露面", "资产价值", "可利用性", "已有控制", "修复成本"], en: ["Exposure", "Asset value", "Exploitability", "Existing controls", "Remediation cost"] } },
      { title: t("安全工程闭环", "Security Engineering Loop"), bullets: { zh: ["Triage", "Reproduce", "Patch", "Test", "Release", "Monitor"], en: ["Triage", "Reproduce", "Patch", "Test", "Release", "Monitor"] } }
    ],
    media: {
      videoSegments: [
        { title: t("事实、推断和未知项", "Facts, Inferences, and Unknowns"), durationMinutes: 8, visualStyle: "annotated table", source: "script sections 1-2" },
        { title: t("把公告转成安全 issue", "Turning an Advisory into a Security Issue"), durationMinutes: 12, visualStyle: "screen recording + template fill", source: "demo and exercise" },
        { title: t("安全响应闭环", "The Security Response Loop"), durationMinutes: 7, visualStyle: "process diagram", source: "summary and slide 5" }
      ]
    }
  }
];

export default lessons;
