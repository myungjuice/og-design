# Reusable Components Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans in this session. No commits or deletion of existing concepts.

**Goal:** Canvas examples and future HTML screens consume the same component markup and CSS.
**Architecture:** Browser-native ES modules beside existing component CSS. Pure render functions accept screen data, with canvas-only descriptions and state examples kept outside components. Public index.mjs and index.css provide one import per consumer.
**Tech Stack:** HTML, CSS custom properties, JavaScript ES modules, Node test runner, Playwright.
**Spec:** User-approved shared components structure in the current conversation.

## Global Constraints

- Preserve the current appearance and all canvas navigation, prompt-copy and static examples.
- Do not modify concepts/my-info or implement service actions.
- No HTML source may be obtained from a rendered canvas by a screen.
- Text parameters are escaped; explicitly named HTML slots are for developer-owned composition only.
- Use unique default IDs; accept explicit IDs for linked labels and existing specimens.

## Tasks

- [x] Write `design-system/components/reuse.test.mjs`: independent render without DOM, escaped labels, distinct generated field IDs, shared buttons in composites, minimum/maximum quantity.
- [x] Run `node --test design-system/components/reuse.test.mjs`; confirm missing public API failure.
- [x] Add `components/core.mjs`, per-group `render.mjs`, `index.mjs`, `index.css`. The entry exports named functions; CSS imports existing component styles and tokens.
- [x] Replace local markup helpers in canvas with imports, keeping specimen data and notes in canvas.
- [x] Move remaining component markup into parameterized renderers; keep visual states as inert examples.
- [x] Add isolated-consumer browser test: no canvas stylesheet or DOM dependency, matching button styles, no duplicate IDs, no active app demos.
- [x] Run existing canvas, layout, prompt and static-specimen tests, plus new reusable component tests.
- [x] Document imports, props, safe HTML slots and extension rules in `components/README.md`. Record any incomplete migration explicitly.

## Verification record

- Node reuse tests: 6/6 pass (including ARIA/data boolean serialization regression).
- Canvas + isolated-consumer browser suites: 28/28 pass.
- Shared button source mutation propagates to all canvas button instances, dialog/sheet actions and a separate consumer.
- Shared stylesheet matches the canvas button without canvas CSS; 320/375/414/768 widths pass.
- Code review found one important attribute serialization bug; reproduced and fixed. Sheet sizing responsibility is documented.
- Existing concepts/my-info unchanged. No commit/push.
