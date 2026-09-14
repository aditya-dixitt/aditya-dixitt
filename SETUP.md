# GitHub Profile — Setup

Everything needed for `github.com/aditya-dixitt`.

## What goes where

```
final/
│
├── README.md              →  repo root (replaces the current one)
├── assets/                →  repo root, keep the folder name
├── scripts/               →  repo root, keep the folder name
├── .github/workflows/     →  repo root, keep the folder name
│
├── SETUP.md               ✗  don't upload (this file)
└── _previews/             ✗  don't upload (reference images)
```

Folder names matter. `README.md` looks for images at `./assets/...`, and GitHub
only runs workflows found in `.github/workflows/`. Renaming either breaks it.

## Deploy — 4 steps

**1 · Upload the folders**

Repo → **Add file → Upload files** → drag in `assets`, `scripts` and `.github`
together → Commit.

> `.github` is hidden on most systems. Windows: File Explorer → View → tick
> *Hidden items*. macOS: press `Cmd + Shift + .` in Finder.

**2 · Replace the README**

Click `README.md` → pencil icon → select all → paste the new one → Commit.

**3 · Allow the workflows to write**

**Settings → Actions → General → Workflow permissions →
"Read and write permissions" → Save.**

Both workflows commit generated files back to the repo. Without this they fail
with a 403.

**4 · Run both once**

**Actions** tab → *Sync Player HUD* → **Run workflow**. Then
*Generate Contribution Snake* → **Run workflow**.

## What you'll see

Before step 4 the stats panel reads `INITIALIZING TELEMETRY` and the snake is a
broken image. Both are correct — those files don't exist until the workflows
create them. After step 4 the panel fills with real numbers and the snake
appears. Both then refresh daily on their own.

## Editing content later

All profile text lives in one `CONTENT` block at the top of
`scripts/build-panels.mjs` — profile rows, skill tiers, quests, achievements.

```bash
# edit the CONTENT block, then:
node scripts/build-panels.mjs
```

That redraws all four panels. Commit the changed SVGs. Never hand-edit an SVG.

To preview the stats panel with sample numbers, without a token:

```bash
node scripts/build-hud.mjs --mock     # writes assets/_preview-*.svg
```

## Still to fill in

- [ ] Replace the default avatar (Settings → Profile → picture)
- [ ] Uncomment your real links in the TRANSMISSION section of `README.md`
- [ ] Push the Redis project, then add it under FEATURED MISSIONS
- [ ] Adjust skill tiers in `build-panels.mjs` if any feel wrong

## Optional — private contributions in the stats

By default the HUD counts public activity only. To include private
contributions: create a token at **Settings → Developer settings → Personal
access tokens → Fine-grained**, no repo access needed, then add it to the repo
as a secret named `GH_PAT` (Settings → Secrets and variables → Actions). The
workflow picks it up automatically.
