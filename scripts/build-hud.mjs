#!/usr/bin/env node
/**
 * build-hud.mjs — generates the PLAYER STATISTICS HUD as SVG files.
 *
 * WHY THIS EXISTS
 * Public stat-card services (github-readme-stats etc.) are rate-limited in 2026,
 * which shows up on your profile as broken images. This script asks GitHub for
 * YOUR numbers directly and draws them into an SVG that lives in your own repo.
 * Nothing to rate-limit, nothing to break, and the design matches the banner.
 *
 * RUN
 *   GH_TOKEN=xxx GH_LOGIN=aditya-dixitt node scripts/build-hud.mjs
 *   node scripts/build-hud.mjs --placeholder   (no token; draws the empty frame)
 */

import { writeFileSync, mkdirSync } from 'node:fs';

const LOGIN = process.env.GH_LOGIN || 'aditya-dixitt';
const TOKEN = process.env.GH_TOKEN;
const PLACEHOLDER = process.argv.includes('--placeholder');

/* ---------- DESIGN TOKENS -------------------------------------------------
   One place for every colour. Change it here, the whole HUD follows.        */
const C = {
  bg: '#05070d', panel: '#080d15', line: '#16303f', grid: '#0f1c27',
  cyan: '#00f0ff', magenta: '#ff2bd6', green: '#00ff9d', violet: '#8a5cff',
  muted: '#6f8598', text: '#b9d7e6', bright: '#eafcff', dim: '#2e4453',
};
const MONO = 'ui-monospace, "SF Mono", SFMono-Regular, "Cascadia Mono", Menlo, Consolas, monospace';

/* ---------- XP MODEL ------------------------------------------------------
   Published openly so the level is auditable, not decorative.
   Weights reflect effort: a merged PR costs more than a commit.             */
const WEIGHTS = { commits: 10, prs: 50, issues: 25, reviews: 40, repos: 100, stars: 75 };
const XP_PER_LEVEL = 250;                                  // level N starts at 250*(N-1)^2
const levelFloor = (l) => XP_PER_LEVEL * (l - 1) ** 2;
const levelOf   = (xp) => Math.floor(Math.sqrt(xp / XP_PER_LEVEL)) + 1;

/* ---------- GRAPHQL -------------------------------------------------------
   One request returns everything. The REST API would need five.             */
const QUERY = `query($login:String!){
  user(login:$login){
    login createdAt
    followers{totalCount}
    contributionsCollection{
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      contributionCalendar{ totalContributions weeks{ contributionDays{ date contributionCount } } }
    }
    repositories(first:100, ownerAffiliations:OWNER, isFork:false){
      totalCount
      nodes{
        stargazerCount
        languages(first:8, orderBy:{field:SIZE,direction:DESC}){ edges{ size node{ name color } } }
      }
    }
  }
}`;

async function fetchStats() {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'profile-hud',
    },
    body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data.user;
}

/* Longest run of consecutive days with at least one contribution. */
function streaks(weeks) {
  const days = weeks.flatMap((w) => w.contributionDays).sort((a, b) => a.date.localeCompare(b.date));
  let cur = 0, best = 0;
  for (const d of days) {
    if (d.contributionCount > 0) { cur++; best = Math.max(best, cur); } else { cur = 0; }
  }
  // current streak counts backwards from the most recent day
  let now = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) now++;
    else if (i !== days.length - 1) break;      // today being empty is allowed
  }
  return { current: now, longest: best };
}

function shape(user) {
  const c = user.contributionsCollection;
  const repos = user.repositories.nodes;
  const stars = repos.reduce((s, r) => s + r.stargazerCount, 0);

  const stats = {
    commits: c.totalCommitContributions,
    prs: c.totalPullRequestContributions,
    issues: c.totalIssueContributions,
    reviews: c.totalPullRequestReviewContributions,
    repos: user.repositories.totalCount,
    stars,
  };
  const xp = Object.entries(WEIGHTS).reduce((sum, [k, w]) => sum + stats[k] * w, 0);
  const level = levelOf(xp);

  // aggregate bytes per language across all repos
  const bytes = new Map();
  for (const r of repos) {
    for (const e of r.languages.edges) {
      const p = bytes.get(e.node.name) || { size: 0, color: e.node.color || C.cyan };
      p.size += e.size;
      bytes.set(e.node.name, p);
    }
  }
  const total = [...bytes.values()].reduce((s, v) => s + v.size, 0) || 1;
  const langs = [...bytes.entries()]
    .sort((a, b) => b[1].size - a[1].size).slice(0, 6)
    .map(([name, v]) => ({ name, pct: (v.size / total) * 100, color: v.color }));

  return {
    ...stats, xp, level,
    total: c.contributionCalendar.totalContributions,
    ...streaks(c.contributionCalendar.weeks),
    xpInto: xp - levelFloor(level),
    xpNeed: levelFloor(level + 1) - levelFloor(level),
    langs,
    synced: new Date().toISOString().slice(0, 10),
  };
}

/* ---------- SVG HELPERS --------------------------------------------------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = (x, y, s, { size = 16, fill = C.text, weight = 400, ls = 1.4, anchor = 'start' } = {}) =>
  `<text x="${x}" y="${y}" font-family='${MONO}' font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;

const defs = `<defs>
  <pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M30 0H0V30" fill="none" stroke="${C.grid}" stroke-width="1"/>
  </pattern>
  <linearGradient id="xp" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${C.cyan}"/><stop offset="100%" stop-color="${C.violet}"/>
  </linearGradient>
  <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${C.cyan}" stop-opacity="0"/>
    <stop offset="25%" stop-color="${C.cyan}"/><stop offset="75%" stop-color="${C.magenta}"/>
    <stop offset="100%" stop-color="${C.magenta}" stop-opacity="0"/>
  </linearGradient>
</defs>`;

const shell = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
${defs}
<rect width="${w}" height="${h}" rx="14" fill="${C.bg}"/>
<rect width="${w}" height="${h}" rx="14" fill="url(#g)" opacity="0.5"/>
${body}
<rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="14" fill="none" stroke="${C.line}" stroke-width="1.5"/>
</svg>`;

/* A single stat cell: label above, big number below. */
function cell(x, y, label, value, colour = C.bright) {
  return t(x, y, label, { size: 15, fill: C.muted, ls: 1.8 }) +
         t(x, y + 34, String(value), { size: 32, fill: colour, weight: 700, ls: 0 });
}

/* ---------- PANEL 1: stats + XP ------------------------------------------- */
function statsPanel(d) {
  const W = 900, H = 340;
  const barW = 300, pct = d ? Math.min(1, d.xpInto / d.xpNeed) : 0;

  let b = '';
  b += t(30, 44, 'PLAYER STATISTICS', { size: 17, fill: C.cyan, weight: 700, ls: 4 });
  b += t(W - 30, 44, d ? `LAST SYNC ${d.synced}` : 'AWAITING FIRST SYNC',
        { size: 15, fill: C.dim, ls: 2, anchor: 'end' });
  b += `<rect x="30" y="60" width="${W - 60}" height="1.5" fill="url(#rule)"/>`;

  if (!d) {
    b += t(W / 2, 180, 'INITIALIZING TELEMETRY', { size: 22, fill: C.muted, ls: 4, anchor: 'middle' });
    b += t(W / 2, 212, 'run the sync workflow to populate', { size: 15, fill: C.dim, ls: 1.5, anchor: 'middle' });
    return shell(W, H, b);
  }

  // level + xp bar
  b += `<rect x="30" y="86" width="330" height="128" rx="10" fill="${C.panel}" stroke="${C.line}" stroke-width="1.5"/>`;
  b += t(52, 116, 'LEVEL', { size: 15, fill: C.muted, ls: 2.4 });
  b += t(52, 168, String(d.level), { size: 54, fill: C.cyan, weight: 700, ls: 0 });
  b += t(130, 168, `${d.xp.toLocaleString()} XP`, { size: 18, fill: C.text, weight: 700 });
  b += `<rect x="130" y="180" width="${barW - 100}" height="8" rx="4" fill="#0f2029"/>`;
  b += `<rect x="130" y="180" width="${Math.max(4, (barW - 100) * pct)}" height="8" rx="4" fill="url(#xp)"/>`;
  b += t(130, 200, `${d.xpInto.toLocaleString()} / ${d.xpNeed.toLocaleString()} to level ${d.level + 1}`,
        { size: 13, fill: C.dim, ls: 1 });

  // six stat cells
  const cols = [400, 562, 724];
  b += cell(cols[0], 116, 'COMMITS', d.commits);
  b += cell(cols[1], 116, 'PULL REQUESTS', d.prs);
  b += cell(cols[2], 116, 'REPOSITORIES', d.repos);
  b += cell(cols[0], 186, 'ISSUES', d.issues);
  b += cell(cols[1], 186, 'REVIEWS', d.reviews);
  b += cell(cols[2], 186, 'STARS EARNED', d.stars, C.magenta);

  // streak strip
  b += `<rect x="30" y="240" width="${W - 60}" height="70" rx="10" fill="${C.panel}" stroke="${C.line}" stroke-width="1.5"/>`;
  b += t(52, 268, 'CONTRIBUTIONS (12 MO)', { size: 14, fill: C.muted, ls: 1.8 });
  b += t(52, 296, String(d.total), { size: 24, fill: C.bright, weight: 700, ls: 0 });
  b += t(330, 268, 'CURRENT STREAK', { size: 14, fill: C.muted, ls: 1.8 });
  b += t(330, 296, `${d.current} d`, { size: 24, fill: C.green, weight: 700, ls: 0 });
  b += t(600, 268, 'LONGEST STREAK', { size: 14, fill: C.muted, ls: 1.8 });
  b += t(600, 296, `${d.longest} d`, { size: 24, fill: C.violet, weight: 700, ls: 0 });

  return shell(W, H, b);
}

/* ---------- PANEL 2: languages -------------------------------------------- */
function langPanel(d) {
  const W = 900, rows = d?.langs?.length || 0;
  const H = 114 + Math.max(1, rows) * 38;
  let b = '';
  b += t(30, 44, 'LOADOUT // LANGUAGE DISTRIBUTION', { size: 17, fill: C.cyan, weight: 700, ls: 4 });
  b += `<rect x="30" y="60" width="${W - 60}" height="1.5" fill="url(#rule)"/>`;

  if (!rows) {
    b += t(W / 2, 110, 'NO LANGUAGE DATA YET', { size: 18, fill: C.muted, ls: 3, anchor: 'middle' });
    return shell(W, H, b);
  }
  d.langs.forEach((l, i) => {
    const y = 100 + i * 38;
    const full = 560;
    b += t(30, y + 14, l.name, { size: 16, fill: C.text, weight: 700 });
    b += `<rect x="200" y="${y}" width="${full}" height="16" rx="8" fill="#0f2029"/>`;
    b += `<rect x="200" y="${y}" width="${Math.max(6, (full * l.pct) / 100)}" height="16" rx="8" fill="${l.color}"/>`;
    b += t(W - 30, y + 14, `${l.pct.toFixed(1)}%`, { size: 15, fill: C.muted, anchor: 'end' });
  });
  return shell(W, H, b);
}

/* ---------- MAIN ---------------------------------------------------------- */
// --mock renders SAMPLE numbers to assets/_preview-*.svg so you can check the
// layout locally without a token. It never touches the real HUD files.
const MOCK = process.argv.includes('--mock');
const sample = {
  commits: 412, prs: 23, issues: 11, reviews: 7, repos: 14, stars: 38,
  xp: 12345, level: 8, total: 463, current: 12, longest: 41,
  xpInto: 1095, xpNeed: 3750, synced: '2026-09-07',
  langs: [
    { name: 'JavaScript', pct: 38.2, color: '#f1e05a' },
    { name: 'C++',        pct: 24.6, color: '#f34b7d' },
    { name: 'Java',       pct: 18.1, color: '#b07219' },
    { name: 'CSS',        pct: 11.4, color: '#563d7c' },
    { name: 'HTML',       pct:  7.7, color: '#e34c26' },
  ],
};

mkdirSync('assets', { recursive: true });
if (MOCK) {
  writeFileSync('assets/_preview-stats.svg', statsPanel(sample));
  writeFileSync('assets/_preview-langs.svg', langPanel(sample));
  console.log('preview written (SAMPLE DATA — not your real stats)');
} else {
  const data = PLACEHOLDER || !TOKEN ? null : shape(await fetchStats());
  writeFileSync('assets/hud-stats.svg', statsPanel(data));
  writeFileSync('assets/hud-langs.svg', langPanel(data));
  console.log(data ? `HUD built — level ${data.level}, ${data.xp} XP` : 'HUD built — placeholder');
}
