# What changed — apply these over your existing repo folder

Overwrite these files in `aditya-dixitt-profile/`, then commit and push:

    README.md                          repositioned to backend/systems, leads with SAMANVAY
    assets/banner.svg                  tagline: BACKEND // SYSTEMS // FROM SCRATCH
    assets/panel-profile.svg           CLASS + FOCUS rows rewritten
    assets/panel-skills.svg            rebuilt around backend/systems, Go+Rust at tier 1
    assets/panel-quests.svg            SAMANVAY added as SHIPPED, Go server added
    assets/panel-achievements.svg      4/8 unlocked (Ship It + Benchmarked earned)
    scripts/build-panels.mjs           new CONTENT block + per-card sizing + overlap guard

Nothing else is touched — `hud-stats.svg` and `hud-langs.svg` are still owned by
the workflow, and the workflows themselves are unchanged.

## Separate: the samanvay language-stats fix

`samanvay-gitattributes.txt` does NOT go in this repo. Copy it into the root of
the **samanvay** repo, renamed to exactly `.gitattributes`, then commit. It stops
a generated HTML export from being counted as your primary language.
