# AGENTS.md

<!-- oak-skills init wrote this starter. Replace each comment with this repository's details, keep the whole file to about 100 lines, and update it in the same pull request as the code it describes. -->

## What this repository is

<!-- One or two sentences: what it does, who uses it, and how it fits with Oak's other services. -->

## Commands

<!-- The exact commands to run. Skills refer to this list rather than repeating commands, so keep it current. -->

- Install: `pnpm install`
- Build: `<command>`
- Test: `<command>`
- Lint and type-check: `<command>`
- Run locally: `<command>`

## Architecture

<!-- A short map: the main folders, what lives in each, and how they depend on each other. -->

## Rules

<!-- Rules that always apply here and that no tool enforces. Leave out anything a linter, formatter, type checker or CI check already catches. -->

## Agent skills

This repository receives Oak's shared agent skills from the `@oaknational/oak-agent-skills` package. They're synced into `.agents/skills/`, and linked into `.claude/skills/` for Claude Code.

- Don't edit the synced skills here: `oak-skills check` fails on local edits, and the next sync would overwrite them.
- To improve a skill, edit it, then ask the user before running `pnpm exec oak-skills promote <skill>`. It opens a pull request in the central repository, which other people see, and restores the synced copy here.
- Which skills this repository receives is set by `oakSkills` in `package.json`.
