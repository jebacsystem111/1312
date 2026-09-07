# 1312

Unified repository for the combined AI skill collections from `emilskills`, `gust`, and `impeccableskills`.

## Collections

| Folder              | Source repo                                          | Description                                             | Pinned commit |
|---------------------|------------------------------------------------------|---------------------------------------------------------|---------------|
| `emilskills/`       | [`emilkowalski/skills`](https://github.com/emilkowalski/skills) | Skills for Designers and Engineers (web design / frontend) | `d23d7f8` |
| `gust/`             | [`Leonxlnx/taste-skill`](https://github.com/Leonxlnx/taste-skill) | Taste-Skill — gives your AI good taste, stops generic "AI slop" | `ccbc156` |
| `impeccableskills/` | [`pbakaus/impeccable`](https://github.com/pbakaus/impeccable) | The Impeccable design language for AI harnesses          | `8dac6ae` |

The directories contain a plain file mirror of each upstream repo at the pinned
commit (originally recorded as gitlinks/submodule pointers, materialized here
because `.gitmodules` was never added).

## Usage

Each collection ships as `SKILL.md` instruction files meant for AI coding
agents. The main entry points are:

- `emilskills/skills/*/SKILL.md`
- `gust/skills/*/SKILL.md`
- `impeccableskills/skill/SKILL.src.md` (canonical source; compiled per-agent
  copies live in `.claude/skills/impeccable/SKILL.md`, `.codex/`, `.gemini/`,
  … inside `impeccableskills/`)

Point the agent at the relevant `SKILL.md` (or the folder) before designing a
website so it applies the collection's rules.
