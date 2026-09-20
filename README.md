<div align="center">

<img src="./assets/banner.svg" width="100%" alt="Aditya Dixitt — Player 01 — Backend, Systems, From Scratch">

![System](https://img.shields.io/badge/SYSTEM-ONLINE-0B0F14?style=flat-square&labelColor=0B0F14&color=0B0F14&logo=statuspage&logoColor=00FF9D)
![Focus](https://img.shields.io/badge/FOCUS-BACKEND_%2F%2F_SYSTEMS-0B0F14?style=flat-square&labelColor=0B0F14&color=0B0F14&logo=serverless&logoColor=00F0FF)
![Build](https://img.shields.io/badge/BUILD-2026-0B0F14?style=flat-square&labelColor=0B0F14&color=0B0F14&logo=semanticrelease&logoColor=FF2BD6)
![Campaign](https://img.shields.io/badge/CAMPAIGN-ACT_I-0B0F14?style=flat-square&labelColor=0B0F14&color=0B0F14&logo=gamejolt&logoColor=8A5CFF)

<br>

<img src="./assets/panel-profile.svg" width="100%" alt="Player profile: aditya-dixitt, backend and systems in training, Pune India, status GRINDING, Act I Foundations, focus on Go, Rust, C++, Postgres and Linux">

</div>

## ▍ BRIEFING

> I build backends and I like knowing what's underneath them — so I tend to
> rebuild the thing rather than read about it. Most of what I've learned so far
> came from one hard problem: matching millions of messy records against each
> other without wrongly merging any of them.
>
> Right now I'm moving toward **Go and Rust** for backend and systems work, and
> writing a Redis clone in C++ to understand how a database server actually runs.
> I care more about measuring whether something works than about shipping fast.

**Building with** — Python · C++ · SQL
**Learning now** — Go · Rust · PostgreSQL · Docker · networking
**Open to** — backend / systems internships · hackathon teams · open-source

---

## ▍ FEATURED WORK

### TULYA — entity resolution across public-sector material catalogues

[`aditya-dixitt/tulya`](https://github.com/aditya-dixitt/tulya) · Python ·
Smart India Hackathon `SIH26099` · Team AlgoRythms

The same bolt sits in three organisations' catalogues under three codes and three
spellings — and under two different codes at two plants of the *same* company.
TULYA finds the records that mean the same item and proposes one national code,
with a human approving every merge.

```
Hexagonal Bolt 12mm x 50mm St.Steel  ==  BOLT HEX M12X50 SS304   same item, almost no shared words
BOLT HEX M12X50 SS304                !=  BOLT HEX M16X50 SS304   different item, nearly all words shared
```

Text similarity fails in both directions at once, so two mechanisms run: one
compares meaning, one reads the specifications and can overrule it.

| | |
|---|---|
| **Auto-suggest precision** | 95.4% on a locked test split (6,541 proposed, 299 wrong) |
| **Coverage of true duplicates** | 82.6% |
| **Search space reduced** | 147,130 candidate pairs from 24.5M possible — 99.4% cut by blocking |
| **Safety mechanism** | hard-key veto: any known spec that disagrees forces the score to zero |

What I'd point at in a code review: evaluation is split into three layers so
blocking can't be gamed by weakening it; the test split is locked and timestamped,
re-running needs `--force`; ~2,000 hard negatives are planted one spec apart;
`UNKNOWN` is never treated as agreement; and thin evidence caps a pair at human
review instead of trusting it. Known limits are written down rather than hidden.

The steward console (Flask + SQLite, union-find grouping, append-only audit log)
exists because a system that merges records without a human is a system nobody
will switch on.

**Stack** — Python · NumPy · Flask · SQLite · Make

---

<div align="center">

<img src="./assets/panel-quests.svg" width="100%" alt="Active quests — TULYA shipped; Redis from scratch in C++ in progress; Go concurrent TCP server next; DSA practice active.">

<br>

<img src="./assets/panel-skills.svg" width="100%" alt="Skill tree — Languages: Python, C++, JavaScript, Go, Rust. Backend: REST APIs, SQL/SQLite, PostgreSQL, Docker. Systems: data structures, algorithms, concurrency, networking. Tools: Git, Make, Linux, VS Code.">

</div>

## ▍ LOADOUT

<div align="center">

**BUILDING WITH**

![Python](https://img.shields.io/badge/Python-0B0F14?style=flat-square&logo=python&logoColor=00F0FF)
![C++](https://img.shields.io/badge/C%2B%2B-0B0F14?style=flat-square&logo=cplusplus&logoColor=00F0FF)
![SQLite](https://img.shields.io/badge/SQLite-0B0F14?style=flat-square&logo=sqlite&logoColor=00F0FF)
![Flask](https://img.shields.io/badge/Flask-0B0F14?style=flat-square&logo=flask&logoColor=00F0FF)
![NumPy](https://img.shields.io/badge/NumPy-0B0F14?style=flat-square&logo=numpy&logoColor=00F0FF)
![Git](https://img.shields.io/badge/Git-0B0F14?style=flat-square&logo=git&logoColor=00F0FF)
![Linux](https://img.shields.io/badge/Linux-0B0F14?style=flat-square&logo=linux&logoColor=00F0FF)
![GNU Make](https://img.shields.io/badge/Make-0B0F14?style=flat-square&logo=gnubash&logoColor=00F0FF)

**LEARNING NOW**

![Go](https://img.shields.io/badge/Go-0B0F14?style=flat-square&logo=go&logoColor=6F8598)
![Rust](https://img.shields.io/badge/Rust-0B0F14?style=flat-square&logo=rust&logoColor=6F8598)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-0B0F14?style=flat-square&logo=postgresql&logoColor=6F8598)
![Docker](https://img.shields.io/badge/Docker-0B0F14?style=flat-square&logo=docker&logoColor=6F8598)

<sub>Dimmed logos are technologies I'm learning, not ones I've shipped with. They brighten when a repo here proves otherwise.</sub>

<br><br>

<img src="./assets/panel-achievements.svg" width="100%" alt="Achievements — 4 of 8 unlocked: First Commit, Save File Created, Ship It, Benchmarked. Locked: Concurrent, Unsafe Territory, Open Source, Constellation.">

<br>

<img src="./assets/hud-stats.svg" width="100%" alt="Live GitHub statistics: level, XP, commits, pull requests, repositories, issues, reviews, stars, contribution streaks">

<br>

<img src="./assets/hud-langs.svg" width="100%" alt="Language distribution across repositories">

<br>

<img src="https://raw.githubusercontent.com/aditya-dixitt/aditya-dixitt/output/snake.svg" width="100%" alt="Snake animation consuming the contribution graph">

</div>

<details>
<summary><b>How the level is calculated</b> — no fake numbers here</summary>

<br>

LEVEL and XP come from live GitHub API data via
[`scripts/build-hud.mjs`](./scripts/build-hud.mjs), on a published formula:

```
XP     = commits×10 + PRs×50 + issues×25 + reviews×40 + repos×100 + stars×75
LEVEL  = floor( sqrt( XP / 250 ) ) + 1
```

Regenerated daily by a scheduled Action. Nothing is hand-written and nothing is
inflated — the numbers are small because the account is new, and that's the point.

The static panels are generated too, from one `CONTENT` block in
[`scripts/build-panels.mjs`](./scripts/build-panels.mjs).

</details>

## ▍ TRANSMISSION

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-0B0F14?style=flat-square&logo=github&logoColor=00F0FF)](https://github.com/aditya-dixitt)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0B0F14?style=flat-square&logo=linkedin&logoColor=00F0FF)](https://www.linkedin.com/in/aditya-dixit-1140a53b9/)
[![Email](https://img.shields.io/badge/Email-0B0F14?style=flat-square&logo=gmail&logoColor=00F0FF)](mailto:adityadixit.1127@gmail.com)


<br>

<sub>`SESSION ACTIVE` · `AUTOSAVE ENABLED` · every panel here is generated from code in this repo</sub>

</div>
