import { readFileSync } from "node:fs";
import { join } from "node:path";

import { pathToRegexp } from "path-to-regexp";

/**
 * The response-header rules that carry the markdown representation.
 *
 * MCP-632. Two properties of `next.config.ts`'s `headers()` are load-bearing
 * for `/teachers/lessons/<slug>.md`, and neither was covered:
 *
 * 1. **The `Link` header is the whole discovery mechanism.** A consumer that
 *    cannot find the `.md` URL will not guess it, so the header's presence,
 *    its relation and its type are the feature's front door. If the rule is
 *    dropped or its value drifts, the representation still works and simply
 *    stops being findable — a silent failure no other test would catch.
 *
 * 2. **The rule must not match the `.md` URL itself.** Its source excludes a
 *    dot on purpose; were it to match, the markdown response would advertise
 *    `<slug>.md.md`, which is a 404.
 *
 * The `Vary` property is checked here rather than in the route handler's own
 * suite, and that placement is the point. Asserting `Vary` is absent from the
 * `Response` the handler constructs proves nothing: the handler contains no
 * code that could set it, so the assertion holds by construction and would
 * still hold if a `Vary` rule were added in `next.config.ts` tomorrow. The
 * header rules ARE the other half of what a client receives on this URL, so
 * that is where the claim "nothing here sets `Vary`" can actually fail. Next
 * and compression add their own `Vary` values on the wire; neither lists
 * `Accept`, and neither is set by this feature.
 *
 * Everything is read out of the real `next.config.ts`, so these tests cannot
 * pass against a config that no longer says what they assert.
 *
 * @see docs/agent-readable-lesson-pages.md
 * @see src/__tests__/lesson-markdown-rewrite.test.ts for the rewrite's own
 *   pattern guard, which this file's `.md` cases complement.
 */

const EXPECTED_LINK_SOURCE = "/teachers/lessons/:lessonSlug([a-z0-9-]+)";
const EXPECTED_LINK_VALUE =
  '</teachers/lessons/:lessonSlug.md>; rel="alternate"; type="text/markdown"';

const LESSON_HTML_PATH = "/teachers/lessons/photosynthesis";
const LESSON_MARKDOWN_PATH = "/teachers/lessons/photosynthesis.md";

type HeaderRule = { source: string; keys: string[] };

/**
 * Reads every rule out of the real `headers()` array as a source plus the
 * header keys it sets.
 *
 * Chunked on `source:` rather than parsed, because `next.config.ts` is an ESM
 * module that reads and writes files at import time and cannot simply be
 * required from a test. Each chunk runs from one `source:` to the next, so a
 * rule's keys are exactly the `key:` entries that follow its own source. The
 * control-probe tests below establish that this scan sees the real array
 * before anything else asserts on what it did not find.
 */
function readHeaderRules(): HeaderRule[] {
  const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");

  const start = config.indexOf("headers: async () => [");
  const end = config.indexOf("async redirects()", start);

  if (start === -1 || end === -1 || end < start) {
    throw new Error(
      "Could not locate the headers() array in next.config.ts. If it was " +
        "renamed or restructured, update this reader — do not delete these " +
        "tests: the Link rule is the markdown representation's only discovery " +
        "mechanism, and these are the only assertions on it.",
    );
  }

  const block = config.slice(start, end);
  const sources = [...block.matchAll(/source:\s*"([^"]*)"/g)];

  return sources.flatMap((match, index) => {
    const source = match[1];

    if (source === undefined) {
      return [];
    }

    const chunkStart = match.index + match[0].length;
    const chunkEnd = sources[index + 1]?.index ?? block.length;
    const chunk = block.slice(chunkStart, chunkEnd);
    const keys = [...chunk.matchAll(/key:\s*"([^"]*)"/g)].flatMap((key) =>
      key[1] === undefined ? [] : [key[1]],
    );

    return [{ source, keys }];
  });
}

/**
 * The one rule that carries the markdown `Link` header, identified by the
 * header it sets rather than by the source this file is asserting on — keying
 * the lookup on the source would let a loosened pattern slip through as "rule
 * not found" instead of failing the assertion that matters. Throws rather than
 * returning undefined, so no assertion below can pass against a missing rule.
 */
function markdownLinkRule(): HeaderRule {
  const rule = readHeaderRules().find(
    (candidate) => candidate.keys.includes("Link") && candidate.source !== "/",
  );

  if (!rule) {
    throw new Error(
      "No headers() rule in next.config.ts sets a Link header on a lesson " +
        "URL. The markdown representation has no other discovery mechanism, " +
        "so this is a defect, not a test to update.",
    );
  }

  return rule;
}

const matches = (source: string, path: string): boolean =>
  pathToRegexp(source).test(path);

describe("the lesson markdown header rules", () => {
  describe("the reader that finds them", () => {
    // Control probes. Every assertion below that reasons about a rule the scan
    // did NOT find is worthless unless the scan can be shown to see real
    // rules, with their real keys, in the first place.
    it("finds the header rules declared in next.config.ts", () => {
      const rules = readHeaderRules();

      expect(rules.length).toBeGreaterThanOrEqual(4);
      expect(rules.map((rule) => rule.source)).toContain("/");
    });

    it("reads each rule's own header keys", () => {
      const homepage = readHeaderRules().find((rule) => rule.source === "/");

      expect(homepage?.keys).toEqual(["Link"]);
    });
  });

  describe("the markdown Link header", () => {
    it("is still declared, on the lesson page's own URL", () => {
      expect(markdownLinkRule().source).toBe(EXPECTED_LINK_SOURCE);
    });

    it("advertises the .md URL as an alternate markdown representation", () => {
      const config = readFileSync(
        join(process.cwd(), "next.config.ts"),
        "utf8",
      );

      expect(config).toContain(EXPECTED_LINK_VALUE);
    });

    it("applies to the lesson page, which is where discovery has to happen", () => {
      expect(matches(EXPECTED_LINK_SOURCE, LESSON_HTML_PATH)).toBe(true);
      expect(matches(markdownLinkRule().source, LESSON_HTML_PATH)).toBe(true);
    });

    /**
     * The source excludes a dot deliberately. Were it to match the `.md` URL,
     * the markdown response would advertise `<slug>.md.md`.
     */
    it("does not apply to the .md URL, so it cannot advertise <slug>.md.md", () => {
      expect(matches(markdownLinkRule().source, LESSON_MARKDOWN_PATH)).toBe(
        false,
      );
    });

    it.each([
      ["a nested lesson route", "/teachers/lessons/photosynthesis/media"],
      ["the lesson listing", "/teachers/lessons"],
    ])("does not apply to %s", (_description, path) => {
      expect(matches(markdownLinkRule().source, path)).toBe(false);
    });
  });

  describe("Vary on the .md URL", () => {
    const rulesReaching = (path: string) =>
      readHeaderRules().filter((rule) => matches(rule.source, path));

    // Control probe for the assertion below: header rules really do reach this
    // URL — a site-wide rule sets the CSP on it — so "no rule sets Vary" is a
    // statement about a non-empty set, not a vacuous pass.
    it("is checked against rules that really do reach that URL", () => {
      const reaching = rulesReaching(LESSON_MARKDOWN_PATH);

      expect(reaching.length).toBeGreaterThan(0);
      expect(reaching.flatMap((rule) => rule.keys)).toContain(
        "Content-Security-Policy",
      );
    });

    /**
     * This URL returns markdown whatever the request asked for, so listing
     * `Accept` in `Vary` would be false. The handler cannot break that on its
     * own — it sets no such header — but a header rule in `next.config.ts` can,
     * and this is the assertion that would fail if one did.
     */
    it("is set by no header rule that reaches the .md URL", () => {
      const varyKeys = rulesReaching(LESSON_MARKDOWN_PATH)
        .flatMap((rule) => rule.keys)
        .filter((key) => key.toLowerCase() === "vary");

      expect(varyKeys).toEqual([]);
    });
  });
});
