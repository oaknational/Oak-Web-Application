---
name: oak-accessibility-review
description: Builds and reviews interface code to meet WCAG 2.2 AA, with Oak's 7:1 contrast target, including the criteria automated checkers miss. Use when building or reviewing components, pages, forms, quizzes or embedded media, or when asked whether something is accessible, to audit accessibility, or to check keyboard support, focus, contrast, alt text, labels, captions or target size.
license: MIT
metadata:
  owner: '@oaknational/skills-maintainers'
  updated: '2026-11-25'
  source: oaknational/oak-ai-plugins@2a43cf1
---

# Oak National Academy: Accessibility review

This skill holds interface code to a clear, consistent accessibility standard: components, pages, forms, quizzes and embedded media. Use it whenever you build or review code that renders something people see or operate.

## The standard: WCAG 2.2 AA is the floor

**Every interface must meet [WCAG 2.2](https://www.w3.org/TR/WCAG22/) at Level AA.** That is the minimum, not the aspiration.

- **AA is the floor.** If you can't confirm a criterion is met, treat it as not met and fix it.
- **AAA where Oak requires it.** Oak goes beyond AA in places, most notably **colour contrast at 7:1** (an AAA threshold) per the brand. Apply the higher bar where Oak's brand or this skill says so; don't drop to AA "because AA allows it".
- **WCAG 2.2 specifically**, not 2.1. The 2.2 additions matter for interactive code (target size, focus visibility, dragging alternatives, redundant entry, accessible authentication). See `references/wcag-2-2-aa.md`.

## How to use this skill

Apply the floor below to everything. Load the matching reference when you need detail, rather than everything up front.

- **The criteria themselves** (what AA requires, the 2.2 additions, what Oak takes to AAA): `references/wcag-2-2-aa.md`
- **Components, pages, forms, quizzes and embedded media** (HTML, anything clickable, video and audio players, animation): `references/web-and-interactive.md`
- **Finishing a piece of work or a review**: run `references/accessibility-checklist.md` before sign-off.
- **Sources** (the WCAG 2.2 spec and supporting guidance): `references/sources.md`

When reviewing, report each problem with the file and line, the WCAG criterion it fails, who it affects (for example keyboard users or screen reader users), and the fix. Report each check you can't do from the code, such as a keyboard-only pass or zooming to 400%, as **not verified: needs a person**, never as met.

## The floor: these hold for every interface

1. **Text alternatives.** Every image, icon, chart or diagram that carries meaning has concise, accurate alt text; purely decorative images are marked decorative (empty alt). Don't put information only in an image of text.
2. **Structure and reading order.** Use real headings in order (one H1, then H2/H3, never skipped for visual size), real lists and tables (with header cells), and a DOM order that matches the visual order.
3. **Don't rely on colour alone.** Never use colour as the only way to convey meaning, state, or "correct/incorrect"; pair it with text, shape or a label. (WCAG 1.4.1)
4. **Contrast.** Text meets at least **4.5:1** (3:1 for large text ≥24px/19px-bold and for UI components/graphics). **Oak's target is 7:1** where the brand applies, and 4.5:1 for large text, as WCAG 1.4.6 allows.
5. **Keyboard and target size.** Anything interactive works by keyboard alone, has a visible focus indicator, and gives pointer targets of at least **24×24 CSS px** (WCAG 2.2 2.5.8).
6. **Captions, transcripts and motion.** Video players support synchronised captions and audio has a transcript; nothing autoplays with sound; meaningful animation has a text equivalent, can be paused, respects reduced motion and **must not flash** more than 3×/second.
7. **Plain language.** Write interface text so it's as readable as the subject allows. (WCAG 3.1.5, AAA: beyond the AA baseline)
8. **Resize and reflow.** Content stays usable at 200% zoom and reflows at 320px width without scrolling in two directions; never disable zoom.

Automated checkers catch only some of these. Keyboard operation, focus order, reading order, contrast on real backgrounds and the meaning of alt text need a person, or you, to check by hand. When something can't fully meet a criterion, such as third-party embedded content, **note the residual limitation** rather than claiming full conformance.
