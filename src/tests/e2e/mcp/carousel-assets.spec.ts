import { createHash } from "node:crypto";

import { expect, test, type APIRequestContext } from "@playwright/test";

/**
 * The Oak Curriculum MCP submission carousel images must stay reachable at
 * these exact URLs.
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
 * MCP-688. The bytes moved on disk to `public/ai-plugin/carousel`, and the
 * published `/mcp/carousel` URLs are kept serving from there by a REWRITE in
 * `next.config.ts` — deliberately not a redirect, which would be a different
 * contract. Both URLs are asserted here, in separate tables, each spelling its
 * own paths out in full: the `/mcp/carousel` one because Anthropic holds it, the
 * `/ai-plugin/carousel` one because it is where the rewrite has to land. Either
 * table going red is a real break, and they fail for different reasons — the
 * first says the stored URLs have stopped serving, the second says the bytes are
 * no longer where the rewrite points.
 */

/**
 * The complete published paths Anthropic holds, spelled out as literals.
 *
 * Deliberately NOT composed from a shared constant and deliberately NOT
 * enumerated from disk. Both would make the test follow the thing it guards: a
 * rename would update the expectation along with the file and this spec would
 * stay green while Anthropic's stored URLs broke. Pinning the whole path is
 * what makes this spec able to fail.
 *
 * These paths are also NOT derived from the canonical paths below, for the same
 * reason: the rewrite is the thing under test, so a table computed from the
 * rewrite's destination could not catch the rewrite going missing.
 *
 * The filenames are generic on purpose. The URLs are permanent while the images
 * may yet be re-exported, so a content-descriptive name could become wrong and
 * uncorrectable; a generic one cannot. The ordinal is the carousel's running
 * order.
 */
const ANTHROPIC_HELD_CAROUSEL_URLS = [
  {
    path: "/mcp/carousel/carousel_image_1.png",
    sha256: "06cbdbf1704e6960afb3ad6b43ddaa42c2c256689e60fe5061cca8c108ffa8a5",
  },
  {
    path: "/mcp/carousel/carousel_image_2.png",
    sha256: "a28e7c329cfa8714551055212157bbab3f2573ce174f4c11480efe21e0d8401c",
  },
  {
    path: "/mcp/carousel/carousel_image_3.png",
    sha256: "8bb07d1ebd9ace22377a8040771e91aef0dc4ade88ec6e3c215782d6556a1b80",
  },
] as const;

/**
 * The canonical paths the bytes are published at since MCP-688, spelled out as
 * literals under the same rules as the table above: whole paths, never composed,
 * never enumerated from disk.
 *
 * These are the rewrite's destination. Asserting them separately is what tells
 * the two failure modes apart. If only this table goes red the files have moved
 * or been renamed again; if only the table above goes red the rewrite has been
 * dropped or mis-sourced; if both go red the images are gone.
 *
 * The digests repeat the ones above rather than referencing them. Both URLs must
 * serve the SAME bytes, and a shared constant would assert that by construction
 * instead of measuring it.
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
const EXTERNAL_CONTRACT_NOTICE =
  "This path is a PUBLISHED URL that Anthropic stores in the Oak MCP directory listing. " +
  "Do NOT change this expected path to match the code. If the asset has genuinely moved, " +
  "the listing itself must be updated with Anthropic first, and that is an owner decision, " +
  "not a test edit. Since MCP-688 this URL is served by a rewrite in `next.config.ts` from " +
  "`/ai-plugin/carousel`, so if it has stopped serving, that rewrite is what to repair.";

/**
 * The same instruction for the canonical paths. Re-pointing these is legitimate
 * when the files really do move, but only together with the rewrite destination
 * in `next.config.ts` — otherwise this table goes green while the URLs Anthropic
 * holds start 404ing, which is exactly the failure this spec exists to catch.
 */
const CANONICAL_PATH_NOTICE =
  "This path is where the carousel bytes are published, and it is the destination of the " +
  "`/mcp/carousel` rewrite in `next.config.ts`. If the files have genuinely moved, this " +
  "expectation and that rewrite destination must be updated in the same change — updating " +
  "this one alone leaves the URLs Anthropic stores serving nothing.";

/**
 * The assertions every carousel URL must satisfy, whichever path serves it.
 *
 * Shared because both paths are held to the SAME standard: a rewrite that
 * quietly served a truncated or re-compressed body at the legacy URL would still
 * be a break. Only the assertions are shared — the paths never are.
 */
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

test.describe("MCP submission carousel images", () => {
  // The URLs in the live listing. These must keep serving whatever happens to
  // the files on disk — that is the whole job of the rewrite.
  test.describe("at the published URLs Anthropic holds", () => {
    for (const { path, sha256 } of ANTHROPIC_HELD_CAROUSEL_URLS) {
      test(`serves ${path} as a PNG at its exact published URL`, async ({
        request,
      }) => {
        await expectServesCarouselImage({
          request,
          path,
          sha256,
          notice: EXTERNAL_CONTRACT_NOTICE,
        });
      });
    }
  });

  // The rewrite's destination, asserted directly so a break in the images
  // themselves is distinguishable from a break in the rewrite.
  test.describe("at their canonical published URLs", () => {
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
});
