const text = (zh, en) => ({ zh, en });

const commonPolicies = {
  zh: [
    "允许使用 AI 工具，但所有生成代码、实验记录和设计建议必须经过学生本人审查，并在报告中说明使用方式。",
    "严禁提交不能解释的代码、证明、配置或实验结果；答辩时每名成员都需要解释自己负责部分的设计、测试和取舍。",
    "迟交会影响迭代评分，但课程更看重可复现、可审计和可维护的结果，而不是临时堆砌。"
  ],
  en: [
    "AI tools are allowed, but generated code, lab notes, and design suggestions must be reviewed by the student and disclosed in the report.",
    "Students may not submit code, proofs, configuration, or experimental results they cannot explain; each member must defend their own design, tests, and tradeoffs.",
    "Late work affects iteration grades, but the course values reproducible, auditable, and maintainable results over last-minute accumulation."
  ]
};

const assessment = (projectZh, projectEn) => [
  {
    item: text("个人作业", "Individual assignments"),
    weight: 25,
    description: text("概念题、阅读题、设计题和小型编程或实验任务。", "Concept questions, reading responses, design tasks, and small programming or lab exercises.")
  },
  {
    item: text("实验与项目", "Labs and project"),
    weight: 40,
    description: text(projectZh, projectEn)
  },
  {
    item: text("课堂参与与评审", "Participation and review"),
    weight: 10,
    description: text("参与讨论、演示、代码或论文评审，以及同伴反馈。", "Participation in discussions, demos, code or paper reviews, and peer feedback.")
  },
  {
    item: text("期末报告与答辩", "Final report and defense"),
    weight: 25,
    description: text("提交可复现材料、技术报告和演示，说明方法、结果、限制与后续工作。", "Submit reproducible artifacts, a technical report, and a demo explaining methods, results, limitations, and future work.")
  }
];

const weekly = (units) => units.flatMap((unit) => [
  {
    topic: unit.topic,
    work: unit.work
  },
  {
    topic: text(`${unit.topic.zh}实验与评审`, `${unit.topic.en}: lab and review`),
    work: text(`${unit.work.zh}完成配套实验、记录问题，并在课堂评审中解释设计取舍。`, `${unit.work.en} Complete the paired lab, record issues, and explain design tradeoffs in class review.`)
  }
]);

const course = ({
  summary,
  positioning,
  prerequisites,
  outcomes,
  format,
  weeks,
  project,
  projectAssessment
}) => ({
  summary,
  positioning,
  prerequisites,
  learningOutcomes: outcomes,
  format: format ?? {
    zh: [
      "每周 2 次课堂：一次讲授核心概念，一次用于实验、论文讨论或项目评审。",
      "课程按 16 周推进，每周都有可检查的作业、实验或项目里程碑。",
      "强调可复现材料：代码、配置、数据、实验日志和报告需要能被助教或同学复查。"
    ],
    en: [
      "Two meetings per week: one for core concepts and one for labs, paper discussion, or project review.",
      "The course proceeds over 16 weeks, each with a checkable assignment, lab, or project milestone.",
      "Reproducibility is required: code, configuration, data, lab logs, and reports must be reviewable by staff or peers."
    ]
  },
  weeklyPlan: weekly(weeks).map((week, index) => ({
    week: index + 1,
    topic: week.topic,
    work: week.work
  })),
  assessment: assessment(projectAssessment.zh, projectAssessment.en),
  project,
  policies: commonPolicies
});

const syllabi = {
  "55AA-001": {
    summary: text(
      "本课程面向已经具备基础编程能力的本科生，训练学生把一个模糊的问题转化为可维护、可测试、可演进的软件系统。课程参考 MIT 6.102 对软件构造质量的强调、CMU 17-313 对工程过程和团队协作的训练、Berkeley CS 169A 对敏捷迭代和用户价值的组织方式，以及 UW CSE 403 对真实项目交付的要求；但课程重心放在安全实验室语境下的软件工程：需求、设计、实现、测试、评审、部署和运维都要为可靠性、安全性和长期维护负责。",
      "This course is for undergraduates who already have basic programming experience. It trains students to turn an ambiguous problem into maintainable, testable, and evolvable software. The design draws on MIT 6.102's emphasis on construction quality, CMU 17-313's treatment of engineering process and teamwork, Berkeley CS 169A's agile and user-value orientation, and UW CSE 403's focus on real project delivery. In the 55AA context, software engineering is taught as disciplined work for reliability, security, and long-term maintenance."
    ),
    positioning: text(
      "这是 55AA 课程体系中的工程入口课，也是后续软件安全、程序分析、安全基线与合规自动化课程的实践基础。",
      "This is the engineering entry course in the 55AA curriculum and a practical foundation for later courses in software security, program analysis, and security baseline automation."
    ),
    prerequisites: {
      zh: [
        "至少掌握一门通用编程语言，能够独立完成 1000 行左右的程序。",
        "理解基本数据结构、模块化、命令行、Git 和单元测试的基本概念。",
        "愿意在团队中接受代码评审、重构建议和持续交付约束。"
      ],
      en: [
        "Ability to program independently in at least one general-purpose language and complete programs of roughly 1000 lines.",
        "Basic understanding of data structures, modularity, command-line tools, Git, and unit testing.",
        "Willingness to work in a team under code review, refactoring, and continuous delivery constraints."
      ]
    },
    learningOutcomes: {
      zh: [
        "把开放式需求分解为用户故事、质量属性、验收标准和可排期任务。",
        "设计具有清晰边界的模块、接口和数据模型，并能解释设计取舍。",
        "使用版本控制、代码评审、静态检查、测试和 CI 维护团队代码质量。",
        "编写覆盖正常路径、边界条件、错误处理和回归风险的测试。",
        "用迭代方式交付一个可运行系统，并通过监控、文档和发布流程支持后续维护。",
        "识别常见工程风险，包括需求漂移、技术债、供应链依赖、安全缺陷和团队协作失效。"
      ],
      en: [
        "Decompose open-ended requirements into user stories, quality attributes, acceptance criteria, and schedulable tasks.",
        "Design modules, interfaces, and data models with clear boundaries and explain the tradeoffs.",
        "Use version control, code review, static checks, tests, and CI to maintain team code quality.",
        "Write tests that cover normal paths, boundary cases, error handling, and regression risks.",
        "Deliver a working system iteratively and support maintenance through monitoring, documentation, and release processes.",
        "Identify common engineering risks including requirements drift, technical debt, dependency risk, security flaws, and team coordination failure."
      ]
    },
    format: {
      zh: [
        "每周 2 次课堂：一次概念与案例，一次设计评审、代码评审或项目工作坊。",
        "每 2 周一次迭代交付，要求有可演示功能、测试结果和复盘记录。",
        "课程项目采用 4 到 5 人团队，题目优先选择实验室工具、课程平台、数据处理或安全工程相关系统。"
      ],
      en: [
        "Two meetings per week: one for concepts and cases, one for design review, code review, or project studio work.",
        "A deliverable iteration every two weeks, including a working demo, test results, and a short retrospective.",
        "The course project is completed by teams of 4 to 5 students, preferably on lab tooling, course platforms, data processing, or security engineering systems."
      ]
    },
    assessment: [
      {
        item: text("个人作业", "Individual assignments"),
        weight: 20,
        description: text("需求分析、接口设计、测试设计、重构和故障复盘等短作业。", "Short assignments on requirements analysis, interface design, test design, refactoring, and failure review.")
      },
      {
        item: text("团队项目", "Team project"),
        weight: 40,
        description: text("四次迭代交付，评分关注用户价值、工程质量、测试证据、可维护性和安全意识。", "Four iterative deliveries graded on user value, engineering quality, test evidence, maintainability, and security awareness.")
      },
      {
        item: text("代码评审与工程记录", "Code review and engineering records"),
        weight: 15,
        description: text("Pull request 质量、评审反馈、issue 管理、设计记录和发布记录。", "Pull request quality, review feedback, issue management, design records, and release notes.")
      },
      {
        item: text("期末技术报告与演示", "Final technical report and demo"),
        weight: 20,
        description: text("说明系统目标、架构、关键实现、测试与部署、已知限制和后续路线图。", "A report covering system goals, architecture, key implementation choices, testing and deployment, known limits, and a roadmap.")
      },
      {
        item: text("课堂参与", "Participation"),
        weight: 5,
        description: text("参与讨论、评审、项目例会和同伴反馈。", "Participation in discussions, reviews, project meetings, and peer feedback.")
      }
    ],
    weeklyPlan: [
      { week: 1, topic: text("软件工程为什么难", "Why software engineering is hard"), work: text("分析一个失败项目，建立团队仓库和工作协议。", "Analyze a failed project; set up the team repository and working agreement.") },
      { week: 2, topic: text("需求、用户故事与质量属性", "Requirements, user stories, and quality attributes"), work: text("把开放题目写成用户故事、验收标准和风险清单。", "Turn an open-ended topic into user stories, acceptance criteria, and a risk list.") },
      { week: 3, topic: text("架构边界、接口与数据模型", "Architecture boundaries, interfaces, and data models"), work: text("提交架构草图、核心接口和第一个 ADR。", "Submit an architecture sketch, core interfaces, and the first ADR.") },
      { week: 4, topic: text("版本控制、分支策略与代码评审", "Version control, branching, and code review"), work: text("完成第一次可运行迭代和一次正式代码评审。", "Complete the first working iteration and a formal code review.") },
      { week: 5, topic: text("测试策略：单元、集成、端到端", "Testing strategy: unit, integration, and end-to-end"), work: text("为关键路径补测试，并定义测试覆盖目标。", "Add tests for critical paths and define coverage goals.") },
      { week: 6, topic: text("可维护代码与重构", "Maintainable code and refactoring"), work: text("识别技术债，完成一次有测试保护的重构。", "Identify technical debt and complete one test-protected refactoring.") },
      { week: 7, topic: text("错误处理、日志与可观测性", "Error handling, logging, and observability"), work: text("为项目加入结构化日志、错误边界和基本监控指标。", "Add structured logs, error boundaries, and basic monitoring signals.") },
      { week: 8, topic: text("中期项目评审", "Midterm project review"), work: text("演示第二次迭代，提交中期复盘和调整后的路线图。", "Demo the second iteration; submit a midterm retrospective and revised roadmap.") },
      { week: 9, topic: text("持续集成、自动化检查与发布", "CI, automated checks, and release"), work: text("建立 CI 流水线，自动运行格式、静态检查和测试。", "Create a CI pipeline that runs formatting, static checks, and tests.") },
      { week: 10, topic: text("安全需求与安全编码基础", "Security requirements and secure coding basics"), work: text("做一次威胁建模，修复至少两个安全或健壮性问题。", "Perform threat modeling and fix at least two security or robustness issues.") },
      { week: 11, topic: text("依赖、配置与供应链风险", "Dependencies, configuration, and supply-chain risk"), work: text("审计依赖、锁定配置，并补充部署文档。", "Audit dependencies, lock down configuration, and improve deployment docs.") },
      { week: 12, topic: text("性能、容量与可靠性取舍", "Performance, capacity, and reliability tradeoffs"), work: text("设计一个小型负载实验，解释瓶颈和改进方案。", "Design a small load experiment and explain bottlenecks and improvements.") },
      { week: 13, topic: text("团队协作、项目管理与工程伦理", "Team coordination, project management, and engineering ethics"), work: text("更新 issue 计划、责任分工和风险登记表。", "Update the issue plan, responsibility split, and risk register.") },
      { week: 14, topic: text("第三次迭代评审与可用性测试", "Third iteration review and usability testing"), work: text("邀请目标用户试用，记录反馈并确定最终修复清单。", "Run a user test, record feedback, and decide the final fix list.") },
      { week: 15, topic: text("文档、移交与长期维护", "Documentation, handoff, and long-term maintenance"), work: text("完成 README、运维手册、测试说明和已知问题清单。", "Finish the README, operations guide, test guide, and known-issues list.") },
      { week: 16, topic: text("最终演示与工程复盘", "Final demo and engineering retrospective"), work: text("交付最终版本、技术报告、演示和个人复盘。", "Deliver the final version, technical report, demo, and individual reflection.") }
    ],
    project: text(
      "团队项目必须有真实用户或明确使用场景。最低交付要求包括：可运行部署、核心功能演示、自动化测试、代码评审记录、威胁建模记录、发布说明和维护文档。鼓励选择能被实验室后续复用的系统，例如课程资料管理、论文与项目展示、实验平台、数据采集清洗工具、轻量级安全扫描或合规检查工具。",
      "The team project must have real users or a clear usage scenario. Minimum deliverables include a runnable deployment, core feature demo, automated tests, code review records, threat-modeling notes, release notes, and maintenance documentation. Students are encouraged to build systems the lab can continue to use, such as course material management, publication and project pages, lab platforms, data ingestion tools, lightweight security scanners, or compliance checkers."
    ),
    policies: commonPolicies
  },

  "55AA-002": course({
    summary: text("软件安全把软件工程、程序分析和攻击者思维连接起来。课程围绕内存安全、输入验证、Web 与 API 安全、依赖风险、模糊测试、静态分析和安全修复展开，目标不是只会利用漏洞，而是能把漏洞产生、发现、验证和修复放进工程流程。", "Software Security connects software engineering, program analysis, and adversarial thinking. The course covers memory safety, input validation, web and API security, dependency risk, fuzzing, static analysis, and secure remediation. The goal is not only exploit writing, but understanding how vulnerabilities arise, are found, validated, and fixed in an engineering workflow."),
    positioning: text("这是软件工程之后的安全入口课，也是系统安全、程序分析和安全基线自动化的共同基础。", "This is the security entry course after software engineering and a foundation for system security, program analysis, and security baseline automation."),
    prerequisites: { zh: ["熟悉一门系统或后端编程语言。", "理解 Git、测试、HTTP 和基本数据库概念。", "建议先修软件工程或具备团队项目经验。"], en: ["Familiarity with one systems or backend programming language.", "Understanding of Git, testing, HTTP, and basic database concepts.", "Software engineering or equivalent team project experience is recommended."] },
    outcomes: { zh: ["解释常见软件漏洞的根因和可利用条件。", "使用静态分析、动态测试和模糊测试发现缺陷。", "编写最小复现、漏洞说明和修复补丁。", "把安全检查接入 CI 和发布流程。", "评估依赖、配置和接口带来的软件供应链风险。"], en: ["Explain root causes and exploitability conditions for common software vulnerabilities.", "Use static analysis, dynamic testing, and fuzzing to find defects.", "Write minimal reproducers, vulnerability reports, and patches.", "Integrate security checks into CI and release workflows.", "Assess software supply-chain risk from dependencies, configuration, and interfaces."] },
    weeks: [
      { topic: text("软件漏洞模型与安全工程流程", "Vulnerability models and secure engineering workflow"), work: text("分析真实漏洞公告，拆解根因、影响和修复。", "Analyze real advisories and separate root cause, impact, and fix.") },
      { topic: text("内存安全与未定义行为", "Memory safety and undefined behavior"), work: text("复现缓冲区、释放后使用和整数错误。", "Reproduce buffer, use-after-free, and integer bugs.") },
      { topic: text("输入验证、序列化与注入", "Input validation, serialization, and injection"), work: text("构造注入测试并修复解析边界。", "Build injection tests and fix parsing boundaries.") },
      { topic: text("Web、API 与认证授权", "Web, API, authentication, and authorization"), work: text("审计一个小型 Web 服务的访问控制。", "Audit access control in a small web service.") },
      { topic: text("模糊测试与动态检测", "Fuzzing and dynamic detection"), work: text("为目标库接入 fuzz harness 和 sanitizer。", "Add a fuzz harness and sanitizers to a target library.") },
      { topic: text("静态分析、代码查询与误报处理", "Static analysis, code queries, and triage"), work: text("编写查询规则并整理告警优先级。", "Write query rules and triage alerts by priority.") },
      { topic: text("依赖、构建和供应链安全", "Dependency, build, and supply-chain security"), work: text("生成 SBOM，评估依赖升级和锁定策略。", "Generate an SBOM and assess upgrade and pinning strategy.") },
      { topic: text("安全修复、披露与回归测试", "Secure remediation, disclosure, and regression tests"), work: text("提交最终修复、测试证据和披露草稿。", "Submit the final patch, test evidence, and disclosure draft.") }
    ],
    project: text("学生选择一个开源或课程提供的软件目标，完成威胁建模、漏洞发现、复现、修复和回归测试。最终交付包括安全报告、补丁、测试证据和可重复运行的分析脚本。", "Students choose an open-source or course-provided target and complete threat modeling, vulnerability discovery, reproduction, remediation, and regression testing. Deliverables include a security report, patch, test evidence, and reproducible analysis scripts."),
    projectAssessment: text("漏洞分析、测试 harness、修复补丁和安全报告。", "Vulnerability analysis, test harnesses, remediation patches, and security reports.")
  }),

  "55AA-003": course({
    summary: text("系统安全关注操作系统、硬件、网络和应用之间的信任边界。课程从攻击面建模开始，覆盖隔离、权限、内核攻击、防御机制、侧信道、沙箱、检测与响应，训练学生在真实系统约束下分析安全机制是否有效。", "System Security studies trust boundaries across operating systems, hardware, networks, and applications. Starting from attack-surface modeling, the course covers isolation, privilege, kernel attacks, defenses, side channels, sandboxing, detection, and response, training students to evaluate mechanisms under real system constraints."),
    positioning: text("这是 55AA 本科安全方向的核心课程，也是硬件安全、取证、虚拟化、可信计算和合规自动化等研究生课程的前置基础。", "This is the core undergraduate security course and the prerequisite base for graduate courses in hardware security, forensics, virtualization, trusted computing, and compliance automation."),
    prerequisites: { zh: ["操作系统、系统编程和计算机网络基础。", "能够阅读 C/C++ 或 Rust 系统代码。", "具备基础软件安全知识更佳。"], en: ["Operating systems, systems programming, and networking fundamentals.", "Ability to read C/C++ or Rust systems code.", "Basic software security background is helpful."] },
    outcomes: { zh: ["识别系统信任边界、攻击面和权限路径。", "解释隔离、访问控制、内存保护和审计机制。", "复现实验级系统攻击并分析前提条件。", "评估系统防御的覆盖范围、成本和绕过方式。", "完成一份可复现的系统安全实验报告。"], en: ["Identify trust boundaries, attack surfaces, and privilege paths.", "Explain isolation, access control, memory protection, and auditing mechanisms.", "Reproduce lab-scale system attacks and analyze preconditions.", "Evaluate coverage, cost, and bypasses of system defenses.", "Produce a reproducible system-security lab report."] },
    weeks: [
      { topic: text("系统安全模型与攻击面", "System security models and attack surfaces"), work: text("为一个 Linux 服务建立资产和攻击面图。", "Build an asset and attack-surface map for a Linux service.") },
      { topic: text("权限、身份和访问控制", "Privilege, identity, and access control"), work: text("比较 DAC、MAC、capability 和 sandbox 策略。", "Compare DAC, MAC, capability, and sandbox policies.") },
      { topic: text("内存保护与漏洞利用缓解", "Memory protection and exploit mitigations"), work: text("实验 ASLR、NX、canary 和 CFI 的边界。", "Experiment with ASLR, NX, canaries, and CFI boundaries.") },
      { topic: text("内核攻击与驱动安全", "Kernel attacks and driver security"), work: text("审计一个小型内核模块或驱动样例。", "Audit a small kernel module or driver sample.") },
      { topic: text("隔离、容器与沙箱", "Isolation, containers, and sandboxes"), work: text("配置容器隔离并测试逃逸前提。", "Configure container isolation and test escape preconditions.") },
      { topic: text("侧信道与微架构安全", "Side channels and microarchitectural security"), work: text("复现实验级缓存侧信道并讨论缓解。", "Reproduce a lab cache side channel and discuss mitigations.") },
      { topic: text("检测、日志与响应", "Detection, logging, and response"), work: text("设计主机侧检测规则和事件时间线。", "Design host detection rules and an event timeline.") },
      { topic: text("系统安全评估与报告", "System security evaluation and reporting"), work: text("提交最终攻击链、防御评估和复现材料。", "Submit the final attack chain, defense evaluation, and reproducibility package.") }
    ],
    project: text("项目要求学生选择一个系统组件，完成威胁建模、攻击或绕过实验、防御评估和复现实验包。鼓励对象包括容器、内核接口、浏览器沙箱、身份服务和系统监控组件。", "Students choose a system component and complete threat modeling, attack or bypass experiments, defense evaluation, and a reproducibility package. Suggested targets include containers, kernel interfaces, browser sandboxes, identity services, and system monitoring components."),
    projectAssessment: text("系统威胁模型、攻击或绕过实验、防御评估和复现材料。", "System threat models, attack or bypass experiments, defense evaluation, and reproducibility packages.")
  }),

  "55AA-004": course({
    summary: text("操作系统课程把抽象概念和可运行内核实验放在一起：进程、线程、内存、文件系统、设备、中断、并发和虚拟化都通过实现与调试来学习。课程特别强调安全语境下的隔离、权限、资源控制和故障边界。", "Operating Systems combines abstractions with runnable kernel experiments: processes, threads, memory, file systems, devices, interrupts, concurrency, and virtualization are learned through implementation and debugging. The course emphasizes isolation, privilege, resource control, and failure boundaries in security contexts."),
    positioning: text("这是系统安全、虚拟化、取证和嵌入式安全的核心系统基础课。", "This is a core systems foundation for system security, virtualization, forensics, and embedded security."),
    prerequisites: { zh: ["计算机组成、汇编语言和系统编程。", "熟悉 C 或 Rust，能够使用调试器和命令行工具。", "理解基本数据结构和并发问题。"], en: ["Computer organization, assembly language, and systems programming.", "Familiarity with C or Rust, debuggers, and command-line tools.", "Understanding of basic data structures and concurrency issues."] },
    outcomes: { zh: ["实现或修改关键 OS 子系统。", "解释进程、虚拟内存、文件系统和设备抽象。", "调试并发、内存和性能问题。", "分析隔离、权限和资源控制机制的安全影响。", "用实验报告清楚呈现设计、bug 和性能证据。"], en: ["Implement or modify key OS subsystems.", "Explain process, virtual memory, file-system, and device abstractions.", "Debug concurrency, memory, and performance problems.", "Analyze security implications of isolation, privilege, and resource control.", "Present design, bugs, and performance evidence clearly in lab reports."] },
    weeks: [
      { topic: text("内核结构、启动和调试", "Kernel structure, boot, and debugging"), work: text("启动教学内核，完成调试环境和第一次系统调用。", "Boot the teaching kernel, set up debugging, and implement the first syscall.") },
      { topic: text("进程、线程和调度", "Processes, threads, and scheduling"), work: text("实现调度或同步相关实验。", "Implement a scheduling or synchronization lab.") },
      { topic: text("虚拟内存与地址空间", "Virtual memory and address spaces"), work: text("完成页表、缺页或内存映射实验。", "Complete a page-table, page-fault, or memory-mapping lab.") },
      { topic: text("并发、锁和死锁", "Concurrency, locks, and deadlock"), work: text("定位并修复一个内核并发 bug。", "Locate and fix a kernel concurrency bug.") },
      { topic: text("文件系统与持久化", "File systems and persistence"), work: text("实现文件系统功能并测试崩溃一致性。", "Implement file-system functionality and test crash consistency.") },
      { topic: text("设备、中断和 I/O", "Devices, interrupts, and I/O"), work: text("分析一个驱动路径的性能和故障模式。", "Analyze performance and failure modes of a driver path.") },
      { topic: text("隔离、权限和容器基础", "Isolation, privilege, and container basics"), work: text("实验 namespace、cgroup 或 capability。", "Experiment with namespaces, cgroups, or capabilities.") },
      { topic: text("OS 设计复盘与安全边界", "OS design review and security boundaries"), work: text("提交最终内核实验、测试和设计文档。", "Submit the final kernel lab, tests, and design document.") }
    ],
    project: text("课程项目围绕一个教学内核或小型系统组件展开，要求实现一个明确子系统，并提供设计说明、测试、性能或安全分析。", "The project extends a teaching kernel or small systems component. Students implement a clear subsystem and provide design notes, tests, and performance or security analysis."),
    projectAssessment: text("内核实验、调试记录、测试和设计说明。", "Kernel labs, debugging records, tests, and design notes.")
  }),

  "55AA-005": course({
    summary: text("计算机体系结构从指令集、流水线、缓存、内存层次、并行性和加速器出发，讨论性能、能耗、可靠性和安全之间的取舍。课程不仅讲结构，还要求学生用模拟和测量解释真实程序为什么快或慢。", "Computer Architecture starts from ISAs, pipelines, caches, memory hierarchies, parallelism, and accelerators, then studies tradeoffs among performance, energy, reliability, and security. Students use simulation and measurement to explain why real programs are fast or slow."),
    positioning: text("这是硬件安全、系统安全、虚拟化和嵌入式系统的硬件基础。", "This is the hardware foundation for hardware security, system security, virtualization, and embedded systems."),
    prerequisites: { zh: ["计算机组成和汇编语言。", "熟悉 C/C++ 或 Rust，并能阅读简单汇编。", "具备基本概率、统计和实验分析能力。"], en: ["Computer organization and assembly language.", "Familiarity with C/C++ or Rust and ability to read simple assembly.", "Basic probability, statistics, and experimental-analysis skills."] },
    outcomes: { zh: ["解释现代处理器和内存系统的关键结构。", "用指标评估性能、局部性、并行性和能耗。", "分析缓存、分支预测和乱序执行对安全的影响。", "使用模拟器或性能计数器完成实验。", "提出有证据支持的体系结构设计取舍。"], en: ["Explain key structures in modern processors and memory systems.", "Evaluate performance, locality, parallelism, and energy using metrics.", "Analyze security implications of caches, branch prediction, and out-of-order execution.", "Use simulators or performance counters in experiments.", "Make evidence-based architectural design tradeoffs."] },
    weeks: [
      { topic: text("ISA、微结构和性能模型", "ISA, microarchitecture, and performance models"), work: text("测量一个程序的 CPI 和瓶颈。", "Measure CPI and bottlenecks for a program.") },
      { topic: text("流水线、冒险和预测", "Pipelines, hazards, and prediction"), work: text("用模拟器观察流水线停顿和分支影响。", "Use a simulator to observe stalls and branch effects.") },
      { topic: text("缓存和内存层次", "Caches and memory hierarchy"), work: text("设计局部性实验并解释 miss 模式。", "Design locality experiments and explain miss patterns.") },
      { topic: text("乱序、投机和一致性", "Out-of-order execution, speculation, and consistency"), work: text("分析投机优化和安全风险。", "Analyze speculative optimization and security risks.") },
      { topic: text("多核、同步和内存模型", "Multicore, synchronization, and memory models"), work: text("测试并发程序在不同内存模型下的行为。", "Test concurrent program behavior under memory models.") },
      { topic: text("向量、GPU 和专用加速器", "Vector units, GPUs, and accelerators"), work: text("比较 CPU 和加速器实现的性能。", "Compare CPU and accelerator implementations.") },
      { topic: text("可靠性、功耗和安全", "Reliability, power, and security"), work: text("评估一个设计在性能和安全上的折中。", "Evaluate performance-security tradeoffs in a design.") },
      { topic: text("体系结构实验报告", "Architecture experiment report"), work: text("提交可复现测量、图表和设计结论。", "Submit reproducible measurements, plots, and design conclusions.") }
    ],
    project: text("项目要求学生选择一个体系结构问题，通过模拟器、性能计数器或基准测试收集证据，提出并评估一个设计或优化方案。", "Students choose an architecture problem, collect evidence with simulation, performance counters, or benchmarks, and evaluate a design or optimization."),
    projectAssessment: text("性能实验、模拟结果、设计评估和报告。", "Performance experiments, simulation results, design evaluation, and reports.")
  }),

  "55AA-006": course({
    summary: text("计算机组成讲清从逻辑门到可执行程序之间的层次：数字逻辑、数据通路、控制器、指令集、汇编、存储器和 I/O。课程目标是让学生理解软件运行在什么机器上，而不是把硬件当作黑盒。", "Computer Organization explains the layers from logic gates to executable programs: digital logic, datapaths, controllers, ISAs, assembly, memory, and I/O. The goal is for students to understand the machine underneath software instead of treating hardware as a black box."),
    positioning: text("这是汇编语言、系统编程、体系结构、操作系统和可信计算的底层基础。", "This is the low-level foundation for assembly, systems programming, architecture, operating systems, and trusted computing."),
    prerequisites: { zh: ["程序设计基础和离散数学基础。", "能阅读简单 C 程序并理解二进制表示。", "愿意完成硬件描述或模拟实验。"], en: ["Programming fundamentals and basic discrete mathematics.", "Ability to read simple C programs and understand binary representation.", "Willingness to complete hardware-description or simulation labs."] },
    outcomes: { zh: ["解释数字电路、组合逻辑和时序逻辑。", "构造基本数据通路和控制器。", "理解指令编码、调用约定和内存访问。", "分析缓存、流水线和 I/O 的基本行为。", "把高级语言行为映射到机器级执行。"], en: ["Explain digital circuits, combinational logic, and sequential logic.", "Construct basic datapaths and controllers.", "Understand instruction encoding, calling conventions, and memory access.", "Analyze basic behavior of caches, pipelines, and I/O.", "Map high-level language behavior to machine-level execution."] },
    weeks: [
      { topic: text("信息表示与布尔逻辑", "Information representation and Boolean logic"), work: text("完成整数、浮点和逻辑电路练习。", "Complete integer, floating-point, and logic-circuit exercises.") },
      { topic: text("组合逻辑与时序逻辑", "Combinational and sequential logic"), work: text("实现 ALU 和寄存器文件。", "Implement an ALU and register file.") },
      { topic: text("指令集与汇编视角", "Instruction sets from the assembly view"), work: text("手工跟踪指令执行和调用栈。", "Trace instruction execution and call stacks by hand.") },
      { topic: text("单周期和多周期数据通路", "Single-cycle and multi-cycle datapaths"), work: text("扩展教学 CPU 的一条指令。", "Extend a teaching CPU with one instruction.") },
      { topic: text("流水线和冒险", "Pipelines and hazards"), work: text("分析数据冒险和控制冒险。", "Analyze data and control hazards.") },
      { topic: text("存储器层次和缓存", "Memory hierarchy and caches"), work: text("测量缓存局部性对程序的影响。", "Measure the impact of locality on program behavior.") },
      { topic: text("I/O、中断和总线", "I/O, interrupts, and buses"), work: text("解释一次设备交互的完整路径。", "Explain the full path of a device interaction.") },
      { topic: text("从组成到系统软件", "From organization to systems software"), work: text("提交处理器实验和机器级分析报告。", "Submit the processor lab and machine-level analysis report.") }
    ],
    project: text("学生实现或扩展一个教学处理器、汇编器或模拟器，并用测试程序证明其行为正确。", "Students implement or extend a teaching processor, assembler, or simulator and prove correctness with test programs."),
    projectAssessment: text("硬件或模拟器实验、测试程序和机器级解释。", "Hardware or simulator labs, test programs, and machine-level explanations.")
  }),

  "55AA-006B": course({
    summary: text("汇编语言课程训练学生直接理解机器状态：寄存器、栈、调用约定、链接、异常、系统调用和反汇编。课程采用 RISC-V 与 x86-64 对照，服务于系统编程、逆向分析、漏洞利用和性能调试。", "Assembly Language trains students to reason directly about machine state: registers, stacks, calling conventions, linking, exceptions, system calls, and disassembly. The course compares RISC-V and x86-64 for systems programming, reverse engineering, exploitation, and performance debugging."),
    positioning: text("这是系统编程、软件安全、应用密码学实现和嵌入式系统的机器级基础。", "This is the machine-level foundation for systems programming, software security, cryptographic implementation, and embedded systems."),
    prerequisites: { zh: ["计算机组成基础。", "熟悉 C 语言指针、数组和函数调用。", "能够使用命令行、编译器和调试器。"], en: ["Computer organization fundamentals.", "Familiarity with C pointers, arrays, and function calls.", "Ability to use command-line tools, compilers, and debuggers."] },
    outcomes: { zh: ["阅读和编写小型汇编程序。", "解释 ABI、调用约定、栈帧和链接过程。", "用调试器和反汇编工具定位机器级 bug。", "理解整数、内存和控制流错误的机器表现。", "为系统代码和安全分析建立机器级直觉。"], en: ["Read and write small assembly programs.", "Explain ABIs, calling conventions, stack frames, and linking.", "Use debuggers and disassemblers to locate machine-level bugs.", "Understand machine-level manifestations of integer, memory, and control-flow errors.", "Build machine-level intuition for systems code and security analysis."] },
    weeks: [
      { topic: text("ISA、寄存器和指令格式", "ISAs, registers, and instruction formats"), work: text("手写 RISC-V 小程序并单步执行。", "Write and single-step a small RISC-V program.") },
      { topic: text("数据表示、寻址和内存", "Data representation, addressing, and memory"), work: text("分析数组、结构体和指针访问。", "Analyze array, struct, and pointer access.") },
      { topic: text("控制流和函数调用", "Control flow and function calls"), work: text("还原 C 函数的汇编控制流。", "Recover C control flow from assembly.") },
      { topic: text("ABI、栈帧和链接", "ABIs, stack frames, and linking"), work: text("调试调用约定和链接错误。", "Debug calling-convention and linking errors.") },
      { topic: text("系统调用、异常和中断", "System calls, exceptions, and interrupts"), work: text("实现一个最小用户态系统调用封装。", "Implement a minimal user-space syscall wrapper.") },
      { topic: text("x86-64 对照与反汇编", "x86-64 comparison and disassembly"), work: text("用 objdump 和 gdb 还原程序行为。", "Use objdump and gdb to recover program behavior.") },
      { topic: text("机器级安全和性能", "Machine-level security and performance"), work: text("观察栈破坏、ROP 片段和热点循环。", "Observe stack corruption, ROP fragments, and hot loops.") },
      { topic: text("汇编项目与复盘", "Assembly project and review"), work: text("提交汇编库、测试和调试笔记。", "Submit an assembly library, tests, and debugging notes.") }
    ],
    project: text("学生实现一个小型汇编库、解释器片段或逆向分析任务，要求给出测试、调试记录和与 C 实现的对照。", "Students implement a small assembly library, interpreter fragment, or reverse-engineering task with tests, debugging notes, and comparison against a C implementation."),
    projectAssessment: text("汇编实现、反汇编分析、调试记录和测试。", "Assembly implementation, disassembly analysis, debugging records, and tests.")
  }),

  "55AA-007": course({
    summary: text("离散数学为计算机系统和安全课程提供证明、建模和抽象能力。课程围绕逻辑、集合、关系、函数、归纳、组合、图、树、自动机和基础概率展开，所有主题都尽量连接到程序、协议、密码和系统设计。", "Discrete Mathematics provides proof, modeling, and abstraction skills for computing systems and security. The course covers logic, sets, relations, functions, induction, counting, graphs, trees, automata, and basic probability, tying topics to programs, protocols, cryptography, and system design."),
    positioning: text("这是应用密码学、编译原理、程序分析和网络协议验证的数学入口课。", "This is the mathematical entry course for applied cryptography, compilers, program analysis, and protocol verification."),
    prerequisites: { zh: ["高中数学和基础编程经验。", "愿意练习形式化表达和严谨证明。", "不要求高等数学背景。"], en: ["High-school mathematics and basic programming experience.", "Willingness to practice formal expression and rigorous proof.", "No advanced mathematics background required."] },
    outcomes: { zh: ["使用命题逻辑和谓词逻辑表达计算性质。", "完成直接证明、反证、归纳和构造性证明。", "用图、关系和自动机描述系统结构。", "解决组合计数和基础概率问题。", "把数学模型连接到程序正确性、协议和密码应用。"], en: ["Use propositional and predicate logic to express computational properties.", "Write direct, contradiction, induction, and constructive proofs.", "Model system structures with graphs, relations, and automata.", "Solve counting and basic probability problems.", "Connect mathematical models to program correctness, protocols, and cryptographic applications."] },
    weeks: [
      { topic: text("逻辑、命题和谓词", "Logic, propositions, and predicates"), work: text("把程序性质翻译为逻辑表达式。", "Translate program properties into logical formulas.") },
      { topic: text("证明方法和归纳", "Proof methods and induction"), work: text("完成递归程序正确性的归纳证明。", "Prove correctness of a recursive program by induction.") },
      { topic: text("集合、关系和函数", "Sets, relations, and functions"), work: text("建模访问控制和等价关系。", "Model access control and equivalence relations.") },
      { topic: text("组合计数", "Counting and combinatorics"), work: text("分析密码空间和碰撞概率。", "Analyze key spaces and collision probabilities.") },
      { topic: text("图、树和遍历", "Graphs, trees, and traversal"), work: text("用图表示依赖、攻击路径或控制流。", "Represent dependencies, attack paths, or control flow as graphs.") },
      { topic: text("递推、复杂度和渐近", "Recurrences, complexity, and asymptotics"), work: text("分析算法成本和协议状态增长。", "Analyze algorithm cost and protocol-state growth.") },
      { topic: text("自动机和形式语言入门", "Automata and formal languages"), work: text("构造一个词法规则或协议状态机。", "Construct a lexical rule or protocol state machine.") },
      { topic: text("概率模型和随机算法", "Probability models and randomized algorithms"), work: text("完成随机实验和安全参数分析。", "Complete a randomized experiment and security-parameter analysis.") }
    ],
    project: text("学生选择一个计算或安全主题，用离散结构建模并完成证明或实验说明，例如协议状态机、访问控制关系、控制流图或密码参数分析。", "Students model a computing or security topic with discrete structures and provide proof or experimental explanation, such as protocol state machines, access-control relations, control-flow graphs, or cryptographic parameter analysis."),
    projectAssessment: text("证明作业、建模练习和小型数学应用项目。", "Proof assignments, modeling exercises, and a small mathematical application project.")
  }),

  "55AA-008": course({
    summary: text("系统编程训练学生在操作系统接口之上构建可靠程序：进程、线程、文件、网络、内存、同步、构建系统和调试工具都以实践为主。课程强调资源生命周期、错误处理和可观测性。", "Systems Programming trains students to build reliable programs on top of operating-system interfaces: processes, threads, files, networks, memory, synchronization, build systems, and debugging tools are taught through practice. The course emphasizes resource lifetimes, error handling, and observability."),
    positioning: text("这是操作系统、网络、软件安全、嵌入式和系统安全课程的实践桥梁。", "This is the practical bridge to operating systems, networking, software security, embedded systems, and system security."),
    prerequisites: { zh: ["计算机组成和汇编语言。", "熟悉 C、C++ 或 Rust 中至少一种。", "能够使用 Linux 命令行和 Git。"], en: ["Computer organization and assembly language.", "Familiarity with at least one of C, C++, or Rust.", "Ability to use the Linux command line and Git."] },
    outcomes: { zh: ["正确使用进程、文件、管道、socket 和线程。", "管理内存、句柄和资源生命周期。", "编写健壮的错误处理、日志和测试。", "使用调试器、追踪器和性能工具定位问题。", "构建一个小型系统工具或服务。"], en: ["Use processes, files, pipes, sockets, and threads correctly.", "Manage memory, handles, and resource lifetimes.", "Write robust error handling, logging, and tests.", "Use debuggers, tracers, and performance tools to locate problems.", "Build a small systems tool or service."] },
    weeks: [
      { topic: text("Unix 编程模型和工具链", "Unix programming model and toolchain"), work: text("实现一个命令行工具并接入测试。", "Implement a command-line tool and add tests.") },
      { topic: text("文件、目录和错误处理", "Files, directories, and error handling"), work: text("编写可靠文件处理程序。", "Write a reliable file-processing program.") },
      { topic: text("进程、管道和信号", "Processes, pipes, and signals"), work: text("实现一个小型 shell 或任务运行器。", "Implement a small shell or task runner.") },
      { topic: text("内存、所有权和调试", "Memory, ownership, and debugging"), work: text("用 sanitizer 或 valgrind 修复内存问题。", "Fix memory issues with sanitizers or valgrind.") },
      { topic: text("线程、同步和并发 bug", "Threads, synchronization, and concurrency bugs"), work: text("实现并调试一个并发队列或服务器。", "Implement and debug a concurrent queue or server.") },
      { topic: text("Socket、协议和网络服务", "Sockets, protocols, and network services"), work: text("实现一个简单网络服务和客户端。", "Implement a simple network service and client.") },
      { topic: text("构建、部署和可观测性", "Build, deployment, and observability"), work: text("加入日志、指标和 CI 检查。", "Add logs, metrics, and CI checks.") },
      { topic: text("系统工具项目", "Systems tool project"), work: text("提交工具、测试、性能和故障说明。", "Submit the tool, tests, performance notes, and failure analysis.") }
    ],
    project: text("项目要求学生实现一个小型系统工具或服务，例如并发下载器、日志收集器、代理、文件同步器或实验平台组件。", "Students implement a small systems tool or service, such as a concurrent downloader, log collector, proxy, file synchronizer, or lab-platform component."),
    projectAssessment: text("系统程序、测试、调试记录和运行说明。", "Systems programs, tests, debugging records, and runbooks.")
  }),

  "55AA-009": course({
    summary: text("编译原理课程围绕一个可运行编译器展开，从词法、语法、语义、IR、优化到代码生成。课程把编译器作为理解程序语言、静态分析、运行时和安全检查的共同基础。", "Compiler Principles is organized around a working compiler, from lexing, parsing, semantic analysis, IR, optimization, to code generation. The compiler is treated as a common foundation for programming languages, static analysis, runtimes, and security checks."),
    positioning: text("这是程序分析、软件安全和形式化工具链的基础课程。", "This is a foundation for program analysis, software security, and formal tooling."),
    prerequisites: { zh: ["离散数学、数据结构和系统编程。", "熟悉至少一门强类型或脚本语言。", "能阅读递归算法和基本形式语言材料。"], en: ["Discrete mathematics, data structures, and systems programming.", "Familiarity with at least one typed or scripting language.", "Ability to read recursive algorithms and basic formal-language material."] },
    outcomes: { zh: ["实现词法分析、语法分析和语义检查。", "设计中间表示并完成基本优化。", "生成可执行或可解释的目标代码。", "理解类型、作用域、控制流和数据流。", "把编译技术应用到静态检查和安全工具。"], en: ["Implement lexing, parsing, and semantic checks.", "Design an intermediate representation and basic optimizations.", "Generate executable or interpretable target code.", "Understand types, scope, control flow, and data flow.", "Apply compiler techniques to static checks and security tools."] },
    weeks: [
      { topic: text("语言设计和编译器结构", "Language design and compiler structure"), work: text("确定课程语言和测试框架。", "Define the course language and test framework.") },
      { topic: text("词法分析和正则语言", "Lexing and regular languages"), work: text("实现 lexer 和错误位置报告。", "Implement a lexer and source-location errors.") },
      { topic: text("语法分析和 AST", "Parsing and ASTs"), work: text("实现 parser 并输出 AST。", "Implement a parser and emit ASTs.") },
      { topic: text("作用域、类型和语义检查", "Scope, types, and semantic analysis"), work: text("完成符号表和类型检查。", "Complete symbol tables and type checking.") },
      { topic: text("IR、控制流和数据流", "IR, control flow, and data flow"), work: text("生成 IR 和控制流图。", "Generate IR and control-flow graphs.") },
      { topic: text("优化和分析", "Optimization and analysis"), work: text("实现常量传播或死代码消除。", "Implement constant propagation or dead-code elimination.") },
      { topic: text("代码生成和运行时", "Code generation and runtime"), work: text("生成目标代码或字节码解释器。", "Generate target code or a bytecode interpreter.") },
      { topic: text("编译器扩展与安全检查", "Compiler extensions and security checks"), work: text("加入一项语言特性或静态安全检查。", "Add a language feature or static security check.") }
    ],
    project: text("学生分阶段实现一个小型编译器，并在最后加入一个自选扩展，例如类型特性、优化、解释器、错误诊断或安全 lint。", "Students build a small compiler in stages and add a final extension such as a type feature, optimization, interpreter, diagnostics, or security lint."),
    projectAssessment: text("编译器阶段作业、测试套件和自选扩展。", "Compiler milestones, test suites, and a final extension.")
  }),

  "55AA-010": course({
    summary: text("程序分析课程研究如何自动理解程序行为。课程覆盖控制流、数据流、抽象解释、指针分析、符号执行、约束求解和静态安全检查，并要求学生实现一个能分析真实小程序的工具。", "Program Analysis studies how to automatically reason about program behavior. The course covers control flow, data flow, abstract interpretation, pointer analysis, symbolic execution, constraint solving, and static security checks, requiring students to implement a tool that analyzes real small programs."),
    positioning: text("这是软件安全、系统安全和协议验证之间的算法与工具桥梁。", "This is the algorithmic and tooling bridge among software security, system security, and protocol verification."),
    prerequisites: { zh: ["编译原理或等价的 AST/IR 基础。", "离散数学和基本算法。", "熟悉一种可用于实现分析器的语言。"], en: ["Compilers or equivalent AST/IR background.", "Discrete mathematics and basic algorithms.", "Familiarity with a language suitable for implementing analyzers."] },
    outcomes: { zh: ["构造 CFG、调用图和数据流事实。", "实现经典数据流分析和抽象解释。", "理解精度、可扩展性和健全性的取舍。", "使用约束求解或符号执行发现路径问题。", "设计一个静态安全检查器并评估误报漏报。"], en: ["Construct CFGs, call graphs, and data-flow facts.", "Implement classic data-flow analyses and abstract interpretation.", "Understand tradeoffs among precision, scalability, and soundness.", "Use constraint solving or symbolic execution to find path problems.", "Design a static security checker and evaluate false positives and false negatives."] },
    weeks: [
      { topic: text("程序表示和分析问题", "Program representations and analysis problems"), work: text("构造 AST、IR 和 CFG。", "Construct ASTs, IR, and CFGs.") },
      { topic: text("数据流分析框架", "Data-flow analysis framework"), work: text("实现活跃变量或到达定义分析。", "Implement liveness or reaching-definitions analysis.") },
      { topic: text("抽象解释和格", "Abstract interpretation and lattices"), work: text("实现区间或符号集合分析。", "Implement interval or symbolic-set analysis.") },
      { topic: text("指针、别名和堆抽象", "Pointers, aliasing, and heap abstraction"), work: text("比较上下文敏感与不敏感分析。", "Compare context-sensitive and insensitive analyses.") },
      { topic: text("过程间分析和调用图", "Interprocedural analysis and call graphs"), work: text("扩展分析器处理函数调用。", "Extend the analyzer to handle function calls.") },
      { topic: text("符号执行和约束求解", "Symbolic execution and constraint solving"), work: text("生成触发特定路径的输入。", "Generate inputs that trigger selected paths.") },
      { topic: text("安全检查和告警排序", "Security checks and alert ranking"), work: text("实现一个 taint 或 API misuse 检查。", "Implement a taint or API-misuse checker.") },
      { topic: text("分析工具评估", "Analyzer evaluation"), work: text("提交 benchmark、误报分析和改进计划。", "Submit benchmarks, false-positive analysis, and improvement plan.") }
    ],
    project: text("项目要求实现一个面向真实代码片段的静态分析器或符号执行工具，给出算法说明、benchmark、误报漏报分析和使用文档。", "Students implement a static analyzer or symbolic-execution tool for real code snippets, with algorithm notes, benchmarks, false-positive and false-negative analysis, and usage docs."),
    projectAssessment: text("分析器实现、benchmark、告警评估和报告。", "Analyzer implementation, benchmarks, alert evaluation, and report.")
  }),

  "55AA-011": course({
    summary: text("综合实践项目把学生在系统、安全、工程和研究方法课程中获得的能力合并到一个真实交付中。课程不是普通大作业，而是要求学生面对真实约束：需求变化、数据质量、部署环境、伦理边界和长期维护。", "Capstone Project integrates skills from systems, security, engineering, and research-method courses into a real delivery. It is not a large homework assignment; students must handle real constraints such as changing requirements, data quality, deployment environments, ethical boundaries, and long-term maintenance."),
    positioning: text("这是 55AA 课程体系的收束课程，适合在完成至少三门方向课程后修读。", "This is the integrating course in the 55AA curriculum, intended after at least three track courses."),
    prerequisites: { zh: ["至少完成软件工程和一门系统或安全核心课。", "具备团队开发、实验记录和技术写作经验。", "项目需通过开题评审。"], en: ["Completion of software engineering and at least one systems or security core course.", "Experience with team development, lab records, and technical writing.", "Project proposal must pass review."] },
    outcomes: { zh: ["提出清晰、有边界、可评估的项目目标。", "建立工程计划、风险清单和伦理审查记录。", "交付可运行、可复现、可维护的系统或研究原型。", "用数据和实验支撑技术结论。", "完成面向外部读者的技术报告和演示。"], en: ["Propose clear, bounded, and evaluable project goals.", "Create an engineering plan, risk register, and ethics review notes.", "Deliver a runnable, reproducible, and maintainable system or research prototype.", "Support technical claims with data and experiments.", "Complete a technical report and demo for external readers."] },
    weeks: [
      { topic: text("项目选题和问题定义", "Project selection and problem definition"), work: text("提交 one-page proposal 和成功标准。", "Submit a one-page proposal and success criteria.") },
      { topic: text("相关工作和需求调研", "Related work and requirements study"), work: text("完成竞品、论文或用户调研。", "Complete product, paper, or user research.") },
      { topic: text("系统设计和风险评审", "System design and risk review"), work: text("提交架构、威胁模型和风险清单。", "Submit architecture, threat model, and risk list.") },
      { topic: text("第一阶段原型", "First prototype"), work: text("交付最小可运行版本和测试计划。", "Deliver a minimum runnable version and test plan.") },
      { topic: text("中期评审和路线调整", "Midterm review and roadmap adjustment"), work: text("演示原型，修订目标和范围。", "Demo the prototype and revise goals and scope.") },
      { topic: text("实验、部署和用户反馈", "Experiments, deployment, and user feedback"), work: text("收集可复现数据或真实用户反馈。", "Collect reproducible data or real user feedback.") },
      { topic: text("硬化、文档和移交", "Hardening, documentation, and handoff"), work: text("完成测试、部署和维护文档。", "Complete tests, deployment notes, and maintenance docs.") },
      { topic: text("最终答辩和归档", "Final defense and archiving"), work: text("提交代码、报告、演示和复现包。", "Submit code, report, demo, and reproducibility package.") }
    ],
    project: text("每个团队完成一个真实系统、工具、数据集或研究原型。项目可以来自实验室需求、开源社区、课程平台或安全工程实践。", "Each team completes a real system, tool, dataset, or research prototype. Projects may come from lab needs, open-source communities, course platforms, or security-engineering practice."),
    projectAssessment: text("项目交付、复现包、技术报告、演示和过程记录。", "Project delivery, reproducibility package, technical report, demo, and process records.")
  }),

  "55AA-012": course({
    summary: text("计算机网络课程从端到端原则出发，覆盖链路、IP、路由、传输、拥塞控制、DNS、HTTP、TLS 和网络测量。课程特别强调协议行为的可观察性、故障诊断和安全边界。", "Computer Networks starts from the end-to-end principle and covers links, IP, routing, transport, congestion control, DNS, HTTP, TLS, and network measurement. The course emphasizes observability, troubleshooting, and security boundaries in protocol behavior."),
    positioning: text("这是网络协议分析、应用密码学、软件安全和系统安全的网络基础。", "This is the networking foundation for protocol analysis, applied cryptography, software security, and system security."),
    prerequisites: { zh: ["系统编程基础。", "理解进程、文件和 socket 的基本概念。", "能阅读协议文档和抓包结果。"], en: ["Systems programming fundamentals.", "Understanding of processes, files, and socket basics.", "Ability to read protocol documents and packet traces."] },
    outcomes: { zh: ["解释 Internet 分层和端到端设计原则。", "分析 IP、TCP、UDP、DNS、HTTP 和 TLS 行为。", "使用抓包、测量和日志诊断网络问题。", "实现小型网络协议或服务。", "识别网络协议和部署中的安全风险。"], en: ["Explain Internet layering and end-to-end design principles.", "Analyze IP, TCP, UDP, DNS, HTTP, and TLS behavior.", "Use packet traces, measurements, and logs to troubleshoot networks.", "Implement a small network protocol or service.", "Identify security risks in protocols and deployments."] },
    weeks: [
      { topic: text("分层、端到端和测量工具", "Layering, end-to-end principle, and measurement tools"), work: text("完成 traceroute、ping 和抓包实验。", "Complete traceroute, ping, and packet-capture labs.") },
      { topic: text("链路、交换和局域网", "Links, switching, and LANs"), work: text("分析以太网、ARP 和局域网故障。", "Analyze Ethernet, ARP, and LAN failures.") },
      { topic: text("IP、路由和地址", "IP, routing, and addressing"), work: text("配置小型路由拓扑并诊断路径。", "Configure a small routing topology and diagnose paths.") },
      { topic: text("UDP、TCP 和拥塞控制", "UDP, TCP, and congestion control"), work: text("测量延迟、吞吐和重传行为。", "Measure latency, throughput, and retransmission behavior.") },
      { topic: text("DNS、CDN 和命名", "DNS, CDNs, and naming"), work: text("追踪域名解析和缓存行为。", "Trace resolution and caching behavior.") },
      { topic: text("HTTP、QUIC 和应用协议", "HTTP, QUIC, and application protocols"), work: text("实现一个小型代理或协议客户端。", "Implement a small proxy or protocol client.") },
      { topic: text("TLS、网络安全和隐私", "TLS, network security, and privacy"), work: text("分析握手、证书和常见配置错误。", "Analyze handshakes, certificates, and common misconfigurations.") },
      { topic: text("网络测量和故障复盘", "Network measurement and failure review"), work: text("提交网络测量项目和故障报告。", "Submit a network-measurement project and failure report.") }
    ],
    project: text("学生完成一个网络测量、协议实现或故障诊断项目，交付抓包、代码、实验数据和分析报告。", "Students complete a network measurement, protocol implementation, or troubleshooting project with packet traces, code, data, and analysis report."),
    projectAssessment: text("协议实验、抓包分析、网络工具和测量报告。", "Protocol labs, packet analysis, network tools, and measurement reports.")
  }),

  "55AA-013": course({
    summary: text("应用密码学课程关注密码机制如何被正确选择、组合、实现和部署。课程覆盖对称加密、哈希、消息认证、公钥密码、签名、密钥交换、TLS、密码协议和常见实现错误。", "Applied Cryptography focuses on how cryptographic mechanisms are correctly selected, composed, implemented, and deployed. Topics include symmetric encryption, hashing, message authentication, public-key cryptography, signatures, key exchange, TLS, cryptographic protocols, and common implementation mistakes."),
    positioning: text("这是网络协议、安全系统、可信计算和合规自动化中的密码基础。", "This is the cryptographic foundation for network protocols, secure systems, trusted computing, and compliance automation."),
    prerequisites: { zh: ["离散数学，尤其是模运算和概率基础。", "能够编写和测试小型程序。", "建议具备计算机网络基础。"], en: ["Discrete mathematics, especially modular arithmetic and basic probability.", "Ability to write and test small programs.", "Computer networking background is recommended."] },
    outcomes: { zh: ["解释主流密码原语的安全目标和使用边界。", "识别常见密码误用和协议组合错误。", "使用标准库实现安全的数据保护流程。", "分析 TLS、签名、密钥交换和证书链。", "为实际系统制定密钥管理和轮换方案。"], en: ["Explain security goals and usage boundaries of major cryptographic primitives.", "Identify common cryptographic misuse and protocol-composition errors.", "Use standard libraries to implement secure data-protection flows.", "Analyze TLS, signatures, key exchange, and certificate chains.", "Design key-management and rotation plans for practical systems."] },
    weeks: [
      { topic: text("威胁模型和密码工程原则", "Threat models and cryptographic engineering principles"), work: text("分析一个真实密码事故。", "Analyze a real cryptographic failure.") },
      { topic: text("哈希、MAC 和认证加密", "Hashing, MACs, and authenticated encryption"), work: text("实现安全消息封装并测试篡改。", "Implement secure message envelopes and tamper tests.") },
      { topic: text("随机数、密钥派生和密码存储", "Randomness, KDFs, and password storage"), work: text("评估口令哈希和参数选择。", "Evaluate password hashing and parameter choices.") },
      { topic: text("公钥密码和数字签名", "Public-key cryptography and digital signatures"), work: text("实现签名验证和错误处理。", "Implement signature verification and error handling.") },
      { topic: text("密钥交换和 TLS", "Key exchange and TLS"), work: text("抓包分析 TLS 握手和证书链。", "Analyze TLS handshakes and certificate chains from traces.") },
      { topic: text("协议组合和形式化直觉", "Protocol composition and formal intuition"), work: text("评审一个认证协议的安全目标。", "Review security goals of an authentication protocol.") },
      { topic: text("实现攻击、侧信道和常数时间", "Implementation attacks, side channels, and constant time"), work: text("观察时序泄露并提出缓解方案。", "Observe timing leakage and propose mitigations.") },
      { topic: text("密钥管理和部署审计", "Key management and deployment audit"), work: text("提交系统级密码使用审计。", "Submit a system-level cryptographic usage audit.") }
    ],
    project: text("学生审计或构建一个小型加密应用，要求说明威胁模型、原语选择、密钥生命周期、错误处理和测试证据。", "Students audit or build a small cryptographic application and document threat model, primitive choices, key lifecycle, error handling, and test evidence."),
    projectAssessment: text("密码实现、协议分析、审计报告和测试。", "Cryptographic implementation, protocol analysis, audit report, and tests.")
  }),

  "55AA-014": course({
    summary: text("硬件注入和硬件安全课程研究物理世界如何破坏数字系统假设。课程覆盖故障注入、侧信道、调试接口、供应链风险、硬件木马、可信执行根和实验安全规范。", "Hardware Injection and Hardware Security studies how the physical world breaks assumptions in digital systems. Topics include fault injection, side channels, debug interfaces, supply-chain risk, hardware Trojans, roots of trust, and lab safety practices."),
    positioning: text("这是系统安全与可信计算向硬件层延伸的研究生专题课。", "This is a graduate topic course extending system security and trusted computing to the hardware layer."),
    prerequisites: { zh: ["计算机体系结构或嵌入式系统基础。", "了解密码学和系统安全基本概念。", "愿意遵守硬件实验安全规范。"], en: ["Computer architecture or embedded-systems background.", "Basic knowledge of cryptography and system security.", "Willingness to follow hardware lab safety rules."] },
    outcomes: { zh: ["解释硬件威胁模型和物理攻击面。", "理解故障注入、功耗侧信道和时序侧信道。", "评估调试接口、启动链和密钥存储风险。", "设计可复现且安全的硬件实验。", "提出硬件安全防护和验证方案。"], en: ["Explain hardware threat models and physical attack surfaces.", "Understand fault injection, power side channels, and timing side channels.", "Evaluate risks in debug interfaces, boot chains, and key storage.", "Design reproducible and safe hardware experiments.", "Propose hardware security defenses and validation plans."] },
    weeks: [
      { topic: text("硬件威胁模型和实验伦理", "Hardware threat models and lab ethics"), work: text("建立目标设备资产和攻击面清单。", "Build an asset and attack-surface list for a target device.") },
      { topic: text("调试接口和固件提取", "Debug interfaces and firmware extraction"), work: text("识别 UART、JTAG、SWD 等接口风险。", "Identify risks in UART, JTAG, SWD, and related interfaces.") },
      { topic: text("故障注入基础", "Fault-injection fundamentals"), work: text("设计电压、时钟或电磁故障实验方案。", "Design voltage, clock, or EM fault-injection experiments.") },
      { topic: text("功耗和电磁侧信道", "Power and EM side channels"), work: text("分析采样、对齐和泄露假设。", "Analyze sampling, alignment, and leakage assumptions.") },
      { topic: text("启动链、ROM 和信任根", "Boot chains, ROM, and roots of trust"), work: text("评估安全启动流程和回滚风险。", "Evaluate secure boot and rollback risks.") },
      { topic: text("硬件木马和供应链", "Hardware Trojans and supply chains"), work: text("阅读并复盘一个硬件供应链案例。", "Read and review a hardware supply-chain case.") },
      { topic: text("防护、检测和验证", "Defenses, detection, and validation"), work: text("提出目标设备的防护测试计划。", "Propose a defense test plan for the target device.") },
      { topic: text("硬件安全实验报告", "Hardware security lab report"), work: text("提交实验记录、数据和安全复盘。", "Submit lab notes, data, and safety review.") }
    ],
    project: text("项目可以是硬件接口审计、固件提取流程、侧信道测量、防护评估或论文复现实验。必须包含实验安全说明和可复现材料。", "Projects may audit hardware interfaces, extract firmware, measure side channels, evaluate defenses, or reproduce a paper. Safety notes and reproducible artifacts are required."),
    projectAssessment: text("硬件实验、数据分析、安全规范和研究报告。", "Hardware experiments, data analysis, safety practice, and research report.")
  }),

  "55AA-015": course({
    summary: text("电子取证和溯源课程训练学生在法律、伦理和技术约束下收集、保护、分析和解释数字证据。课程覆盖磁盘、内存、日志、网络、移动与云证据，以及攻击链重建和归因的可信度表达。", "Digital Forensics and Attribution trains students to collect, preserve, analyze, and explain digital evidence under legal, ethical, and technical constraints. Topics include disk, memory, logs, network, mobile and cloud evidence, attack-chain reconstruction, and confidence-aware attribution."),
    positioning: text("这是系统安全、操作系统和网络知识在事件响应与证据分析中的应用课。", "This course applies system security, operating systems, and networking knowledge to incident response and evidence analysis."),
    prerequisites: { zh: ["操作系统、网络和系统安全基础。", "能够使用 Linux、脚本和常见日志工具。", "愿意严格遵守证据处理和隐私规范。"], en: ["Operating systems, networking, and system-security fundamentals.", "Ability to use Linux, scripting, and common log tools.", "Willingness to follow evidence-handling and privacy rules strictly."] },
    outcomes: { zh: ["建立证据保全、哈希和链路记录流程。", "分析磁盘、内存、日志和网络证据。", "重建攻击时间线和关键行为。", "区分事实、推断和归因置信度。", "撰写面向技术和非技术读者的取证报告。"], en: ["Establish preservation, hashing, and chain-of-custody procedures.", "Analyze disk, memory, log, and network evidence.", "Reconstruct attack timelines and key actions.", "Separate facts, inferences, and attribution confidence.", "Write forensic reports for technical and nontechnical readers."] },
    weeks: [
      { topic: text("证据、法律伦理和链路记录", "Evidence, legal ethics, and chain of custody"), work: text("完成镜像、哈希和证据记录练习。", "Complete imaging, hashing, and evidence-record exercises.") },
      { topic: text("文件系统和磁盘取证", "File-system and disk forensics"), work: text("恢复删除文件并解释元数据。", "Recover deleted files and explain metadata.") },
      { topic: text("内存取证和进程痕迹", "Memory forensics and process artifacts"), work: text("分析内存镜像中的进程和连接。", "Analyze processes and connections in a memory image.") },
      { topic: text("日志、时间线和事件关联", "Logs, timelines, and event correlation"), work: text("构建多源事件时间线。", "Build a multi-source event timeline.") },
      { topic: text("网络取证和流量重建", "Network forensics and traffic reconstruction"), work: text("从 pcap 重建会话和攻击阶段。", "Reconstruct sessions and attack phases from pcap.") },
      { topic: text("云、容器和身份日志", "Cloud, container, and identity logs"), work: text("分析云审计日志中的权限滥用。", "Analyze privilege abuse in cloud audit logs.") },
      { topic: text("归因、误导和置信度", "Attribution, deception, and confidence"), work: text("为一个案例写归因假设和证据表。", "Write attribution hypotheses and evidence tables for a case.") },
      { topic: text("取证报告和专家陈述", "Forensic reporting and expert testimony"), work: text("提交最终取证报告和复现材料。", "Submit the final forensic report and reproducibility package.") }
    ],
    project: text("学生完成一个模拟事件响应案例，从原始证据中重建攻击过程、关键指标、影响范围和归因置信度。", "Students complete a simulated incident-response case, reconstructing the attack process, key indicators, impact scope, and attribution confidence from raw evidence."),
    projectAssessment: text("取证流程、证据分析、时间线和报告。", "Forensic workflow, evidence analysis, timeline, and report.")
  }),

  "55AA-016": course({
    summary: text("网络协议分析和验证课程把协议工程、形式化建模和安全分析结合起来。课程覆盖状态机、协议逆向、模糊测试、模型检查、符号协议分析和实现一致性测试。", "Network Protocol Analysis and Verification combines protocol engineering, formal modeling, and security analysis. Topics include state machines, protocol reverse engineering, fuzzing, model checking, symbolic protocol analysis, and implementation conformance testing."),
    positioning: text("这是网络、应用密码学和程序分析之后的研究生专题课。", "This is a graduate topic course after networking, applied cryptography, and program analysis."),
    prerequisites: { zh: ["计算机网络和应用密码学基础。", "理解状态机、逻辑和基本程序分析。", "能够编写测试 harness 或协议脚本。"], en: ["Computer networking and applied-cryptography fundamentals.", "Understanding of state machines, logic, and basic program analysis.", "Ability to write test harnesses or protocol scripts."] },
    outcomes: { zh: ["从规范和流量中抽取协议状态机。", "编写协议解析、模糊测试和一致性测试工具。", "用模型检查或符号工具验证关键性质。", "识别认证、重放、降级和状态混淆问题。", "把验证结果转化为工程修复建议。"], en: ["Extract protocol state machines from specifications and traces.", "Write protocol parsing, fuzzing, and conformance tools.", "Verify key properties with model checking or symbolic tools.", "Identify authentication, replay, downgrade, and state-confusion issues.", "Translate verification results into engineering fixes."] },
    weeks: [
      { topic: text("协议规范、状态机和威胁模型", "Protocol specs, state machines, and threat models"), work: text("为一个协议绘制状态机和安全目标。", "Draw a state machine and security goals for a protocol.") },
      { topic: text("抓包、解析和协议逆向", "Tracing, parsing, and protocol reverse engineering"), work: text("实现协议解析器并标注字段语义。", "Implement a parser and annotate field semantics.") },
      { topic: text("协议模糊测试", "Protocol fuzzing"), work: text("构建 stateful fuzzing harness。", "Build a stateful fuzzing harness.") },
      { topic: text("模型检查基础", "Model-checking fundamentals"), work: text("用模型描述握手或重传行为。", "Model a handshake or retransmission behavior.") },
      { topic: text("认证协议和符号分析", "Authentication protocols and symbolic analysis"), work: text("验证认证、保密或新鲜性性质。", "Verify authentication, secrecy, or freshness properties.") },
      { topic: text("实现一致性和差分测试", "Conformance and differential testing"), work: text("比较两个实现的边界行为。", "Compare boundary behavior of two implementations.") },
      { topic: text("降级、重放和状态混淆", "Downgrade, replay, and state confusion"), work: text("复现或设计一个协议状态漏洞。", "Reproduce or design a protocol-state flaw.") },
      { topic: text("协议验证报告", "Protocol verification report"), work: text("提交模型、测试工具和修复建议。", "Submit models, testing tools, and fix recommendations.") }
    ],
    project: text("项目选择一个真实或教学协议，完成状态机建模、测试工具、性质验证和安全评估。", "Projects choose a real or teaching protocol and complete state-machine modeling, testing tools, property verification, and security evaluation."),
    projectAssessment: text("协议模型、测试工具、验证结果和修复建议。", "Protocol models, testing tools, verification results, and fix recommendations.")
  }),

  "55AA-017": course({
    summary: text("可信计算方法和安全课程研究如何在不完全可信的系统中建立、传递和验证信任。课程覆盖 TPM、TEE、远程证明、安全启动、密钥封存、供应链证明和可信执行的局限。", "Trusted Computing Methods and Security studies how to establish, transfer, and verify trust in partially trusted systems. Topics include TPMs, TEEs, remote attestation, secure boot, key sealing, supply-chain provenance, and the limitations of trusted execution."),
    positioning: text("这是硬件安全、虚拟化和应用密码学交叉的研究生专题课。", "This is a graduate topic course at the intersection of hardware security, virtualization, and applied cryptography."),
    prerequisites: { zh: ["系统安全、应用密码学和体系结构基础。", "理解密钥、证书和启动链概念。", "具备阅读系统论文的能力。"], en: ["System security, applied cryptography, and architecture fundamentals.", "Understanding of keys, certificates, and boot chains.", "Ability to read systems research papers."] },
    outcomes: { zh: ["解释信任根、度量启动和远程证明。", "评估 TPM、TEE 和虚拟化信任边界。", "设计密钥封存、策略绑定和证明验证流程。", "分析可信执行中的侧信道和回滚风险。", "构建一个小型可信计算原型或审计报告。"], en: ["Explain roots of trust, measured boot, and remote attestation.", "Evaluate TPM, TEE, and virtualization trust boundaries.", "Design key sealing, policy binding, and attestation-verification flows.", "Analyze side-channel and rollback risks in trusted execution.", "Build a small trusted-computing prototype or audit report."] },
    weeks: [
      { topic: text("信任根和威胁模型", "Roots of trust and threat models"), work: text("为一个部署场景定义信任假设。", "Define trust assumptions for a deployment scenario.") },
      { topic: text("TPM、PCR 和度量启动", "TPMs, PCRs, and measured boot"), work: text("实验 PCR 扩展和度量日志。", "Experiment with PCR extension and measurement logs.") },
      { topic: text("安全启动和密钥封存", "Secure boot and key sealing"), work: text("设计密钥释放策略和回滚防护。", "Design key-release policies and rollback protection.") },
      { topic: text("远程证明协议", "Remote attestation protocols"), work: text("实现证明验证端原型。", "Implement an attestation verifier prototype.") },
      { topic: text("TEE 和可信执行边界", "TEEs and trusted-execution boundaries"), work: text("分析 enclave 的 TCB 和接口风险。", "Analyze enclave TCB and interface risks.") },
      { topic: text("虚拟化和云信任", "Virtualization and cloud trust"), work: text("评估 confidential computing 声明。", "Evaluate confidential-computing claims.") },
      { topic: text("供应链证明和策略自动化", "Supply-chain provenance and policy automation"), work: text("连接构建证明、签名和部署策略。", "Connect build provenance, signatures, and deployment policy.") },
      { topic: text("可信计算限制与报告", "Limits of trusted computing and report"), work: text("提交原型、安全分析和局限说明。", "Submit prototype, security analysis, and limitations.") }
    ],
    project: text("项目可以实现远程证明流程、TPM 密钥封存实验、TEE 应用审计或供应链证明策略。", "Projects may implement remote attestation, TPM key sealing, TEE application audit, or supply-chain provenance policy."),
    projectAssessment: text("可信计算原型、策略设计、安全分析和论文复盘。", "Trusted-computing prototype, policy design, security analysis, and paper review.")
  }),

  "55AA-018": course({
    summary: text("嵌入式系统原理和安全课程把微控制器、实时约束、外设、固件和物联网安全放在同一框架下。课程强调资源受限环境中的工程取舍、安全启动、固件更新和调试接口风险。", "Embedded Systems Principles and Security brings microcontrollers, real-time constraints, peripherals, firmware, and IoT security into one framework. The course emphasizes engineering tradeoffs in resource-constrained environments, secure boot, firmware update, and debug-interface risk."),
    positioning: text("这是系统编程、组成原理和体系结构之后连接硬件安全的实践课。", "This is a practical bridge from systems programming, organization, and architecture to hardware security."),
    prerequisites: { zh: ["计算机组成、汇编和系统编程。", "能够阅读 C/Rust 嵌入式代码。", "愿意完成板级实验和调试。"], en: ["Computer organization, assembly, and systems programming.", "Ability to read C/Rust embedded code.", "Willingness to complete board-level labs and debugging."] },
    outcomes: { zh: ["解释 MCU、外设、中断和实时调度。", "编写和调试固件驱动与通信代码。", "分析固件更新、安全启动和密钥存储。", "识别 IoT 设备中的调试接口和配置风险。", "完成一个可运行嵌入式安全项目。"], en: ["Explain MCUs, peripherals, interrupts, and real-time scheduling.", "Write and debug firmware drivers and communication code.", "Analyze firmware update, secure boot, and key storage.", "Identify debug-interface and configuration risks in IoT devices.", "Complete a runnable embedded-security project."] },
    weeks: [
      { topic: text("嵌入式硬件、工具链和调试", "Embedded hardware, toolchains, and debugging"), work: text("建立开发板、串口和调试环境。", "Set up board, serial, and debugging environment.") },
      { topic: text("GPIO、定时器和中断", "GPIO, timers, and interrupts"), work: text("实现中断驱动的外设任务。", "Implement an interrupt-driven peripheral task.") },
      { topic: text("实时约束和低功耗", "Real-time constraints and low power"), work: text("测量延迟、抖动和功耗。", "Measure latency, jitter, and power.") },
      { topic: text("总线、传感器和通信", "Buses, sensors, and communication"), work: text("实现 I2C/SPI/UART 通信实验。", "Implement I2C/SPI/UART communication labs.") },
      { topic: text("固件结构和更新", "Firmware structure and update"), work: text("设计安全更新和回滚策略。", "Design secure update and rollback strategy.") },
      { topic: text("安全启动和密钥存储", "Secure boot and key storage"), work: text("分析启动链和密钥生命周期。", "Analyze boot chain and key lifecycle.") },
      { topic: text("IoT 攻击面和调试接口", "IoT attack surfaces and debug interfaces"), work: text("审计一个设备的接口和配置。", "Audit interfaces and configuration of a device.") },
      { topic: text("嵌入式安全项目", "Embedded security project"), work: text("提交固件、实验记录和安全评估。", "Submit firmware, lab notes, and security evaluation.") }
    ],
    project: text("学生完成一个板级项目，例如安全传感器节点、固件更新机制、接口审计、低功耗通信或调试接口风险评估。", "Students complete a board-level project such as a secure sensor node, firmware update mechanism, interface audit, low-power communication, or debug-interface risk assessment."),
    projectAssessment: text("板级实验、固件实现、测量数据和安全分析。", "Board labs, firmware implementation, measurements, and security analysis.")
  }),

  "55AA-019": course({
    summary: text("系统安全科研方法课程训练研究生从论文问题、实验设计、复现、测量、写作和伦理角度开展安全研究。课程强调提出可验证问题，而不是堆砌工具；强调反例、威胁有效性和实验可复现。", "System Security Research Methods trains graduate students to conduct security research through problem formulation, experiment design, reproduction, measurement, writing, and ethics. The course emphasizes verifiable questions over tool accumulation, and stresses counterexamples, threat validity, and reproducibility."),
    positioning: text("这是研究生安全方向的入口方法课，应在专题研究课之前或并行修读。", "This is the graduate methodological entry course for security and should be taken before or alongside topic courses."),
    prerequisites: { zh: ["至少一门系统或安全课程。", "能够阅读英文系统安全论文。", "具备编程、实验记录和技术写作基础。"], en: ["At least one systems or security course.", "Ability to read English systems-security papers.", "Programming, lab-record, and technical-writing fundamentals."] },
    outcomes: { zh: ["从论文中抽取问题、假设、方法和证据链。", "设计可复现、安全合规的实验。", "评估测量误差、选择偏差和外部有效性。", "撰写清晰的研究问题、威胁模型和局限。", "完成一个小型论文复现或预研项目。"], en: ["Extract problems, assumptions, methods, and evidence chains from papers.", "Design reproducible and ethically compliant experiments.", "Evaluate measurement error, selection bias, and external validity.", "Write clear research questions, threat models, and limitations.", "Complete a small paper reproduction or pilot study."] },
    weeks: [
      { topic: text("安全研究问题和论文结构", "Security research questions and paper structure"), work: text("拆解一篇顶会论文的问题和证据链。", "Decompose a top-tier paper's question and evidence chain.") },
      { topic: text("威胁模型、伦理和 IRB 直觉", "Threat models, ethics, and IRB intuition"), work: text("为一个实验写伦理和风险说明。", "Write ethics and risk notes for an experiment.") },
      { topic: text("复现、基线和 artifact", "Reproduction, baselines, and artifacts"), work: text("复现论文中的一个小结果。", "Reproduce one small result from a paper.") },
      { topic: text("测量、统计和可视化", "Measurement, statistics, and visualization"), work: text("整理实验数据并报告不确定性。", "Clean experimental data and report uncertainty.") },
      { topic: text("系统实验设计", "Systems experiment design"), work: text("设计消融、压力和鲁棒性实验。", "Design ablation, stress, and robustness experiments.") },
      { topic: text("写作、审稿和 rebuttal", "Writing, reviewing, and rebuttal"), work: text("完成一次匿名论文互评。", "Complete an anonymous peer review.") },
      { topic: text("研究原型和工程债", "Research prototypes and engineering debt"), work: text("整理代码、脚本和复现说明。", "Clean code, scripts, and reproduction instructions.") },
      { topic: text("预研报告", "Pilot-study report"), work: text("提交预研论文式报告和 artifact。", "Submit a paper-style pilot report and artifact.") }
    ],
    project: text("项目可以是论文复现、公开数据再分析、工具原型或新问题预研。必须包含清晰问题、基线、复现步骤、局限和伦理说明。", "Projects may be paper reproduction, public-data reanalysis, tool prototypes, or pilot studies. They must include a clear question, baseline, reproduction steps, limitations, and ethics notes."),
    projectAssessment: text("论文复现、实验设计、技术写作和 artifact。", "Paper reproduction, experiment design, technical writing, and artifacts.")
  }),

  "55AA-020": course({
    summary: text("虚拟化方法和安全课程研究虚拟机、容器、hypervisor、设备虚拟化、隔离和云安全。课程既讲虚拟化机制，也分析逃逸、侧信道、镜像供应链和 confidential computing 的边界。", "Virtualization Methods and Security studies virtual machines, containers, hypervisors, device virtualization, isolation, and cloud security. The course covers mechanisms as well as escapes, side channels, image supply chains, and the boundaries of confidential computing."),
    positioning: text("这是操作系统、体系结构和系统安全之后的研究生系统专题课。", "This is a graduate systems topic after operating systems, architecture, and system security."),
    prerequisites: { zh: ["操作系统、体系结构和系统安全基础。", "理解页表、中断、设备和权限级别。", "能阅读内核或 hypervisor 相关代码。"], en: ["Operating systems, architecture, and system-security fundamentals.", "Understanding of page tables, interrupts, devices, and privilege levels.", "Ability to read kernel or hypervisor-related code."] },
    outcomes: { zh: ["解释 CPU、内存和 I/O 虚拟化机制。", "比较虚拟机、容器和沙箱隔离边界。", "分析 hypervisor、容器运行时和镜像供应链风险。", "评估云环境中的逃逸、侧信道和租户隔离。", "构建一个虚拟化实验或安全评估工具。"], en: ["Explain CPU, memory, and I/O virtualization mechanisms.", "Compare isolation boundaries of VMs, containers, and sandboxes.", "Analyze risk in hypervisors, container runtimes, and image supply chains.", "Evaluate escapes, side channels, and tenant isolation in cloud environments.", "Build a virtualization experiment or security-evaluation tool."] },
    weeks: [
      { topic: text("虚拟化目标和隔离模型", "Virtualization goals and isolation models"), work: text("比较 VM、容器和进程沙箱威胁模型。", "Compare threat models for VMs, containers, and process sandboxes.") },
      { topic: text("CPU 虚拟化和陷入", "CPU virtualization and traps"), work: text("跟踪一次特权指令或 VM exit。", "Trace a privileged instruction or VM exit.") },
      { topic: text("内存虚拟化和 EPT", "Memory virtualization and EPT"), work: text("分析二级页表和隔离成本。", "Analyze nested page tables and isolation cost.") },
      { topic: text("I/O、设备和中断虚拟化", "I/O, devices, and interrupt virtualization"), work: text("评估设备直通或模拟设备风险。", "Evaluate risks in passthrough or emulated devices.") },
      { topic: text("容器、namespace 和 cgroup", "Containers, namespaces, and cgroups"), work: text("配置容器隔离并测试边界。", "Configure container isolation and test boundaries.") },
      { topic: text("逃逸、侧信道和云多租户", "Escapes, side channels, and cloud multi-tenancy"), work: text("复盘一个虚拟化漏洞或云隔离案例。", "Review a virtualization flaw or cloud isolation case.") },
      { topic: text("镜像、运行时和供应链", "Images, runtimes, and supply chains"), work: text("审计镜像和运行时配置。", "Audit images and runtime configuration.") },
      { topic: text("confidential computing 和局限", "Confidential computing and limits"), work: text("提交虚拟化安全评估报告。", "Submit a virtualization security evaluation report.") }
    ],
    project: text("项目围绕虚拟化机制或安全边界展开，例如容器隔离评估、hypervisor 实验、镜像供应链审计或云信任边界分析。", "Projects focus on virtualization mechanisms or security boundaries, such as container isolation evaluation, hypervisor experiments, image supply-chain audit, or cloud trust-boundary analysis."),
    projectAssessment: text("虚拟化实验、安全评估、配置审计和报告。", "Virtualization experiments, security evaluation, configuration audits, and report.")
  }),

  "55AA-021": course({
    summary: text("安全基线、合规和自动化课程把安全要求转化为可执行、可审计、可持续运行的工程流程。课程覆盖基线建模、策略即代码、配置扫描、证据收集、漏洞管理、例外处理和自动化整改。", "Security Baselines, Compliance, and Automation turns security requirements into executable, auditable, and sustainable engineering processes. Topics include baseline modeling, policy as code, configuration scanning, evidence collection, vulnerability management, exception handling, and automated remediation."),
    positioning: text("这是软件工程、系统安全、操作系统和应用密码学之后的安全工程落地课程。", "This is the applied security-engineering course after software engineering, system security, operating systems, and applied cryptography."),
    prerequisites: { zh: ["软件工程和系统安全基础。", "熟悉 Linux、脚本、CI 和配置文件。", "理解基本密码、身份和日志概念。"], en: ["Software engineering and system-security fundamentals.", "Familiarity with Linux, scripting, CI, and configuration files.", "Understanding of basic cryptography, identity, and logging concepts."] },
    outcomes: { zh: ["把安全要求拆解为可测试控制项。", "使用策略即代码表达配置和合规规则。", "自动收集证据并生成审计报告。", "管理漏洞、例外、风险接受和整改 SLA。", "构建一条可维护的安全基线自动化流水线。"], en: ["Decompose security requirements into testable controls.", "Express configuration and compliance rules as policy as code.", "Collect evidence automatically and generate audit reports.", "Manage vulnerabilities, exceptions, risk acceptance, and remediation SLAs.", "Build a maintainable automation pipeline for security baselines."] },
    weeks: [
      { topic: text("安全控制、基线和风险", "Security controls, baselines, and risk"), work: text("把一组要求转成控制项和测试点。", "Convert requirements into controls and test points.") },
      { topic: text("Linux、云和应用配置基线", "Linux, cloud, and application baselines"), work: text("编写配置检查脚本。", "Write configuration-check scripts.") },
      { topic: text("策略即代码", "Policy as code"), work: text("用 OPA、Rego 或等价工具表达规则。", "Express rules with OPA, Rego, or equivalent tools.") },
      { topic: text("CI/CD 安全门禁", "CI/CD security gates"), work: text("把扫描和策略检查接入流水线。", "Integrate scans and policy checks into pipelines.") },
      { topic: text("证据收集和审计追踪", "Evidence collection and audit trails"), work: text("设计自动证据包和报告格式。", "Design automated evidence packages and report formats.") },
      { topic: text("漏洞管理和例外流程", "Vulnerability management and exception workflow"), work: text("建立优先级、SLA 和风险接受记录。", "Create priority, SLA, and risk-acceptance records.") },
      { topic: text("自动化整改和漂移检测", "Automated remediation and drift detection"), work: text("实现一项安全配置自动修复。", "Implement one automated security-configuration fix.") },
      { topic: text("合规自动化项目", "Compliance automation project"), work: text("提交基线工具、证据包和运行手册。", "Submit baseline tooling, evidence package, and runbook.") }
    ],
    project: text("学生为一个服务、主机、容器或云资源集合建立安全基线自动化，包括规则、扫描、证据、例外流程和整改建议。", "Students build baseline automation for a service, host, container, or cloud resource set, including rules, scanning, evidence, exceptions, and remediation guidance."),
    projectAssessment: text("策略规则、扫描流水线、证据包和整改流程。", "Policy rules, scan pipelines, evidence packages, and remediation workflow.")
  })
};

export default syllabi;
