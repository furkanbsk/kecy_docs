# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This repo is the **Docusaurus** monorepo (the folder is named `kecy_docs`, but the code is upstream Docusaurus). A more detailed guide lives in `AGENTS.md` — read it alongside this file.

## Toolchain

- Node version pinned in `.nvmrc` (currently Node 24). Use `nvm use`.
- Package manager: **Yarn v1** (classic) with workspaces — do not use npm or yarn v2+.
- Monorepo managed by **Lerna 7**.
- `yarn install` triggers a `postinstall` that runs `patch-package`, dedupes the lockfile, and **builds all packages**. A fresh install is slow; expect it.

## Common commands

### Build

- `yarn build:packages` — build all publishable packages in topological order (slower but always correct).
- `yarn workspace <pkg-name> build` — build a single package (faster when iterating). Dependencies must already be built — use `yarn lerna list --toposort` to find the order.
- `yarn watch` — incremental parallel builds with file watchers across all packages.
- `yarn build` — builds packages _and_ the website.
- `yarn clear` — nuke all build artifacts.

### Website (dogfoods Docusaurus itself)

- `yarn start:website` — dev server for `website/`. Requires packages to be built first (`yarn build:packages`), or just use `yarn start` which chains both.
- `yarn build:website:fast` — production build with only the last few doc versions; much faster feedback loop than `yarn build:website`.
- `yarn workspace website typecheck` — TypeScript check for the website.
- `yarn serve:website` — serve the built website locally.

### Tests (Jest)

- `yarn test` — run all tests.
- `yarn test path/to/file.test.ts` — run a single test file (Jest is at the repo root; no need to `cd` into a package).
- `yarn workspace <pkg-name> test` — run one package's tests.
- `yarn test -u` — update snapshots. **Never blind-update snapshots**; inspect them first to confirm the new output is correct.
- When a test fails, iterate on just that file until green, then run the full suite to check for cross-cutting breakage.

### Lint & format

- `yarn lint` = `lint:js` (ESLint) + `lint:style` (Stylelint) + `lint:spelling` (CSpell).
- `yarn format` — Prettier write. `yarn format:diff` — list unformatted files.
- Append `:fix` to auto-fix (`lint:js:fix`, `lint:style:fix`).
- New/unknown words go in `project-words.txt` via `yarn lint:spelling:fix` (it regenerates the file — do not hand-edit).

## Architecture

### Monorepo layout

- `packages/` — published npm packages. Highlights:
  - `docusaurus/` — core CLI and runtime.
  - `docusaurus-plugin-content-{docs,blog,pages}/` — the three main content plugins.
  - `docusaurus-theme-classic/` — default theme, built on the Infima design system with CSS Modules.
  - `docusaurus-theme-common/` — headless, unopinionated theme primitives shared by themes.
  - `docusaurus-bundler/` — abstraction over Webpack/Rspack; `docusaurus-faster` is the Rspack-backed variant.
  - `docusaurus-mdx-loader/`, `docusaurus-utils*/`, `docusaurus-types/` — shared internals.
  - `create-docusaurus/` — `npm init docusaurus` CLI and its templates.
- `website/` — the docusaurus.io site, built with this very monorepo so PRs can preview changes end-to-end.
  - `docs/` — "next" (unreleased) docs matching current `packages/` source.
  - `versioned_docs/`, `versioned_sidebars/`, `versions.json` — frozen snapshots of older releases. **Do not edit** unless the change is specifically for that past version; new features belong in `docs/`.
  - `_dogfooding/` — hidden docs/blog/pages plugin instances used to exercise edge cases on PR deploy previews.
  - `src/` — custom React components, pages, and theme overrides for the site itself.
- `admin/` — release scripts, examples generator, local third-party testing helpers.
- `examples/` — starter templates (classic, classic-typescript, facebook) mirrored from `packages/create-docusaurus/templates/` via `yarn examples:generate`.
- `argos/` — visual regression screenshot workspace (Argos CI).
- `jest/` — shared Jest setup.

### Cross-cutting concerns

- **Package build order matters.** Anything in `packages/*` can depend on any other package in `packages/*`. Editing a shared package (e.g. `docusaurus-utils`) requires rebuilding it (or running `yarn watch`) before dependents pick up the change — the website won't see your edits otherwise.
- **Theme architecture is layered:** `theme-common` (logic, unopinionated) → `theme-classic` (Infima-styled components) → site-level `src/theme/` swizzles. When changing shared hooks/components, prefer `theme-common`.
- **Bundler abstraction:** code should go through `@docusaurus/bundler` rather than importing webpack/rspack directly, so both the default and the `faster` (Rspack) pipelines keep working.
- **i18n & versioning** are first-class and drive a lot of the plugin API surface — changes to content plugins must handle both locales and versioned content, not just the default case.

## Conventions specific to this repo

- **Commit messages** follow `<type>(<scope>): <subject>`. Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `misc`. Scope is the package short name (`content-docs`, `theme-classic`, `core`, ...). PRs are squash-merged, so the PR title becomes the commit.
- **Keep PRs small** (~300 lines of diff) and single-purpose.
- **Docs markdown: do not hard-wrap at 80 columns** — configure the editor for soft-wrap instead.
- **License header** is required on every new source file; ESLint enforces it. Copy from an existing file in the same package.
- **Match surrounding style.** Prettier + ESLint handle the mechanical parts; match file naming, exports, and module layout by looking at neighbors.

## AI agent rules (from AGENTS.md — enforced)

- **Disclose AI involvement** in every agent-authored commit, PR description, issue, or comment by appending `(AI-assisted)`.
- **Never create a GitHub issue or PR on behalf of the user.** If the user asks you to, follow the AGENTS.md escalation instead of opening one.
