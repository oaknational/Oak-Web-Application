import { expect, test } from "@playwright/test";

/**
 * MCP-715. Guards the rewrite, not the handler: unit tests cover the handler,
 * but it can be healthy while the rewrite is missing, and then the only URLs
 * anyone fetches return 404. Nothing on the site links these paths, so no
 * other check would notice.
 *
 * See `docs/agent-discovery.md`.
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
      // A redirect resolves in a browser but not for a consumer that does not
      // follow hops, so a 3xx here must fail.
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

      // Per entry: a non-empty-array check would pass with one resource lost.
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

    // An agent that never fetches `/.well-known/` still finds the manifest.
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
