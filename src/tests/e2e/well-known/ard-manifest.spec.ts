import { expect, test } from "@playwright/test";

/**
 * The ARD manifest must be served, and reachable, at both published paths.
 *
 * MCP-715. The manifest is produced by an App Router route handler and mapped
 * onto `/.well-known/` by rewrites in `next.config.ts`, because the App Router
 * will not route a folder beginning with a dot. That indirection is what this
 * spec guards: the handler can be healthy while the rewrite is missing, and
 * then the only URLs anyone actually fetches return 404.
 *
 * Nothing in the site links to these paths as a user would follow them, so no
 * other check here would notice.
 */

/**
 * Both paths, spelled out.
 *
 * `ard.json` is what ARD v0.91 §5.1 requires a conformant consumer to fetch.
 * `ai-catalog.json` is its predecessor, and measured 2026-09-09 it is the only
 * path every reference publisher actually serves. Dropping either is a
 * deliberate change to who can discover Oak, not a tidy-up.
 */
const MANIFEST_PATHS = [
  "/.well-known/ard.json",
  "/.well-known/ai-catalog.json",
] as const;

const EXPECTED_IDENTIFIERS = [
  "urn:air:thenational.academy:mcp:curriculum",
  "urn:air:thenational.academy:api:curriculum",
] as const;

test.describe("ARD manifest", () => {
  for (const path of MANIFEST_PATHS) {
    test(`serves the manifest at ${path}`, async ({ request }) => {
      // `maxRedirects: 0` because the paths are a published contract. A
      // redirect would still resolve in a browser while a consumer that does
      // not follow hops got nothing.
      const response = await request.get(path, { maxRedirects: 0 });

      expect(
        response.status(),
        `${path} did not return 200, so discovery agents cannot find Oak's resources.`,
      ).toBe(200);

      expect(
        response.headers()["content-type"],
        `${path} is served with the wrong content type.`,
      ).toContain("application/ai-catalog+json");

      // Without this, the manifest is unreadable from a browser context.
      expect(
        response.headers()["access-control-allow-origin"],
        `${path} does not allow cross-origin reads.`,
      ).toBe("*");

      const body = await response.json();

      // Asserted positively and per entry. Checking only that `entries` is a
      // non-empty array would pass against a manifest that had silently lost
      // one of the two resources.
      const identifiers = body.entries.map(
        (entry: { identifier: string }) => entry.identifier,
      );
      for (const identifier of EXPECTED_IDENTIFIERS) {
        expect(
          identifiers,
          `${path} no longer advertises ${identifier}.`,
        ).toContain(identifier);
      }
    });
  }

  test("advertises the manifest from the document head", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // ARD §5.1 makes `rel="ard"` a discovery mechanism a conformant consumer
    // must honour, so an agent that never fetches `/.well-known/` still finds
    // the manifest from any page.
    await expect(page.locator('head link[rel="ard"]')).toHaveAttribute(
      "href",
      "/.well-known/ard.json",
    );
    await expect(page.locator('head link[rel="ai-catalog"]')).toHaveAttribute(
      "href",
      "/.well-known/ai-catalog.json",
    );
  });
});
