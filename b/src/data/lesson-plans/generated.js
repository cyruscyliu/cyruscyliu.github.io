import syllabi from '../syllabi.js';

const t = (zh, en) => ({ zh, en });
const text = (value, lang) => typeof value === 'string' ? value : value?.[lang] ?? value?.zh ?? value?.en ?? '';
const list = (value, lang) => value?.[lang] ?? value?.zh ?? value?.en ?? [];
const pad = (number) => String(number).padStart(2, '0');

const courseName = (code) => code;

const sessionProfiles = {
  1: {
    suffix: t('概念、案例与方法', 'Concepts, Cases, and Method'),
    mode: t('讲解与提问穿插', 'Lecture with guided questions'),
    homeworkVerb: t('整理概念图、案例拆解和一个可验证的问题清单。', 'Prepare a concept map, case breakdown, and a verifiable question list.'),
    demoVerb: t('把主题拆成术语、边界、证据和可执行任务。', 'Decompose the topic into terms, boundaries, evidence, and executable tasks.')
  },
  2: {
    suffix: t('实验、评审与迁移', 'Lab, Review, and Transfer'),
    mode: t('工作坊、练习与评审', 'Workshop, exercise, and review'),
    homeworkVerb: t('提交实验记录、评审反馈和下一轮改进计划。', 'Submit lab notes, review feedback, and the next improvement plan.'),
    demoVerb: t('把课堂方法迁移到一个小型实验或项目任务。', 'Transfer the class method to a small lab or project task.')
  }
};

function makeObjectives(syllabus, week, session) {
  const outcomesZh = list(syllabus.learningOutcomes, 'zh');
  const outcomesEn = list(syllabus.learningOutcomes, 'en');
  const profile = sessionProfiles[session];
  return {
    zh: [
      `解释“${text(week.topic, 'zh')}”在本课程中的位置和核心问题。`,
      `用本节课的方法分析一个与“${text(week.topic, 'zh')}”相关的案例或系统。`,
      outcomesZh[0] ? `把课程目标落到本节任务：${outcomesZh[0]}` : '把抽象概念转化为可检查的课堂产出。',
      `完成${text(profile.mode, 'zh')}中的提问、记录和小结。`
    ],
    en: [
      `Explain where "${text(week.topic, 'en')}" fits in this course and what core problem it addresses.`,
      `Analyze a case or system related to "${text(week.topic, 'en')}" using today's method.`,
      outcomesEn[0] ? `Connect the session task to the course outcome: ${outcomesEn[0]}` : 'Turn abstract concepts into checkable class artifacts.',
      `Complete the questions, notes, and synthesis required by ${text(profile.mode, 'en').toLowerCase()}.`
    ]
  };
}

function makePrerequisites(syllabus, week) {
  const prerequisitesZh = list(syllabus.prerequisites, 'zh');
  const prerequisitesEn = list(syllabus.prerequisites, 'en');
  return {
    zh: [
      prerequisitesZh[0] ?? '具备本课程前序知识和基本实验环境。',
      `已经阅读周计划中的任务：${text(week.work, 'zh')}`,
      '能够在课堂中记录假设、证据、风险和待验证问题。'
    ],
    en: [
      prerequisitesEn[0] ?? 'Have the prior course knowledge and basic lab environment ready.',
      `Have read the weekly task: ${text(week.work, 'en')}`,
      'Be able to record assumptions, evidence, risks, and questions to validate in class.'
    ]
  };
}

function makePreparation(code, week, session) {
  return {
    zh: [
      `打开 ${courseName(code)} 的课程仓库、阅读材料和本周任务说明。`,
      `课前写下 2 个关于“${text(week.topic, 'zh')}”的判断题或困惑点。`,
      session === 1 ? '准备参与概念辨析和案例阅读。' : '准备展示上一次课留下的问题、实验记录或项目片段。'
    ],
    en: [
      `Open the ${courseName(code)} course repository, readings, and this week's task brief.`,
      `Write two true/false claims or open questions about "${text(week.topic, 'en')}" before class.`,
      session === 1 ? 'Be ready for concept comparison and case reading.' : 'Be ready to show questions, lab notes, or project fragments from the previous meeting.'
    ]
  };
}

function makeFlow(week, session) {
  const topicZh = text(week.topic, 'zh');
  const topicEn = text(week.topic, 'en');
  const workZh = text(week.work, 'zh');
  const workEn = text(week.work, 'en');

  if (session === 1) {
    return [
      { minutes: '0-8', type: 'review', title: t('复习与入口问题', 'Review and entry question'), plan: t(`回顾上周或上一节课的关键结论，并把问题引到“${topicZh}”。`, `Review the previous conclusions and lead into "${topicEn}".`) },
      { minutes: '8-18', type: 'diagnostic', title: t('诊断提问', 'Diagnostic question'), plan: t(`让学生先判断：这个主题最容易被误解的边界是什么。`, `Ask students to judge the most commonly misunderstood boundary in this topic.`) },
      { minutes: '18-34', type: 'concept', title: t('核心概念讲解', 'Core concept explanation'), plan: t(`建立“${topicZh}”的术语、对象、边界和基本推理路径。`, `Establish the terms, objects, boundaries, and reasoning path for "${topicEn}".`) },
      { minutes: '34-48', type: 'case', title: t('案例拆解', 'Case dissection'), plan: t(`用一个小案例展示如何从现象走到根因、证据和工程动作。`, `Use a small case to move from symptoms to root cause, evidence, and engineering action.`) },
      { minutes: '48-62', type: 'method', title: t('方法框架', 'Method framework'), plan: t(`把案例抽象成可以复用的检查清单和分析步骤。`, `Abstract the case into a reusable checklist and analysis steps.`) },
      { minutes: '62-75', type: 'practice', title: t('短练习', 'Short practice'), plan: t(`学生独立或两人一组，把方法用于周任务：${workZh}`, `Students apply the method individually or in pairs to the weekly task: ${workEn}`) },
      { minutes: '75-84', type: 'discussion', title: t('全班讨论', 'Whole-class discussion'), plan: t('收集不同答案，比较证据质量、假设差异和遗漏风险。', 'Collect answers and compare evidence quality, assumptions, and missing risks.') },
      { minutes: '84-90', type: 'summary', title: t('总结与下次课钩子', 'Summary and next-session hook'), plan: t(`总结“${topicZh}”的核心判断句，并留下实验或评审问题。`, `Summarize the core judgment for "${topicEn}" and leave a lab or review question.`) }
    ];
  }

  return [
    { minutes: '0-8', type: 'review', title: t('复习上次课结论', 'Review previous conclusions'), plan: t(`快速复盘“${topicZh}”的概念框架和未解决问题。`, `Quickly review the concept framework and unresolved questions for "${topicEn}".`) },
    { minutes: '8-18', type: 'setup', title: t('实验目标与验收标准', 'Lab goal and acceptance criteria'), plan: t(`明确今天的可交付物、评价标准和最小完成线。`, `Define today's deliverable, evaluation criteria, and minimum completion line.`) },
    { minutes: '18-35', type: 'demo', title: t('教师演示', 'Instructor demo'), plan: t(`演示如何把课堂方法落到一个可复现步骤或项目片段。`, `Demonstrate how to turn the method into reproducible steps or a project fragment.`) },
    { minutes: '35-58', type: 'lab', title: t('分组实验', 'Group lab'), plan: t(`学生围绕周任务执行、记录证据，并标出失败点。`, `Students execute the weekly task, record evidence, and mark failure points.`) },
    { minutes: '58-70', type: 'review', title: t('同伴评审', 'Peer review'), plan: t('交换结果，检查可复现性、解释质量和风险遗漏。', 'Exchange results and check reproducibility, explanation quality, and missed risks.') },
    { minutes: '70-80', type: 'fix', title: t('现场修正', 'In-class revision'), plan: t('根据评审反馈修正记录、代码、配置、模型或报告结构。', 'Revise notes, code, configuration, models, or report structure based on review feedback.') },
    { minutes: '80-87', type: 'share', title: t('代表分享', 'Selected sharing'), plan: t('选择 2 到 3 组说明发现、取舍和下一步。', 'Select two or three groups to explain findings, tradeoffs, and next steps.') },
    { minutes: '87-90', type: 'summary', title: t('提交要求确认', 'Submission check'), plan: t('确认课后作业、命名规范、证据材料和截止时间。', 'Confirm homework, naming conventions, evidence artifacts, and deadline.') }
  ];
}

function makeQuestions(week, session) {
  const topicZh = text(week.topic, 'zh');
  const topicEn = text(week.topic, 'en');
  const workZh = text(week.work, 'zh');
  const workEn = text(week.work, 'en');
  return [
    {
      prompt: t(`判断“${topicZh}”时，最先应该确认什么事实？`, `When judging "${topicEn}", what fact should be confirmed first?`),
      expectedAnswer: t('先确认对象、边界、攻击者或用户能力、可观测证据，以及评价标准。', 'First confirm the object, boundary, attacker or user capability, observable evidence, and evaluation criteria.'),
      followUp: t('如果这个事实无法直接观察，你会设计什么最小实验？', 'If that fact is not directly observable, what minimal experiment would you design?')
    },
    {
      prompt: t(`本周任务“${workZh}”最可能失败在哪里？`, `Where is the weekly task "${workEn}" most likely to fail?`),
      expectedAnswer: t('常见失败点包括目标不清、证据不足、环境不可复现、只给结论不给过程。', 'Common failures include unclear goals, insufficient evidence, unreproducible environment, and conclusions without process.'),
      followUp: t('你会用什么检查项提前发现这个失败？', 'What checklist item would reveal this failure early?')
    },
    {
      prompt: t(session === 1 ? '概念理解和工程执行之间还缺哪一步？' : '实验结果怎样才算可以被别人复查？', session === 1 ? 'What step is missing between concept understanding and engineering execution?' : 'What makes a lab result reviewable by someone else?'),
      expectedAnswer: t(session === 1 ? '需要把概念转成对象、输入、输出、判断标准和证据格式。' : '需要环境、命令、输入、输出、失败条件、截图或日志，以及对异常结果的解释。', session === 1 ? 'Concepts must become objects, inputs, outputs, judgment criteria, and evidence format.' : 'It needs environment, commands, inputs, outputs, failure conditions, screenshots or logs, and explanations for anomalous results.'),
      followUp: t('这个要求如何写进作业或项目验收标准？', 'How would you write this requirement into homework or project acceptance criteria?')
    }
  ];
}

function makeScript(week, session) {
  const topicZh = text(week.topic, 'zh');
  const topicEn = text(week.topic, 'en');
  const workZh = text(week.work, 'zh');
  const workEn = text(week.work, 'en');
  const profile = sessionProfiles[session];
  return {
    zh: [
      { section: '开场', text: `今天这次课围绕“${topicZh}”。我们不把它当成孤立知识点，而是把它放进课程主线：先确认对象和边界，再寻找证据，最后形成可执行的工程动作。` },
      { section: '复习', text: `先回到上一轮讨论。请用一句话说出你认为最重要的结论，再说一个仍然不确定的地方。我们会把这些不确定项带入今天的分析。` },
      { section: '提问引导', text: `我先问一个判断题：如果我们只知道结论，却不知道环境、输入和证据，这个结论能不能用于工程决策？请先给 yes 或 no，再说明你依赖的假设。` },
      { section: '讲解', text: `处理“${topicZh}”时，关键不是背定义，而是建立分析顺序。第一，界定对象；第二，列出边界；第三，说明谁能做什么；第四，找到可观察证据；第五，把结论转成任务或测试。` },
      { section: '练习过渡', text: `现在把这个顺序用于本周任务：${workZh}请不要只写最终答案，要保留你如何排除其他可能性的过程。` },
      { section: '总结', text: `今天的交付物不是一段漂亮文字，而是一组能被复查的判断。课后请按要求补齐证据、命令、截图、日志或评审记录。` }
    ],
    en: [
      { section: 'Opening', text: `Today's session focuses on "${topicEn}". We will not treat it as an isolated topic. We place it in the course workflow: define the object and boundary, gather evidence, and turn the result into engineering action.` },
      { section: 'Review', text: `Return to the previous discussion. State one important conclusion in a sentence, then state one remaining uncertainty. We will carry those uncertainties into today's analysis.` },
      { section: 'Guided question', text: `Here is the first judgment question: if we know only the conclusion but not the environment, inputs, or evidence, can that conclusion guide engineering decisions? Answer yes or no first, then name your assumptions.` },
      { section: 'Explanation', text: `For "${topicEn}", the key is not memorizing definitions but following an analysis order: define the object, list boundaries, state who can do what, find observable evidence, and turn the conclusion into a task or test.` },
      { section: 'Practice transition', text: `Now apply that order to the weekly task: ${workEn} Do not write only the final answer; preserve how you ruled out alternatives.` },
      { section: 'Summary', text: `Today's deliverable is not polished prose. It is a set of reviewable judgments. After class, complete the required evidence, commands, screenshots, logs, or review notes.` }
    ]
  };
}

function makeSlides(week, session) {
  const topic = week.topic;
  const profile = sessionProfiles[session];
  return [
    { title: t(`${text(topic, 'zh')}：本节问题`, `${text(topic, 'en')}: Session Question`), bullets: { zh: ['对象是什么？', '边界在哪里？', '证据是什么？'], en: ['What is the object?', 'Where is the boundary?', 'What is the evidence?'] } },
    { title: t('概念框架', 'Concept Framework'), bullets: { zh: ['术语', '前提', '判断标准'], en: ['Terms', 'Preconditions', 'Judgment criteria'] } },
    { title: t('案例路径', 'Case Path'), bullets: { zh: ['现象', '根因', '影响', '动作'], en: ['Symptom', 'Root cause', 'Impact', 'Action'] } },
    { title: text(profile.mode, 'zh') ? t(text(profile.mode, 'zh'), text(profile.mode, 'en')) : t('课堂活动', 'Class Activity'), bullets: { zh: ['输入', '步骤', '输出'], en: ['Input', 'Steps', 'Output'] } },
    { title: t('课后交付', 'After-class Deliverable'), bullets: { zh: ['证据', '解释', '改进'], en: ['Evidence', 'Explanation', 'Improvement'] } }
  ];
}

function makeMedia(week, session) {
  return {
    videoSegments: [
      { title: t(`${text(week.topic, 'zh')}：课堂讲解视频`, `${text(week.topic, 'en')}: lecture video`), durationMinutes: session === 1 ? 12 : 8, visualStyle: 'placeholder video', source: 'placeholder' },
      { title: t(`${text(week.topic, 'zh')}：演示与点评视频`, `${text(week.topic, 'en')}: demo and review video`), durationMinutes: session === 1 ? 8 : 12, visualStyle: 'placeholder video', source: 'placeholder' }
    ]
  };
}

function makeLesson(code, syllabus, week, session) {
  const profile = sessionProfiles[session];
  return {
    id: `week-${pad(week.week)}-session-${pad(session)}`,
    courseCode: code,
    week: week.week,
    session,
    durationMinutes: 90,
    title: t(`${text(week.topic, 'zh')}：${text(profile.suffix, 'zh')}`, `${text(week.topic, 'en')}: ${text(profile.suffix, 'en')}`),
    position: t(
      `这是 ${code} 第 ${week.week} 周第 ${session} 次课，围绕“${text(week.topic, 'zh')}”展开，目标是把周计划任务转化为可讨论、可练习、可复查的课堂产出。`,
      `This is ${code}, week ${week.week}, session ${session}. It focuses on "${text(week.topic, 'en')}" and turns the weekly plan into discussable, practicable, and reviewable class artifacts.`
    ),
    objectives: makeObjectives(syllabus, week, session),
    prerequisites: makePrerequisites(syllabus, week),
    preparation: makePreparation(code, week, session),
    flow: makeFlow(week, session),
    questions: makeQuestions(week, session),
    demo: {
      title: t(`${text(week.topic, 'zh')}课堂演示`, `${text(week.topic, 'en')} class demo`),
      steps: {
        zh: [
          `打开与“${text(week.topic, 'zh')}”相关的示例、数据或项目片段。`,
          '说明输入、环境、假设和成功标准。',
          text(profile.demoVerb, 'zh'),
          '记录可复现步骤和失败条件。',
          '把结果转成作业、测试、issue 或报告条目。'
        ],
        en: [
          `Open the example, data, or project fragment related to "${text(week.topic, 'en')}".`,
          'State inputs, environment, assumptions, and success criteria.',
          text(profile.demoVerb, 'en'),
          'Record reproducible steps and failure conditions.',
          'Turn the result into homework, a test, an issue, or a report item.'
        ]
      },
      fallback: t('如果现场环境不可用，使用课程仓库中的离线材料和预期输出继续讨论。', 'If the live environment is unavailable, use offline materials and expected outputs from the course repository.')
    },
    exercise: {
      title: t(`${text(week.topic, 'zh')}课堂练习`, `${text(week.topic, 'en')} in-class exercise`),
      prompt: t(
        `围绕周任务“${text(week.work, 'zh')}”，写出对象、边界、证据、风险和下一步动作。`,
        `For the weekly task "${text(week.work, 'en')}", write the object, boundary, evidence, risk, and next action.`
      ),
      rubric: {
        zh: ['结论必须对应证据。', '步骤必须可复现。', '风险和限制必须明确写出。'],
        en: ['Each conclusion must map to evidence.', 'Steps must be reproducible.', 'Risks and limitations must be explicit.']
      }
    },
    homework: {
      zh: `${text(week.work, 'zh')}${text(profile.homeworkVerb, 'zh')}`,
      en: `${text(week.work, 'en')} ${text(profile.homeworkVerb, 'en')}`
    },
    script: makeScript(week, session),
    slides: makeSlides(week, session),
    media: makeMedia(week, session)
  };
}

function generateForCourse(code, syllabus) {
  return (syllabus.weeklyPlan ?? []).flatMap((week) => [
    makeLesson(code, syllabus, week, 1),
    makeLesson(code, syllabus, week, 2)
  ]);
}

const generatedLessonPlans = Object.fromEntries(
  Object.entries(syllabi).map(([code, syllabus]) => [code, generateForCourse(code, syllabus)])
);

export default generatedLessonPlans;
