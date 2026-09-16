import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const publicDir = join(root, 'public');
const teaching = JSON.parse(readFileSync(join(root, 'src/data/courses.json'), 'utf8'));
mkdirSync(publicDir, { recursive: true });

const courseByEnglishName = Object.fromEntries(teaching.courses.map((course) => [course.name.en, course]));

const dependencyNames = [
  ['Computer Organization', 'Assembly Language'],
  ['Computer Organization', 'Computer Architecture'],
  ['Computer Organization', 'Systems Programming'],
  ['Assembly Language', 'Systems Programming'],
  ['Assembly Language', 'Applied Cryptography'],
  ['Computer Organization', 'Trusted Computing Methods and Security'],
  ['Computer Architecture', 'Trusted Computing Methods and Security'],
  ['Computer Organization', 'Embedded Systems Principles and Security'],
  ['Computer Architecture', 'Embedded Systems Principles and Security'],
  ['Compiler Principles', 'Program Analysis'],
  ['Program Analysis', 'Software Security'],
  ['Program Analysis', 'System Security'],
  ['Systems Programming', 'Computer Networks'],
  ['Computer Networks', 'Network Protocol Analysis and Verification'],
  ['System Security', 'Network Protocol Analysis and Verification'],
  ['Program Analysis', 'Network Protocol Analysis and Verification'],
  ['Discrete Mathematics', 'Applied Cryptography'],
  ['Discrete Mathematics', 'Compiler Principles'],
  ['Computer Networks', 'Applied Cryptography'],
  ['Applied Cryptography', 'Network Protocol Analysis and Verification'],
  ['Applied Cryptography', 'System Security'],
  ['Applied Cryptography', 'Hardware Injection and Hardware Security'],
  ['Applied Cryptography', 'Security Baselines, Compliance, and Automation'],
  ['Hardware Injection and Hardware Security', 'Trusted Computing Methods and Security'],
  ['Computer Architecture', 'Trusted Computing Methods and Security'],
  ['Applied Cryptography', 'Trusted Computing Methods and Security'],
  ['Virtualization Methods and Security', 'Trusted Computing Methods and Security'],
  ['System Security', 'Trusted Computing Methods and Security'],
  ['Systems Programming', 'Embedded Systems Principles and Security'],
  ['System Security', 'Embedded Systems Principles and Security'],
  ['Software Engineering', 'Software Security'],
  ['Systems Programming', 'Operating Systems'],
  ['Systems Programming', 'Software Security'],
  ['Operating Systems', 'System Security'],
  ['Software Security', 'System Security'],
  ['Computer Architecture', 'System Security'],
  ['System Security', 'Hardware Injection and Hardware Security'],
  ['Computer Architecture', 'Hardware Injection and Hardware Security'],
  ['System Security', 'Digital Forensics and Attribution'],
  ['Operating Systems', 'Digital Forensics and Attribution'],
  ['System Security', 'Virtualization Methods and Security'],
  ['Operating Systems', 'Virtualization Methods and Security'],
  ['Computer Architecture', 'Virtualization Methods and Security'],
  ['System Security', 'Security Baselines, Compliance, and Automation'],
  ['Operating Systems', 'Security Baselines, Compliance, and Automation'],
  ['System Security Research Methods', 'Hardware Injection and Hardware Security'],
  ['System Security Research Methods', 'Digital Forensics and Attribution'],
  ['System Security Research Methods', 'Network Protocol Analysis and Verification'],
  ['System Security Research Methods', 'Trusted Computing Methods and Security'],
  ['System Security Research Methods', 'Embedded Systems Principles and Security'],
  ['System Security Research Methods', 'Virtualization Methods and Security'],
  ['System Security Research Methods', 'Security Baselines, Compliance, and Automation']
];

const edges = dependencyNames.map(([from, to]) => {
  const source = courseByEnglishName[from];
  const target = courseByEnglishName[to];
  if (!source || !target) throw new Error(`Missing course dependency endpoint: ${from} -> ${to}`);
  return [source.code, target.code];
});

const escape = (value) => value.replaceAll('"', '\\"');
const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');
const nodeId = (code) => `"${escape(code)}"`;
const slug = (code) => code.toLowerCase();
const isUnderDevelopment = (course) => course.status.en.toLowerCase().includes('under development');
const wrap = (value, size) => {
  if (value.length <= size) return value;
  const parts = [];
  let remaining = value;
  while (remaining.length > size) {
    const space = remaining.lastIndexOf(' ', size);
    const split = space > 0 ? space : size;
    parts.push(remaining.slice(0, split));
    remaining = remaining.slice(split).trim();
  }
  if (remaining) parts.push(remaining);
  return parts.join('\\n');
};
const htmlLines = (value) => escapeHtml(value).replaceAll('\\n', '<BR/>');

const dot = (lang, level) => {
  const zh = lang === 'zh';
  const font = zh ? 'Noto Sans CJK SC' : 'Arial';
  const courses = teaching.courses.filter((course) => course.level.en === level);
  const courseCodes = new Set(courses.map((course) => course.code));
  const nodeStatement = (course) => {
    const title = wrap(course.name[lang], zh ? 12 : 26);
    const inactive = isUnderDevelopment(course);
    const undergraduate = course.level.en === 'Undergraduate';
    const badge = zh ? (undergraduate ? '本' : '研') : (undergraduate ? 'UG' : 'GR');
    const fill = inactive ? '#eef0f2' : '#ffffff';
    const stroke = inactive ? '#d3d7dc' : '#8bb8df';
    const fontColor = inactive ? '#5f666d' : '#111111';
    const metaColor = inactive ? '#6f767d' : '#4c5965';
    const badgeFill = undergraduate ? (inactive ? '#e3e8ee' : '#d9ebfb') : (inactive ? '#e8e4ec' : '#eadcf8');
    const badgeColor = undergraduate ? (inactive ? '#596472' : '#155f9e') : (inactive ? '#665b70' : '#6c348f');
    const url = `/${lang}/courses/${slug(course.code)}/`;
    return `    ${nodeId(course.code)} [
    label=<
      <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="0" CELLPADDING="6" COLOR="${stroke}" BGCOLOR="${fill}">
        <TR>
          <TD ALIGN="LEFT"><FONT FACE="${font}" POINT-SIZE="11" COLOR="${metaColor}">${escapeHtml(course.code)}</FONT></TD>
          <TD ALIGN="RIGHT" BGCOLOR="${badgeFill}"><FONT FACE="${font}" POINT-SIZE="9" COLOR="${badgeColor}">${badge}</FONT></TD>
        </TR>
        <TR>
          <TD COLSPAN="2" ALIGN="CENTER"><FONT FACE="${font}" POINT-SIZE="12" COLOR="${fontColor}">${htmlLines(title)}</FONT></TD>
        </TR>
      </TABLE>
    >,
    URL="${escape(url)}",
    target="_top"
  ];`;
  };
  const nodes = courses.map(nodeStatement).join('\n');
  const links = edges
    .filter(([from, to]) => courseCodes.has(from) && courseCodes.has(to))
    .map(([from, to]) => `  ${nodeId(from)} -> ${nodeId(to)};`)
    .join('\n');
  return `digraph CourseGraph {
  graph [
    rankdir=LR,
    bgcolor="transparent",
    margin=0,
    pad=0.08,
    nodesep=0.46,
    ranksep=0.82,
    splines=spline,
    outputorder=edgesfirst
  ];
  node [
    shape=plain,
    fontname="${font}"
  ];
  edge [
    color="#9bb6cf",
    penwidth=1.1,
    arrowsize=0.55,
    fontname="${font}"
  ];
${nodes}
${links}
}`;
};

for (const lang of ['en', 'zh']) {
  for (const level of ['Undergraduate', 'Graduate']) {
    const out = join(publicDir, `course-graph-${lang}-${level.toLowerCase()}.svg`);
    const result = spawnSync('dot', ['-Tsvg', '-o', out], {
      input: dot(lang, level),
      encoding: 'utf8'
    });
    if (result.status !== 0) {
      throw new Error(`Graphviz failed for ${lang} ${level}: ${result.stderr || result.error?.message || 'unknown error'}`);
    }
    writeFileSync(out, cleanSvg(out));
  }
}

function cleanSvg(path) {
  return readFileSync(path, 'utf8')
    .replace(/<\?xml[\s\S]*?\?>\n?/u, '')
    .replace(/<!DOCTYPE svg[\s\S]*?>\n?/u, '')
    .replace(/<!-- Generated by graphviz version[\s\S]*?-->\n?/u, '')
    .replace(/<title>[\s\S]*?<\/title>\n?/gu, '')
    .replace(/ xlink:title="[^"]*"/gu, '');
}
