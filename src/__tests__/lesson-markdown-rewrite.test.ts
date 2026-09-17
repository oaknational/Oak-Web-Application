import { readFileSync } from "node:fs";
import { join } from "node:path";

import { pathToRegexp } from "path-to-regexp";

/**
 * The `.md` rewrite must never match a lesson page's own URL.
 *
 * MCP-632. `/teachers/lessons/<slug>.md` is served by a rewrite in
 * `next.config.ts` pointing at the markdown route handler. `rewrites()` there
 * returns a plain array, which Next.js applies "after checking the filesystem
 * (pages and `/public` files) and before dynamic routes". The lesson page is a
 * DYNAMIC route, so route precedence does not protect it: this rewrite is
 * evaluated first, and the `source` pattern is the only thing keeping markdown
 * off the HTML URL.
 *
 * If the pattern ever over-matches, lesson pages stop serving HTML on
 * www.thenational.academy — with a wrong slug handed to the handler, so the
 * likely symptom is a 404 on a real lesson rather than an error anyone would
 * read as a routing bug. That is a production incident on Oak's main site, and
 * nothing else in the suite would catch it.
 *
 * The specific trap this guards is the unescaped dot. Next's own documentation
 * lists `.` among the characters that "are used for regex path matching, so
 * when used in the `source` as non-special values they must be escaped". The
 * pattern here writes a bare `.md`, and the bundled `path-to-regexp` escapes it
 * during compilation — so the pattern is safe today because of the compiler's
 * behaviour, not because of the pattern's own text. That is exactly the kind of
 * safety that should be pinned rather than assumed: were the dot to act as a
 * wildcard, `[a-z0-9-]+` plus any character plus `md` would swallow every
 * lesson whose slug ends in `md`.
 *
 * The pattern is read out of `next.config.ts` rather than duplicated here, so
 * this test cannot pass against a config that no longer says what it asserts.
 *
 * Compilation goes through this repository's own `path-to-regexp` dependency,
 * which is typed, rather than the untyped copy bundled inside Next. Both were
 * checked to compile this pattern to the identical regex source, and a test
 * below re-checks that equivalence so a future version skew cannot make this
 * suite quietly stop describing what Next does.
 *
 * @see docs/agent-readable-lesson-pages.md
 */

const EXPECTED_SOURCE = "/teachers/lessons/:lessonSlug([a-z0-9-]+).md";

/**
 * Reads the markdown rewrite's `source` out of the real `next.config.ts`.
 *
 * Deliberately matched on the DESTINATION, not the source: the source is what
 * this test exists to police, so keying the lookup on it would let a loosened
 * pattern slip through as "rewrite not found" instead of failing the assertion
 * that matters.
 */
function readRewriteSourceFromConfig(): string {
  const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");

  const match = config.match(
    /source:\s*"([^"]*)"\s*,\s*\n\s*destination:\s*"\/api\/teachers\/lessons\/:lessonSlug\/markdown"/,
  );

  if (!match?.[1]) {
    throw new Error(
      "Could not find a rewrite in next.config.ts whose destination is " +
        "/api/teachers/lessons/:lessonSlug/markdown. If the rewrite was renamed or " +
        "restructured, update this test to locate it — do not delete the test: the " +
        "pattern it guards is the only thing keeping markdown off the lesson HTML URL.",
    );
  }

  return match[1];
}

describe("the lesson markdown rewrite", () => {
  it("is still declared in next.config.ts with the expected source", () => {
    expect(readRewriteSourceFromConfig()).toBe(EXPECTED_SOURCE);
  });

  it("compiles identically under Next's own bundled path-to-regexp", () => {
    const nextBundled = require("next/dist/compiled/path-to-regexp") as {
      pathToRegexp: (source: string) => RegExp;
    };
    const source = readRewriteSourceFromConfig();

    expect(nextBundled.pathToRegexp(source).source).toBe(
      pathToRegexp(source).source,
    );
  });

  describe("compiled from the rewrite source", () => {
    const compile = () => pathToRegexp(readRewriteSourceFromConfig());

    it("escapes the literal dot rather than treating it as a wildcard", () => {
      expect(compile().source).toContain("\\.md");
    });

    it("matches the markdown URL and captures the slug", () => {
      const match = compile().exec("/teachers/lessons/photosynthesis.md");

      expect(match?.[1]).toBe("photosynthesis");
    });

    it.each([
      ["the lesson page's own URL", "/teachers/lessons/photosynthesis"],
      ["a nested lesson route", "/teachers/lessons/photosynthesis/media"],
      // The cases an unescaped dot would have swallowed.
      ["a slug ending in md", "/teachers/lessons/introduction-to-amd"],
      ["a short slug ending in md", "/teachers/lessons/what-is-a-cmd"],
      ["the shortest slug ending in md", "/teachers/lessons/nnmd"],
    ])("does not match %s", (_description, path) => {
      expect(compile().exec(path)).toBeNull();
    });
  });
});
