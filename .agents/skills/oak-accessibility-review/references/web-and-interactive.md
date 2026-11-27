# Accessibility: web pages and interactive content

For HTML/web output, forms, and anything clickable — including **quizzes** (starter/exit/unit) and
other interactive learning content. This is where the WCAG 2.2 additions bite hardest.

## Structure and semantics

- **Real landmarks and headings.** Use `<header>`, `<nav>`, `<main>`, `<footer>`, and a correct
  heading hierarchy (one `<h1>`, then `<h2>`/`<h3>` in order). Don't fake headings/buttons with
  styled `<div>`s.
- **Native elements first.** Use `<button>`, `<a href>`, `<label>`, `<input>`, `<table>` with
  `<th>` — they bring keyboard support, roles, and states for free. Reach for ARIA only to fill a
  gap, and follow "no ARIA is better than bad ARIA".
- **Page title** describes the page; **language** is set on `<html lang>`.

## Keyboard and focus

- **Everything operable by keyboard**, in a logical tab order, with **no keyboard traps**.
- **Visible focus indicator** on every interactive element (2.4.7), and the focused element is never
  entirely hidden behind sticky headers/overlays (**2.4.11**, new in 2.2); keeping all of it visible
  is 2.4.12 (AAA).
- Provide a **skip-to-content** link for pages with repeated navigation (2.4.1).
- **Single-key shortcuts**, using only a letter, number, punctuation or symbol key, can be turned
  off or remapped, or work only while their component has focus (2.1.4).

## Pointer, target size, and motion

- **Target size ≥ 24×24 CSS px** (**2.5.8**, new) for buttons, links, quiz options, icon controls —
  or ensure adequate spacing. The most common new failure.
- **Dragging has a tap/click alternative** (**2.5.7**, new) — e.g. drag-and-drop matching questions
  also work by select-then-place.
- No essential action depends on a device gesture/motion only.
- **Gestures have a single-pointer alternative** (2.5.1): a pinch, multi-finger or path-based swipe
  also works with a tap or click.
- **Actions run on release, not press** (2.5.2), or can be aborted or undone, so a slip doesn't
  submit a quiz answer.

## Forms and quizzes

- **Every input has a programmatic `<label>`** (or equivalent); instructions aren't placeholder-only.
- **Don't convey correct/incorrect by colour alone** — pair green/red with a word and/or icon
  ("Correct", "Try again", ✓/✗). This is the single most common quiz failure (1.4.1).
- **Errors are identified in text** and suggest a fix (3.3.1/3.3.3); group related fields with
  `<fieldset>`/`<legend>`.
- **Redundant entry** (**3.3.7**, new): don't ask pupils to re-type something already provided in
  the same flow.
- **Accessible authentication** (**3.3.8**, new): no login step that's a cognitive puzzle.
- Quiz timers: if timed, make the limit adjustable/extendable (2.2.1), or avoid time limits.
- **No surprises on focus or input** (3.2.1/3.2.2): focusing a control never navigates or submits,
  and choosing a quiz option doesn't submit it or move on unless pupils are told first.
- **Instructions don't rely on the senses alone** (1.3.3): not "the round button" or "the answer
  on the right" without a label.

## Tooltips and pop-ups

- Content that appears on hover or focus (1.4.13) can be dismissed without moving the pointer or
  focus, for example with Escape, stays visible while the pointer moves over it, and stays until
  it's dismissed or no longer relevant.

## Colour, contrast, and zoom

- Text **4.5:1** (large text/UI/graphics **3:1**); **Oak's target is 7:1**, and 4.5:1 for large
  text (1.4.6).
- **Non-text contrast 3:1** for control boundaries, focus rings, and meaningful graphics (1.4.11).
- Usable at **200% zoom**, and **reflows at 320px wide without scrolling in two directions**
  (1.4.4/1.4.10); never set `user-scalable=no`.

## Embedded media and motion

What the code controls about video, audio and animation:

- **Captions.** Video players load and expose synchronised captions (WCAG 1.2.2, A), with a visible
  control to turn them on. Don't ship a player that can't show the captions the content has.
- **Transcripts.** Audio-only media links to a transcript (1.2.1, A). For video, a transcript link is
  strongly recommended, and placed next to the player.
- **No autoplay with sound.** If media plays automatically for more than 3 seconds, provide a pause/
  stop/mute control (1.4.2, A); better, don't autoplay with sound at all.
- **Pause controls.** Moving, looping or auto-updating content, such as carousels and looping
  animations or GIFs, can be paused, stopped or hidden (2.2.2).
- **No flashing** more than **three times per second** (2.3.1). This is a seizure-safety criterion,
  not a nicety. Check animated explainers and transitions.
- **Respect reduced motion.** Honour `prefers-reduced-motion`, and avoid large parallax or
  auto-motion that can trigger vestibular issues. Animation must not carry information that's
  unavailable in text.
- Player controls themselves meet the rest of this page: keyboard operable, labelled, visible focus
  and large enough targets.

## Status and live updates

- **Status messages** (e.g. "Answer saved", "3 of 10 correct") are announced to assistive tech
  without moving focus (4.1.3).
