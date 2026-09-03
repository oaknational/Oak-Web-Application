import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The Oak Curriculum MCP submission carousel images must keep existing, at
 * these exact paths, with these exact bytes.
 *
 * MCP-606. Anthropic's MCP directory listing stores these URLs and fetches the
 * images itself, indefinitely — the submission portal accepts no uploads, so
 * the URL is the delivery mechanism. The paths are an EXTERNAL contract held by
 * a third party.
 *
 * Nothing in this repository links to these files. No page renders them, no
 * component imports them, no sitemap lists them. So a routine tidy-up of
 * `public/` would break a rendered public listing that Oak never sees, and
 * every other check here would stay green.
 *
 * There is a companion Playwright spec (`src/tests/e2e/mcp/`) that asserts the
 * SERVED contract — status, content type, no redirect — against a real preview
 * deployment, and it is the better test of the two because it exercises
 * routing. This one exists because that check is not a required status on
 * `main`, so on its own it reports a break without preventing one. This test
 * runs inside the required unit-test gate. Keep both: this one blocks the
 * merge, that one proves the URL actually serves.
 */

/** Repository-root-relative path to the published directory. */
const CAROUSEL_DIR = join(process.cwd(), "public", "mcp", "carousel");

/**
 * Each published filename paired with the SHA-256 of its own bytes.
 *
 * Pinned as literals, and deliberately not enumerated from disk: reading the
 * directory would make any rename self-fulfilling, and the point of this test
 * is to fail when a name changes.
 *
 * The digests are per file because the ordinal is paired EXTERNALLY — each
 * carousel position has its own example prompt on the submission form. Serving
 * image 3 in image 2's position is a real failure, and a set-wise check of "all
 * three files are present" passes straight through it.
 *
 * The digests also make an image pipeline visible: these bytes must be copied,
 * never re-exported. A re-compression would leave the filename right and the
 * image subtly different.
 */
const CAROUSEL_IMAGES = [
  {
    file: "carousel_image_1.png",
    sha256: "06cbdbf1704e6960afb3ad6b43ddaa42c2c256689e60fe5061cca8c108ffa8a5",
  },
  {
    file: "carousel_image_2.png",
    sha256: "a28e7c329cfa8714551055212157bbab3f2573ce174f4c11480efe21e0d8401c",
  },
  {
    file: "carousel_image_3.png",
    sha256: "8bb07d1ebd9ace22377a8040771e91aef0dc4ade88ec6e3c215782d6556a1b80",
  },
] as const;

/** What to do when this goes red: stop, do not re-point the expectation. */
const EXTERNAL_CONTRACT_NOTICE =
  "These files back PUBLISHED URLs that Anthropic stores in the Oak MCP directory listing. " +
  "Do NOT update this expectation to match the code. If the assets have genuinely moved or " +
  "been re-exported, the listing itself must be updated with Anthropic first, and that is an " +
  "owner decision, not a test edit.";

describe("MCP submission carousel images", () => {
  it.each(CAROUSEL_IMAGES)(
    "keeps $file at its published path with its exact bytes",
    ({ file, sha256 }) => {
      const contents = readFileSync(join(CAROUSEL_DIR, file));

      expect(
        `${createHash("sha256").update(contents).digest("hex")} ${EXTERNAL_CONTRACT_NOTICE}`,
      ).toBe(`${sha256} ${EXTERNAL_CONTRACT_NOTICE}`);

      // PNG magic number, so a file renamed to .png is not accepted as one.
      expect(contents.subarray(0, 8)).toEqual(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      );
    },
  );
});
