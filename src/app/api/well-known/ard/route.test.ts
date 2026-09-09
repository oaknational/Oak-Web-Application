/**
 * @jest-environment node
 */
import { GET } from "@/app/api/well-known/ard/route";

describe("/.well-known/ard.json", () => {
  it("responds 200 with the catalog content type and open CORS", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/ai-catalog+json",
    );
    // Discovery agents fetch this cross-origin; without this the manifest is
    // unreadable from a browser context and the entries may as well not exist.
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("returns entries that satisfy the ARD entry requirements", async () => {
    const response = GET();
    const body = await response.json();

    expect(Array.isArray(body.entries)).toBe(true);
    expect(body.entries.length).toBeGreaterThan(0);

    for (const entry of body.entries) {
      // MUST terms, ARD spec v0.91 section 4.2.
      expect(entry.identifier).toMatch(
        /^urn:air:[a-zA-Z0-9.-]+(:[a-zA-Z0-9._-]+)+$/,
      );
      expect(typeof entry.displayName).toBe("string");
      expect(entry.displayName.length).toBeGreaterThan(0);
      expect(typeof entry.type).toBe("string");

      // Exactly one of url/data, section 4.3. Asserted as an exclusive pair
      // rather than "has one of them" — an entry carrying both is invalid, and
      // a looser check would pass it.
      expect("url" in entry).not.toBe("data" in entry);

      // representativeQueries is the signal a registry indexes on. An entry
      // without it validates structurally but cannot be found by search,
      // which would make publishing the manifest pointless.
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
      expect(entry.representativeQueries.length).toBeLessThanOrEqual(5);
    }
  });

  it("advertises the MCP server with an inline card naming the endpoint", async () => {
    const response = GET();
    const body = await response.json();

    const mcp = body.entries.find(
      (entry: { identifier: string }) =>
        entry.identifier === "urn:air:thenational.academy:mcp:curriculum",
    );

    expect(mcp).toBeDefined();
    expect(mcp.type).toBe("application/mcp-server-card+json");
    // Inline, and deliberately carrying no server card URL: the `.well-known`
    // card paths are a rejected placement, and the reserved
    // `<streamable-http-url>/server-card` location is not served by Oak.
    expect(mcp.url).toBeUndefined();
    expect(mcp.data.remotes[0].url).toBe("https://mcp.thenational.academy/mcp");
  });

  it("advertises the curriculum API by the catalogue the API itself hosts", async () => {
    const response = GET();
    const body = await response.json();

    const api = body.entries.find(
      (entry: { identifier: string }) =>
        entry.identifier === "urn:air:thenational.academy:api:curriculum",
    );

    expect(api).toBeDefined();
    expect(api.type).toContain("application/linkset+json");

    // Pinned to the API-hosted catalogue, not www's copy. Measured 2026-09-09
    // the two disagree — this one carries `/api/bulk`, www's does not — so
    // swapping the host here would silently narrow what Oak advertises.
    // MCP-721 tracks the drift.
    expect(api.url).toBe(
      "https://open-api.thenational.academy/.well-known/api-catalog",
    );
  });
});
