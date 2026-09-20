#!/usr/bin/env node
/**
 * build-panels.mjs — renders the static HUD panels as SVG.
 *
 * All profile content lives in the CONTENT block below. Edit it here,
 * re-run `node scripts/build-panels.mjs`, and every panel regenerates.
 * Nothing else in the repo needs touching.
 */
import { writeFileSync, mkdirSync } from 'node:fs';

/* ═══ CONTENT ═════════════════════════════════════════════════════════ */
const CONTENT = {
  profile: [
    ['PLAYER',   'aditya-dixitt'],
    ['CLASS',    'Backend / Systems — in training'],
    ['ORIGIN',   'Pune, India'],
    ['STATUS',   'GRINDING'],
    ['CAMPAIGN', 'Act I — Foundations'],
    ['FOCUS',    'Go · Rust · C++ · Postgres · Linux'],
  ],
  // tier: 4 = used heavily · 3 = actively building with · 2 = basics · 1 = just started
  skills: [
    ['LANGUAGES', [['Python', 4], ['C++', 3], ['JavaScript', 3], ['Go', 1], ['Rust', 1]]],
    ['BACKEND',   [['REST APIs', 3], ['SQL / SQLite', 3], ['PostgreSQL', 1], ['Docker', 1]]],
    ['SYSTEMS',   [['Data Structures', 3], ['Algorithms', 3], ['Concurrency', 1], ['Networking', 1]]],
    ['TOOLS',     [['Git / GitHub', 4], ['Make', 3], ['Linux', 2], ['VS Code', 4]]],
  ],
  quests: [
    ['01', 'SHIPPED',     'TULYA — entity resolution',  '95.4% precision on a locked holdout'],
    ['02', 'IN PROGRESS', 'Redis, from scratch, in C++',           'Event loop, RESP protocol, KV store'],
    ['03', 'NEXT',        'Go — concurrent TCP server',            'Learn the language by writing a server'],
    ['04', 'ACTIVE',      'Data Structures & Algorithms',          'Consistent practice, no skipped days'],
  ],
  achievements: [
    [true,  'First Commit',      'Push your first commit'],
    [true,  'Save File Created', 'Publish a profile README'],
    [true,  'Ship It',           'TULYA — running, measured, public'],
    [true,  'Benchmarked',       'Evaluate against baselines on a locked split'],
    [false, 'Concurrent',        'Ship something in Go that handles load'],
    [false, 'Unsafe Territory',  'Write and publish real Rust'],
    [false, 'Open Source',       'Land a merged PR elsewhere'],
    [false, 'Constellation',     'First star from a stranger'],
  ],
};

/* ═══ DESIGN SYSTEM ═══════════════════════════════════════════════════ */
const W = 900;
const C = {
  bg: '#05070d', panel: '#080d15', line: '#16303f', grid: '#0f1c27',
  cyan: '#00f0ff', magenta: '#ff2bd6', green: '#00ff9d', violet: '#8a5cff',
  muted: '#6f8598', text: '#b9d7e6', bright: '#eafcff', dim: '#33475a',
  track: '#0f2029',
};
const MONO = 'ui-monospace, "SF Mono", SFMono-Regular, "Cascadia Mono", Menlo, Consolas, monospace';

const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const t = (x, y, s, o = {}) => {
  const { size = 18, fill = C.text, weight = 400, ls = 1.4, anchor = 'start' } = o;
  return `<text x="${x}" y="${y}" font-family='${MONO}' font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
};

const defs = `<defs>
  <pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M30 0H0V30" fill="none" stroke="${C.grid}" stroke-width="1"/>
  </pattern>
  <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${C.cyan}" stop-opacity="0"/>
    <stop offset="22%" stop-color="${C.cyan}"/>
    <stop offset="72%" stop-color="${C.magenta}"/>
    <stop offset="100%" stop-color="${C.magenta}" stop-opacity="0"/>
  </linearGradient>
</defs>`;

/* Every panel shares this frame: grid, rounded border, title, gradient rule. */
const shell = (h, title, body, accent = C.cyan) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" role="img">
${defs}
<rect width="${W}" height="${h}" rx="14" fill="${C.bg}"/>
<rect width="${W}" height="${h}" rx="14" fill="url(#g)" opacity="0.5"/>
<rect x="30" y="26" width="4" height="20" rx="2" fill="${accent}"/>
${t(46, 44, title, { size: 18, fill: accent, weight: 700, ls: 4.5 })}
<rect x="30" y="62" width="${W - 60}" height="1.5" fill="url(#rule)"/>
${body}
<rect x="0.75" y="0.75" width="${W - 1.5}" height="${h - 1.5}" rx="14" fill="none" stroke="${C.line}" stroke-width="1.5"/>
</svg>`;

const card = (x, y, w, h) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${C.panel}" stroke="${C.line}" stroke-width="1.5"/>`;

/* ═══ PANEL: PLAYER PROFILE ═══════════════════════════════════════════ */
function profile() {
  const rows = CONTENT.profile;
  const H = 110 + rows.length * 38;
  let b = card(30, 88, W - 60, rows.length * 38 + 14);
  rows.forEach(([k, v], i) => {
    const y = 122 + i * 38;
    b += t(56, y, k, { size: 16, fill: C.muted, ls: 2.6 });
    const hot = k === 'STATUS' ? C.green : k === 'MISSION' ? C.cyan : C.bright;
    if (k === 'STATUS') b += `<circle cx="228" cy="${y - 6}" r="5" fill="${C.green}"><animate attributeName="opacity" values="0.3;1;0.3" dur="2.2s" repeatCount="indefinite"/></circle>`;
    b += t(k === 'STATUS' ? 246 : 222, y, v, { size: 18, fill: hot, weight: 700, ls: 1.2 });
    if (i < rows.length - 1)
      b += `<rect x="56" y="${y + 12}" width="${W - 112}" height="1" fill="${C.line}" opacity="0.55"/>`;
  });
  return shell(H, 'PLAYER PROFILE', b);
}

/* ═══ PANEL: SKILL TREE ═══════════════════════════════════════════════ */
function skills() {
  const cols = [30, 465], colW = 405;
  const h = (n) => 82 + n * 34;                    // a card is as tall as its own list
  const rows = [];
  for (let i = 0; i < CONTENT.skills.length; i += 2) rows.push(CONTENT.skills.slice(i, i + 2));
  const rowH = rows.map((r) => Math.max(...r.map(([, l]) => h(l.length))));
  const tops = [];
  let y = 88;
  for (const rh of rowH) { tops.push(y); y += rh + 20; }
  const H = y + 26;

  let b = '';
  rows.forEach((row, ri) => {
    row.forEach(([cat, list], ci) => {
      const x = cols[ci], top = tops[ri];
      b += card(x, top, colW, h(list.length));
      b += t(x + 24, top + 32, cat, { size: 15, fill: C.magenta, weight: 700, ls: 3.4 });
      list.forEach(([name, tier], j) => {
        const ry = top + 66 + j * 34;
        b += `<path d="M${x + 24} ${ry - 20}v14h10" fill="none" stroke="${C.line}" stroke-width="1.5"/>`;
        b += t(x + 42, ry, name, { size: 17, fill: C.text, ls: 0.8 });
        for (let p = 0; p < 5; p++) {
          const on = p < tier;
          b += `<rect x="${x + 300 + p * 18}" y="${ry - 11}" width="12" height="12" rx="2.5"
                fill="${on ? (tier >= 4 ? C.cyan : tier === 1 ? C.muted : C.violet) : C.track}"/>`;
        }
      });
    });
  });
  b += t(W / 2, H - 16, 'SELF-ASSESSED  ·  4 USED HEAVILY  ·  3 BUILDING WITH  ·  2 BASICS  ·  1 JUST STARTED',
        { size: 13, fill: C.dim, ls: 1.6, anchor: 'middle' });
  return shell(H, 'SKILL TREE', b, C.magenta);
}

/* ═══ PANEL: ACTIVE QUESTS ════════════════════════════════════════════ */
function quests() {
  const STATUS = { SHIPPED: C.green, 'IN PROGRESS': C.cyan, NEXT: C.magenta, ACTIVE: C.violet, QUEUED: C.dim };
  const H = 96 + CONTENT.quests.length * 96;
  let b = '';
  CONTENT.quests.forEach(([n, status, title, obj], i) => {
    const y = 88 + i * 96, col = STATUS[status] || C.muted;
    b += card(30, y, W - 60, 80);
    b += `<rect x="30" y="${y}" width="4" height="80" rx="2" fill="${col}"/>`;
    b += t(56, y + 32, `QUEST ${n}`, { size: 14, fill: C.dim, ls: 3 });
    // monospace is ~0.6em per character, so overlap is predictable — catch it at build time
    if (56 + title.length * 12.8 + 28 > W - 56 - obj.length * 9.9)
      throw new Error(`Quest ${n}: title + objective are too long for one row. Shorten one of them.\n  title: "${title}"\n  objective: "${obj}"`);
    b += t(56, y + 60, title, { size: 20, fill: C.bright, weight: 700, ls: 0.6 });
    b += t(W - 56, y + 32, status, { size: 14, fill: col, weight: 700, ls: 2.4, anchor: 'end' });
    b += t(W - 56, y + 60, obj, { size: 15, fill: C.muted, ls: 0.8, anchor: 'end' });
  });
  return shell(H, 'ACTIVE QUESTS', b);
}

/* ═══ PANEL: ACHIEVEMENTS ═════════════════════════════════════════════ */
function achievements() {
  const list = CONTENT.achievements, rows = Math.ceil(list.length / 2);
  const H = 96 + rows * 72 + 26;
  const done = list.filter((a) => a[0]).length;
  let b = '';
  list.forEach(([unlocked, name, cond], i) => {
    const x = i % 2 ? 465 : 30, y = 88 + Math.floor(i / 2) * 72;
    b += card(x, y, 405, 60);
    const col = unlocked ? C.cyan : C.dim;
    b += `<circle cx="${x + 32}" cy="${y + 30}" r="13" fill="none" stroke="${col}" stroke-width="1.5"/>`;
    b += unlocked
      ? `<path d="M${x + 26} ${y + 30}l4.5 5 9-10" fill="none" stroke="${C.cyan}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<rect x="${x + 27}" y="${y + 28}" width="10" height="8" rx="1.5" fill="${C.dim}"/><path d="M${x + 29} ${y + 28}v-3a3 3 0 0 1 6 0v3" fill="none" stroke="${C.dim}" stroke-width="1.6"/>`;
    b += t(x + 56, y + 27, name, { size: 17, fill: unlocked ? C.bright : C.muted, weight: 700, ls: 0.6 });
    b += t(x + 56, y + 46, cond, { size: 13, fill: C.dim, ls: 0.6 });
  });
  b += t(W / 2, H - 18, `${done} / ${list.length} UNLOCKED  ·  LOCKED ENTRIES ARE REAL GOALS, NOT DECORATION`,
        { size: 13, fill: C.dim, ls: 1.6, anchor: 'middle' });
  return shell(H, 'ACHIEVEMENTS', b);
}

mkdirSync('assets', { recursive: true });
writeFileSync('assets/panel-profile.svg', profile());
writeFileSync('assets/panel-skills.svg', skills());
writeFileSync('assets/panel-quests.svg', quests());
writeFileSync('assets/panel-achievements.svg', achievements());
console.log('panels built');
