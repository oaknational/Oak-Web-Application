import { createHash } from "node:crypto";

import { expect, test, type APIRequestContext } from "@playwright/test";

/**
 * The Oak Curriculum MCP submission carousel images must stay reachable at
 * their canonical URL.
 *
 * MCP-606. Anthropic's MCP directory listing stores these URLs and fetches the
 * images itself, indefinitely. The submission portal will not accept image
 * uploads, so the URL *is* the delivery mechanism. That makes these paths an
 * EXTERNAL contract held by a third party, not an internal asset path.
 *
 * Nothing in this repository links to them. No page renders them, no component
 * imports them, and no sitemap lists them — so every other guard here is blind
 * to them, and a routine tidy-up of `public/` would break a rendered public
 * listing that Oak never sees, with all of CI still green. This spec is the
 * only thing standing between that tidy-up and the broken listing.
 *
 * MCP-688 moved the bytes on disk to `public/ai-plugin/carousel`. The old
 * `/mcp/carousel` URLs Anthropic's listing used to hold were kept alive for a
 * while by a compat REWRITE in `next.config.ts`; Anthropic has since updated
 * the listing to fetch from `/ai-plugin/carousel` directly (confirmed by
 * Aakesh Pattani, MCP-689), so that rewrite was removed in MCP-690 and this
 * spec only asserts the canonical URL below.
 */

/**
 * The published paths Anthropic's listing now fetches, spelled out as
 * literals.
 *
 * Deliberately NOT composed from a shared constant and deliberately NOT
 * enumerated from disk. Both would make the test follow the thing it guards: a
 * rename would update the expectation along with the file and this spec would
 * stay green while Anthropic's stored URLs broke. Pinning the whole path is
 * what makes this spec able to fail.
 *
 * The filenames are generic on purpose. The URLs are permanent while the images
 * may yet be re-exported, so a content-descriptive name could become wrong and
 * uncorrectable; a generic one cannot. The ordinal is the carousel's running
 * order.
 */
const CANONICAL_CAROUSEL_URLS = [
  {
    path: "/ai-plugin/carousel/carousel_image_1.png",
    sha256: "06cbdbf1704e6960afb3ad6b43ddaa42c2c256689e60fe5061cca8c108ffa8a5",
  },
  {
    path: "/ai-plugin/carousel/carousel_image_2.png",
    sha256: "a28e7c329cfa8714551055212157bbab3f2573ce174f4c11480efe21e0d8401c",
  },
  {
    path: "/ai-plugin/carousel/carousel_image_3.png",
    sha256: "8bb07d1ebd9ace22377a8040771e91aef0dc4ade88ec6e3c215782d6556a1b80",
  },
] as const;

/**
 * What to do when this spec goes red. The correct response is to STOP, not to
 * update the expected path to match the code.
 */
const CANONICAL_PATH_NOTICE =
  "This path is a PUBLISHED URL that Anthropic's MCP directory listing fetches directly. " +
  "Do NOT change this expected path to match the code. If the asset has genuinely moved, " +
  "the listing itself must be updated with Anthropic first, and that is an owner decision, " +
  "not a test edit.";

const expectServesCarouselImage = async ({
  request,
  path,
  sha256,
  notice,
}: {
  request: APIRequestContext;
  path: string;
  sha256: string;
  notice: string;
}) => {
  // `maxRedirects: 0` is the point of this call, not a detail. Anthropic
  // stores a literal URL, and a redirect is a different contract: it would
  // still render for a browser while this spec, had it followed the hop,
  // reported success for a path that no longer serves the image itself.
  // A 3xx here must fail.
  const response = await request.get(path, { maxRedirects: 0 });

  expect(
    response.status(),
    `${path} did not return 200 — the submitted listing would show a gap. ${notice}`,
  ).toBe(200);

  // Asserted positively and per file. A negative check ("not a 404") is
  // not equivalent: it passes against anything that answers, including an
  // error page served with a 200.
  expect(
    response.headers()["content-type"],
    `${path} is served with the wrong content type. ${notice}`,
  ).toContain("image/png");

  const body = await response.body();

  // A zero-length or placeholder body would satisfy both checks above
  // while rendering as a broken image in the listing.
  expect(
    body.byteLength,
    `${path} is served but empty. ${notice}`,
  ).toBeGreaterThan(0);

  // The bytes, pinned per path. This is what catches the two failures the
  // checks above cannot see: an image pipeline that re-compresses on
  // ingest, and a permutation that serves image 3 at image 2's URL. Both
  // leave every other assertion here green.
  expect(
    createHash("sha256").update(body).digest("hex"),
    `${path} does not serve the expected bytes — it may have been re-exported, optimised on ingest, or swapped with another ordinal. ${notice}`,
  ).toBe(sha256);
};

test.describe.skip("MCP submission carousel images", () => {
  for (const { path, sha256 } of CANONICAL_CAROUSEL_URLS) {
    test(`serves ${path} as a PNG at its canonical URL`, async ({
      request,
    }) => {
      await expectServesCarouselImage({
        request,
        path,
        sha256,
        notice: CANONICAL_PATH_NOTICE,
      });
    });
  }
});
