# Website Rebuild Prompt

重新从零实现这个网站。不要沿用当前或之前的页面、组件、CSS、布局和视觉方案。

## 目标

使用 Astro 构建一个静态主页。主页内部使用 tab 切换不同内容，不创建多个实验室子页面。

参考网站：

https://www.55aaseclab.com/

参考的是它的页面组织和信息呈现方式，不是要求发挥新的视觉设计。

## 视觉约束

- 白色背景。
- 黑色文字。
- 蓝色超链接。
- 使用普通、清晰、可读的网页排版。
- 不要设计新的品牌视觉。
- 不要加入渐变。
- 不要加入装饰性背景。
- 不要加入纹理。
- 不要加入竹简、古风、档案、卷轴、印章、朱砂等元素。
- 不要加入卡片、阴影、圆角容器或营销型 hero。
- 不要画装饰线、分隔线或无意义边框。
- 不要使用大面积留白来制造视觉效果。
- 不要为不同 tab 设计不同的视觉系统。
- 所有 tab 的起始位置、间距、字体和内容结构保持一致。
- People 不得单独使用特殊间距规则。

## 页面结构

- 顶部保留站点名称和必要的语言切换。
- 主体直接显示 tab 导航。
- 不要在 tab 上方添加：
  - `55AA Security Lab`
  - slogan
  - organization statement
  - hero
  - title/subtitle 组合
- tab 内容区域直接显示数据。
- tab 包括：
  - Research
  - People
  - Publications
  - Projects
  - Tools
  - Teaching
  - Blog
  - Contact
- 使用原生按钮或简单链接实现 tab 切换。
- 页面应支持 `/en/` 和 `/zh/`。
- 页面底部保留简单 footer，但不要设计 footer。

## People

People 内容必须按照以下顺序显示：

1. profile image
2. name
3. role
4. motto
5. social icons

当前 People 数据来自 `src/data/people.json`。

Google Scholar、GitHub 和 Email 只能显示 icon，不能显示文字链接。

三个 icon 必须彼此紧凑排列。不要给 People 增加额外的大块空白、特殊卡片、边框或单独布局。

## 数据要求

- 保留并使用现有 `src/data/*.json`。
- 不修改现有 JSON 数据结构，除非实现确实无法读取某个字段。
- 不把数据写死在 Astro 页面中。
- 每个数据文件继续作为独立页面数据源：
  - `home.json`
  - `research.json`
  - `people.json`
  - `publications.json`
  - `projects.json`
  - `tools.json`
  - `courses.json`
  - `blog.json`
  - `contact.json`
- 不创建一个新的统一 JSON 替代这些文件。

## Publications

- `publications.json` 同时支持手工论文和 DBLP 数据。
- 手工论文和 DBLP 单论文应使用各自已有的数据结构。
- 当前任务只需要正确展示已有数据，不要重新实现 DBLP 网络解析。

## 实现要求

- 先读取现有 JSON，再写模板。
- 先确认参考站的实际结构，再实现。
- 只建立必要的 Astro 文件。
- 不要添加无关依赖。
- 不要添加设计说明文字到网页中。
- 不要用 TypeScript 数据对象替代 JSON。
- 不要删除任何现有 JSON。
- 删除旧实现后，确保没有空目录。
- 最后运行 `npm run build` 验证。

## 验收标准

- `/en/` 可以打开。
- `/zh/` 可以打开。
- tab 可以切换。
- 所有 tab 内容来自对应 JSON。
- People 的头像、姓名、职务、座右铭和 icon 紧凑排列。
- 页面只有白底、黑字、蓝色链接。
- 没有额外的 hero、宣传语、卡片、装饰线、渐变和自创设计。
