# voodoofugu libraries — project context

## Purpose

This repository is the source for `https://voodoofugu.github.io/`, a compact
catalog of Georg Schilin's public frontend libraries. It provides one route to
the package, repository and documentation for each project without duplicating
full documentation or maintaining a library list in the npm profile README.

## Decisions

- GitHub Pages user site, built as a static React and Vite application.
- Hash routes keep direct reloads reliable without server rewrites.
- The visual shell follows the documentation sites for `morphing-scroll`,
  `nexus-state` and `styled-atom`, while project accent colors identify entries.
- Package metadata stays in `src/libraries.ts`; detail views share one template.
- The catalog has no search or nested navigation while the list remains small.
- Existing documentation sites link back here from their footers.
- The three documentation shells remain local to their repositories until a
  shared UI package has enough behavior to justify release coupling.

## Commands

```bash
npm run dev
npm run build
npm run preview
```
